// Overview tab — split hero + highlights across the sections
const OverviewTab = ({ filters, setFilters }) => {
  const D = window.DATA;
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(filters.region || null);

  // --- Split hero: KPIs left (9 primary), live pulse right ---
  return (
    <div className="vstack" style={{ gap: 20 }}>

      {/* Row 1 — Split Hero */}
      <div className="grid grid-hero">
        {/* Primary KPIs */}
        <div className="grid grid-3" style={{ gap: 12 }}>
          {D.kpis.primary.map(k => <KpiCard key={k.id} k={k} primary />)}
        </div>

        {/* Live Pulse */}
        <LivePulseCard ops={D.liveOps} queue={D.queue} />
      </div>

      {/* Row 2 — Secondary KPIs (compact grid) */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Detailed metrics</h3>
            <div className="sub">Contact center performance · updated every 30s</div>
          </div>
          <div className="hstack" style={{ gap: 12 }}>
            <div className="subtabs">
              <button className="is-active">All</button>
              <button>Calls</button>
              <button>Cases</button>
              <button>Quality</button>
            </div>
          </div>
        </div>
        <div className="grid grid-6" style={{ gap: 10 }}>
          {D.kpis.secondary.map(k => (
            <div key={k.id} className="kpi" style={{ minHeight: 78, padding: 12 }}>
              <div className="kpi-label" style={{ fontSize: 10 }}>{k.label}</div>
              <div className="kpi-value num" style={{ fontSize: 20 }}>{k.value}</div>
              <div className="kpi-meta">
                <TrendPill delta={k.trend} invert={k.label.includes('Miss') || k.label.includes('Breach') || k.label.includes('Longest')} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — Trend charts */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Calls by hour</h3>
              <div className="sub">Today · 24 hour view</div>
            </div>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-1)' }} />Offered</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-2)' }} />Answered</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--warn)' }} />Missed</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--danger)' }} />Abandoned</span>
            </div>
          </div>
          <AreaChart
            data={D.callsByHour}
            series={[
              { key: 'offered',   label: 'Offered',   color: 'var(--chart-1)' },
              { key: 'answered',  label: 'Answered',  color: 'var(--chart-2)' },
              { key: 'missed',    label: 'Missed',    color: 'var(--warn)', fill: false },
              { key: 'abandoned', label: 'Abandoned', color: 'var(--danger)', fill: false },
            ]}
            height={240}
            xLabel={h => `${String(h).padStart(2, '0')}:00`}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Calls by day</h3>
              <div className="sub">Last 14 days vs previous period</div>
            </div>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-1)' }} />Current</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--fg-4)' }} />Previous</span>
            </div>
          </div>
          <LineChart
            data={D.callsByDay}
            series={[
              { key: 'current',  label: 'Current',  color: 'var(--chart-1)' },
              { key: 'previous', label: 'Previous', color: 'var(--fg-4)', dashed: true },
            ]}
            height={240}
            xLabel={i => `Day ${i + 1}`}
          />
        </div>
      </div>

      {/* Row 4 — Geographic + Categories */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Geographic distribution</h3>
              <div className="sub">Call volume by region · click to filter dashboard</div>
            </div>
            <div className="hstack">
              <span className="pill">Regions</span>
              <span className="pill" style={{ opacity: 0.4 }}>Districts</span>
            </div>
          </div>
          <Choropleth
            regions={D.regions}
            selected={selectedRegion}
            onSelect={(id) => {
              setSelectedRegion(id);
              setFilters(f => ({ ...f, region: id }));
            }}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Case categories</h3>
              <div className="sub">Click a slice to filter</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Donut
              data={D.categories.slice(0, 8)}
              size={180}
              thickness={28}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              centerLabel="Cases"
            />
            <div className="vstack" style={{ flex: 1, gap: 8 }}>
              {D.categories.slice(0, 8).map(c => (
                <div key={c.id}
                     onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                     style={{
                       display: 'flex', alignItems: 'center', gap: 8,
                       padding: '4px 6px', borderRadius: 4, cursor: 'pointer',
                       background: selectedCategory === c.id ? 'var(--bg-inset)' : 'transparent',
                       opacity: selectedCategory && selectedCategory !== c.id ? 0.5 : 1,
                     }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-2)', flex: 1 }}>{c.label}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--fg-1)' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5 — Forecast */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Monthly volume &amp; 4-month forecast</h3>
            <div className="sub">Historical actuals with model-based projection</div>
          </div>
          <div className="legend">
            <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-1)' }} />Actual</span>
            <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--brand-accent)', opacity: 0.5 }} />Forecast</span>
          </div>
        </div>
        <ForecastChart data={D.callsByMonth} />
      </div>
    </div>
  );
};

