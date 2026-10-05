// Quality tab — operator table, team leader cards, QA trend
const QualityTab = ({ filters, setFilters }) => {
  const D = window.DATA;
  const [sortBy, setSortBy] = React.useState('prod');
  const [sortDir, setSortDir] = React.useState('desc');

  const sorted = React.useMemo(() => {
    return [...D.operators].sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      const asNum = (v) => typeof v === 'string' && v.includes(':')
        ? v.split(':').reduce((s, p, i, arr) => s + Number(p) * Math.pow(60, arr.length - i - 1), 0)
        : Number(v);
      const na = asNum(av), nb = asNum(bv);
      return sortDir === 'desc' ? nb - na : na - nb;
    });
  }, [sortBy, sortDir]);

  const toggleSort = (k) => {
    if (sortBy === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(k); setSortDir('desc'); }
  };

  return (
    <div className="vstack" style={{ gap: 20 }}>

      {/* Team leader dashboard cards */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Team leader dashboard</h3>
            <div className="sub">Team-level highlights across all shifts</div>
          </div>
        </div>
        <div className="grid grid-3" style={{ gap: 12 }}>
          {D.teamCards.map((c, i) => (
            <div key={i} style={{
              padding: 16,
              background: 'var(--bg-subtle)',
              borderRadius: 8,
              borderLeft: `2px solid var(--${c.tone === 'ok' ? 'ok' : c.tone === 'warn' ? 'warn' : c.tone === 'danger' ? 'danger' : 'brand-accent'})`,
            }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {c.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg-1)', margin: '6px 0 2px' }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Operator performance table */}
      <div className="card card--flush">
        <div className="card-head" style={{ padding: '20px 20px 12px', marginBottom: 0 }}>
          <div>
            <h3>Operator performance</h3>
            <div className="sub">Ranked by productivity score · click a column to sort</div>
          </div>
          <div className="hstack" style={{ gap: 8 }}>
            <span className="pill">{D.operators.length} operators</span>
            <button className="filter-chip">Export CSV</button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>#</th>
                <th>Operator</th>
                <SortTH k="ans" label="Ans" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="miss" label="Miss" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="aht" label="AHT" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="awt" label="AWT" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="occ" label="Occ" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="csat" label="CSAT" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="qa" label="QA" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="res" label="Res %" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="fcr" label="FCR" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="esc" label="Esc" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="trans" label="Trs" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="closed" label="Closed" curr={sortBy} dir={sortDir} on={toggleSort} />
                <SortTH k="prod" label="Productivity" curr={sortBy} dir={sortDir} on={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((op, i) => {
                const initials = op.name.split(' ').map(n => n[0]).join('');
                return (
                  <tr key={op.name}>
                    <td style={{ paddingLeft: 20 }}>
                      <span className={`rank ${i < 3 ? 'top' : ''}`}>{i + 1}</span>
                    </td>
                    <td>
                      <div className="operator-cell">
                        <div className="avatar-sm">{initials}</div>
                        <div>
                          <div>{op.name}</div>
                          <div className="op-meta">Team {op.team}</div>
                        </div>
                      </div>
                    </td>
                    <td className="num-cell">{op.ans}</td>
                    <td className="num-cell" style={{ color: op.miss > 20 ? 'var(--danger)' : op.miss > 15 ? 'var(--warn)' : 'var(--fg-1)' }}>{op.miss}</td>
                    <td className="num-cell mono">{op.aht}</td>
                    <td className="num-cell mono">{op.awt}</td>
                    <td className="num-cell">{op.occ}%</td>
                    <td className="num-cell">{op.csat}</td>
                    <td>
                      <div className="score-bar">
                        <div className="track"><div className={`fill ${op.qa >= 90 ? 'ok' : op.qa >= 85 ? 'warn' : 'danger'}`} style={{ width: `${op.qa}%` }} /></div>
                        <span className="val">{op.qa}</span>
                      </div>
                    </td>
                    <td className="num-cell">{op.res}%</td>
                    <td className="num-cell">{op.fcr}%</td>
                    <td className="num-cell">{op.esc}</td>
                    <td className="num-cell">{op.trans}</td>
                    <td className="num-cell">{op.closed}</td>
                    <td>
                      <div className="score-bar">
                        <div className="track"><div className={`fill ${op.prod >= 88 ? 'ok' : op.prod >= 80 ? '' : op.prod >= 75 ? 'warn' : 'danger'}`} style={{ width: `${op.prod}%` }} /></div>
                        <span className="val">{op.prod}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QA charts */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Quality assurance trend</h3>
              <div className="sub">12-month rolling averages</div>
            </div>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-1)' }} />QA score</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-2)' }} />Script</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--ok)' }} />Mandatory fields</span>
            </div>
          </div>
          <LineChart
            data={D.qaTrend}
            series={[
              { key: 'qa',     label: 'QA score', color: 'var(--chart-1)' },
              { key: 'script', label: 'Script adherence', color: 'var(--chart-2)' },
              { key: 'mand',   label: 'Mandatory fields', color: 'var(--ok)' },
            ]}
            height={220}
            xLabel={i => D.qaTrend[i]?.m}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>QA breakdown</h3>
              <div className="sub">Latest audit period</div>
            </div>
            <span className="pill ok">92 / 100</span>
          </div>
          <div className="vstack" style={{ gap: 16 }}>
            {[
              { label: 'Call opening & identification', score: 96 },
              { label: 'Active listening',              score: 91 },
              { label: 'Empathy & tone',                score: 94 },
              { label: 'Assessment protocol',           score: 88 },
              { label: 'Safeguarding checks',           score: 97 },
              { label: 'Referral accuracy',             score: 89 },
              { label: 'Documentation completeness',    score: 86 },
              { label: 'Call closure & follow-up',      score: 92 },
            ].map(r => (
              <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 12, alignItems: 'center', fontSize: 12 }}>
                <span style={{ color: 'var(--fg-2)' }}>{r.label}</span>
                <div className="score-bar">
                  <div className="track"><div className={`fill ${r.score >= 92 ? 'ok' : r.score >= 85 ? '' : 'warn'}`} style={{ width: `${r.score}%` }} /></div>
                  <span className="val">{r.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance stats */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Compliance &amp; monitoring</h3>
            <div className="sub">This month · rolling audits</div>
          </div>
        </div>
        <div className="grid grid-4" style={{ gap: 12 }}>
          <CompStat label="QA audits completed" value={412} unit="/ 450" pct={91} />
          <CompStat label="Script adherence" value={94} unit="%" pct={94} />
          <CompStat label="Mandatory fields" value={97} unit="%" pct={97} />
          <CompStat label="Documentation" value={88} unit="%" pct={88} />
        </div>
      </div>
    </div>
  );
};

const SortTH = ({ k, label, curr, dir, on }) => (
  <th onClick={() => on(k)} style={{ textAlign: 'right' }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
      {label}
      {curr === k && (
        <svg width="8" height="8" viewBox="0 0 10 10">
          <path d={dir === 'desc' ? 'M1 3 L5 7 L9 3' : 'M1 7 L5 3 L9 7'} stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  </th>
);

const CompStat = ({ label, value, unit, pct }) => (
  <div style={{ padding: 14, background: 'var(--bg-subtle)', borderRadius: 8 }}>
    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '6px 0 10px' }}>
      <span className="num" style={{ fontSize: 22 }}>{value}</span>
      <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{unit}</span>
    </div>
    <div style={{ height: 4, background: 'var(--bg-inset)', borderRadius: 999 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: pct >= 92 ? 'var(--ok)' : pct >= 85 ? 'var(--brand-accent)' : 'var(--warn)', borderRadius: 999 }} />
    </div>
  </div>
);

Object.assign(window, { QualityTab, SortTH, CompStat });
