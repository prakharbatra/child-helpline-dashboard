// Live Ops tab — real-time status, queue, map, hourly
const LiveOpsTab = ({ filters, setFilters }) => {
  const D = window.DATA;
  const [tick, setTick] = React.useState(0);
  const [selectedRegion, setSelectedRegion] = React.useState(filters.region || null);

  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="vstack" style={{ gap: 20 }}>

      {/* Live status tiles */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Live contact center status</h3>
            <div className="sub">Real-time · updated {tick > 0 ? `${(tick * 4)}s ago` : 'just now'}</div>
          </div>
          <div className="hstack" style={{ gap: 12 }}>
            <span className="live-dot">Live</span>
          </div>
        </div>
        <div className="grid grid-6" style={{ gap: 10 }}>
          {D.liveOps.map((tile, i) => (
            <div key={i} className="live-tile">
              <div className="vstack" style={{ gap: 4 }}>
                <div className="live-tile-label">{tile.label}</div>
                <div className="live-tile-value">{tile.value}</div>
              </div>
              <div className={`live-tile-status ${tile.status}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Map + Queue */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Calls by region</h3>
              <div className="sub">Click a region to filter · showing today's totals</div>
            </div>
            <div className="subtabs">
              <button className="is-active">Province</button>
              <button>District</button>
              <button>Municipality</button>
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
              <h3>Real-time queue</h3>
              <div className="sub">{D.queue.current} waiting · expected {D.queue.expectedWait}</div>
            </div>
          </div>

          {/* Queue summary */}
          <div className="grid grid-2" style={{ gap: 8, marginBottom: 16 }}>
            <QueueStat label="Current" value={D.queue.current} tone="warn" />
            <QueueStat label="Longest wait" value={D.queue.longestWait} tone="danger" />
            <QueueStat label="SLA risk" value={D.queue.slaRisk} tone="danger" />
            <QueueStat label="Expected" value={D.queue.expectedWait} tone="info" />
          </div>

          {/* Queue list */}
          <div className="vstack" style={{ gap: 4 }}>
            {D.queue.items.map(item => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '8px 68px 1fr 78px 46px',
                gap: 10, alignItems: 'center',
                padding: '9px 10px',
                background: 'var(--bg-subtle)', borderRadius: 6, fontSize: 11,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: item.priority === 'critical' ? 'var(--danger)' : item.priority === 'high' ? 'var(--warn)' : 'var(--fg-4)',
                }} />
                <span className="mono" style={{ color: 'var(--fg-2)' }}>{item.id}</span>
                <span style={{ color: 'var(--fg-1)' }}>{item.category}</span>
                <span className="mono" style={{ color: 'var(--fg-3)' }}>{item.region}</span>
                <span className="mono" style={{ color: item.priority === 'critical' ? 'var(--danger)' : 'var(--fg-1)', fontWeight: 600, textAlign: 'right' }}>{item.wait}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly + Daily trend */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Calls by hour</h3>
              <div className="sub">Today · offered vs answered</div>
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
              { key: 'offered', label: 'Offered', color: 'var(--chart-1)' },
              { key: 'answered', label: 'Answered', color: 'var(--chart-2)' },
              { key: 'missed', label: 'Missed', color: 'var(--warn)', fill: false },
              { key: 'abandoned', label: 'Abandoned', color: 'var(--danger)', fill: false },
            ]}
            height={240}
            xLabel={h => `${String(h).padStart(2, '0')}:00`}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Daily trend</h3>
              <div className="sub">Current vs previous 14 days</div>
            </div>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-1)' }} />This period</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--fg-4)' }} />Previous</span>
            </div>
          </div>
          <LineChart
            data={D.callsByDay}
            series={[
              { key: 'current', label: 'Current', color: 'var(--chart-1)' },
              { key: 'previous', label: 'Previous', color: 'var(--fg-4)', dashed: true },
            ]}
            height={240}
          />
        </div>
      </div>
    </div>
  );
};

const QueueStat = ({ label, value, tone }) => {
  const bg = tone === 'danger' ? 'var(--danger-soft)' : tone === 'warn' ? 'var(--warn-soft)' : tone === 'ok' ? 'var(--ok-soft)' : 'var(--info-soft)';
  const fg = tone === 'danger' ? 'var(--danger)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--info)';
  return (
    <div style={{ padding: 12, background: bg, borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: fg, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div className="num" style={{ fontSize: 20, color: fg, marginTop: 4 }}>{value}</div>
    </div>
  );
};

Object.assign(window, { LiveOpsTab, QueueStat });
