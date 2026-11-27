"""Compute the figures for the vertical subject series (video/series.html) from CSO table HEO08.

Each video follows ONE group of graduates: honours-degree (NFQ Level 8) graduates of
2010-2013, the cohorts the CSO has published for all horizons (Years 1, 3, 5 and 10).
Shares exclude the 'not stated' sector, as in the main pipeline.

Run from the repo root:
    python3 video/scripts/build_series_data.py
Writes video/series_data.js and prints each subject's top 5 sectors per year.
"""
import json
import os
import urllib.request

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
URL = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO08/JSON-stat/2.0/en"
COHORTS = ["2010", "2011", "2012", "2013"]
LEVEL = "08"
FIELDS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]
YEARS = ["01", "03", "05", "10"]

with urllib.request.urlopen(URL, timeout=120) as r:
    d = json.loads(r.read().decode("utf-8"))

ids, size, values = d["id"], d["size"], d["value"]
cats = [d["dimension"][k]["category"]["index"] for k in ids]
strides = [1] * len(ids)
for i in range(len(ids) - 2, -1, -1):
    strides[i] = strides[i + 1] * size[i + 1]
stat, year, sector, field, level, ys_dim = ids


def get(**kw):
    idx = sum(cats[i].index(kw[k]) * strides[i] for i, k in enumerate(ids))
    v = values[idx] if isinstance(values, list) else values.get(str(idx))
    return v or 0


sectors = [s for s in cats[ids.index(sector)] if s not in ("-", "ZZ")]
out = {}
for f in FIELDS:
    out[f] = {}
    for ys in YEARS:
        row = {s: sum(get(**{stat: "HEO08", year: y, sector: s, field: f, level: LEVEL, ys_dim: ys}) for y in COHORTS)
               for s in sectors}
        total = sum(row.values())
        out[f][str(int(ys))] = {"shares": {s: round(100 * c / total, 1) for s, c in row.items()},
                                "graduates": int(total)}
        top = sorted(row, key=row.get, reverse=True)[:5]
        print(f"{f} Y{int(ys):<2} " + " | ".join(f"{s} {100 * row[s] / total:.1f}%" for s in top))

with open(os.path.join(ROOT, "video", "series_data.js"), "w", encoding="utf-8") as fh:
    fh.write("window.SD=" + json.dumps(out) + ";")
print("Wrote video/series_data.js")
