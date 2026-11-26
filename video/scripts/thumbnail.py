"""Render the 1920x1080 YouTube thumbnail to video/output/youtube-thumbnail.jpg. Run: python3 video/scripts/thumbnail.py"""
import asyncio
import os
from playwright.async_api import async_playwright
VIDEO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JS = r"""
() => {
  const W = 1920, H = 1080;
  const stage = document.getElementById('stage'); stage.style.width = W+'px'; stage.style.height = H+'px';
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  // background glow
  const defs = el('defs', {});
  const rg = el('radialGradient', { id: 'glow', cx: '80%', cy: '30%', r: '60%' }, defs);
  el('stop', { offset: '0%', 'stop-color': '#a855f7', 'stop-opacity': 0.22 }, rg);
  el('stop', { offset: '100%', 'stop-color': '#070b18', 'stop-opacity': 0 }, rg);
  el('rect', { x: 0, y: 0, width: W, height: H, fill: '#070b18' });
  el('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#glow)' });
  // Sankey on the right (Year 10, Arts highlighted), clipped to the chart area only
  const cp = el('clipPath', { id: 'sk' }, defs);
  el('rect', { x: 95, y: 225, width: 960, height: 605 }, cp);
  const holder = el('g', { transform: 'translate(905,95) scale(0.95)' });
  const inner = el('g', { 'clip-path': 'url(#sk)' }, holder);
  drawInto(inner, () => drawSankey(26.0));
  // Left text
  el('text', { x: 90, y: 170, 'font-size': 38, 'font-weight': 800, fill: '#38bdf8', 'letter-spacing': 6 }, svg, 'IRISH GRADUATES • 10 YEARS ON');
  el('text', { x: 84, y: 330, 'font-size': 128, 'font-weight': 900, fill: '#fff' }, svg, 'Degree');
  const t2 = el('text', { x: 84, y: 470, 'font-size': 128, 'font-weight': 900, fill: '#fff' }, svg);
  el('tspan', { fill: '#fbbf24' }, t2, '≠ ');
  el('tspan', {}, t2, 'career?');
  // Stat strip
  const sg = el('g', { transform: 'translate(90,560)' });
  el('rect', { x: 0, y: 0, width: 760, height: 250, rx: 32, fill: 'rgba(15,23,42,0.92)', stroke: '#ec4899', 'stroke-width': 4 }, sg);
  el('text', { x: 40, y: 72, 'font-size': 36, 'font-weight': 700, fill: '#cbd5e1' }, sg, 'Arts grads in retail: Year 1 → Year 10');
  const st = el('text', { x: 40, y: 196, 'font-size': 120, 'font-weight': 900, fill: '#fff' }, sg);
  el('tspan', {}, st, '27%');
  el('tspan', { fill: '#fbbf24', dx: 24, 'font-size': 90 }, st, '→');
  el('tspan', { dx: 24 }, st, '7%');
  el('text', { x: 1095, y: 268, 'font-size': 30, 'font-weight': 800, fill: '#e2e8f0', 'letter-spacing': 2 }, svg, 'WHERE ARTS GRADS WORK, YEAR 10');
  el('text', { x: 90, y: 900, 'font-size': 32, 'font-weight': 600, fill: '#94a3b8' }, svg, 'Where Irish graduates really work • CSO data');
  el('text', { x: 90, y: 1030, 'font-size': 26, 'font-weight': 700, fill: '#38bdf8', 'letter-spacing': 4 }, svg, 'DEGREE DRIFT');
}
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + os.path.join(VIDEO_DIR, 'index.html')); await pg.wait_for_timeout(500)
        await pg.evaluate(JS); await pg.wait_for_timeout(200)
        await pg.screenshot(path=os.path.join(VIDEO_DIR, 'output', 'youtube-thumbnail.jpg'), type='jpeg', quality=90, clip={'x':0,'y':0,'width':1920,'height':1080})
        print('errors', errs)
        await b.close()
asyncio.run(main())
