// Alerts tab — warnings, critical events
const AlertsTab = () => {
  const D = window.DATA;
  const [filter, setFilter] = React.useState('all');

  const filtered = D.alerts.filter(a =>
    filter === 'all' ||
    (filter === 'critical' && a.severity === 'critical') ||
    (filter === 'warn' && a.severity === 'warn') ||
    (filter === 'info' && a.severity === 'info')
  );

  const counts = {
    all: D.alerts.length,
    critical: D.alerts.filter(a => a.severity === 'critical').length,
    warn: D.alerts.filter(a => a.severity === 'warn').length,
    info: D.alerts.filter(a => a.severity === 'info').length,
  };

  const iconFor = (sev, cat) => {
    if (sev === 'critical') {
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    }
    if (sev === 'warn') {
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    }
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
  };

  return (
    <div className="vstack" style={{ gap: 20 }}>

      {/* Summary strip */}
      <div className="grid grid-4">
        <AlertSummary label="Total active" value={counts.all} tone="info" />
        <AlertSummary label="Critical" value={counts.critical} tone="danger" />
        <AlertSummary label="Warnings" value={counts.warn} tone="warn" />
        <AlertSummary label="Info" value={counts.info} tone="ok" />
      </div>

      {/* Filter row */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Active alerts</h3>
            <div className="sub">Auto-triggered by SLA and case rules</div>
          </div>
          <div className="subtabs">
            <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>All ({counts.all})</button>
            <button className={filter === 'critical' ? 'is-active' : ''} onClick={() => setFilter('critical')}>Critical ({counts.critical})</button>
            <button className={filter === 'warn' ? 'is-active' : ''} onClick={() => setFilter('warn')}>Warnings ({counts.warn})</button>
            <button className={filter === 'info' ? 'is-active' : ''} onClick={() => setFilter('info')}>Info ({counts.info})</button>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: 12 }}>
          {filtered.map((a, i) => (
            <div key={i} className={`alert ${a.severity}`}>
              <div className="alert-icon">{iconFor(a.severity)}</div>
              <div style={{ flex: 1 }}>
                <div className="alert-title">
                  {a.title}
                  <span className="pill" style={{ marginLeft: 'auto' }}>{a.category}</span>
                </div>
                <div className="alert-body">{a.body}</div>
                <div className="alert-time">{a.time}</div>
                <div className="alert-actions">
                  <button className="primary">Take action</button>
                  <button>Assign</button>
                  <button>Dismiss</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlertSummary = ({ label, value, tone }) => {
  const bg = tone === 'danger' ? 'var(--danger-soft)' : tone === 'warn' ? 'var(--warn-soft)' : tone === 'ok' ? 'var(--ok-soft)' : 'var(--info-soft)';
  const fg = tone === 'danger' ? 'var(--danger)' : tone === 'warn' ? 'var(--warn)' : tone === 'ok' ? 'var(--ok)' : 'var(--info)';
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <div className="num" style={{ fontSize: 30 }}>{value}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, color: fg, display: 'grid', placeItems: 'center', marginLeft: 'auto' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { AlertsTab, AlertSummary });
