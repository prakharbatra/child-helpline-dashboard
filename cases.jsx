// Cases tab — categories, severity, sankey, funnel, demographics, referrals
const CasesTab = ({ filters, setFilters }) => {
  const D = window.DATA;
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  return (
    <div className="vstack" style={{ gap: 20 }}>

      {/* Row 1 — Case category donut + Severity stack */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Call categories</h3>
              <div className="sub">Click a slice to filter the dashboard</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Donut
              data={D.categories}
              size={220}
              thickness={34}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              centerLabel="Total cases"
            />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {D.categories.map(c => (
                <div key={c.id}
                     onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                     style={{
                       display: 'flex', alignItems: 'center', gap: 6,
                       padding: '4px 6px', borderRadius: 4, cursor: 'pointer',
                       background: selectedCategory === c.id ? 'var(--bg-inset)' : 'transparent',
                       opacity: selectedCategory && selectedCategory !== c.id ? 0.4 : 1,
                     }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-2)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--fg-1)' }}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Case severity</h3>
              <div className="sub">Distribution across the last 8 months</div>
            </div>
            <div className="legend">
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-3)' }} />Low</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--chart-2)' }} />Medium</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--warn)' }} />High</span>
              <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--danger)' }} />Critical</span>
            </div>
          </div>
          <StackedBar
            data={D.severity}
            series={[
              { key: 'low',      label: 'Low',      color: 'var(--chart-3)' },
              { key: 'medium',   label: 'Medium',   color: 'var(--chart-2)' },
              { key: 'high',     label: 'High',     color: 'var(--warn)' },
              { key: 'critical', label: 'Critical', color: 'var(--danger)' },
            ]}
            height={240}
          />
        </div>
      </div>

      {/* Row 2 — Sankey flow */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Referral outcomes flow</h3>
            <div className="sub">From caller through operator, case, referral to closure</div>
          </div>
        </div>
        <SankeyFlow nodes={D.sankey.nodes} height={220} />
      </div>

      {/* Row 3 — Funnel + Follow-ups */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Case management funnel</h3>
              <div className="sub">Case lifecycle · this month</div>
            </div>
            <span className="pill info">Conversion 41%</span>
          </div>
          <div className="funnel">
            {D.funnel.map((f, i) => {
              const max = D.funnel[0].value;
              const w = (f.value / max) * 100;
              const drop = i > 0 ? Math.round((1 - f.value / D.funnel[i - 1].value) * 100) : 0;
              return (
                <div key={f.label} className="funnel-row">
                  <div className="funnel-label">{f.label}</div>
                  <div className="funnel-bar">
                    <div className="funnel-bar-fill" style={{ width: `${w}%`, background: f.color }}>
                      {f.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="funnel-drop">
                    {i > 0 ? `−${drop}%` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Follow-up tracker</h3>
              <div className="sub">Active follow-up commitments</div>
            </div>
          </div>
          <div className="grid grid-2" style={{ gap: 10 }}>
            <FUCard label="Due today"  value={D.followups.dueToday}  tone="info" />
            <FUCard label="Overdue"    value={D.followups.overdue}   tone="danger" />
            <FUCard label="Completed"  value={D.followups.completed} tone="ok" />
            <FUCard label="Pending"    value={D.followups.pending}   tone="warn" />
          </div>

          {/* Referral outcome sub-stats */}
          <div className="divider" />
          <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            This week's follow-up completion
          </div>
          <div className="vstack" style={{ gap: 8 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => {
              const pct = [92, 88, 94, 76, 82, 68, 71][i];
              return (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 34px', gap: 10, alignItems: 'center', fontSize: 11 }}>
                  <span style={{ color: 'var(--fg-3)' }}>{d}</span>
                  <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? 'var(--ok)' : pct > 75 ? 'var(--warn)' : 'var(--danger)', borderRadius: 999 }} />
                  </div>
                  <span className="num" style={{ fontSize: 11, textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4 — Child demographics */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Child demographics</h3>
            <div className="sub">Reported across all active cases</div>
          </div>
        </div>
        <div className="grid grid-4">
          <DemoCard title="Age group">
            <div className="vstack" style={{ gap: 10 }}>
              {D.demographics.age.map(a => (
                <div key={a.label} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 46px', gap: 10, alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: 'var(--fg-2)' }}>{a.label}</span>
                  <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999 }}>
                    <div style={{ width: `${a.pct * 2.5}%`, height: '100%', background: 'var(--chart-2)', borderRadius: 999 }} />
                  </div>
                  <span className="num" style={{ fontSize: 12, textAlign: 'right' }}>{a.value}</span>
                </div>
              ))}
            </div>
          </DemoCard>

          <DemoCard title="Gender">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Donut data={D.demographics.gender.map((g, i) => ({ id: g.label, label: g.label, value: g.value, color: g.color }))}
                     size={120} thickness={20} centerLabel="Cases" />
              <div className="vstack" style={{ flex: 1, gap: 6, fontSize: 11 }}>
                {D.demographics.gender.map(g => (
                  <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: g.color }} />
                    <span style={{ flex: 1, color: 'var(--fg-2)' }}>{g.label}</span>
                    <span className="num" style={{ color: 'var(--fg-1)' }}>{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </DemoCard>

          <DemoCard title="Disability status">
            <div className="vstack" style={{ gap: 10 }}>
              {D.demographics.disability.map(d => (
                <div key={d.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--fg-2)' }}>{d.label}</span>
                    <span className="num" style={{ color: 'var(--fg-1)' }}>{d.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999 }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: 'var(--chart-1)', borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </DemoCard>

          <DemoCard title="Location">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: 8 }}>
              <div style={{ display: 'flex', width: '100%', height: 40, borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${D.demographics.location[0].pct}%`, background: 'var(--chart-1)', display: 'grid', placeItems: 'center', color: 'white', fontSize: 11, fontWeight: 600 }}>
                  Urban {D.demographics.location[0].pct}%
                </div>
                <div style={{ width: `${D.demographics.location[1].pct}%`, background: 'var(--chart-3)', display: 'grid', placeItems: 'center', color: 'white', fontSize: 11, fontWeight: 600 }}>
                  Rural {D.demographics.location[1].pct}%
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--fg-3)', textAlign: 'center' }}>
              {D.demographics.location.reduce((s, l) => s + l.value, 0)} reported cases
            </div>
          </DemoCard>
        </div>
      </div>

      {/* Row 5 — Referrals */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Referrals by agency</h3>
              <div className="sub">Volume and success rate per partner</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px', gap: 10, marginBottom: 10, fontSize: 10, color: 'var(--fg-3)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span>Agency</span>
            <span style={{ textAlign: 'right' }}>Volume</span>
            <span style={{ textAlign: 'right' }}>Success</span>
          </div>
          <div className="vstack" style={{ gap: 10 }}>
            {D.referralAgencies.map(a => (
              <div key={a.label} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px', gap: 10, alignItems: 'center', fontSize: 12 }}>
                <div>
                  <div style={{ marginBottom: 4, color: 'var(--fg-1)' }}>{a.label}</div>
                  <div style={{ height: 4, background: 'var(--bg-inset)', borderRadius: 999 }}>
                    <div style={{ width: `${(a.value / D.referralAgencies[0].value) * 100}%`, height: '100%', background: 'var(--chart-2)', borderRadius: 999 }} />
                  </div>
                </div>
                <span className="num" style={{ textAlign: 'right' }}>{a.value}</span>
                <div className="score-bar">
                  <div className="track"><div className={`fill ${a.success > 85 ? 'ok' : a.success > 75 ? 'warn' : 'danger'}`} style={{ width: `${a.success}%` }} /></div>
                  <span className="val">{a.success}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Overall referral success</h3>
              <div className="sub">Accepted vs made · rolling 30 days</div>
            </div>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', paddingTop: 8 }}>
            <Gauge value={82} label="Referrals accepted" size={180} color="var(--chart-2)" />
          </div>
          <div className="divider" />
          <div className="vstack" style={{ gap: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Made</span><span className="num">1,248</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Accepted</span><span className="num" style={{ color: 'var(--ok)' }}>1,024</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Pending</span><span className="num" style={{ color: 'var(--warn)' }}>142</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="muted">Declined</span><span className="num" style={{ color: 'var(--danger)' }}>82</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FUCard = ({ label, value, tone }) => {
  const bg = tone === 'danger' ? 'var(--danger-soft)' : tone === 'warn' ? 'var(--warn-soft)' : tone === 'ok' ? 'var(--ok-soft)' : 'var(--info-soft)';
  const fg = tone === 'danger' ? 'var(--danger)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--info)';
  return (
    <div style={{ padding: 14, background: bg, borderRadius: 8 }}>
      <div style={{ fontSize: 10, color: fg, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div className="num" style={{ fontSize: 26, color: fg, marginTop: 4 }}>{value}</div>
    </div>
  );
};

const DemoCard = ({ title, children }) => (
  <div style={{ padding: 16, background: 'var(--bg-subtle)', borderRadius: 8 }}>
    <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
      {title}
    </div>
    {children}
  </div>
);

Object.assign(window, { CasesTab, FUCard, DemoCard });
