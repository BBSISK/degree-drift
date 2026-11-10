# 🎓 Degree Drift — Where Do Irish University Graduates Actually Go?

> An interactive 10-year longitudinal dashboard tracking Irish university graduates from lecture hall to actual economic sectors, linked directly with Revenue tax data across fields and higher education institutions.

[![Source: CSO Ireland](https://img.shields.io/badge/Data-CSO%20Ireland%20(HEO08%2C%20HEO12%2C%20HEO16)-0ea5e9)](https://data.cso.ie)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-emerald)](https://creativecommons.org/licenses/by/4.0/)

---

## 💡 The Core Problem

Most people assume their college major locks them into one industry forever. But what does the hard administrative data show?

The Central Statistics Office (CSO) and the Higher Education Authority (HEA) performed an unprecedented statutory linkage: pairing university graduation records directly with **Revenue PAYE tax records** to track cohorts at **1, 2, 3, 5, 8, and 10 years post-graduation**.

**Degree Drift** visualizes this transition across the entire Irish economy, with institutional resolution across Ireland's major universities and technological universities.

---

## 🔍 Key Findings Revealed by the Data

1. **The Tech Inflow Paradox**:
   * At Year 5, **more graduates working in the Irish Tech sector hold Business degrees (26.9%) and Arts & Humanities degrees (22.6%) than pure ICT Computer Science degrees (24.4%)**.
   * Dublin's multinational tech ecosystem absorbs vast numbers of non-CS majors into operations, policy, customer solutions, sales, and product roles.
2. **The "Landing Pad" Effect**:
   * In Year 1, over **27.1%** of Arts & Humanities graduates work in Wholesale & Retail.
   * By Year 5 and 10, retail drops to ~10% as Education (36%), Tech (10.5%), and Professional/Scientific (9.4%) absorb them.
3. **Field Stickiness**:
   * **Education** (87.5%) and **Health & Welfare** (68.7%) have the highest retention in their direct fields.
   * **Natural Sciences & Humanities** act as flexible "Swiss Army knives", scattering evenly across multiple economic sectors.
4. **Institutional Salary Divergence (CSO Table HEO16)**:
   * By Year 5 and Year 10, selecting specific institutions (e.g., **Maynooth University**, **Trinity**, **UCD**, **TU Dublin**) reveals how graduate earnings compare against the national baseline within the same field of study.

---

## 🏛️ Institutional Layering & Methodology Integrity

Under **Section 33 of the Statistics Act 1993**, strict statistical disclosure control applies to prevent personal re-identification (cell counts $< 10$ are suppressed).

To maintain absolute methodological and statistical integrity:
* **Macroeconomic Industry Sector Flows** are drawn from the comprehensive joint matrix **CSO Table HEO08** & **HEO09**.
* **Microeconomic Institutional Earnings Curves & Counts** are drawn from **CSO Table HEO14** & **HEO16**.
* Both datasets derive from the identical underlying HEA-Revenue PPSN linkage.

---

## 🚀 Quick Start

### 1. Run Locally
```bash
cd degree-drift
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 2. Refresh Data from CSO API
To re-run the Python data pipeline and fetch the latest tables directly from `data.cso.ie`:
```bash
python3 data_pipeline/process.py
```

---

## 🛠️ Tech Stack & Architecture

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4**
- **D3 Sankey (`d3-sankey`)**: Custom interactive SVG flow visualization with node/link isolation.
- **CSO PxStat Open Data Pipeline**: Python script querying `ws.cso.ie` REST API for tables `HEO08`, `HEO12`, `HEO14`, and `HEO16`.
- **Zero-Latency Client Bundle**: Clean JSON payload stored in `public/data.json` for instant client-side transitions across all 10 years, NFQ levels, and institutions.

---

## 📊 Data Attribution

* Data sourced from the [Central Statistics Office (CSO) Ireland](https://data.cso.ie).
* Datasets: **HEO08**, **HEO12**, **HEO14**, and **HEO16** (Higher Education Outcomes).
* Licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
