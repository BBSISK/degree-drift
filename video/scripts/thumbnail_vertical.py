"""Render the 1080x1920 (9:16) YouTube Shorts thumbnail to video/output/youtube-shorts-thumbnail.jpg.

Shorts thumbnails are shown in portrait, and YouTube may crop them further to 4:5 on some pages,
so everything important sits in the central 1080x1350 band.
Run: python3 video/scripts/thumbnail_vertical.py
"""
import asyncio
import os

from playwright.async_api import async_playwright

VIDEO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
JS = r"""
() => {
  const W = 1080, H = 1920;
  const stage = document.getElementById('stage'); stage.style.width = W+'px'; stage.style.height = H+'px';
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const defs = el('defs', {});
  const rg = el('radialGradient', { id: 'glow', cx: '70%', cy: '65%', r: '60%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#a855f7', 'stop-opacity': 0.22 }, rg);
  el('stop', { offset: '100%', 'stop-color': '#070b18', 'stop-opacity': 0 }, rg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: '#070b18' });
  el('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#glow)' });

  // Outside the 4:5 band (decorative only)
  el('text', { x: 540, y: 200, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 800, fill: '#38bdf8', 'letter-spacing': 8 }, svg, 'DEGREE DRIFT');

  // Central band y 285–1635
  el('text', { x: 540, y: 360, 'text-anchor': 'middle', 'font-size': 36, 'font-weight': 800, fill: '#38bdf8', 'letter-spacing': 5 }, svg, 'IRISH GRADUATES • 10 YEARS ON');
  const t1 = el('text', { x: 540, y: 520, 'text-anchor': 'middle', 'font-size': 150, 'font-weight': 900, fill: '#fff' }, svg);
  el('tspan', {}, t1, 'Degree ');
  el('tspan', { fill: '#fbbf24' }, t1, '≠');
  el('text', { x: 540, y: 670, 'text-anchor': 'middle', 'font-size': 150, 'font-weight': 900, fill: '#fff' }, svg, 'career?');

  const sg = el('g', { transform: 'translate(90,730)' });
  el('rect', { x: 0, y: 0, width: 900, height: 250, rx: 32, fill: 'rgba(15,23,42,0.92)', stroke: '#ec4899', 'stroke-width': 4 }, sg);
  el('text', { x: 450, y: 70, 'text-anchor': 'middle', 'font-size': 38, 'font-weight': 700, fill: '#cbd5e1' }, sg, 'Arts grads in retail: Year 1 → Year 10');
  const st = el('text', { x: 450, y: 200, 'text-anchor': 'middle', 'font-size': 124, 'font-weight': 900, fill: '#fff' }, sg);
  el('tspan', {}, st, '27%');
  el('tspan', { fill: '#fbbf24', dx: 24, 'font-size': 94 }, st, '→');
  el('tspan', { dx: 24 }, st, '7%');

  el('text', { x: 540, y: 1052, 'text-anchor': 'middle', 'font-size': 32, 'font-weight': 800, fill: '#e2e8f0', 'letter-spacing': 2 }, svg, 'WHERE ARTS GRADS WORK, YEAR 10');
  const cp = el('clipPath', { id: 'sk' }, defs);
  el('rect', { x: 95, y: 225, width: 960, height: 605 }, cp);
  const holder = el('g', { transform: 'translate(-30,860) scale(0.97)' });
  const inner = el('g', { 'clip-path': 'url(#sk)' }, holder);
  drawInto(inner, () => drawSankey(26.0));

  // Below the band
  el('text', { x: 540, y: 1720, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 600, fill: '#94a3b8' }, svg, 'Where Irish graduates really work');
  el('text', { x: 540, y: 1772, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 600, fill: '#64748b' }, svg, 'CSO data • degree-drift.onrender.com');
}
"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1080, "height": 1920})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + os.path.join(VIDEO_DIR, "index.html"))
        await pg.wait_for_timeout(500)
        await pg.evaluate(JS)
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=os.path.join(VIDEO_DIR, "output", "youtube-shorts-thumbnail.jpg"), type="jpeg",
                            quality=90, clip={"x": 0, "y": 0, "width": 1080, "height": 1920})
        print("errors", errs)
        await b.close()


asyncio.run(main())
