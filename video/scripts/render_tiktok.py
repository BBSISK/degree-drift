"""Render the vertical TikTok / Reels / Shorts cut (1080x1920, 30 fps, 17 s) from video/tiktok.html.

Run from the repo root:
    python3 video/scripts/build_tiktok_data.py
    python3 video/scripts/render_tiktok.py
Writes video/output/degree-drift-arts-tiktok.mp4. Needs Playwright (Chromium) and ffmpeg.
"""
import asyncio
import os
import subprocess

from playwright.async_api import async_playwright

FPS, DURATION = 30, 17.0
VIDEO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(VIDEO_DIR, "output", "degree-drift-arts-tiktok.mp4")


async def main():
    tmp = OUT.replace(".mp4", ".tmp.mp4")
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        await pg.goto("file://" + os.path.join(VIDEO_DIR, "tiktok.html"))
        await pg.wait_for_timeout(400)
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
            raise SystemExit("ffmpeg failed")
        os.replace(tmp, OUT)
        await b.close()
    print("Wrote", OUT)


asyncio.run(main())
