"""
Degree Drift data checks.

Run after process.py (and in CI) to confirm that public/data.json is internally
consistent and that every figure quoted in the dashboard text and README still
matches the data. Exits non-zero on any failure.

    python3 data_pipeline/check_data.py
"""

import json
import os
import sys

HERE = os.path.dirname(__file__)
DATA = os.path.join(HERE, "..", "public", "data.json")

failures = []


def check(cond, msg):
    if not cond:
        failures.append(msg)


def main():
    with open(DATA, encoding="utf-8") as f:
        d = json.load(f)

    meta = d["metadata"]
    years = ["1", "2", "3", "5", "8", "10"]

    # 1. Shares within each field and each sector add up to ~100%.
    for lvl, tl in d["timelines"].items():
        for ys in years:
            flows = tl[ys]["flows"]
            by_field, by_sector = {}, {}
            for fl in flows:
                by_field[fl["sourceId"]] = by_field.get(fl["sourceId"], 0) + fl["percentOfField"]
                by_sector[fl["targetId"]] = by_sector.get(fl["targetId"], 0) + fl["percentOfSector"]
            for k, v in list(by_field.items()) + list(by_sector.items()):
                check(abs(v - 100) <= 1.0, f"{lvl} Y{ys} {k}: shares sum to {v:.1f}%")

    # 2. Cohort metadata is present and sensible.
    cohorts = meta.get("cohortsByYearsSince", {})
    for ys in years:
        cs = cohorts.get(ys, [])
        check(len(cs) > 0, f"no cohorts recorded for Year {ys}")
        if cs:
            check(max(cs) + int(ys) <= meta.get("latestEarningsYear", 0) + 1,
                  f"Year {ys} cohorts run past the latest data year")

    # 3. Institution earnings are never filled in from the national figure,
    #    and every published value has a matched national benchmark.
    for inst, by_lvl in d["institutionEarnings"].items():
        check(inst in meta["institutions"], f"institution {inst} missing from metadata")
        if inst == "-":
            continue
        for lvl, by_ys in by_lvl.items():
            for ys, fields in by_ys.items():
                for fid, e in fields.items():
                    if e["weeklyMedianEur"] > 0:
                        check(len(e.get("cohorts", [])) > 0, f"{inst} {lvl} Y{ys} {fid}: value without cohorts")
                        check(e.get("nationalMatchedWeeklyEur", 0) > 0,
                              f"{inst} {lvl} Y{ys} {fid}: no matched national benchmark")
                    else:
                        check(not e.get("cohorts"), f"{inst} {lvl} Y{ys} {fid}: cohorts but no value")
    # Newer TUs cannot have Year 10 data yet.
    for inst in ["TU", "MU", "AT", "TS", "SE"]:
        y10 = d["institutionEarnings"][inst]["level_8"]["10"]
        check(all(e["weeklyMedianEur"] == 0 for e in y10.values()),
              f"{inst} shows Year 10 earnings, which the CSO has not published")
    check(any(e["weeklyMedianEur"] > 0 for e in d["institutionEarnings"]["AD"]["level_8"]["5"].values()),
          "NCAD (AD) has no earnings: check the institution code")

    # 4. Headline figures quoted in the dashboard and README (NFQ Level 8, national).
    t8 = d["timelines"]["level_8"]

    def pof(ys, f, s):
        return next((x["percentOfField"] for x in t8[ys]["flows"] if x["sourceId"] == f and x["targetId"] == s), 0)

    def pos(ys, f, s):
        return next((x["percentOfSector"] for x in t8[ys]["flows"] if x["sourceId"] == f and x["targetId"] == s), 0)

    def annual(ys, f):
        return t8[ys]["earnings"][f]["annualEquivalentEur"]

    expected = [
        ("Tech sector Y5: Business share", pos("5", "04", "J"), 26.9),
        ("Tech sector Y5: Arts share", pos("5", "02", "J"), 22.6),
        ("Tech sector Y5: ICT share", pos("5", "06", "J"), 24.4),
        ("Arts in retail Y1", pof("1", "02", "G"), 27.1),
        ("Arts in retail + hospitality Y1", round(pof("1", "02", "G") + pof("1", "02", "I"), 1), 42.9),
        ("Business in retail Y1", pof("1", "04", "G"), 15.7),
        ("Arts in retail Y3", pof("3", "02", "G"), 15.0),
        ("Arts in education Y1", pof("1", "02", "P"), 11.8),
        ("Arts in education Y3", pof("3", "02", "P"), 25.5),
        ("Arts in retail Y5", pof("5", "02", "G"), 10.5),
        ("Arts in retail Y10", pof("10", "02", "G"), 7.1),
        ("Arts in education Y10", pof("10", "02", "P"), 36.0),
        ("Arts in tech Y10", pof("10", "02", "J"), 10.5),
        ("Arts in professional Y10", pof("10", "02", "M"), 9.4),
        ("Education stickiness Y1", pof("1", "01", "P"), 87.5),
        ("Health stickiness Y1", pof("1", "09", "Q"), 68.7),
        ("ICT in ICT sector Y8", pof("8", "06", "J"), 49.2),
        ("ICT in finance Y8", pof("8", "06", "Y3500"), 8.8),
        ("ICT in finance Y10", pof("10", "06", "Y3500"), 9.0),
        ("ICT median Y10", annual("10", "06"), 70200),
        ("Business median Y10", annual("10", "04"), 58552),
        ("Education median Y1", annual("1", "01"), 36192),
        ("Health median Y1", annual("1", "09"), 34424),
        ("ICT median Y1", annual("1", "06"), 31460),
        ("ICT median Y3", annual("3", "06"), 40300),
        ("Engineering median Y5", annual("5", "07"), 45032),
        ("ICT median Y5", annual("5", "06"), 49244),
        ("Natural Sciences median Y8", annual("8", "05"), 52312),
        ("Business median Y8", annual("8", "04"), 52104),
        ("ICT growth Y1->Y10 %", round(100 * (annual("10", "06") / annual("1", "06") - 1)), 123),
        ("Business growth Y1->Y10 %", round(100 * (annual("10", "04") / annual("1", "04") - 1)), 137),
        ("Arts growth Y1->Y10 %", round(100 * (annual("10", "02") / annual("1", "02") - 1)), 146),
    ]
    for name, got, want in expected:
        check(abs(got - want) < 0.051 if isinstance(want, float) else got == want,
              f"{name}: data says {got}, text says {want}")

    # Arts grows fastest of all fields Y1 -> Y10 (claim in text).
    growth = {f: annual("10", f) / annual("1", f) for f in t8["1"]["earnings"] if annual("1", f) > 0}
    check(max(growth, key=growth.get) == "02", "Arts & Humanities is no longer the fastest-growing field")

    if failures:
        print(f"{len(failures)} check(s) failed:")
        for m in failures:
            print("  -", m)
        sys.exit(1)
    print(f"All data checks passed ({len(expected)} quoted figures verified).")


if __name__ == "__main__":
    main()
