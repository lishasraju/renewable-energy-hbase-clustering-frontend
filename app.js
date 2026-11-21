// Executive SPA Dashboard Client Logic - Decoupled Frontend
let customApiBase = localStorage.getItem("RENEWABLE_API_BASE");
let API_BASE = customApiBase !== null ? customApiBase : "";

// If running locally on a dev port (e.g. 5500, 3000, 5173), default to http://localhost:8000
if (!API_BASE && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && window.location.port !== "8000") {
    API_BASE = "http://localhost:8000";
}

function configureApiUrl() {
    const current = localStorage.getItem("RENEWABLE_API_BASE") || API_BASE || "http://localhost:8000";
    const nextUrl = prompt(
        "Enter your FastAPI Backend URL:\n\n" +
        "• If deployed on Vercel: https://your-backend.vercel.app\n" +
        "• If running locally: http://localhost:8000\n",
        current
    );
    if (nextUrl !== null) {
        const cleaned = nextUrl.trim().replace(/\/+$/, "");
        localStorage.setItem("RENEWABLE_API_BASE", cleaned);
        API_BASE = cleaned;
        updateApiBadge(true);
        refreshAllDashboardData();
    }
}

function updateApiBadge(online) {
    const badge = document.getElementById('backend-badge');
    const text = document.getElementById('backend-status-text');
    const pulse = document.getElementById('backend-pulse');
    const docs = document.getElementById('api-docs-link');
    
    if (docs && API_BASE) {
        docs.href = `${API_BASE}/docs`;
        docs.innerText = "API Docs ↗";
    }

    if (online) {
        try {
            const host = API_BASE ? new URL(API_BASE, window.location.href).host : "Online";
            if (text) text.innerText = `FastAPI: ${host}`;
        } catch {
            if (text) text.innerText = "FastAPI: Connected";
        }
        if (badge) {
            badge.className = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer";
        }
        if (pulse) pulse.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2";
    } else {
        if (text) text.innerText = API_BASE ? "FastAPI: Connecting..." : "FastAPI: Configure";
        if (badge) {
            badge.className = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer";
        }
        if (pulse) pulse.className = "w-2 h-2 rounded-full bg-amber-400 mr-2";
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-emerald-400', 'text-emerald-400', 'font-semibold');
        btn.classList.add('border-transparent', 'text-slate-400');
    });

    const activePane = document.getElementById(`tab-${tabId}`);
    if (activePane) activePane.classList.remove('hidden');

    const activeBtn = document.querySelector(`button[data-tab="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('border-emerald-400', 'text-emerald-400', 'font-semibold');
        activeBtn.classList.remove('border-transparent', 'text-slate-400');
    }

    if (tabId === 'analytics') {
        loadCorrelationChart();
        loadTransitionChart();
    } else if (tabId === 'hbase') {
        loadHBaseRows();
    }
}

// Fetch KPI Summaries
async function loadKPIs() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/esg-financials`);
        if (res.ok) {
            updateApiBadge(true);
            const data = await res.json();
            document.getElementById('kpi-gen').innerText = `${data.total_energy_mwh.toLocaleString()} MWh`;
            document.getElementById('kpi-co2').innerText = `${data.co2_avoided_tons.toLocaleString()} Tons`;
            document.getElementById('kpi-trees').innerText = `~${data.equivalent_trees_planted.toLocaleString()} mature trees equiv.`;
            document.getElementById('kpi-revenue').innerText = `$${data.estimated_revenue_usd.toLocaleString()}`;
        } else {
            loadFallbackKPIs();
        }

        const statsRes = await fetch(`${API_BASE}/api/telemetry/stats`);
        if (statsRes.ok) {
            const stats = await statsRes.json();
            document.getElementById('kpi-rows').innerText = stats.row_count.toLocaleString();
            if (stats.is_live_cluster) {
                document.getElementById('hbase-badge').innerText = "HBase: Live Cluster (Stargate)";
                document.getElementById('hbase-badge').classList.replace('text-blue-400', 'text-emerald-400');
            }
        }
    } catch (e) {
        console.warn("API offline, displaying dashboard metrics:", e);
        updateApiBadge(false);
        loadFallbackKPIs();
    }
}

function loadFallbackKPIs() {
    document.getElementById('kpi-gen').innerText = "18,420 MWh";
    document.getElementById('kpi-co2').innerText = "13,262 Tons";
    document.getElementById('kpi-trees').innerText = "~636,589 mature trees equiv.";
    document.getElementById('kpi-revenue').innerText = "$1,657,800";
    document.getElementById('kpi-rows').innerText = "10,800";
}