// ============================================================
// KPI Card
// ============================================================
const KpiCard = ({ k, primary }) => {
  const isGood = k.invert ? k.trend < 0 : k.trend > 0;
  const trendClass = k.trend === 0 ? 'flat' : (isGood ? 'up' : 'down');
  return (
    <div className={`kpi ${primary ? 'is-primary' : ''} ${k.accent ? 'accent-' + k.accent : ''}`}>
      <div className="kpi-label">{k.label}</div>
      <div className="kpi-value num">
        {k.value}{k.unit && <span className="unit">{k.unit}</span>}
      </div>
      <div className="kpi-meta">
        <TrendPill delta={k.trend} invert={k.invert} />
        <span style={{ color: 'var(--fg-3)' }}>vs last period</span>
      </div>
      {k.spark && (
        <div className="kpi-spark">
          <Sparkline data={k.spark} width={72} height={24}
                     color={isGood ? 'var(--ok)' : (k.trend === 0 ? 'var(--fg-4)' : 'var(--danger)')}
                     fill />
        </div>
      )}
    </div>
  );
};

const TrendPill = ({ delta, invert }) => {
  if (delta === 0 || delta == null) {
    return <span className="kpi-trend flat">— 0%</span>;
  }
  const isGood = invert ? delta < 0 : delta > 0;
  const cls = isGood ? 'up' : 'down';
  const abs = typeof delta === 'number' ? Math.abs(delta) : delta;
  const sign = delta > 0 ? '+' : '−';
  const arrow = delta > 0
    ? <svg viewBox="0 0 10 10"><path d="M1 7 L5 3 L9 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    : <svg viewBox="0 0 10 10"><path d="M1 3 L5 7 L9 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  return (
    <span className={`kpi-trend ${cls}`}>
      {arrow}
      {sign}{typeof abs === 'number' ? abs.toFixed(abs < 10 ? 1 : 0).replace(/\.0$/, '') : abs}{typeof delta === 'number' && Math.abs(delta) < 100 && !String(delta).includes('%') ? '' : ''}
    </span>
  );
};

