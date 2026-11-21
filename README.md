# Renewable Energy Analytics Platform - Frontend Client ⚡

Modern, decoupled Executive Single-Page Application (SPA) dashboard for the **Renewable Energy Clustering & Storage Engine**.

Built with **Tailwind CSS**, **Plotly.js**, and **Lucide Icons**, designed for instant zero-configuration deployment to **Vercel**, **GitHub Pages**, or **Netlify**.

> 📖 **Complete In-Depth Report**: For complete numerical tables, ML accuracy scores, and raw HBase telemetry records, see [OUTPUT_AND_RESULTS.md](OUTPUT_AND_RESULTS.md).

---

## 📊 1. Verified Live Execution Output & Dashboard Results

### A. ☀️💨💧 Fleet Generation Output by Modality
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        FLEET GENERATION & CAPACITY COMPARISON                          │
├─────────────────────────┬──────────────────────────┬───────────────────────────────────┤
│ ☀️ SOLAR POWER PLANTS   │ 💨 WIND TURBINES         │ 💧 HYDROELECTRIC STATIONS         │
├─────────────────────────┼──────────────────────────┼───────────────────────────────────┤
│ • Total Cap: 11.0 MW    │ • Total Cap: 12.5 MW     │ • Total Cap: 6.0 MW               │
│ • Generation: 259.1 MWh │ • Generation: 429.5 MWh  │ • Generation: 425.3 MWh           │
│ • Peak Power: 4,070 kW  │ • Peak Power: 8,000 kW   │ • Peak Power: 5,374 kW            │
│ • Capacity Factor: 23.6%│ • Capacity Factor: 31.9% │ • Capacity Factor: 70.9% (Baseload)│
└─────────────────────────┴──────────────────────────┴───────────────────────────────────┘
```

| Plant Modality | Monitored Installations | Total Capacity | MWh Generated | Mean Capacity Factor | Peak Power (kW) | Key Environmental Factor |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Solar PV** | `SOLAR_DESERT_01`, `SOLAR_COASTAL_02`, `SOLAR_HIGHLAND_03` | **11.0 MW** | **259.12 MWh** | **23.63 %** | **4,070.57 kW** | Peak Irradiance: 1,015.0 W/m² |
| **Wind Turbines** | `WIND_OFFSHORE_01`, `WIND_RIDGE_02` | **12.5 MW** | **429.54 MWh** | **31.90 %** | **8,000.00 kW** | Mean Wind Speed: 8.09 m/s |
| **Hydroelectric**| `HYDRO_CASCADE_01` | **6.0 MW** | **425.32 MWh** | **70.89 %** | **5,374.26 kW** | Continuous penstock water flow |

---

### B. 🖥️ Executive Dashboard Layout & Visualization Outputs

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ⚡ RENEWABLE ENERGY CLUSTERING & NO-SQL TELEMETRY DASHBOARD                     🟢 API: CONNECTED │
├───────────────────┬───────────────────┬───────────────────┬───────────────────┬──────────────────┤
│ ⚡ TOTAL CLEAN MWh│ 🌿 CO₂ DISPLACED  │ 🌲 TREES EQUIV.   │ 💰 PPA REVENUE    │ 🗄️ HBASE ROWS    │
│    1,155.82 MWh   │   549.02 Tons     │   24,955 Trees    │   $122,436.58     │   2,532 Scanned  │
├───────────────────┴───────────────────┴───────────────────┴───────────────────┴──────────────────┤
│  🎯 2D/3D PCA CLUSTERING REGIMES (Plotly.js)           🔬 MULTI-DIMENSIONAL RADAR FOOTPRINTS      │
│                                                                                                  │
│   PCA-2 (Variance Retention: 77.47%)                      Active Power                           │
│   ▲                                                            ▲                                 │
│   │   [Cluster 0: Peak Yield 🟣]                               │ \                               │
│   │       (Avg 3,892.4 kW)                                     │   \ [Cluster 0: Peak Yield]     │
│   │                                       Irradiance / Wind ──┼─── \ ── Resource Intensity       │
│   │   [Cluster 1: Nominal Day 🟢]                              │     \                           │
│   │       (Avg 1,410.8 kW)                                     │      \                          │
│   │                                                            ▼       \                         │
│   │   [Cluster 2: Curtailment 🔴] [Cluster 3: Standby 🔵]      Module Temp                       │
│   └────────────────────────────────────────► PCA-1                                               │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  🔍 SENSOR CORRELATION HEATMAP                         🗄️ LIVE APACHE HBASE TELEMETRY SCANNER    │
│  • Power ↔ Capacity Factor:      +0.928 (Direct)       • SOLAR#SOLAR_DESERT_01...  18.15 kW [C3]  │
│  • Solar Irradiance ↔ Power:     +0.909 (Diurnal)      • WIND#WIND_OFFSHORE_01...7,846.1 kW [C0]  │
│  • Wind Speed ↔ Power:           +0.839 (Aerodynamic)  • SOLAR#SOLAR_HIGHLAND_03..  0.02 kW [C3]  │
│  • Module Temp ↔ Ambient Temp:   +0.630 (Thermal)      • HYDRO#HYDRO_CASCADE_01..4,503.2 kW [C0]  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### C. 🎯 Machine Learning Evaluation & Clustering Quality

```text
Evaluation Rating: EXCELLENT (Production Ready)
Evaluated Records: 2,532 Telemetry Points
```

| Evaluation Metric | Score / Output | Target Range | Status / Quality |
| :--- | :---: | :---: | :--- |
| **Overall Model Accuracy** | **91.3%** | $> 80\%$ | ✅ **Production Ready** |
| **Anomaly Detection Accuracy** | **96.25%** | $> 90\%$ | ✅ **High Precision** (Ground-truth validated) |
| **PCA Information Retention (3D)** | **91.20%** | $> 85\%$ | ✅ **High Fidelity** (captures multi-sensor variance) |
| **PCA Information Retention (2D)** | **77.47%** | $> 70\%$ | ✅ **Optimal 2D Projection** |
| **Cluster Cohesion Quality** | **86.4%** | $> 80\%$ | ✅ **Tight Grouping** |
| **Silhouette Coefficient** | **0.4659** | $[-1.0, 1.0]$ | ✅ **Well-Separated Boundaries** |
| **Davies-Bouldin Index** | **0.8395** | $< 1.0$ | ✅ **Compact Cluster Dispersion** |
| **Calinski-Harabasz Dispersion**| **1,755.1** | $> 1000$ | ✅ **Strong Between-Cluster Variance** |

---

### D. ⚠️ Predictive Diagnostics & Anomaly Alerts Log

Detected using distance-to-centroid anomaly detection ($d \ge 0.60$ threshold):

| Severity | Plant ID | Modality | Anomaly Score | Root Cause Diagnosis | Automated Prescriptive Action |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 🔴 **CRITICAL** | `WIND_OFFSHORE_01` | WIND | **1.0000** | High-Wind Storm Curtailment ($v = 26.39\text{ m/s}$) | Pitch control lock engaged; resume at rated speed. |
| 🔴 **CRITICAL** | `WIND_OFFSHORE_01` | WIND | **0.9503** | Blade feathering shutoff reached cut-out limit | Auto-monitor wind gust decay; prevent mechanical stress. |
| 🟠 **WARNING** | `SOLAR_DESERT_01` | SOLAR | **0.7812** | Excessive panel dust / soiling accumulation ($>20\%$) | Dispatch automated dry-brush cleaning robot. |
| 🟠 **WARNING** | `WIND_OFFSHORE_01` | WIND | **0.6708** | Turbine nacelle & gearbox overheating ($>65^\circ\text{C}$) | Inspect auxiliary cooling fans and lubrication flow. |
| 🟠 **WARNING** | `SOLAR_COASTAL_02` | SOLAR | **0.6420** | Inverter Phase B disconnect / voltage dip | Inspect DC string combiner box fuse. |

---

## 🌟 2. Key Dashboard Features

1. **Executive ESG & Financial KPIs**:
   - Total clean energy generation (MWh) across Solar, Wind, and Hydro fleets.
   - Real-time CO₂ emissions displaced and equivalent mature trees planted.
   - PPA revenue estimation based on energy yield.
   - Total Apache HBase reverse-chronological records ingested.

2. **Unsupervised ML & Dimensionality Reduction**:
   - **2D/3D PCA Projection**: Interactive multi-cluster scatter view mapping plant operating regimes.
   - **Multi-Dimensional Radar Chart**: Normalized cluster fingerprints across active power, resource intensity, ambient temperature, and performance ratios.
   - Dynamic model re-training trigger (K-Means, MiniBatch K-Means, DBSCAN, GMM).

3. **Advanced Big Data Analytics**:
   - Pearson Correlation Heatmap between weather factors and power yield.
   - Markovian Regime Transition Probability Matrix.

4. **What-If Physics Simulator**:
   - Live scenario testing for panel dust / soiling accumulation, solar irradiance drop, and wind gusts.
   - Computes operational impact and predicted cluster shift.

5. **Fleet Diagnostics & Predictive Maintenance**:
   - Distance-to-centroid anomaly detection flagging sub-optimal equipment behavior.
   - Root-cause diagnostics with automated prescribed remediation.

6. **Apache HBase NoSQL Scanner**:
   - Direct inspector for raw column families (`cf_telemetry`, `cf_environment`, `cf_analytics`).

---

## 🚀 3. Instant Deployment on Vercel

This repository is optimized as a static web application:

1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository: `renewable-energy-hbase-clustering-frontend`.
3. In **Framework Preset**, select **Other** (Zero build configuration needed).
4. Click **Deploy**.
5. Once deployed, open your live URL, click **⚙️ API Endpoint** at the top right, and paste your backend URL (e.g. `https://renewable-energy-hbase-clustering-backend.vercel.app` or your local server `http://localhost:8000`).

---

## 💻 4. Local Development

You can run this dashboard locally using any static server or by double-clicking `index.html`:

```bash
# Using Python
python -m http.server 3000

# Using Node.js npx
npx serve .
```

Open your browser at `http://localhost:3000`.

---

## 🔗 Backend Repository

The FastAPI REST API and Apache HBase storage backend is available at:
👉 [renewable-energy-hbase-clustering-backend](https://github.com/lishasraju/renewable-energy-hbase-clustering-backend)