// 2D PCA Cluster Chart
async function loadPCAChart() {
    try {
        const res = await fetch(`${API_BASE}/api/clustering/pca-points?limit=400`);
        if (res.ok) {
            const data = await res.json();
            renderPCAPoints(data.points);
            return;
        }
    } catch (e) {
        console.warn("Could not load PCA chart from API:", e);
    }
    renderFallbackPCA();
}

function renderPCAPoints(points) {
    const traces = {};
    points.forEach(pt => {
        const label = pt.cluster_label || `Cluster ${pt.cluster_id}`;
        if (!traces[label]) {
            traces[label] = {
                x: [], y: [],
                mode: 'markers',
                type: 'scatter',
                name: label,
                text: [],
                marker: { size: 6 }
            };
        }
        traces[label].x.push(pt.pca_x);
        traces[label].y.push(pt.pca_y);
        traces[label].text.push(`${pt.plant_id}<br>Power: ${pt.active_power_kw} kW`);
    });

    Plotly.newPlot('pca-chart', Object.values(traces), {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 20, r: 20, b: 30, l: 30 },
        xaxis: { gridcolor: '#334155' },
        yaxis: { gridcolor: '#334155' },
        legend: { orientation: 'h', y: -0.2 }
    }, { responsive: true, displayModeBar: false });
}

function renderFallbackPCA() {
    const clusters = [
        { name: "Optimal Peak Output", cx: 2.2, cy: 1.5, n: 60, color: "#10b981" },
        { name: "Moderate Daytime Generation", cx: 0.2, cy: -0.5, n: 70, color: "#38bdf8" },
        { name: "Curtailment / Sub-Optimal", cx: -1.8, cy: 1.8, n: 40, color: "#f59e0b" },
        { name: "Night Inactive / Outage", cx: -2.5, cy: -2.0, n: 50, color: "#94a3b8" }
    ];
    const traces = clusters.map(c => {
        const x = [], y = [];
        for (let i = 0; i < c.n; i++) {
            x.push(c.cx + (Math.random() - 0.5) * 1.6);
            y.push(c.cy + (Math.random() - 0.5) * 1.6);
        }
        return {
            x, y,
            mode: 'markers',
            type: 'scatter',
            name: c.name,
            marker: { size: 6, color: c.color }
        };
    });
    Plotly.newPlot('pca-chart', traces, {
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 20, r: 20, b: 30, l: 30 },
        xaxis: { gridcolor: '#334155' },
        yaxis: { gridcolor: '#334155' },
        legend: { orientation: 'h', y: -0.2 }
    }, { responsive: true, displayModeBar: false });
}

// Radar Chart
async function loadRadarChart() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/radar`);
        if (res.ok) {
            const data = await res.json();
            if (data.categories) {
                renderRadar(data.categories, data.clusters);
                return;
            }
        }
    } catch (e) {
        console.warn("Could not load Radar chart from API:", e);
    }
    renderFallbackRadar();
}

function renderRadar(categories, clusters) {
    const traces = [];
    const cats = [...categories, categories[0]];

    for (const [cid, vals] of Object.entries(clusters)) {
        traces.push({
            type: 'scatterpolar',
            r: [...vals, vals[0]],
            theta: cats,
            fill: 'toself',
            name: `Cluster ${cid}`
        });
    }

    Plotly.newPlot('radar-chart', traces, {
        polar: {
            bgcolor: 'transparent',
            radialaxis: { visible: true, range: [0, 1], gridcolor: '#334155' }
        },
        paper_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 20, r: 20, b: 20, l: 20 },
        legend: { orientation: 'h', y: -0.2 }
    }, { responsive: true, displayModeBar: false });
}

function renderFallbackRadar() {
    const cats = ["Active Power", "Resource Intensity", "Ambient Temp", "Performance Ratio", "Active Power"];
    const traces = [
        { type: 'scatterpolar', r: [0.92, 0.88, 0.45, 0.85, 0.92], theta: cats, fill: 'toself', name: 'Optimal Peak' },
        { type: 'scatterpolar', r: [0.60, 0.55, 0.40, 0.65, 0.60], theta: cats, fill: 'toself', name: 'Moderate' },
        { type: 'scatterpolar', r: [0.25, 0.70, 0.65, 0.30, 0.25], theta: cats, fill: 'toself', name: 'Curtailment' },
        { type: 'scatterpolar', r: [0.05, 0.05, 0.20, 0.10, 0.05], theta: cats, fill: 'toself', name: 'Night Inactive' }
    ];
    Plotly.newPlot('radar-chart', traces, {
        polar: {
            bgcolor: 'transparent',
            radialaxis: { visible: true, range: [0, 1], gridcolor: '#334155' }
        },
        paper_bgcolor: 'transparent',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 20, r: 20, b: 20, l: 20 },
        legend: { orientation: 'h', y: -0.2 }
    }, { responsive: true, displayModeBar: false });
}

// Correlation Heatmap & Detailed Analysis
async function loadCorrelationChart() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/correlation`);
        if (res.ok) {
            const data = await res.json();
            if (data.features) {
                const trace = [{
                    z: data.matrix,
                    x: data.features,
                    y: data.features,
                    type: 'heatmap',
                    colorscale: 'Blues'
                }];
                Plotly.newPlot('corr-chart', trace, {
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#94a3b8', size: 9 },
                    margin: { t: 20, r: 20, b: 50, l: 80 }
                }, { responsive: true, displayModeBar: false });

                // Populate Top Correlated Pairs Table
                if (data.top_correlations && data.top_correlations.length > 0) {
                    const tbody = document.getElementById('corr-pairs-body');
                    if (tbody) {
                        tbody.innerHTML = "";
                        data.top_correlations.forEach(pair => {
                            const row = document.createElement('tr');
                            row.className = "hover:bg-slate-700/30 transition";
                            const badgeColor = pair.correlation >= 0.7 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : (pair.correlation >= 0.4 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-slate-700 text-slate-300');
                            row.innerHTML = `
                                <td class="p-3 font-semibold text-slate-200">${pair.feature_1}</td>
                                <td class="p-3 font-semibold text-slate-200">${pair.feature_2}</td>
                                <td class="p-3 font-mono font-bold ${pair.correlation >= 0 ? 'text-emerald-400' : 'text-amber-400'}">${pair.correlation > 0 ? '+' : ''}${pair.correlation}</td>
                                <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-medium ${badgeColor}">${pair.strength}</span></td>
                            `;
                            tbody.appendChild(row);
                        });
                    }
                }

                // Populate Key Insights
                if (data.key_insights && data.key_insights.length > 0) {
                    const container = document.getElementById('corr-insights-container');
                    if (container) {
                        container.innerHTML = "";
                        data.key_insights.forEach(ins => {
                            const div = document.createElement('div');
                            div.className = "bg-slate-900/60 p-3 rounded-lg border border-slate-700/40 text-xs text-slate-300";
                            div.innerHTML = ins;
                            container.appendChild(div);
                        });
                    }
                }
                return;
            }
        }
    } catch (e) {
        console.warn("Could not load Correlation chart:", e);
    }
}

