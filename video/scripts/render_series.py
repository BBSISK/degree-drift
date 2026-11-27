"""Render the vertical subject series (1080x1920, 30 fps, 17 s each) from video/series.html.

Run from the repo root:
    python3 video/scripts/build_series_data.py
    python3 video/scripts/render_series.py            # all subjects
    python3 video/scripts/render_series.py 06 04      # chosen field codes
Writes video/output/series/degree-drift-<subject>.mp4. Needs Playwright (Chromium) and ffmpeg.
"""
import asyncio
import os
import subprocess
import sys

from playwright.async_api import async_playwright

FPS, DURATION = 30, 17.0
SUBJECTS = {"06": "ict", "04": "business", "07": "engineering", "05": "science", "03": "social-sciences"}
VIDEO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_DIR = os.path.join(VIDEO_DIR, "output", "series")


async def render(pg, code, slug):
    out = os.path.join(OUT_DIR, f"degree-drift-{slug}.mp4")
    tmp = out.replace(".mp4", ".tmp.mp4")
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    await pg.goto(f"file://{os.path.join(VIDEO_DIR, 'series.html')}?f={code}")
    await pg.wait_for_timeout(400)
    if errors:  # a hook's claim no longer matches the data
        raise SystemExit(f"{slug}: {errors[0]}")
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg",
         "-i", "-", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-shortest",
         "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", tmp],
        stdin=subprocess.PIPE,
    )
    for i in range(round(DURATION * FPS)):
        await pg.evaluate(f"window.render({i / FPS})")
        ff.stdin.write(await pg.screenshot(type="jpeg", quality=92))
    ff.stdin.close()
    if ff.wait() != 0:
        raise SystemExit(f"ffmpeg failed for {slug}")
    os.replace(tmp, out)
    print("Wrote", out)


async def main(codes):
    os.makedirs(OUT_DIR, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--allow-file-access-from-files"])
        for code in codes:
            pg = await b.new_page(viewport={"width": 1080, "height": 1920})
            await render(pg, code, SUBJECTS[code])
            await pg.close()
        await b.close()


asyncio.run(main(sys.argv[1:] or list(SUBJECTS)))
