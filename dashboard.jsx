// Main dashboard app — shell, sidebar, topbar, filters, tab routing
const { useState, useEffect } = React;

const TABS = [
  { id: 'overview',  label: 'Overview',   icon: 'grid' },
  { id: 'liveops',   label: 'Live Ops',   icon: 'pulse' },
  { id: 'cases',     label: 'Cases',      icon: 'folder' },
  { id: 'quality',   label: 'Quality',    icon: 'shield' },
  { id: 'alerts',    label: 'Alerts',     icon: 'bell', badge: 3 },
];

const FILTERS = [
  { key: 'date',     label: 'Date',       value: 'Today',       options: ['Today','Yesterday','Last 7 days','Last 30 days','Month','Quarter','Year'] },
  { key: 'region',   label: 'Region',     value: 'All regions', options: ['All regions','Karakalpakstan','Andijan','Bukhara','Jizzakh','Kashkadarya','Khorezm','Navoiy','Namangan','Samarkand','Sirdarya','Surkhandarya','Tashkent','Tashkent city','Fergana'] },
  { key: 'district', label: 'District',   value: 'All',         options: [
    'All',

    // Karakalpakstan
    'Amudarya',
    'Beruniy',
    'Bozatau',
    'Karauzak',
    'Kegeyli',
    'Kungrad',
    'Kanlykul',
    'Muynak',
    'Nukus',
    'Takhiatash',
    'Takhtakupyr',
    'Turtkul',
    'Khojeyli',
    'Chimbay',
    'Shumanai',
    'Ellikkala',

    // Andijan
    'Altynkul',
    'Andijan',
    'Balykchi',
    'Bustan',
    'Bulakbashi',
    'Jalaquduk',
    'Izbaskan',
    'Ulugnor',
    'Kurgantepa',
    'Asaka',
    'Markhamat',
    'Shakhrikhan',
    'Pakhtaabad',
    'Khojaabad',

    // Bukhara
    'Alat',
    'Bukhara',
    'Vobkent',
    'Gijduvan',
    'Kagan',
    'Karakul',
    'Qorovulbozor',
    'Peshkun',
    'Romitan',
    'Jondor',
    'Shafirkan',

    // Jizzakh
    'Arnasay',
    'Bakhmal',
    'Gallaaral',
    'Sharof Rashidov',
    'Dustlik',
    'Zomin',
    'Zarbdar',
    'Mirzachul',
    'Zafarabad',
    'Pakhtakor',
    'Farish',
    'Yangiabad',

    // Kashkadarya
    'Kukdala',
    'Gissar',
    'Dehkanabad',
    'Kamashi',
    'Karshi',
    'Kasan',
    'Kitab',
    'Mirishkor',
    'Mubarek',
    'Nishon',
    'Kasbi',
    'Chirakchi',
    'Shakhrisabz',
    'Yakkabag',

    // Navoiy
    'Kanimekh',
    'Kyzyltepa',
    'Navbahor',
    'Karmana',
    'Nurota',
    'Tomdy',
    'Uchkuduk',
    'Khatyrchi',

    // Namangan
    'Mingbulak',
    'Kasansay',
    'Namangan',
    'Naryn',
    'Pop',
    'Turakurgan',
    'Uychi',
    'Uchkurgan',
    'Chartak',
    'Chust',
    'Yangikurgan',

    // Samarkand
    'Akdarya',
    'Bulungur',
    'Jomboy',
    'Ishtykhan',
    'Kattakurgan',
    'Koshrabad',
    'Narpai',
    'Payaryk',
    'Pastdargom',
    'Pakhtachi',
    'Samarkand',
    'Nurabad',
    'Urgut',
    'Tailak',

    // Surkhandarya
    'Altynsay',
    'Angor',
    'Bandykhan',
    'Baysun',
    'Muzrabad',
    'Denau',
    'Jarkurgan',
    'Kumkurgan',
    'Kizirik',
    'Sariosia',
    'Termiz',
    'Uzun',
    'Sherabad',
    'Shurchi',

    // Syrdarya
    'Akaltyn',
    'Bayaut',
    'Saykhunabad',
    'Gulistan',
    'Sardoba',
    'Mirzaabad',
    'Syrdarya',
    'Khovos',

    // Tashkent Region
    'Akkurgan',
    'Akhangaran',
    'Bekabad',
    'Bostanlyk',
    'Buka',
    'Kuyichirchik',
    'Zangiata',
    'Yukorichirchik',
    'Kibray',
    'Parkent',
    'Piskent',
    'Urtachirchik',
    'Chinaz',
    'Yangiyul',
    'Tashkent',

    // Fergana
    'Altyaryk',
    'Kushtepa',
    'Baghdad',
    'Buvayda',
    'Besharik',
    'Kuva',
    'Uchkuprik',
    'Rishtan',
    'Sokh',
    'Tashlak',
    'Uzbekistan',
    'Fergana',
    'Dangara',
    'Furkat',
    'Yazyavan',

    // Khorezm
    'Bagat',
    'Gurlan',
    'Kushkupyr',
    'Urgench',
    'Khazarasp',
    'Tuprakkala',
    'Khanka',
    'Khiva',
    'Shavat',
    'Yangiaryk',
    'Yangibazar',

    // Tashkent City
    'Uchtepa',
    'Bektemir',
    'Yunusabad',
    'Mirzo Ulugbek',
    'Mirabad',
    'Shaykhantakhur',
    'Almazar',
    'Sergeli',
    'Yakkasaray',
    'Yashnabad',
    'Yangikhayot',
    'Chilanzar'
  ] },
  { key: 'lang',     label: 'Language',   value: 'All',         options: ['All','Uzbek','Russian','English','Local B'] },
  { key: 'gender',   label: 'Gender',     value: 'All',         options: ['All','Female','Male','Other','Unknown'] },
  { key: 'age',      label: 'Age group',  value: 'All',         options: ['All','0–5','6–10','11–14','15–18'] },
  { key: 'agency',   label: 'Ref. agency',value: 'All',         options: ['All','Police','Hospital','Social Worker','NGO','Legal Aid'] },
  { key: 'type',     label: 'Call type',  value: 'All',         options: ['All','Report','Enquiry','Follow-up','Callback'] },
  { key: 'hotline',  label: 'Hotline',    value: 'All',         options: ['All','116','1098','198'] },
  { key: 'op',       label: 'Operator',   value: 'All',         options: ['All','Team Alpha','Team Bravo','Team Charlie'] },
  { key: 'shift',    label: 'Shift',      value: 'All',         options: ['All','Morning','Afternoon','Evening','Night'] },
  { key: 'status',   label: 'Case status',value: 'All',         options: ['All','New','Active','Referred','Follow-up','Closed'] },
  { key: 'cat',      label: 'Category',   value: 'All',         options: ['All','Physical','Sexual','Emotional','Neglect','Mental Health','Other'] },
  { key: 'risk',     label: 'Risk',       value: 'All',         options: ['All','Low','Medium','High','Critical'] },
];

