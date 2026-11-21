"""Render the Degree Drift LinkedIn video (1080x1080, 30 fps, 37 s) from video/index.html.

Needs: Python Playwright (pip install playwright && playwright install chromium) and ffmpeg.
Run from the repo root:
    python3 video/scripts/build_data.py
    python3 video/scripts/render.py

Writes video/output/degree-drift-linkedin.mp4 and video/output/degree-drift-cover.png (frame 0).
"""
import asyncio
import os
import subprocess

from playwright.async_api import async_playwright

FPS = 30
SCENES = [("s1_hook", 0.0, 2.6), ("s2_salary", 2.6, 14.0), ("s3_sankey", 14.0, 30.0), ("s4_build", 30.0, 37.0)]
VIDEO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(VIDEO_DIR, "output")
TMP = os.path.join(OUT, "scenes")


async def render_scenes():
    os.makedirs(TMP, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--allow-file-access-from-files"])
        page = await browser.new_page(viewport={"width": 1080, "height": 1080})
        await page.goto("file://" + os.path.join(VIDEO_DIR, "index.html"))
        await page.wait_for_timeout(500)
        for name, t0, t1 in SCENES:
            n = round((t1 - t0) * FPS)
            tmp = os.path.join(TMP, f"{name}.tmp.mp4")
            ff = subprocess.Popen(
                ["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg",
                 "-i", "-", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p",
                 "-r", str(FPS), tmp],
                stdin=subprocess.PIPE,
            )
            for i in range(n):
                await page.evaluate(f"window.render({t0 + i / FPS})")
                ff.stdin.write(await page.screenshot(type="jpeg", quality=92))
            ff.stdin.close()
            if ff.wait() != 0:
                raise SystemExit(f"ffmpeg failed on {name}")
            os.replace(tmp, os.path.join(TMP, f"{name}.mp4"))
            print(f"{name}: {n} frames")
        await browser.close()


def join():
    lst = os.path.join(TMP, "list.txt")
    with open(lst, "w") as f:
        for name, _, _ in SCENES:
            f.write(f"file '{name}.mp4'\n")
    mp4 = os.path.join(OUT, "degree-drift-linkedin.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", "-movflags", "+faststart", mp4], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-frames:v", "1",
                    os.path.join(OUT, "degree-drift-cover.png")], check=True)
    print("Wrote", mp4)


if __name__ == "__main__":
    asyncio.run(render_scenes())
    join()
