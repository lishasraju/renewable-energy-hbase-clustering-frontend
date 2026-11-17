# Renewable Energy Analytics Platform - Frontend Client ⚡

Modern, decoupled Executive Single-Page Application (SPA) dashboard for the **Renewable Energy Clustering & Storage Engine**.

Built with **Tailwind CSS**, **Plotly.js**, and **Lucide Icons**, designed for instant zero-configuration deployment to **Vercel**, **GitHub Pages**, or **Netlify**.

---

## 🌟 Key Features

1. **Executive ESG & Financial KPIs**:
   - Total clean energy generation (MWh) across Solar, Wind, and Hydro fleets.
   - Real-time CO₂ emissions displaced and equivalent mature trees planted.
   - PPA revenue estimation based on energy yield.
   - Total Apache HBase reverse-chronological records ingested.

2. **Unsupervised ML & Dimensionality Reduction**:
   - **2D PCA Projection**: Interactive multi-cluster scatter view mapping plant operating regimes.
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

## 🚀 Instant Deployment on Vercel

This repository is optimized as a static web application:

1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository: `renewable-energy-hbase-clustering-frontend`.
3. In **Framework Preset**, select **Other** (Zero build configuration needed).
4. Click **Deploy**.
5. Once deployed, open your live URL, click **⚙️ API Endpoint** at the top right, and paste your backend URL (e.g. `https://renewable-energy-hbase-clustering-backend.vercel.app` or your local server `http://localhost:8000`).

---

## 💻 Local Development

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
