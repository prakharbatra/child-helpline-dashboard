// Mock data for the Child Protection Helpline Dashboard
window.DATA = (() => {
  const rand = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(42);
  const range = n => Array.from({ length: n }, (_, i) => i);

  // Sparkline generator
  const spark = (n, base, variance) =>
    range(n).map(i => Math.max(0, base + Math.sin(i * 0.7) * variance * 0.6 + (rand() - 0.5) * variance));

  const kpis = {
    primary: [
      { id: 'sl',   label: 'Service Level',    value: 87.4, unit: '%',  trend: +2.3, target: 85, spark: spark(24, 87, 4), accent: 'ok' },
      { id: 'tot',  label: 'Total Calls',      value: 3842, unit: '',   trend: +8.1, spark: spark(24, 160, 40) },
      { id: 'ans',  label: 'Calls Answered',   value: 3521, unit: '',   trend: +7.4, spark: spark(24, 145, 35) },
      { id: 'asa',  label: 'Avg Speed of Answer', value: 18, unit: 's', trend: -4.2, spark: spark(24, 20, 6), accent: 'ok', invert: true },
      { id: 'aht',  label: 'Avg Handle Time',  value: '6:42', unit: '', trend: +0.8, spark: spark(24, 400, 40) },
      { id: 'aban', label: 'Abandonment Rate', value: 8.4,  unit: '%',  trend: +1.2, spark: spark(24, 8, 2), accent: 'warn', invert: true },
      { id: 'act',  label: 'Active Cases',     value: 428,  unit: '',   trend: +12,  spark: spark(24, 420, 20) },
      { id: 'hr',   label: 'High-Risk Cases',  value: 37,   unit: '',   trend: +5,   spark: spark(24, 32, 6), accent: 'danger', invert: true },
      { id: 'csat', label: 'CSAT',             value: 4.6,  unit: '/5', trend: +0.1, spark: spark(24, 4.5, 0.2), accent: 'ok' },
    ],
    secondary: [
      { id: 'miss', label: 'Missed',          value: 321, trend: +12 },
      { id: 'cb',   label: 'Callback Req.',   value: 84,  trend: -6 },
      { id: 'rep',  label: 'Repeat Callers',  value: 142, trend: +3 },
      { id: 'awt',  label: 'Avg Wait Time',   value: '24s', trend: -8 },
      { id: 'hold', label: 'Avg Hold Time',   value: '42s', trend: +2 },
      { id: 'acw',  label: 'Wrap-up Time',    value: '1:12', trend: -3 },
      { id: 'lwt',  label: 'Longest Wait',    value: '3:48', trend: -12 },
      { id: 'lc',   label: 'Longest Call',    value: '27:14', trend: +5 },
      { id: 'occ',  label: 'Occupancy',       value: '78%', trend: +2 },
      { id: 'util', label: 'Utilization',     value: '84%', trend: +1 },
      { id: 'ql',   label: 'Queue Length',    value: 7,   trend: 0 },
      { id: 'peak', label: 'Peak Concurrent', value: 42,  trend: +3 },
      { id: 'sla',  label: 'SLA Breaches',    value: 47,  trend: -18 },
      { id: 'fcr',  label: 'First-Call Res.', value: '72%', trend: +4 },
      { id: 'esc',  label: 'Escalation Rate', value: '14%', trend: -2 },
      { id: 'trans',label: 'Transfer Rate',   value: '9%', trend: +1 },
      { id: 'qa',   label: 'Quality Score',   value: 92, trend: +1 },
      { id: 'comp', label: 'Compliance',      value: '96%', trend: 0 },
      { id: 'newc', label: 'New Cases',       value: 62, trend: +8 },
      { id: 'clc',  label: 'Closed Cases',    value: 41, trend: +4 },
      { id: 'em',   label: 'Emergency Cases', value: 12, trend: +2 },
      { id: 'ref',  label: 'Referrals Made',  value: 148, trend: +11 },
      { id: 'refa', label: 'Refs Accepted',   value: 121, trend: +9 },
      { id: 'foll', label: 'Follow-ups Due',  value: 89, trend: -4 },
    ],
  };

  const liveOps = [
    { label: 'Active Calls',      value: 34, status: 'ok' },
    { label: 'Waiting Calls',     value: 7,  status: 'warn' },
    { label: 'Available Ops',     value: 12, status: 'ok' },
    { label: 'Busy Operators',    value: 28, status: 'ok' },
    { label: 'Break',             value: 6,  status: 'idle' },
    { label: 'Training',          value: 3,  status: 'idle' },
    { label: 'After-Call Work',   value: 5,  status: 'idle' },
    { label: 'Logged In',         value: 54, status: 'ok' },
    { label: 'Avg Queue Time',    value: '24s', status: 'ok' },
    { label: 'Oldest Waiting',    value: '3:48', status: 'danger' },
    { label: 'Offline',           value: 4,  status: 'idle' },
    { label: 'SLA Risk',          value: 3,  status: 'warn' },
  ];

  // Regions (generic Region 1–7)
  const regions = [
  { id: 'tashkent-city', name: 'Tashkent city', calls: 1156, cases: 126 },
  { id: 'namangan', name: 'Namangan', calls: 174, cases: 18 },
  { id: 'tashkent', name: 'Tashkent', calls: 967, cases: 112 },
  { id: 'fergana', name: 'Fergana', calls: 876, cases: 103 },
  { id: 'andijan', name: 'Andijan', calls: 1284, cases: 148 },
  { id: 'syrdarya', name: 'Syrdarya', calls: 246, cases: 27 },
  { id: 'jizzakh', name: 'Jizzakh', calls: 512, cases: 58 },
  { id: 'navoi', name: 'Navoi', calls: 285, cases: 31 },
  { id: 'samarkand', name: 'Samarkand', calls: 734, cases: 82 },
  { id: 'kashkadarya', name: 'Kashkadarya', calls: 388, cases: 42 },
  { id: 'surkhandarya', name: 'Surkhandarya', calls: 319, cases: 38 },
  { id: 'bukhara', name: 'Bukhara', calls: 621, cases: 74 },
  { id: 'khorezm', name: 'Khorezm', calls: 298, cases: 34 },
  { id: 'karakalpakstan', name: 'Karakalpakstan', calls: 842, cases: 96 }
 ];

  const callsByHour = range(24).map(h => ({
    h,
    offered:   Math.round(60 + Math.sin((h - 7) * 0.35) * 55 + Math.max(0, 40 - Math.abs(h - 14) * 4) + rand() * 8),
    answered:  Math.round(55 + Math.sin((h - 7) * 0.35) * 50 + Math.max(0, 35 - Math.abs(h - 14) * 3.5) + rand() * 6),
    missed:    Math.round(3 + Math.max(0, 8 - Math.abs(h - 15) * 1.2) + rand() * 3),
    abandoned: Math.round(2 + Math.max(0, 6 - Math.abs(h - 12) * 1.1) + rand() * 2),
  }));

  const callsByDay = range(14).map(i => ({
    day: i,
    current:  Math.round(3200 + Math.sin(i * 0.9) * 300 + rand() * 200),
    previous: Math.round(2900 + Math.sin(i * 0.9 + 0.5) * 280 + rand() * 180),
  }));

  const callsByMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
    m,
    value: Math.round(72000 + Math.sin(i * 0.7) * 12000 + rand() * 4000),
    forecast: i > 7 ? Math.round(78000 + Math.sin(i * 0.7) * 14000 + rand() * 3000) : null,
  }));

  const categories = [
    { id: 'phys',   label: 'Physical Abuse',    value: 428, color: '#B42318' },
    { id: 'neg',    label: 'Neglect',           value: 384, color: '#0B2A4A' },
    { id: 'emo',    label: 'Emotional Abuse',   value: 312, color: '#2E7DD1' },
    { id: 'mh',     label: 'Mental Health',     value: 287, color: '#6BA3D6' },
    { id: 'sex',    label: 'Sexual Abuse',      value: 231, color: '#7C3AED' },
    { id: 'dv',     label: 'Domestic Violence', value: 198, color: '#B7791F' },
    { id: 'bully',  label: 'Bullying',          value: 176, color: '#4F7A5E' },
    { id: 'marr',   label: 'Child Marriage',    value: 142, color: '#A08A5F' },
    { id: 'lab',    label: 'Child Labour',      value: 128, color: '#17835A' },
    { id: 'miss',   label: 'Missing Child',     value: 96,  color: '#C4995A' },
    { id: 'run',    label: 'Runaway Child',     value: 74,  color: '#6E5B8A' },
    { id: 'onl',    label: 'Online Exploit.',   value: 68,  color: '#384759' },
    { id: 'sub',    label: 'Substance Abuse',   value: 54,  color: '#94A3B8' },
    { id: 'traf',   label: 'Trafficking',       value: 42,  color: '#5B2E0F' },
    { id: 'other',  label: 'Other',             value: 61,  color: '#D6DCE5' },
  ];

  const severity = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'].map((m, i) => ({
    m,
    low:      Math.round(120 + rand() * 40),
    medium:   Math.round(180 + rand() * 40),
    high:     Math.round(90 + rand() * 30),
    critical: Math.round(30 + rand() * 15),
  }));

  const sankey = {
    // Flow: Caller → Operator → Case → Referral → Closure
    nodes: [
      { id: 'callers', label: 'Callers',   col: 0, value: 3842 },
      { id: 'ops',     label: 'Operators', col: 1, value: 3521 },
      { id: 'cases',   label: 'Cases',     col: 2, value: 1247 },
      { id: 'refs',    label: 'Referrals', col: 3, value: 842 },
      { id: 'closed',  label: 'Closed',    col: 4, value: 621 },
    ],
    // We render a stepped horizontal flow with proportional widths
  };

  const funnel = [
    { label: 'New Case',     value: 428, color: '#2E7DD1' },
    { label: 'Assigned',     value: 402, color: '#2E7DD1' },
    { label: 'Investigation',value: 361, color: '#1E4B82' },
    { label: 'Referral',     value: 284, color: '#1E4B82' },
    { label: 'Follow-up',    value: 218, color: '#0B2A4A' },
    { label: 'Closed',       value: 174, color: '#0B2A4A' },
  ];

  const operators = [
    { name: 'Amara Okafor',    team: 'Alpha',   ans: 284, miss: 8,  aht: '5:42', awt: '18s', occ: 82, csat: 4.8, qa: 96, res: 78, fcr: 74, esc: 12, trans: 7, closed: 42, prod: 94 },
    { name: 'Rohan Sharma',    team: 'Alpha',   ans: 271, miss: 11, aht: '5:58', awt: '22s', occ: 79, csat: 4.7, qa: 94, res: 75, fcr: 71, esc: 14, trans: 9, closed: 38, prod: 91 },
    { name: 'Layla Hassan',    team: 'Bravo',   ans: 268, miss: 9,  aht: '6:12', awt: '24s', occ: 81, csat: 4.7, qa: 93, res: 73, fcr: 69, esc: 15, trans: 8, closed: 36, prod: 89 },
    { name: 'Diego Ramirez',   team: 'Bravo',   ans: 254, miss: 14, aht: '6:34', awt: '28s', occ: 77, csat: 4.5, qa: 91, res: 70, fcr: 66, esc: 18, trans: 11, closed: 34, prod: 86 },
    { name: 'Priya Nair',      team: 'Charlie', ans: 248, miss: 12, aht: '6:48', awt: '31s', occ: 76, csat: 4.6, qa: 90, res: 68, fcr: 65, esc: 17, trans: 10, closed: 32, prod: 84 },
    { name: 'Kwame Asante',    team: 'Alpha',   ans: 241, miss: 16, aht: '7:02', awt: '34s', occ: 74, csat: 4.4, qa: 88, res: 66, fcr: 62, esc: 21, trans: 12, closed: 30, prod: 81 },
    { name: 'Mei-Lin Chen',    team: 'Charlie', ans: 234, miss: 15, aht: '7:14', awt: '38s', occ: 72, csat: 4.5, qa: 87, res: 64, fcr: 60, esc: 22, trans: 13, closed: 28, prod: 79 },
    { name: 'Fatima Al-Rashid',team: 'Bravo',   ans: 227, miss: 18, aht: '7:28', awt: '42s', occ: 71, csat: 4.3, qa: 85, res: 62, fcr: 58, esc: 24, trans: 14, closed: 26, prod: 76 },
    { name: 'Ivan Petrov',     team: 'Charlie', ans: 218, miss: 22, aht: '7:52', awt: '48s', occ: 68, csat: 4.2, qa: 82, res: 58, fcr: 54, esc: 28, trans: 16, closed: 22, prod: 71 },
    { name: 'Sofia Martinez',  team: 'Alpha',   ans: 212, miss: 24, aht: '8:14', awt: '54s', occ: 66, csat: 4.1, qa: 79, res: 55, fcr: 51, esc: 31, trans: 18, closed: 20, prod: 68 },
  ];

  const teamCards = [
    { label: 'Best Performing Team',    value: 'Team Alpha',   sub: 'SL 91.2% · CSAT 4.7', tone: 'ok' },
    { label: 'Lowest SLA',              value: 'Team Charlie', sub: '78.4% — below target',tone: 'warn' },
    { label: 'Highest Occupancy',       value: 'Team Bravo',   sub: '84% · at capacity',    tone: 'info' },
    { label: 'Coaching Required',       value: '4 operators',  sub: 'QA score < 85',        tone: 'warn' },
    { label: 'Top Performer',           value: 'Amara Okafor', sub: 'Productivity 94',      tone: 'ok' },
    { label: 'Needs Attention',         value: 'Sofia Martinez',sub: 'QA 79 · AHT 8:14',    tone: 'warn' },
  ];

  const demographics = {
    age: [
      { label: '0–5',   value: 84,  pct: 12 },
      { label: '6–10',  value: 156, pct: 22 },
      { label: '11–14', value: 248, pct: 35 },
      { label: '15–18', value: 212, pct: 30 },
    ],
    gender: [
      { label: 'Female',  value: 421, pct: 55, color: '#2E7DD1' },
      { label: 'Male',    value: 268, pct: 35, color: '#0B2A4A' },
      { label: 'Other',   value: 42,  pct: 5.5, color: '#6BA3D6' },
      { label: 'Unknown', value: 34,  pct: 4.5, color: '#B8C1CE' },
    ],
    disability: [
      { label: 'None reported', value: 612, pct: 82 },
      { label: 'Reported',      value: 96,  pct: 13 },
      { label: 'Unknown',       value: 37,  pct: 5 },
    ],
    location: [
      { label: 'Urban', value: 542, pct: 68 },
      { label: 'Rural', value: 253, pct: 32 },
    ],
  };

  const referralAgencies = [
    { label: 'Police',        value: 284, success: 88 },
    { label: 'Social Worker', value: 241, success: 92 },
    { label: 'Hospital',      value: 186, success: 94 },
    { label: 'Shelter',       value: 142, success: 78 },
    { label: 'NGO Partner',   value: 128, success: 84 },
    { label: 'Legal Aid',     value: 96,  success: 71 },
    { label: 'School',        value: 78,  success: 89 },
    { label: 'Psychologist',  value: 64,  success: 86 },
  ];

  const qaTrend = range(12).map(i => ({
    m: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    qa:      Math.round(86 + Math.sin(i * 0.4) * 3 + rand() * 2),
    script:  Math.round(91 + Math.sin(i * 0.5) * 2 + rand() * 2),
    mand:    Math.round(94 + Math.sin(i * 0.3) * 2 + rand() * 1.5),
  }));

  const alerts = [
    { severity: 'critical', title: 'Emergency case escalation queue',   body: '3 critical cases awaiting action for > 15 minutes. Assign a supervisor immediately.', time: '2 min ago', category: 'Case' },
    { severity: 'critical', title: 'Repeat calls from same number',     body: 'Number +XXX-XXX-4821 has called 6 times in the last hour. Possible child in danger — flagged for review.', time: '4 min ago', category: 'Safety' },
    { severity: 'critical', title: 'SLA breach — Region 2',             body: 'Service level dropped to 71% (target 85%). 14 calls have exceeded the 20-second answer target.', time: '8 min ago', category: 'SLA' },
    { severity: 'warn',     title: 'High abandonment rate',             body: 'Abandonment climbed to 12.4% over the last hour, above the 10% threshold.', time: '11 min ago', category: 'Queue' },
    { severity: 'warn',     title: 'Long queue on Hotline 116',         body: '7 calls waiting, oldest 3:48. Consider re-routing to backup pool.', time: '13 min ago', category: 'Queue' },
    { severity: 'warn',     title: 'Operator shortage — evening shift', body: '4 operators short of forecast for 18:00–22:00. Coverage at 76%.', time: '22 min ago', category: 'Staffing' },
    { severity: 'warn',     title: 'Spike in Sexual Abuse category',    body: 'Category volume +48% vs 7-day average. Alert QA and clinical lead.', time: '34 min ago', category: 'Case' },
    { severity: 'warn',     title: 'Referrals overdue — Shelter',       body: '8 referrals to Shelter Network have not been acknowledged within 24h.', time: '41 min ago', category: 'Referral' },
    { severity: 'info',     title: 'Follow-ups scheduled today',        body: '89 follow-ups due before 17:00. 12 assigned to operators currently on break.', time: '1h ago', category: 'Case' },
  ];

  const queue = {
    current: 7,
    longestWait: '3:48',
    slaRisk: 3,
    expectedWait: '00:34',
    items: [
      { id: 'C-4821', wait: '3:48', region: 'Region 2', priority: 'critical', category: 'Emergency' },
      { id: 'C-4822', wait: '2:14', region: 'Region 3', priority: 'high',     category: 'Physical Abuse' },
      { id: 'C-4823', wait: '1:52', region: 'Region 1', priority: 'high',     category: 'Neglect' },
      { id: 'C-4824', wait: '1:28', region: 'Region 2', priority: 'medium',   category: 'Mental Health' },
      { id: 'C-4825', wait: '0:54', region: 'Region 4', priority: 'medium',   category: 'Bullying' },
      { id: 'C-4826', wait: '0:41', region: 'Region 5', priority: 'low',      category: 'Enquiry' },
      { id: 'C-4827', wait: '0:22', region: 'Region 2', priority: 'medium',   category: 'Emotional Abuse' },
    ],
  };

  const followups = {
    dueToday:  42,
    overdue:   18,
    completed: 87,
    pending:   134,
  };

  return {
    kpis, liveOps, regions, callsByHour, callsByDay, callsByMonth,
    categories, severity, sankey, funnel, operators, teamCards,
    demographics, referralAgencies, qaTrend, alerts, queue, followups,
  };
})();
