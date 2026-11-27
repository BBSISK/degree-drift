"""Compute the figures for the TikTok cut (video/tiktok.html) straight from CSO table HEO08.

The TikTok story follows ONE group of graduates over time, so it uses only the
graduating cohorts the CSO has published for all horizons (2010-2013), honours
degree (NFQ Level 8), Arts & Humanities. Shares exclude the 'not stated' sector,
as in the main pipeline.

Run from the repo root:
    python3 video/scripts/build_tiktok_data.py
Writes video/tiktok_data.js and prints the figures.
"""
import json
import os
import urllib.request

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
URL = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO08/JSON-stat/2.0/en"
COHORTS = ["2010", "2011", "2012", "2013"]
FIELD, LEVEL = "02", "08"  # Arts & Humanities, honours degree
YEARS = ["01", "03", "05", "10"]

with urllib.request.urlopen(URL, timeout=120) as r:
    d = json.loads(r.read().decode("utf-8"))

ids, size, values = d["id"], d["size"], d["value"]
cats = [d["dimension"][k]["category"]["index"] for k in ids]
strides = [1] * len(ids)
for i in range(len(ids) - 2, -1, -1):
    strides[i] = strides[i + 1] * size[i + 1]


def get(**kw):
    idx = sum(cats[i].index(kw[k]) * strides[i] for i, k in enumerate(ids))
    v = values[idx] if isinstance(values, list) else values.get(str(idx))
    return v or 0


dims = dict(zip(["stat", "year", "sector", "field", "level", "ys"], ids))
sectors = [s for s in cats[ids.index(dims["sector"])] if s not in ("-", "ZZ")]

out = {}
for ys in YEARS:
    row = {s: sum(get(**{dims["stat"]: "HEO08", dims["year"]: y, dims["sector"]: s, dims["field"]: FIELD,
                         dims["level"]: LEVEL, dims["ys"]: ys}) for y in COHORTS) for s in sectors}
    total = sum(row.values())
    out[str(int(ys))] = {"retail": round(100 * row["G"] / total, 1), "education": round(100 * row["P"] / total, 1),
                         "graduates": int(total)}
    print(f"Year {int(ys)}: retail {out[str(int(ys))]['retail']}%, education {out[str(int(ys))]['education']}%")

with open(os.path.join(ROOT, "video", "tiktok_data.js"), "w", encoding="utf-8") as f:
    f.write("window.TT=" + json.dumps(out) + ";")
print("Wrote video/tiktok_data.js")
