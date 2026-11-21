# 🎓 Degree Drift: Where Do Irish University Graduates Actually Go?

> An interactive dashboard showing where Irish graduates work and what they earn 1 to 10 years after graduation, by field of study and higher education institution, using CSO tables that link graduation records with Revenue PAYE records.

**Live:** https://degree-drift.onrender.com/

[![Source: CSO Ireland](https://img.shields.io/badge/Data-CSO%20Ireland%20(HEO08%2C%20HEO12%2C%20HEO16)-0ea5e9)](https://data.cso.ie)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-emerald)](https://creativecommons.org/licenses/by/4.0/)

---

## 💡 The question

Most people assume their degree locks them into one industry. What does the administrative data show?

The Central Statistics Office (CSO) and the Higher Education Authority (HEA) linked graduation records with **Revenue PAYE tax records**, so the CSO can publish outcomes for each graduating cohort at **1 to 10 years after graduation**. The dashboard uses 1, 2, 3, 5, 8 and 10.

**Degree Drift** shows that movement across the Irish economy, for every field of study and for the major universities and technological universities.

---

## 🔍 What the data shows

Figures are for **NFQ Level 8 (honours degree), all institutions**. All of them are checked against `public/data.json` by `data_pipeline/check_data.py`.

1. **Tech isn't just for computing graduates**
   * At Year 5, more graduates working in the Irish tech sector hold a **Business** degree (**26.9%**) than an **ICT** degree (**24.4%**). Business and **Arts & Humanities** (22.6%) together make up **49.5%**, about twice the ICT share.
2. **The "landing pad" effect**
   * In Year 1, **27.1%** of Arts & Humanities graduates work in Wholesale & Retail (42.9% with Hospitality).
   * Retail falls to 10.5% by Year 5 and 7.1% by Year 10, as Education (36.0%), Tech (10.5%) and Professional / Scientific (9.4%) take them in by Year 10.
   * This holds when following only the 2010–2013 graduates, so it isn't caused by pooling different cohorts.
3. **Field stickiness**
   * **Education** (87.5%) and **Health & Welfare** (68.7%) keep the most graduates in their own sector in Year 1.
   * **Social Sciences** and **Natural Sciences** graduates spread most widely across sectors.
4. **Earnings**
   * ICT has the highest median at Year 10 (€70,200 a year), but it doesn't grow fastest. From Year 1 to Year 10, Arts & Humanities grows +146%, Business +137% and ICT +123%.
   * Choosing an institution (for example **Maynooth University**, **Trinity**, **UCD** or **TU Dublin**) compares its graduates with the national median for the **same graduating cohorts**.

### ⚠️ How to read the years

* Each "years since graduation" view **pools every graduating cohort the CSO has published for that horizon**. Year 1 covers 2010–2022 graduates, Year 5 covers 2010–2018 and Year 10 only 2010–2013. The latest earnings data is for 2023. **Year 1 and Year 10 are not the same graduates.** The cohort list for each year is in `metadata.cohortsByYearsSince`.
* Earnings are the **unweighted average of each cohort's median weekly earnings**, in nominal euro. Annual figures are weekly × 52.
* The data covers **young graduates in substantial employment in Ireland** (CSO definition). Graduates working abroad aren't included.
* Sector counts are rounded by the CSO to the nearest 10 and summed across the pooled cohorts.

---

## 🏛️ Data and method

Under **Section 33 of the Statistics Act 1993**, the CSO applies disclosure control so that no one can be identified: small cells (counts under 10) are suppressed in the published tables.

The dashboard uses three CSO tables, all from the same HEA–Revenue linkage:

| Layer | Table | What it gives |
|---|---|---|
| Sector flows | **HEO08**: Graduate Sector of Employment | Field of study → sector, by NFQ level and years since graduation |
| National earnings | **HEO12**: National Graduate Earnings | Median earnings by field, NFQ level and years since graduation |
| Institution earnings | **HEO16**: Graduate Earnings by Institution | Median earnings by institution, field, NFQ level and years since graduation |

Suppressed cells are left out rather than estimated, so a flow or line that is missing for an institution means the CSO didn't publish it. Institution figures are never filled in from the national figure. Newer technological universities only appear from their founding cohorts (TU Dublin from 2018, MTU from 2020, ATU, TUS and SETU from 2021), so they have no Year 10 figures yet.

---

## 🛠️ How it's built and checked

- **Front end:** React 19 + TypeScript + Vite, styled with Tailwind CSS v4.
- **Sankey flows:** a custom interactive SVG built on `d3-sankey`, with node and link highlighting.
- **Data pipeline:** `data_pipeline/process.py` (Python standard library only) reads HEO08, HEO12 and HEO16 from the CSO PxStat REST API (`ws.cso.ie`, JSON-stat 2.0) and writes one compact file, `public/data.json`. The site loads that file once, so switching year, NFQ level or institution is instant and the site never calls the CSO API itself.
- **Type-checked builds:** TypeScript runs in strict mode, and `npm run build` runs `tsc` before Vite, so a type error stops the build.
- **Continuous deployment:** a GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site on every push to `main` and publishes it to GitHub Pages. `render.yaml` describes the same build as a Render static site.
- **Data checks:** `data_pipeline/check_data.py` runs in CI before every build. It checks that sector shares add up to 100%, that institution values are never national fallbacks and always have a same-cohort benchmark, that newer TUs show no Year 10 figures, and that every figure quoted in the dashboard and this README matches `public/data.json`.

---

## 🚀 Run it

### Locally
```bash
npm install
npm run dev
```
Open [http://localhost:5174](http://localhost:5174).

### Refresh the data from the CSO API
```bash
python3 data_pipeline/process.py
python3 data_pipeline/check_data.py
```
This rewrites `public/data.json` and checks it. If the CSO revises its tables, the checks show which quoted figures need updating. Commit `data.json` to publish the new data.

---

## 🎬 LinkedIn video

`video/` holds a 37-second, 1080×1080 video built from the same verified data: a salary race, the sector Sankey and a "how it was built" slide. `video/output/` has the finished MP4 and cover image, and `video/linkedin-post.md` has the post text and the sourced first comment. To rebuild it after a data refresh:

```bash
python3 video/scripts/build_data.py
python3 video/scripts/render.py   # needs Playwright (Chromium) and ffmpeg
```

---

## 📊 Data attribution

* Data from the [Central Statistics Office (CSO) Ireland](https://data.cso.ie): tables **HEO08**, **HEO12** and **HEO16** (Higher Education Outcomes).
* Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
