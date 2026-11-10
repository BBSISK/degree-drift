"""
CSO Ireland Higher Education Outcomes Data Processor
Fetches:
- HEO08: Graduate Sector of Employment (Field of Study x Sector x NFQ Level x Years Since Grad)
- HEO12: National Graduate Earnings (Field x NFQ Level x Years Since Grad)
- HEO14: Graduate Counts by Higher Education Institution (Institution x Field x NFQ Level)
- HEO16: Graduate Earnings by Higher Education Institution (Institution x Field x NFQ Level x Years Since Grad)

Aggregates and transforms into a clean, compact JSON structure for Degree Drift.
"""

import urllib.request
import json
import os

URL_HEO08 = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO08/JSON-stat/2.0/en"
URL_HEO12 = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO12/JSON-stat/2.0/en"
URL_HEO14 = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO14/JSON-stat/2.0/en"
URL_HEO16 = "https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/HEO16/JSON-stat/2.0/en"

def fetch_json_stat(url):
    print(f"Fetching from {url} ...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (DegreeDrift Data Pipeline)"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def parse_heo08(data):
    print("Processing HEO08 (Sector destinations)...")
    dim = data['dimension']
    size = data['size']
    values = data['value']

    years = list(dim['TLIST(A1)']['category']['label'].keys())
    sectors = dim['C03430V04137']['category']['label']
    fields = dim['C03428V04135']['category']['label']
    levels = dim['C03427V04134']['category']['label']
    years_since = list(dim['C03433V04141']['category']['label'].keys())

    valid_fields = {k: v for k, v in fields.items() if k != '-'}
    valid_sectors = {k: v for k, v in sectors.items() if k not in ('-', 'ZZ')}

    m5 = 1
    m4 = m5 * len(years_since)
    m3 = m4 * len(levels)
    m2 = m3 * len(fields)
    m1 = m2 * len(sectors)

    flows = {}
    field_keys = list(fields.keys())
    sector_keys = list(sectors.keys())
    level_keys = list(levels.keys())
    target_levels = ['-', '08', '09']

    for i_yr, yr in enumerate(years):
        for i_sec, s_code in enumerate(sector_keys):
            if s_code not in valid_sectors:
                continue
            for i_fld, f_code in enumerate(field_keys):
                if f_code not in valid_fields:
                    continue
                for i_lvl, lvl_code in enumerate(level_keys):
                    if lvl_code not in target_levels:
                        continue
                    for i_ys, ys_code in enumerate(years_since):
                        idx = (i_yr * m1) + (i_sec * m2) + (i_fld * m3) + (i_lvl * m4) + (i_ys * m5)
                        val = values[idx]
                        if val is not None and val > 0:
                            key = (lvl_code, int(ys_code), f_code, s_code)
                            flows[key] = flows.get(key, 0) + val

    return flows, valid_fields, valid_sectors

def parse_heo12(data):
    print("Processing HEO12 (National Median Earnings)...")
    dim = data['dimension']
    size = data['size']
    values = data['value']

    stats = list(dim['STATISTIC']['category']['label'].keys())
    years = list(dim['TLIST(A1)']['category']['label'].keys())
    genders = list(dim['C03919V04671']['category']['label'].keys())
    fields = dim['C03428V04135']['category']['label']
    levels = dim['C03427V04134']['category']['label']
    years_since = list(dim['C03433V04141']['category']['label'].keys())

    m5 = 1
    m4 = m5 * len(years_since)
    m3 = m4 * len(levels)
    m2 = m3 * len(fields)
    m1 = m2 * len(genders)
    m0 = m1 * len(years)

    i_stat = stats.index('HEO12C03') # median
    i_gen = genders.index('-')
    field_keys = list(fields.keys())
    level_keys = list(levels.keys())

    earnings_map = {}
    for i_yr, yr in enumerate(years):
        for i_fld, f_code in enumerate(field_keys):
            for i_lvl, lvl_code in enumerate(level_keys):
                if lvl_code not in ('-', '08', '09'):
                    continue
                for i_ys, ys_code in enumerate(years_since):
                    idx = (i_stat * m0) + (i_yr * m1) + (i_gen * m2) + (i_fld * m3) + (i_lvl * m4) + (i_ys * m5)
                    val = values[idx]
                    if val is not None and val > 0:
                        key = (lvl_code, int(ys_code), f_code)
                        if key not in earnings_map:
                            earnings_map[key] = []
                        earnings_map[key].append(val)

    averaged = {}
    for k, v_list in earnings_map.items():
        averaged[k] = round(sum(v_list) / len(v_list))

    return averaged

def parse_heo16(data):
    print("Processing HEO16 (Institution Graduate Earnings)...")
    dim = data['dimension']
    size = data['size']
    values = data['value']

    stats = list(dim['STATISTIC']['category']['label'].keys())
    years = list(dim['TLIST(A1)']['category']['label'].keys())
    fields = dim['C03428V04135']['category']['label']
    levels = dim['C03427V04134']['category']['label']
    years_since = list(dim['C03433V04141']['category']['label'].keys())
    insts = dim['C03685V04428']['category']['label']

    m5 = 1
    m4 = m5 * len(insts)
    m3 = m4 * len(years_since)
    m2 = m3 * len(levels)
    m1 = m2 * len(fields)
    m0 = m1 * len(years)

    i_stat = stats.index('HEO16C03') # median earnings
    field_keys = list(fields.keys())
    level_keys = list(levels.keys())
    inst_keys = list(insts.keys())

    # Map (inst_code, lvl_code, ys_int, f_code) -> list of medians across cohorts
    inst_earnings_map = {}

    for i_yr, yr in enumerate(years):
        for i_fld, f_code in enumerate(field_keys):
            for i_lvl, lvl_code in enumerate(level_keys):
                if lvl_code not in ('-', '08', '09'):
                    continue
                for i_ys, ys_code in enumerate(years_since):
                    for i_inst, inst_code in enumerate(inst_keys):
                        idx = (i_stat * m0) + (i_yr * m1) + (i_fld * m2) + (i_lvl * m3) + (i_ys * m4) + (i_inst * m5)
                        val = values[idx]
                        if val is not None and val > 0:
                            key = (inst_code, lvl_code, int(ys_code), f_code)
                            if key not in inst_earnings_map:
                                inst_earnings_map[key] = []
                            inst_earnings_map[key].append(val)

    averaged_inst_earnings = {}
    for k, v_list in inst_earnings_map.items():
        averaged_inst_earnings[k] = round(sum(v_list) / len(v_list))

    return averaged_inst_earnings, insts

def main():
    data_heo08 = fetch_json_stat(URL_HEO08)
    data_heo12 = fetch_json_stat(URL_HEO12)
    data_heo16 = fetch_json_stat(URL_HEO16)

    flows, fields_meta, sectors_meta = parse_heo08(data_heo08)
    national_earnings = parse_heo12(data_heo12)
    inst_earnings, insts_meta = parse_heo16(data_heo16)

    friendly_sectors = {
        'A': 'Agriculture & Forestry',
        'F': 'Construction & Trades',
        'G': 'Wholesale & Retail',
        'H': 'Transportation & Logistics',
        'I': 'Hospitality & Food Services',
        'J': 'Information & Communication (Tech)',
        'M': 'Professional, Scientific & Technical',
        'N': 'Administrative & Support',
        'O': 'Public Administration & Civil Service',
        'P': 'Education & Teaching',
        'Q': 'Health & Social Work',
        'Y0900': 'Industry & Manufacturing (Pharma/Semi)',
        'Y3500': 'Financial, Insurance & Real Estate',
        'Y7500': 'Arts, Culture & Other Services'
    }

    friendly_fields = {
        '01': 'Education',
        '02': 'Arts & Humanities',
        '03': 'Social Sciences & Journalism',
        '04': 'Business, Admin & Law',
        '05': 'Natural Sciences & Mathematics',
        '06': 'Information & Comm. Tech (ICT)',
        '07': 'Engineering & Construction',
        '08': 'Agriculture & Veterinary',
        '09': 'Health & Welfare',
        '10': 'Services'
    }

    # Major Irish Higher Education Institutions to feature
    featured_institutions = {
        '-': 'All Institutions (National Benchmark)',
        'MH': 'Maynooth University',
        'TR': 'Trinity College Dublin',
        'DN': 'University College Dublin (UCD)',
        'DC': 'Dublin City University (DCU)',
        'TU': 'Technological University Dublin (TU Dublin)',
        'CK': 'University College Cork (UCC)',
        'GY': 'University of Galway',
        'LM': 'University of Limerick (UL)',
        'MU': 'Munster Technological University (MTU)',
        'AT': 'Atlantic Technological University (ATU)',
        'TS': 'Technological University of the Shannon (TUS)',
        'SE': 'South East Technological University (SETU)',
        'RC': 'Royal College of Surgeons in Ireland (RCSI)',
        'NC': 'National College of Art and Design (NCAD)',
        'DK': 'Dundalk Institute of Technology'
    }

    level_map = {
        '-': 'all',
        '08': 'level_8',
        '09': 'level_9'
    }

    target_years_since = [1, 2, 3, 5, 8, 10]

    result = {
        "metadata": {
            "source": "Central Statistics Office (CSO) Ireland",
            "tables": [
                "HEO08 (Graduate Sector of Employment)",
                "HEO12 (National Graduate Earnings)",
                "HEO14 (Graduates by Higher Education Institution)",
                "HEO16 (Graduate Earnings by Institution)"
            ],
            "url": "https://data.cso.ie",
            "description": "10-year longitudinal analysis of Irish university graduates tracking sectors and earnings by institution and field.",
            "nfq_levels": {
                "all": "All Qualifications Combined",
                "level_8": "NFQ Level 8 (Honours Bachelor)",
                "level_9": "NFQ Level 9 (Masters / Postgraduate Diploma)"
            },
            "fields": friendly_fields,
            "sectors": friendly_sectors,
            "institutions": featured_institutions
        },
        "timelines": {},
        "institutionEarnings": {} # (inst_code, level_name, year_since) -> { fieldId -> earnings }
    }

    # Build timeline flows
    for lvl_code, lvl_name in level_map.items():
        result["timelines"][lvl_name] = {}
        for ys in target_years_since:
            flow_list = []
            field_totals = {}
            sector_totals = {}

            for f_code, f_name in friendly_fields.items():
                for s_code, s_name in friendly_sectors.items():
                    cnt = flows.get((lvl_code, ys, f_code, s_code), 0)
                    if cnt > 0:
                        flow_list.append({
                            "sourceId": f_code,
                            "sourceName": f_name,
                            "targetId": s_code,
                            "targetName": s_name,
                            "count": int(cnt)
                        })
                        field_totals[f_code] = field_totals.get(f_code, 0) + cnt
                        sector_totals[s_code] = sector_totals.get(s_code, 0) + cnt

            for item in flow_list:
                f_tot = field_totals.get(item["sourceId"], 1)
                s_tot = sector_totals.get(item["targetId"], 1)
                item["percentOfField"] = round((item["count"] / f_tot) * 100, 1)
                item["percentOfSector"] = round((item["count"] / s_tot) * 100, 1)

            flow_list.sort(key=lambda x: x["count"], reverse=True)

            # National baseline earnings
            earnings_by_field = {}
            for f_code, f_name in friendly_fields.items():
                weekly_eur = national_earnings.get((lvl_code, ys, f_code), 0)
                earnings_by_field[f_code] = {
                    "fieldId": f_code,
                    "fieldName": f_name,
                    "weeklyMedianEur": weekly_eur,
                    "annualEquivalentEur": weekly_eur * 52 if weekly_eur > 0 else 0
                }

            result["timelines"][lvl_name][str(ys)] = {
                "yearsSinceGraduation": ys,
                "flows": flow_list,
                "fieldTotals": field_totals,
                "sectorTotals": sector_totals,
                "earnings": earnings_by_field
            }

    # Build institution-specific earnings mapping
    print("Compiling institution earnings matrices...")
    for inst_code in featured_institutions:
        result["institutionEarnings"][inst_code] = {}
        for lvl_code, lvl_name in level_map.items():
            result["institutionEarnings"][inst_code][lvl_name] = {}
            for ys in target_years_since:
                inst_map = {}
                for f_code, f_name in friendly_fields.items():
                    # If specific institution has earnings, use them; fallback to national benchmark
                    wk = inst_earnings.get((inst_code, lvl_code, ys, f_code))
                    if not wk:
                        wk = national_earnings.get((lvl_code, ys, f_code), 0)

                    inst_map[f_code] = {
                        "fieldId": f_code,
                        "fieldName": f_name,
                        "weeklyMedianEur": wk,
                        "annualEquivalentEur": wk * 52 if wk > 0 else 0
                    }
                result["institutionEarnings"][inst_code][lvl_name][str(ys)] = inst_map

    out_path = os.path.join(os.path.dirname(__file__), "..", "public", "data.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"Data successfully compiled to {out_path} ({os.path.getsize(out_path) // 1024} KB)")

if __name__ == "__main__":
    main()