// ============================================================
// Live Pulse Card (right side of hero)
// ============================================================
const LivePulseCard = ({ ops, queue }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div className="card-head" style={{ marginBottom: 0 }}>
      <div>
        <h3>Live contact center</h3>
        <div className="sub">Real-time status · auto-refresh</div>
      </div>
      <span className="live-dot">Live</span>
    </div>

    {/* Big status callouts */}
    <div className="grid grid-2" style={{ gap: 10 }}>
      <div style={{ padding: 14, background: 'var(--brand-soft)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: 'var(--brand)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active now</div>
        <div className="num" style={{ fontSize: 28, color: 'var(--brand)', marginTop: 4 }}>{ops[0].value}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>calls in progress</div>
      </div>
      <div style={{ padding: 14, background: 'var(--warn-soft)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, color: 'var(--warn)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>In queue</div>
        <div className="num" style={{ fontSize: 28, color: 'var(--warn)', marginTop: 4 }}>{queue.current}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>oldest: {queue.longestWait}</div>
      </div>
    </div>

    {/* Compact operator status */}
    <div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
        Operator status
      </div>
      <div className="vstack" style={{ gap: 8 }}>
        <OpStatusRow label="Available" value={12} pct={22} color="var(--ok)" total={54} />
        <OpStatusRow label="Busy on call" value={28} pct={52} color="var(--brand-accent)" total={54} />
        <OpStatusRow label="After-call work" value={5} pct={9} color="var(--chart-4)" total={54} />
        <OpStatusRow label="Break" value={6} pct={11} color="var(--fg-4)" total={54} />
        <OpStatusRow label="Training" value={3} pct={6} color="var(--chart-6)" total={54} />
      </div>
    </div>

    {/* Queue preview */}
    <div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span>SLA at risk</span>
        <span style={{ color: 'var(--danger)' }}>{queue.slaRisk} calls</span>
      </div>
      <div className="vstack" style={{ gap: 4 }}>
        {queue.items.slice(0, 3).map(item => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            background: 'var(--bg-subtle)', borderRadius: 6, fontSize: 11,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: item.priority === 'critical' ? 'var(--danger)' : item.priority === 'high' ? 'var(--warn)' : 'var(--fg-4)',
            }} />
            <span className="mono" style={{ color: 'var(--fg-2)' }}>{item.id}</span>
            <span style={{ flex: 1, color: 'var(--fg-1)' }}>{item.category}</span>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>{item.region}</span>
            <span className="mono" style={{ color: item.priority === 'critical' ? 'var(--danger)' : 'var(--fg-2)', fontWeight: 600 }}>{item.wait}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OpStatusRow = ({ label, value, pct, color, total }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 40px', gap: 10, alignItems: 'center', fontSize: 12 }}>
    <span style={{ color: 'var(--fg-2)' }}>{label}</span>
    <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
    </div>
    <span className="num" style={{ fontSize: 12, textAlign: 'right', color: 'var(--fg-1)' }}>{value}</span>
  </div>
);

// ============================================================
// Forecast chart (line with forecast section styled differently)
// ============================================================
const ForecastChart = ({ data }) => {
  const svgRef = React.useRef(null);
  const [dim, setDim] = React.useState({ w: 800 });
  const [hover, setHover] = React.useState(null);

  React.useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width }));
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const height = 220;
  const w = dim.w;
  const pad = { t: 12, r: 12, b: 28, l: 44 };
  const iw = w - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const all = [...data.map(d => d.value), ...data.filter(d => d.forecast).map(d => d.forecast)];
  const max = Math.ceil(Math.max(...all) / 10000) * 10000;
  const min = Math.floor(Math.min(...all) / 10000) * 10000;
  const step = iw / (data.length - 1);
  const y = v => pad.t + ih - ((v - min) / (max - min)) * ih;
  const x = i => pad.l + i * step;
  const grid = [min, min + (max - min) / 2, max];

  const actualPts = data.map((d, i) => [x(i), y(d.value)]);
  const actualPath = actualPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const actualArea = `${actualPath} L${x(data.length - 1)},${y(min)} L${x(0)},${y(min)} Z`;

  const forecastData = data.map((d, i) => d.forecast ? { i, v: d.forecast } : null).filter(Boolean);
  const forecastPath = forecastData.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.i)},${y(p.v)}`).join(' ');

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width="100%" height={height} style={{ display: 'block' }}>
        {grid.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke="var(--border-1)" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 8} y={y(v) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">{fmt(v)}</text>
          </g>
        ))}
        <path d={actualArea} fill="var(--chart-1)" fillOpacity="0.1" />
        <path d={actualPath} fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {forecastData.length > 0 && (
          <path d={forecastPath} fill="none" stroke="var(--brand-accent)" strokeWidth="2" strokeDasharray="5,4" strokeLinecap="round" />
        )}
        {data.map((d, i) => (
          <text key={i} x={x(i)} y={height - 8} fontSize="10" fill="var(--fg-3)" textAnchor="middle">{d.m}</text>
        ))}
        {data.map((d, i) => (
          <circle key={'a'+i} cx={x(i)} cy={y(d.value)} r="3" fill="white" stroke="var(--chart-1)" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
};

Object.assign(window, { OverviewTab, KpiCard, TrendPill, LivePulseCard, ForecastChart });