// simple icon set
const Icon = ({ name }) => {
  const paths = {
    grid:   <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
    pulse:  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    bell:   <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>,
    down:   <path d="M6 9l6 6 6-6"/>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
    export: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  };
  return (
    <svg className="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

// ============================================================
// Filter chip with dropdown
// ============================================================
const FilterChip = ({ f, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const active = value && value !== f.options[0];
  const ref = React.useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div
  ref={ref}
  style={{
    position: 'relative',
    minWidth: 0
  }}
>
      <button className={`filter-chip ${active ? 'is-active' : ''}`} onClick={() => setOpen(o => !o)}>
        <span className="label">{f.label}:</span>
        <span className="value">{value || f.options[0]}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 1000,
          background: 'var(--bg-canvas)', border: '1px solid var(--border-1)',
          borderRadius: 6, boxShadow: 'var(--shadow-3)', minWidth: 160,
          padding: 4,
        }}>
          {f.options.map(o => (
            <button key={o}
                    onClick={() => { onChange(o); setOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '6px 10px', fontSize: 12, borderRadius: 4,
                      color: 'var(--fg-1)', fontWeight: value === o ? 600 : 400,
                      background: value === o ? 'var(--brand-soft)' : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (value !== o) e.currentTarget.style.background = 'var(--bg-inset)'; }}
                    onMouseLeave={(e) => { if (value !== o) e.currentTarget.style.background = 'transparent'; }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// App
// ============================================================
const App = () => {
  const [tab, setTab] = useState(() => localStorage.getItem('cpd_tab') || 'overview');
  const [variant, setVariant] = useState(() => localStorage.getItem('cpd_variant') || 'institutional');
  const [filters, setFilters] = useState(() => {
    const init = {};
    FILTERS.forEach(f => init[f.key] = f.options[0]);
    return init;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-variant', variant);
    localStorage.setItem('cpd_variant', variant);
  }, [variant]);

  useEffect(() => {
    localStorage.setItem('cpd_tab', tab);
  }, [tab]);

  const setFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }));
  const resetFilters = () => {
    const init = {};
    FILTERS.forEach(f => init[f.key] = f.options[0]);
    setFilters(init);
  };
  const activeFilterCount = FILTERS.filter(f => filters[f.key] !== f.options[0]).length;

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">CP</div>
          <div>
            <div className="sidebar-brand-text">Child Protection</div>
            <div className="sidebar-brand-sub">Helpline · Analytics</div>
          </div>
        </div>
        {TABS.map(t => (
          <button key={t.id} className={`nav-item ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} />
            <span style={{ flex: 1 }}>{t.label}</span>
            {t.badge && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                background: 'var(--danger)', color: 'white',
              }}>{t.badge}</span>
            )}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '12px 8px 8px', fontSize: 10, color: 'var(--fg-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            More
          </div>
          <button className="nav-item"><Icon name="settings" /><span>Settings</span></button>
          <button className="nav-item"><Icon name="export" /><span>Export</span></button>
        </div>

        <div className="sidebar-footer">
          Data as of {new Date().toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
        </div>
      </aside>

      {/* Main column */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            <div className="crumb">Contact center · Team leader view</div>
            <h1>{TABS.find(t => t.id === tab)?.label}</h1>
          </div>
          <div className="topbar-spacer" />

          <div className="variant-switch">
            <button className={variant === 'institutional' ? 'is-active' : ''} onClick={() => setVariant('institutional')}>Institutional</button>
            <button className={variant === 'command' ? 'is-active' : ''} onClick={() => setVariant('command')}>Command</button>
            <button className={variant === 'editorial' ? 'is-active' : ''} onClick={() => setVariant('editorial')}>Editorial</button>
          </div>

          <span className="live-dot">Live · auto-refresh 30s</span>

          <button className="icon-btn" title="Refresh">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <div className="avatar">MO</div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', paddingRight: 6, whiteSpace: 'nowrap' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
            </svg>
            Filters
          </div>
          {FILTERS.map(f => (
            <FilterChip key={f.key} f={f} value={filters[f.key]} onChange={(v) => setFilter(f.key, v)} />
          ))}
          {activeFilterCount > 0 && (
            <button className="filter-reset" onClick={resetFilters}>Reset ({activeFilterCount})</button>
          )}
        </div>

        {/* Main content */}
        <div className="main">
          {tab === 'overview' && <OverviewTab filters={filters} setFilters={setFilters} />}
          {tab === 'liveops'  && <LiveOpsTab filters={filters} setFilters={setFilters} />}
          {tab === 'cases'    && <CasesTab filters={filters} setFilters={setFilters} />}
          {tab === 'quality'  && <QualityTab filters={filters} setFilters={setFilters} />}
          {tab === 'alerts'   && <AlertsTab />}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
