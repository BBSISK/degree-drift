"""Extract the figures the LinkedIn video uses from public/data.json into video/vdata.js.

Run from the repo root after refreshing the data:
    python3 video/scripts/build_data.py
"""
import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
d = json.load(open(os.path.join(ROOT, "public", "data.json"), encoding="utf-8"))
t8 = d["timelines"]["level_8"]  # honours degree, national

out = {
    "earn": {ys: {k: v["annualEquivalentEur"] for k, v in t8[ys]["earnings"].items()}
             for ys in ["1", "2", "3", "5", "8", "10"]},
    "flows": {ys: [[f["sourceId"], f["targetId"], f["count"], f["percentOfField"], f["percentOfSector"]]
                   for f in t8[ys]["flows"]] for ys in ["1", "5", "10"]},
}
with open(os.path.join(ROOT, "video", "vdata.js"), "w", encoding="utf-8") as f:
    f.write("window.VDATA=" + json.dumps(out) + ";")
print("Wrote video/vdata.js")