// Model Accuracy & Clustering Quality Evaluation Metrics
async function loadAccuracyMetrics() {
    try {
        const res = await fetch(`${API_BASE}/api/clustering/accuracy`);
        if (res.ok) {
            const data = await res.json();
            const elAcc = document.getElementById('metric-model-acc');
            const elRating = document.getElementById('metric-model-rating');
            const elAnom = document.getElementById('metric-anom-acc');
            const elPca = document.getElementById('metric-pca-acc');
            const elCohesion = document.getElementById('metric-cohesion-acc');
            const elDetail = document.getElementById('metric-sil-detail');

            if (elAcc) elAcc.innerText = `${data.overall_model_accuracy_pct}%`;
            if (elRating) elRating.innerText = data.evaluation_rating || "EXCELLENT";
            if (elAnom) elAnom.innerText = `${data.anomaly_detection_accuracy_pct}%`;
            if (elPca) elPca.innerText = `${data.pca_variance_accuracy_2d_pct}% (2D) / ${data.pca_variance_accuracy_3d_pct}% (3D)`;
            if (elCohesion) elCohesion.innerText = `${data.clustering_cohesion_quality_pct}%`;
            if (elDetail) elDetail.innerText = `Silhouette: ${data.silhouette_score} • DB: ${data.davies_bouldin_index}`;
        }
    } catch (e) {
        console.warn("Could not load accuracy metrics from API:", e);
    }
}

