# LinkedIn post: Degree Drift video

Upload `output/degree-drift-linkedin.mp4`. If LinkedIn offers a thumbnail option, use `output/degree-drift-cover.png`.

## Post text

Where do Irish university graduates actually work, 1 to 10 years after graduating?

Most people assume their degree locks them into one industry. I used Central Statistics Office (CSO) open data, which links graduation records with Revenue PAYE records, to build an interactive dashboard: "Degree Drift".

What the data shows (honours degree, NFQ Level 8, national):

1. Tech isn't just for computing graduates: at Year 5, more people in the Irish tech sector hold a Business degree (26.9%) than an ICT degree (24.4%). Business and Arts & Humanities together make up 49.5%, about twice the ICT share.
2. The Arts "landing pad": in Year 1, 27% of Arts & Humanities graduates work in retail. By Year 5 that's about 10%, and by Year 10 7%, as Education (36%), Tech (10.5%) and Professional Services (9.4%) take them in.
3. Field stickiness: Education (87.5%) and Health & Welfare (68.7%) keep the most graduates in their own sector in Year 1. Social Sciences and Natural Sciences graduates spread most widely across the economy.
4. Earnings: ICT has the highest median at Year 10 (€70.2k), but Arts & Humanities (+146%) and Business (+137%) grow faster from Year 1 than ICT (+123%).

The last slide shows how I built it: from the CSO's open data API, through a Python pipeline with automated checks, to a React dashboard.

Link to the dashboard and full sources in the first comment 👇

#DataAnalytics #DataEngineering #Python #OpenData #HigherEducation #Ireland #CSO

## First comment (post straight after publishing)

🔗 Explore the interactive dashboard: https://degree-drift.onrender.com
Open-source code and method: https://github.com/bbsisk/degree-drift

Sources: Central Statistics Office (CSO), Higher Education Outcomes, tables HEO08 (Graduate Sector of Employment) and HEO12 (National Graduate Earnings), data.cso.ie. © Government of Ireland, licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). The dashboard also uses HEO16 (Graduate Earnings by Institution).

Changes made: figures are for honours degrees (NFQ Level 8), nationally. Each "years since graduation" pools every graduating cohort the CSO has published for that horizon (Year 1 = 2010–2022 graduates, Year 10 = 2010–2013), so Year 1 and Year 10 are not the same people. Earnings are the average of cohort median weekly pay × 52, in nominal euro. The data covers graduates in substantial employment in Ireland, so those working abroad aren't included.

This is my own analysis, not endorsed by the CSO.

## Before posting on Monday

- Open https://degree-drift.onrender.com and hard-refresh, to check the site is up.
- If the CSO has revised its tables since November 2026, re-run `python3 data_pipeline/process.py` and `python3 data_pipeline/check_data.py`. Any changed figure in this post will show up as a failed check.
