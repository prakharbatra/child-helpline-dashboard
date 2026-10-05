// Reusable SVG chart primitives — no external chart libs
const { useState, useRef, useMemo, useEffect } = React;

// --- helpers ---
const cx = (...a) => a.filter(Boolean).join(' ');
const fmt = (n) => {
  if (typeof n !== 'number') return n;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  if (n % 1 === 0) return n.toLocaleString();
  return n.toFixed(1);
};

// ============================================================
// Sparkline
// ============================================================
function Sparkline({ data, width = 80, height = 28, color = 'var(--brand-accent)', strokeWidth = 1.5, fill = false }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = fill ? `${path} L${width},${height} L0,${height} Z` : null;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {area && <path d={area} fill={color} fillOpacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ============================================================
// Area chart (multi-series stacked or overlaid)
// ============================================================
function AreaChart({ data, series, height = 220, xKey = 'h', xLabel = v => `${v}:00` }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [dim, setDim] = useState({ w: 600 });

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width }));
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const w = dim.w;
  const pad = { t: 12, r: 12, b: 28, l: 36 };
  const iw = w - pad.l - pad.r;
  const ih = height - pad.t - pad.b;

  const allValues = data.flatMap(d => series.map(s => d[s.key]));
  const max = Math.ceil(Math.max(...allValues) / 20) * 20 || 20;
  const step = iw / (data.length - 1);

  const y = v => pad.t + ih - (v / max) * ih;
  const x = i => pad.l + i * step;

  // grid
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => max * f);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width="100%" height={height} style={{ display: 'block', overflow: 'visible' }}>
        {/* grid */}
        {gridLines.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke="var(--border-1)" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 8} y={y(v) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">{fmt(v)}</text>
          </g>
        ))}
        {/* areas */}
        {series.map((s, si) => {
          const pts = data.map((d, i) => [x(i), y(d[s.key])]);
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
          const area = `${path} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
          return (
            <g key={s.key}>
              {s.fill !== false && <path d={area} fill={s.color} fillOpacity="0.12" />}
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {/* x labels */}
        {data.map((d, i) => i % Math.ceil(data.length / 8) === 0 && (
          <text key={i} x={x(i)} y={height - 8} fontSize="10" fill="var(--fg-3)" textAnchor="middle">{xLabel(d[xKey])}</text>
        ))}
        {/* hover overlay */}
        {data.map((d, i) => (
          <rect key={'h'+i} x={x(i) - step/2} y={pad.t} width={step} height={ih}
                fill="transparent"
                onMouseEnter={(e) => setHover({ i, d, x: x(i), y: pad.t })}
                onMouseLeave={() => setHover(null)}
          />
        ))}
        {hover && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={pad.t} y2={pad.t + ih} stroke="var(--fg-3)" strokeDasharray="2,3" />
            {series.map(s => (
              <circle key={s.key} cx={hover.x} cy={y(hover.d[s.key])} r="3.5" fill="white" stroke={s.color} strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>
      {hover && (
        <div className="chart-tt show" style={{ left: hover.x, top: hover.y }}>
          <div className="tt-title">{xLabel(hover.d[xKey])}</div>
          {series.map(s => (
            <div className="tt-row" key={s.key}>
              <span className="tt-key"><span className="tt-swatch" style={{ background: s.color }} />{s.label}</span>
              <span className="tt-val">{fmt(hover.d[s.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Line chart with comparison
// ============================================================
function LineChart({ data, series, height = 200, xLabel = (i) => `D${i + 1}` }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [dim, setDim] = useState({ w: 600 });

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width }));
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const w = dim.w;
  const pad = { t: 12, r: 12, b: 24, l: 36 };
  const iw = w - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const allValues = data.flatMap(d => series.map(s => d[s.key]));
  const max = Math.ceil(Math.max(...allValues) / 500) * 500;
  const min = Math.floor(Math.min(...allValues) / 500) * 500;
  const step = iw / (data.length - 1);
  const y = v => pad.t + ih - ((v - min) / (max - min)) * ih;
  const x = i => pad.l + i * step;
  const grid = [min, min + (max - min) / 2, max];

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width="100%" height={height} style={{ display: 'block' }}>
        {grid.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke="var(--border-1)" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 8} y={y(v) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">{fmt(v)}</text>
          </g>
        ))}
        {series.map(s => {
          const pts = data.map((d, i) => [x(i), y(d[s.key])]);
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
          return (
            <path key={s.key} d={path} fill="none" stroke={s.color}
                  strokeWidth="2" strokeDasharray={s.dashed ? '4,4' : ''}
                  strokeLinecap="round" strokeLinejoin="round" />
          );
        })}
        {data.map((d, i) => i % Math.ceil(data.length / 7) === 0 && (
          <text key={i} x={x(i)} y={height - 6} fontSize="10" fill="var(--fg-3)" textAnchor="middle">{xLabel(i)}</text>
        ))}
        {data.map((d, i) => (
          <rect key={'h'+i} x={x(i) - step/2} y={pad.t} width={step} height={ih}
                fill="transparent"
                onMouseEnter={() => setHover({ i, d, x: x(i), y: pad.t })}
                onMouseLeave={() => setHover(null)} />
        ))}
        {hover && (
          <g>
            <line x1={hover.x} x2={hover.x} y1={pad.t} y2={pad.t + ih} stroke="var(--fg-3)" strokeDasharray="2,3" />
            {series.map(s => (
              <circle key={s.key} cx={hover.x} cy={y(hover.d[s.key])} r="3.5" fill="white" stroke={s.color} strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>
      {hover && (
        <div className="chart-tt show" style={{ left: hover.x, top: hover.y }}>
          <div className="tt-title">{xLabel(hover.i)}</div>
          {series.map(s => (
            <div className="tt-row" key={s.key}>
              <span className="tt-key"><span className="tt-swatch" style={{ background: s.color }} />{s.label}</span>
              <span className="tt-val">{fmt(hover.d[s.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Donut chart
// ============================================================
function Donut({ data, size = 200, thickness = 32, onSelect, selected, centerLabel, centerValue }) {
  const [hover, setHover] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 4;
  const rInner = r - thickness;
  const cx = size / 2, cy = size / 2;

  let acc = 0;
  const arcs = data.map(d => {
    const start = acc / total * Math.PI * 2 - Math.PI / 2;
    acc += d.value;
    const end = acc / total * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const x3 = cx + rInner * Math.cos(end),   y3 = cy + rInner * Math.sin(end);
    const x4 = cx + rInner * Math.cos(start), y4 = cy + rInner * Math.sin(start);
    return {
      d,
      path: `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 ${large} 0 ${x4},${y4} Z`,
    };
  });

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      {arcs.map((a, i) => {
        const active = selected === a.d.id || hover === a.d.id;
        const dim = (selected && selected !== a.d.id) || (hover && hover !== a.d.id);
        return (
          <path key={a.d.id} d={a.path} fill={a.d.color}
                opacity={dim ? 0.35 : 1}
                style={{ transition: 'opacity 0.15s, transform 0.15s', cursor: onSelect ? 'pointer' : 'default',
                         transformOrigin: `${cx}px ${cy}px`, transform: active ? 'scale(1.03)' : 'scale(1)' }}
                onMouseEnter={() => setHover(a.d.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect && onSelect(selected === a.d.id ? null : a.d.id)}
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="var(--fg-3)" fontWeight="500">
        {hover ? data.find(d => d.id === hover)?.label : (centerLabel || 'Total')}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="22" fill="var(--fg-1)" fontWeight="600" style={{ fontFeatureSettings: '"tnum" 1' }}>
        {hover ? fmt(data.find(d => d.id === hover)?.value) : (centerValue || fmt(total))}
      </text>
    </svg>
  );
}

// ============================================================
// Stacked bar
// ============================================================
function StackedBar({ data, series, height = 200, xKey = 'm' }) {
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [dim, setDim] = useState({ w: 600 });

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width }));
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const w = dim.w;
  const pad = { t: 12, r: 12, b: 24, l: 36 };
  const iw = w - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const totals = data.map(d => series.reduce((s, k) => s + d[k.key], 0));
  const max = Math.ceil(Math.max(...totals) / 100) * 100;
  const bandW = iw / data.length;
  const barW = Math.min(bandW * 0.6, 40);
  const y = v => pad.t + ih - (v / max) * ih;
  const grid = [0, max * 0.5, max];

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width="100%" height={height} style={{ display: 'block' }}>
        {grid.map((v, i) => (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + iw} y1={y(v)} y2={y(v)} stroke="var(--border-1)" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 8} y={y(v) + 3} fontSize="10" fill="var(--fg-3)" textAnchor="end">{fmt(v)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          let stack = 0;
          const bx = pad.l + i * bandW + (bandW - barW) / 2;
          return (
            <g key={i} onMouseEnter={() => setHover({ i, d, x: bx + barW / 2, y: pad.t })} onMouseLeave={() => setHover(null)}>
              {series.map((s, si) => {
                const h = (d[s.key] / max) * ih;
                const yPos = y(stack + d[s.key]);
                stack += d[s.key];
                const isTop = si === series.length - 1;
                return (
                  <rect key={s.key} x={bx} y={yPos} width={barW} height={h}
                        fill={s.color}
                        rx={isTop ? 2 : 0}
                        style={{ transition: 'opacity 0.15s' }}
                        opacity={hover && hover.i !== i ? 0.4 : 1}
                  />
                );
              })}
              <text x={bx + barW / 2} y={height - 8} fontSize="10" fill="var(--fg-3)" textAnchor="middle">{d[xKey]}</text>
            </g>
          );
        })}
      </svg>
      {hover && (
        <div className="chart-tt show" style={{ left: hover.x, top: hover.y }}>
          <div className="tt-title">{hover.d[xKey]}</div>
          {series.slice().reverse().map(s => (
            <div className="tt-row" key={s.key}>
              <span className="tt-key"><span className="tt-swatch" style={{ background: s.color }} />{s.label}</span>
              <span className="tt-val">{fmt(hover.d[s.key])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Horizontal bar list
// ============================================================
function HBar({ data, valueKey = 'value', labelKey = 'label', color = 'var(--brand-accent)', maxOverride, showValue = true, suffix = '' }) {
  const max = maxOverride || Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="vstack" style={{ gap: 10 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: 'var(--fg-2)' }}>{d[labelKey]}</span>
            {showValue && (
              <span className="num" style={{ color: 'var(--fg-1)', fontSize: 12 }}>{fmt(d[valueKey])}{suffix}</span>
            )}
          </div>
          <div style={{ height: 6, background: 'var(--bg-inset)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              width: `${(d[valueKey] / max) * 100}%`,
              height: '100%',
              background: d.color || color,
              borderRadius: 999,
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Gauge (semicircle)
// ============================================================
function Gauge({ value, max = 100, label, size = 160, color }) {
  const pct = Math.min(value / max, 1);
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2 + 8;
  const start = Math.PI;
  const end = Math.PI + Math.PI * pct;
  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
  const x2b = cx + r * Math.cos(Math.PI * 2), y2b = cy + r * Math.sin(Math.PI * 2);
  const large = end - start > Math.PI ? 1 : 0;
  const arcBg = `M${x1},${y1} A${r},${r} 0 0 1 ${x2b},${y2b}`;
  const arcFg = `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`;
  const c = color || (pct > 0.8 ? 'var(--ok)' : pct > 0.6 ? 'var(--warn)' : 'var(--danger)');
  return (
    <svg width={size} height={size / 2 + 24} style={{ display: 'block' }}>
      <path d={arcBg} stroke="var(--bg-inset)" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d={arcFg} stroke={c} strokeWidth="10" fill="none" strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s' }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="26" fontWeight="600" fill="var(--fg-1)"
            style={{ fontFeatureSettings: '"tnum" 1' }}>
        {Math.round(value)}<tspan fontSize="12" fill="var(--fg-3)">%</tspan>
      </text>
      {label && (
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--fg-3)" fontWeight="500">
          {label}
        </text>
      )}
    </svg>
  );
}

// ============================================================
// Choropleth map — stylized regions (not real geography)
// ============================================================
// ============================================================
// Uzbekistan Regional Choropleth Map
// ============================================================

// ============================================================
// Uzbekistan Regional Map
// Uses the actual GeoJSON administrative boundaries.
// No D3 required.
// ============================================================

function Choropleth({ regions, onSelect, selected, valueKey = 'calls' }) {

  const wrapRef = React.useRef(null);

  const [geoData, setGeoData] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });


  // ----------------------------------------------------------
  // Load Uzbekistan GeoJSON
  // ----------------------------------------------------------

  React.useEffect(() => {

    fetch('./uzbekistan_regional.geojson')
      .then(response => {

        if (!response.ok) {
          throw new Error(
            `Unable to load GeoJSON: ${response.status}`
          );
        }

        return response.json();

      })
      .then(data => {

        console.log(
          'Uzbekistan GeoJSON loaded:',
          data.features.length,
          'regions'
        );

        setGeoData(data);

      })
      .catch(error => {

        console.error(
          'Uzbekistan GeoJSON error:',
          error
        );

      });

  }, []);


  // ----------------------------------------------------------
  // Loading state
  // ----------------------------------------------------------

  if (!geoData) {

    return (
      <div
        style={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--fg-3)',
          fontSize: 12
        }}
      >
        Loading Uzbekistan map...
      </div>
    );

  }


  // ----------------------------------------------------------
  // Convert GeometryCollection → standard geometry
  // ----------------------------------------------------------

  const getGeometry = (feature) => {

    if (!feature.geometry) {
      return null;
    }

    if (
      feature.geometry.type ===
      'GeometryCollection'
    ) {

      return feature.geometry.geometries[0];

    }

    return feature.geometry;

  };


  // ----------------------------------------------------------
  // Extract all features
  // ----------------------------------------------------------

  const features = geoData.features
    .map(feature => ({
      ...feature,
      geometry: getGeometry(feature)
    }))
    .filter(feature => feature.geometry);


  // ----------------------------------------------------------
  // Calculate geographic bounds
  // ----------------------------------------------------------

  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;


  const inspectCoordinates = (coords) => {

    if (
      typeof coords[0] === 'number'
    ) {

      const lon = coords[0];
      const lat = coords[1];

      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);

      return;
    }

    coords.forEach(
      inspectCoordinates
    );

  };


  features.forEach(feature => {

    inspectCoordinates(
      feature.geometry.coordinates
    );

  });


  // ----------------------------------------------------------
  // SVG dimensions
  // ----------------------------------------------------------

  const width = 620;
  const height = 360;

  const padding = 20;


  // ----------------------------------------------------------
  // Geographic → SVG coordinate conversion
  // ----------------------------------------------------------

  const lonRange =
    maxLon - minLon;

  const latRange =
    maxLat - minLat;


  // Compensate for longitude distortion at
  // Uzbekistan's latitude.

  const centerLat =
    (minLat + maxLat) / 2;

  const longitudeCorrection =
    Math.cos(
      centerLat *
      Math.PI /
      180
    );


  const usableWidth =
    width - padding * 2;

  const usableHeight =
    height - padding * 2;


  const scaleX =
    usableWidth /
    (lonRange * longitudeCorrection);


  const scaleY =
    usableHeight /
    latRange;


  const scale =
    Math.min(
      scaleX,
      scaleY
    );


  const actualWidth =
    lonRange *
    longitudeCorrection *
    scale;


  const actualHeight =
    latRange *
    scale;


  const offsetX =
    (width - actualWidth) / 2;


  const offsetY =
    (height - actualHeight) / 2;


  const project = (lon, lat) => {

    const x =
      offsetX +
      (
        (lon - minLon) *
        longitudeCorrection
      ) *
      scale;

    const y =
      offsetY +
      (
        maxLat - lat
      ) *
      scale;

    return [x, y];

  };


  // ----------------------------------------------------------
  // Convert polygon coordinates → SVG path
  // ----------------------------------------------------------

  const ringToPath = (ring) => {

    if (!ring || ring.length === 0) {
      return '';
    }

    return ring
      .map((point, index) => {

        const [
          x,
          y
        ] = project(
          point[0],
          point[1]
        );

        return `${
          index === 0
            ? 'M'
            : 'L'
        }${x.toFixed(2)},${y.toFixed(2)}`;

      })
      .join(' ') + ' Z';

  };


  const geometryToPath = (
    geometry
  ) => {

    if (
      geometry.type ===
      'Polygon'
    ) {

      return geometry.coordinates
        .map(ringToPath)
        .join(' ');

    }


    if (
      geometry.type ===
      'MultiPolygon'
    ) {

      return geometry.coordinates
        .map(polygon => {

          return polygon
            .map(ringToPath)
            .join(' ');

        })
        .join(' ');

    }


    return '';

  };


  // ----------------------------------------------------------
  // Match GeoJSON region to dashboard data
  // ----------------------------------------------------------

  const normalize = (name) => {

    return String(name || '')
      .toLowerCase()
      .replace(
        ' region',
        ''
      )
      .replace(
        ' province',
        ''
      )
      .replace(
        'republic of ',
        ''
      )
      .trim();

  };


  const findRegion = (
    feature
  ) => {

    const geoName =
      normalize(
        feature.properties?.ADM1_EN
      );


    return regions.find(
      region => {

        const dataName =
          normalize(
            region.name
          );

        return (
          geoName === dataName
        );

      }
    );

  };


  // ----------------------------------------------------------
  // Call-volume colour scale
  // ----------------------------------------------------------

  const maxValue =
    Math.max(
      ...regions.map(
        r =>
          Number(
            r[valueKey]
          ) || 0
      ),
      1
    );


  const getColour = (
    value
  ) => {

    const ratio =
      value /
      maxValue;


    if (ratio < 0.20) {
      return '#E8F0FA';
    }

    if (ratio < 0.40) {
      return '#C4DAF1';
    }

    if (ratio < 0.60) {
      return '#96BCE1';
    }

    if (ratio < 0.80) {
      return '#5C93CE';
    }

    return '#0B2A4A';

  };


  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (

    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%'
      }}

      onMouseMove={(event) => {

        const rect =
          wrapRef.current
            .getBoundingClientRect();

        setMouse({
          x:
            event.clientX -
            rect.left +
            12,

          y:
            event.clientY -
            rect.top +
            12
        });

      }}
    >

      <svg
        viewBox="0 0 620 360"
        width="100%"
        height="360"
        preserveAspectRatio="xMidYMid meet"
        style={{
          display: 'block'
        }}
      >

        {features.map(
          feature => {

            const region =
              findRegion(
                feature
              );


            const regionName =
              feature.properties?.ADM1_EN ||
              'Unknown region';


            const value =
              region
                ? Number(
                    region[valueKey]
                  ) || 0
                : 0;


            const regionId =
              region?.id ||
              regionName;


            const isSelected =
              selected === regionId;


            const isHovered =
              hovered?.id === regionId;


            const path =
              geometryToPath(
                feature.geometry
              );


            return (

              <path
                key={regionName}

                d={path}

                fill={
                  getColour(value)
                }

                fillRule="evenodd"

                stroke={
                  isSelected ||
                  isHovered
                    ? '#2E7DD1'
                    : '#FFFFFF'
                }

                strokeWidth={
                  isSelected
                    ? 2.5
                    : isHovered
                      ? 2
                      : 1
                }

                style={{
                  cursor:
                    region
                      ? 'pointer'
                      : 'default',
                  transition:
                    'fill 0.15s ease'
                }}


                onMouseEnter={() => {

                  setHovered({
                    id:
                      regionId,

                    name:
                      regionName,

                    value:
                      value
                  });

                }}


                onMouseLeave={() => {

                  setHovered(
                    null
                  );

                }}


                onClick={() => {

                  if (
                    region &&
                    onSelect
                  ) {

                    onSelect(
                      isSelected
                        ? null
                        : region.id
                    );

                  }

                }}

              />

            );

          }
        )}

      </svg>


      {/* ----------------------------------------------------
          Tooltip
      ---------------------------------------------------- */}

      {hovered && (

        <div
          className="map-tooltip show"

          style={{
            left:
              mouse.x,

            top:
              mouse.y,

            pointerEvents:
              'none'
          }}
        >

          <div>
            {hovered.name}
          </div>

          <div
            className="tt-value"
          >
            {fmt(
              hovered.value
            )}{' '}
            calls
          </div>

        </div>

      )}


      {/* ----------------------------------------------------
          Legend
      ---------------------------------------------------- */}

      <div
        className="map-legend"
        style={{
          justifyContent:
            'center',
          marginTop: 6
        }}
      >

        <span>
          Low
        </span>

        <div
          style={{
            display: 'flex',
            width: 140,
            height: 8,
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >

          <div
            style={{
              flex: 1,
              background:
                '#E8F0FA'
            }}
          />

          <div
            style={{
              flex: 1,
              background:
                '#C4DAF1'
            }}
          />

          <div
            style={{
              flex: 1,
              background:
                '#96BCE1'
            }}
          />

          <div
            style={{
              flex: 1,
              background:
                '#5C93CE'
            }}
          />

          <div
            style={{
              flex: 1,
              background:
                '#0B2A4A'
            }}
          />

        </div>

        <span>
          High
        </span>

      </div>

    </div>

  );

}

// ============================================================
// Sankey-style flow (5 columns: Caller → Op → Case → Ref → Closure)
// ============================================================
function SankeyFlow({ nodes, height = 220 }) {
  const svgRef = useRef(null);
  const [dim, setDim] = useState({ w: 600 });
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width }));
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const w = dim.w;
  const pad = 12;
  const cols = 5;
  const colW = 90;
  const gap = (w - pad * 2 - colW * cols) / (cols - 1);
  const maxV = nodes[0].value;
  const ih = height - 40;
  const colors = ['#0B2A4A', '#1E4B82', '#2E7DD1', '#6BA3D6', '#17835A'];

  const rects = nodes.map((n, i) => {
    const h = (n.value / maxV) * ih;
    const x = pad + i * (colW + gap);
    const y = 20 + (ih - h) / 2;
    return { ...n, x, y, w: colW, h };
  });

  const links = rects.slice(0, -1).map((a, i) => {
    const b = rects[i + 1];
    const linkH = Math.min(a.h, b.h);
    const ay = a.y + (a.h - linkH) / 2;
    const by = b.y + (b.h - linkH) / 2;
    const x1 = a.x + a.w;
    const x2 = b.x;
    const mid = (x1 + x2) / 2;
    // Bezier band
    const path = `M${x1},${ay} C${mid},${ay} ${mid},${by} ${x2},${by} L${x2},${by + linkH} C${mid},${by + linkH} ${mid},${ay + linkH} ${x1},${ay + linkH} Z`;
    return { path, from: a, to: b, i };
  });

  return (
    <svg ref={svgRef} width="100%" height={height} style={{ display: 'block' }}>
      {links.map((l, i) => (
        <path key={i} d={l.path} fill={colors[i]} fillOpacity={hover === i ? 0.35 : 0.18}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s' }} />
      ))}
      {rects.map((n, i) => (
        <g key={n.id}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="3" fill={colors[i]} />
          <text x={n.x + n.w / 2} y={n.y - 6} fontSize="11" fontWeight="600" fill="var(--fg-1)" textAnchor="middle">
            {n.label}
          </text>
          <text x={n.x + n.w / 2} y={n.y + n.h + 14} fontSize="11" fill="var(--fg-2)" textAnchor="middle"
                style={{ fontFeatureSettings: '"tnum" 1' }} fontWeight="600">
            {fmt(n.value)}
          </text>
          <text x={n.x + n.w / 2} y={n.y + n.h + 26} fontSize="9" fill="var(--fg-3)" textAnchor="middle">
            {i > 0 ? `${Math.round(n.value / rects[i-1].value * 100)}% conv.` : ''}
          </text>
        </g>
      ))}
    </svg>
  );
}

// export
Object.assign(window, { Sparkline, AreaChart, LineChart, Donut, StackedBar, HBar, Gauge, Choropleth, SankeyFlow, fmt, cx });
