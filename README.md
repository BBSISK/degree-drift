# 🎓 Degree Drift: Where Do Irish University Graduates Actually Go?

> An interactive 10-year dashboard that follows Irish graduates from lecture hall into the sectors of the economy where they actually work, using CSO data linked to Revenue tax records, by field of study and higher education institution.

**Live:** [ADD THE LIVE URL]

[![Source: CSO Ireland](https://img.shields.io/badge/Data-CSO%20Ireland%20(HEO08%2C%20HEO12%2C%20HEO16)-0ea5e9)](https://data.cso.ie)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-emerald)](https://creativecommons.org/licenses/by/4.0/)

---

## 💡 The question

Most people assume their degree locks them into one industry. What does the administrative data show?

The Central Statistics Office (CSO) and the Higher Education Authority (HEA) linked graduation records with **Revenue PAYE tax records**, so each graduating cohort can be followed at **1, 2, 3, 5, 8 and 10 years after graduation**.

**Degree Drift** shows that movement across the Irish economy, for every field of study and for the major universities and technological universities.

---

## 🔍 What the data shows

1. **The tech inflow paradox**
   * At Year 5, **more graduates working in the Irish tech sector hold Business degrees (26.9%) and Arts & Humanities degrees (22.6%) than ICT / Computer Science degrees (24.4%)**.
   * Dublin's multinational tech sector takes in many non-CS graduates, in operations, policy, customer solutions, sales and product roles.
2. **The "landing pad" effect**
   * In Year 1, over **27.1%** of Arts & Humanities graduates work in Wholesale & Retail.
   * By Years 5 and 10, retail falls to about 10% as Education (36%), Tech (10.5%) and Professional / Scientific (9.4%) take them in.
3. **Field stickiness**
   * **Education** (87.5%) and **Health & Welfare** (68.7%) keep the most graduates in their own field.
   * **Natural Sciences** and **Arts & Humanities** graduates spread evenly across many sectors.
4. **Earnings by institution (CSO Table HEO16)**
   * At Years 5 and 10, choosing an institution (for example **Maynooth University**, **Trinity**, **UCD** or **TU Dublin**) shows how its graduates' earnings compare with the national figure for the same field.

---

## 🏛️ Data and method

Under **Section 33 of the Statistics Act 1993**, the CSO applies disclosure control so that no one can be identified: small cells (counts under 10) are suppressed in the published tables.

The dashboard uses three CSO tables, all from the same HEA–Revenue linkage:

| Layer | Table | What it gives |
|---|---|---|
| Sector flows | **HEO08**: Graduate Sector of Employment | Field of study → sector, by NFQ level and years since graduation |
| National earnings | **HEO12**: National Graduate Earnings | Median earnings by field, NFQ level and years since graduation |
| Institution earnings | **HEO16**: Graduate Earnings by Institution | Median earnings by institution, field, NFQ level and years since graduation |

Suppressed cells are left out rather than estimated, so a flow or line that is missing for an institution means the CSO didn't publish it.

---

## 🛠️ How it's built and checked

- **Front end:** React 19 + TypeScript + Vite, styled with Tailwind CSS v4.
- **Sankey flows:** a custom interactive SVG built on `d3-sankey`, with node and link highlighting.
- **Data pipeline:** `data_pipeline/process.py` (Python standard library only) reads HEO08, HEO12 and HEO16 from the CSO PxStat REST API (`ws.cso.ie`, JSON-stat 2.0) and writes one compact file, `public/data.json`. The site loads that file once, so switching year, NFQ level or institution is instant and the site never calls the CSO API itself.
- **Type-checked builds:** TypeScript runs in strict mode, and `npm run build` runs `tsc` before Vite, so a type error stops the build.
- **Continuous deployment:** a GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site on every push to `main` and publishes it to GitHub Pages. `render.yaml` describes the same build as a Render static site.
- **Not yet:** there are no automated tests and no checks on the downloaded tables, for example that each field's sector shares add up to 100%. Those are the next additions.

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
```
This rewrites `public/data.json`. Commit it to publish the new data.

---

## 📊 Data attribution

* Data from the [Central Statistics Office (CSO) Ireland](https://data.cso.ie): tables **HEO08**, **HEO12** and **HEO16** (Higher Education Outcomes).
* Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