// Transition Probability Heatmap
async function loadTransitionChart() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/transitions`);
        if (res.ok) {
            const data = await res.json();
            if (data.cluster_ids) {
                const labels = data.cluster_ids.map(c => `Cluster ${c}`);
                const trace = [{
                    z: data.probabilities,
                    x: labels,
                    y: labels,
                    type: 'heatmap',
                    colorscale: 'Viridis'
                }];
                Plotly.newPlot('trans-chart', trace, {
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#94a3b8', size: 10 },
                    margin: { t: 20, r: 20, b: 50, l: 70 }
                }, { responsive: true, displayModeBar: false });
                return;
            }
        }
    } catch (e) {
        console.warn("Could not load Transition chart:", e);
    }
}

// What-If Simulation
async function runSimulation() {
    const plant = document.getElementById('sim-plant').value;
    const ptype = plant.includes('SOLAR') ? 'SOLAR' : (plant.includes('WIND') ? 'WIND' : 'HYDRO');
    const basePower = ptype === 'SOLAR' ? 3200.0 : (ptype === 'WIND' ? 5200.0 : 4500.0);
    const solarDelta = parseFloat(document.getElementById('sim-solar').value);
    const windDelta = parseFloat(document.getElementById('sim-wind').value);
    const soiling = parseFloat(document.getElementById('sim-soiling').value);

    try {
        const res = await fetch(`${API_BASE}/api/simulation/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plant_id: plant,
                plant_type: ptype,
                baseline_power_kw: basePower,
                solar_delta_pct: solarDelta,
                wind_delta_pct: windDelta,
                temp_delta_c: 0.0,
                soiling_pct: soiling
            })
        });

        if (res.ok) {
            const data = await res.json();
            document.getElementById('sim-result-power').innerText = `${data.simulated_power_kw.toLocaleString()} kW`;
            const sign = data.delta_pct >= 0 ? '+' : '';
            document.getElementById('sim-result-delta').innerText = `Delta: ${sign}${data.delta_pct}% (${data.delta_power_kw} kW)`;
            document.getElementById('sim-result-impact').innerText = `${data.operational_impact} • Predicted Shift -> Cluster ${data.predicted_cluster_id}`;
            return;
        }
    } catch (e) {
        console.warn("Simulation API offline, calculating client-side estimation:", e);
    }

    // Client-side fallback calculation
    const factor = (1 + (solarDelta / 100)) * (1 - (soiling / 100));
    const simPower = Math.round(basePower * factor);
    const deltaKw = simPower - basePower;
    const deltaPct = Math.round(((simPower - basePower) / basePower) * 100);
    document.getElementById('sim-result-power').innerText = `${simPower.toLocaleString()} kW`;
    document.getElementById('sim-result-delta').innerText = `Delta: ${deltaPct >= 0 ? '+' : ''}${deltaPct}% (${deltaKw} kW)`;
    document.getElementById('sim-result-impact').innerText = `Client Calculation • Operational Impact Modeled`;
}

// Run Diagnostics & Load Alerts
async function evaluateAlerts() {
    try {
        const res = await fetch(`${API_BASE}/api/alerts/evaluate?threshold=0.65`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('alerts-table-body');
            tbody.innerHTML = "";

            if (data.alerts.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-500">No anomalies detected above threshold. Systems healthy.</td></tr>`;
                return;
            }

            data.alerts.slice(0, 15).forEach(a => {
                const badgeColor = a.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-700/30 transition";
                row.innerHTML = `
                    <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${a.severity}</span></td>
                    <td class="p-3 font-semibold text-slate-200">${a.plant_id}</td>
                    <td class="p-3 text-slate-300">${a.diagnostic_reason}</td>
                    <td class="p-3 text-emerald-400">${a.recommended_action}</td>
                    <td class="p-3 font-mono">${a.anomaly_score}</td>
                `;
                tbody.appendChild(row);
            });
            return;
        }
    } catch (e) {
        console.warn("Diagnostics evaluation fallback:", e);
    }
}

// Load HBase Rows
async function loadHBaseRows() {
    try {
        const res = await fetch(`${API_BASE}/api/telemetry/scan?limit=25`);
        if (res.ok) {
            const data = await res.json();
            const tbody = document.getElementById('hbase-table-body');
            tbody.innerHTML = "";

            data.records.forEach(r => {
                const row = document.createElement('tr');
                row.className = "hover:bg-slate-700/30 transition";
                row.innerHTML = `
                    <td class="p-3 font-mono text-[11px] text-slate-400 truncate max-w-[200px]" title="${r.row_key}">${r.row_key}</td>
                    <td class="p-3 font-semibold">${r.plant_type}</td>
                    <td class="p-3 text-amber-300 font-mono">${r.active_power_kw}</td>
                    <td class="p-3 font-mono">${r.solar_irradiance_wm2 || 0}</td>
                    <td class="p-3 font-mono">${r.wind_speed_ms || 0}</td>
                    <td class="p-3"><span class="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px]">${r.cluster_label || 'Cluster ' + r.cluster_id}</span></td>
                `;
                tbody.appendChild(row);
            });
            return;
        }
    } catch (e) {
        console.warn("Could not load HBase rows from API:", e);
    }
}

// Re-Train Clustering
async function trainClustering() {
    const algo = document.getElementById('algo-select').value;
    try {
        const res = await fetch(`${API_BASE}/api/clustering/train`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ algorithm: algo, n_clusters: 4 })
        });
        if (res.ok) {
            alert("Model re-trained and HBase cf_analytics updated successfully!");
            loadPCAChart();
            loadRadarChart();
            return;
        }
    } catch (e) {
        alert("Training request failed: " + e + "\nEnsure backend API is running.");
    }
}

function refreshAllDashboardData() {
    loadKPIs();
    loadAccuracyMetrics();
    loadPCAChart();
    loadRadarChart();
    loadCorrelationChart();
}

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
    refreshAllDashboardData();
});
