import { useState, useEffect, FC } from 'react';

const properties = [
  {
    id: 1,
    name: 'XYZ Residency',
    location: 'Whitefield, Bengaluru',
    builder: 'Prestige Group',
    type: '3BHK Apartment',
    advertised: 12000000,
    trueValue: 10500000,
    builderScore: 6.2,
    delayRisk: 'Medium',
    delayPercent: 42,
    legalRisk: 'Low',
    rentalYield: 3.8,
    infraScore: 7.1,
    waterRisk: 'Low',
    priceHistory: [
      9200000, 9800000, 10100000, 10400000, 10500000, 10800000, 11200000,
      12000000,
    ],
    hiddenCosts: {
      stampDuty: 480000,
      gst: 360000,
      registration: 120000,
      maintenance: 250000,
      plc: 180000,
    },
    rera: 'PRM/KA/RERA/1251/309/PR/180323/001234',
    reraCompliant: true,
    escrowHealth: 68,
    similarSales: [9800000, 10200000, 10600000],
    verdict: 'Overpriced',
    verdictColor: '#FF6B35',
    completionDate: 'Q3 2026',
    disputes: 2,
  },
  {
    id: 2,
    name: 'Lodha Palava Phase 7',
    location: 'Dombivli, Mumbai',
    builder: 'Lodha Group',
    type: '2BHK Apartment',
    advertised: 8500000,
    trueValue: 8900000,
    builderScore: 8.7,
    delayRisk: 'Low',
    delayPercent: 12,
    legalRisk: 'Low',
    rentalYield: 4.2,
    infraScore: 8.4,
    waterRisk: 'Medium',
    priceHistory: [
      7200000, 7600000, 7900000, 8100000, 8300000, 8400000, 8500000, 8500000,
    ],
    hiddenCosts: {
      stampDuty: 340000,
      gst: 255000,
      registration: 85000,
      maintenance: 200000,
      plc: 120000,
    },
    rera: 'P51700047789',
    reraCompliant: true,
    escrowHealth: 84,
    similarSales: [8600000, 8900000, 9100000],
    verdict: 'Fair Deal',
    verdictColor: '#00C896',
    completionDate: 'Q1 2026',
    disputes: 0,
  },
  {
    id: 3,
    name: 'Sobha Dream Acres',
    location: 'Panathur, Bengaluru',
    builder: 'Sobha Limited',
    type: '1BHK Apartment',
    advertised: 5800000,
    trueValue: 4900000,
    builderScore: 7.4,
    delayRisk: 'High',
    delayPercent: 71,
    legalRisk: 'Medium',
    rentalYield: 2.9,
    infraScore: 5.2,
    waterRisk: 'High',
    priceHistory: [
      4100000, 4300000, 4600000, 4800000, 5100000, 5400000, 5600000, 5800000,
    ],
    hiddenCosts: {
      stampDuty: 232000,
      gst: 174000,
      registration: 58000,
      maintenance: 180000,
      plc: 95000,
    },
    rera: 'PRM/KA/RERA/1251/446/PR/210823/002891',
    reraCompliant: false,
    escrowHealth: 41,
    similarSales: [4700000, 4900000, 5100000],
    verdict: 'Avoid',
    verdictColor: '#FF2D55',
    completionDate: 'Q4 2027',
    disputes: 8,
  },
];

const fmt = (n: number): string => `₹${(n / 100000).toFixed(1)}L`;
const fmtCr = (n: number): string =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(0)}L`;

interface MiniChartProps {
  data: number[];
  color: string;
}

const MiniChart: FC<MiniChartProps> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 120,
    h = 40;
  const pts = data
    .map((v: number, i: number) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * (h - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1] - min) / (max - min)) * (h - 6) - 3}
        r="3"
        fill={color}
      />
    </svg>
  );
};

interface RiskBadgeProps {
  level: string;
}

const RiskBadge: FC<RiskBadgeProps> = ({ level }) => {
  const colors: Record<string, string> = { Low: '#00C896', Medium: '#FFB800', High: '#FF2D55' };
  return (
    <span
      style={{
        background: colors[level] + '22',
        color: colors[level],
        border: `1px solid ${colors[level]}44`,
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {level.toUpperCase()}
    </span>
  );
};

interface ScoreArcProps {
  score: number;
  max?: number;
  size?: number;
}

const ScoreArc: FC<ScoreArcProps> = ({ score, max = 10, size = 80 }) => {
  const pct = score / max;
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75;
  const color = pct > 0.75 ? '#00C896' : pct > 0.5 ? '#FFB800' : '#FF2D55';
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-225deg)' }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1a1a2e"
        strokeWidth="6"
        strokeDasharray={`${circ * 0.75} ${circ}`}
        strokeLinecap="round"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2 + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="800"
        style={{
          transform: 'rotate(225deg)',
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        {score}
      </text>
    </svg>
  );
};

export default function TruthEngine() {
  const [selected, setSelected] = useState(properties[0]);
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, [selected]);

  const gap = selected.advertised - selected.trueValue;
  const gapPct = ((gap / selected.advertised) * 100).toFixed(1);
  const totalHidden = Object.values(selected.hiddenCosts).reduce(
    (a: number, b: number) => a + b,
    0
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#08081a',
        fontFamily: "'Syne', 'Space Grotesk', sans-serif",
        color: '#e8e8f0',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0d0d24; } ::-webkit-scrollbar-thumb { background: #2a2a4a; }
        .prop-card { background: #0f0f28; border: 1px solid #1e1e40; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.2s; }
        .prop-card:hover { border-color: #3a3a6a; background: #12122e; }
        .prop-card.active { border-color: #5b5bf0; background: #13133a; }
        .tab-btn { background: none; border: none; color: #666; font-family: inherit; font-size: 13px; font-weight: 700; letter-spacing: 1px; padding: 8px 16px; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab-btn.active { color: #7c7cf8; border-color: #7c7cf8; }
        .metric-box { background: #0c0c22; border: 1px solid #1a1a3a; border-radius: 10px; padding: 16px; }
        .bar-bg { background: #1a1a3a; border-radius: 99px; height: 6px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }
        .reveal { opacity: 0; transform: translateY(10px); animation: fadeUp 0.4s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        input { outline: none; }
        input::placeholder { color: #3a3a5a; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: '#0b0b20',
          borderBottom: '1px solid #1a1a3a',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 60,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #5b5bf0, #c84bff)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 14 }}>⚡</span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: '#fff',
                }}
              >
                SATYAM
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 3,
                  color: '#5b5bf0',
                  fontWeight: 600,
                }}
              >
                REAL ESTATE TRUTH ENGINE
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              background: '#0f0f28',
              border: '1px solid #1e1e40',
              borderRadius: 8,
              padding: '8px 14px',
              width: 260,
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#3a3a5a', fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project, builder, area..."
              style={{
                background: 'none',
                border: 'none',
                color: '#e8e8f0',
                fontSize: 13,
                width: '100%',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className="pulse"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#00C896',
                display: 'inline-block',
              }}
            ></span>
            <span
              style={{
                fontSize: 11,
                color: '#00C896',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              LIVE DATA
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: 20,
        }}
      >
        {/* Left sidebar */}
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              color: '#4a4a7a',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            ANALYSED PROJECTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {properties.map((p) => (
              <div
                key={p.id}
                className={`prop-card ${selected.id === p.id ? 'active' : ''}`}
                onClick={() => setSelected(p)}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{ fontSize: 11, color: '#5a5a8a', marginBottom: 10 }}
                >
                  {p.location}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: '#4a4a7a' }}>LISTED</div>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: '#ccc' }}
                    >
                      {fmtCr(p.advertised)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#4a4a7a' }}>
                      TRUE VALUE
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: p.verdictColor,
                      }}
                    >
                      {fmtCr(p.trueValue)}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      background: p.verdictColor + '22',
                      color: p.verdictColor,
                      border: `1px solid ${p.verdictColor}44`,
                      padding: '2px 10px',
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {p.verdict.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#5a5a8a',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {p.builderScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div
            style={{
              marginTop: 20,
              background: '#0c0c22',
              border: '1px solid #1a1a3a',
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: '#4a4a7a',
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              DATA SOURCES
            </div>
            {[
              'RERA Portal',
              'SRO Records',
              'Court Databases',
              'Satellite Imagery',
              'Municipal Records',
              '500+ Buyer Reviews',
            ].map((s: string) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#5b5bf0',
                  }}
                ></div>
                <span style={{ fontSize: 11, color: '#6a6a9a' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.3s' }}>
          {/* Hero verdict bar */}
          <div
            style={{
              background: `linear-gradient(135deg, #0f0f28, ${selected.verdictColor}11)`,
              border: `1px solid ${selected.verdictColor}33`,
              borderRadius: 14,
              padding: '20px 24px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: '#5a5a8a',
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                TRUTH REPORT ·{' '}
                {new Date()
                  .toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 4,
                }}
              >
                {selected.name}
              </div>
              <div style={{ fontSize: 13, color: '#6a6a9a' }}>
                {selected.builder} · {selected.location} · {selected.type}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 11,
                  color: '#5a5a8a',
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                VERDICT
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: selected.verdictColor,
                }}
              >
                {selected.verdict}
              </div>
            </div>
          </div>

          {/* Key numbers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: 'LISTED PRICE',
                value: fmtCr(selected.advertised),
                sub: 'Builder asking',
                color: '#888',
              },
              {
                label: 'TRUE MARKET VALUE',
                value: fmtCr(selected.trueValue),
                sub: `${gapPct}% ${gap > 0 ? 'overpriced' : 'underpriced'}`,
                color: selected.verdictColor,
              },
              {
                label: 'HIDDEN COSTS',
                value: fmtCr(totalHidden),
                sub: 'Stamp + GST + Misc',
                color: '#FFB800',
              },
              {
                label: 'TOTAL OUTFLOW',
                value: fmtCr(selected.advertised + totalHidden),
                sub: 'True cost of ownership',
                color: '#c84bff',
              },
            ].map((m, i) => (
              <div
                key={i}
                className="metric-box reveal"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: m.color,
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: '#5a5a8a', marginTop: 4 }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div
            style={{
              borderBottom: '1px solid #1a1a3a',
              marginBottom: 16,
              display: 'flex',
            }}
          >
            {['overview', 'builder', 'legal', 'financials', 'locality'].map(
              (t: string) => (
                <button
                  key={t}
                  className={`tab-btn ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              )
            )}
          </div>

          {/* Tab: Overview */}
          {tab === 'overview' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              {/* Price Analysis */}
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  PRICE TREND (8-MONTH)
                </div>
                <MiniChart data={selected.priceHistory} color="#5b5bf0" />
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 10, color: '#5a5a8a' }}>
                      Similar sales avg
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#00C896',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      {fmtCr(
                        selected.similarSales.reduce((a: number, b: number) => a + b, 0) /
                          selected.similarSales.length
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#5a5a8a' }}>
                      Price gap
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: selected.verdictColor,
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      {gap > 0 ? '+' : ''}
                      {fmtCr(gap)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Matrix */}
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  RISK MATRIX
                </div>
                {[
                  {
                    label: 'Delay Risk',
                    value: selected.delayRisk,
                    pct: selected.delayPercent,
                  },
                  { label: 'Legal Risk', value: selected.legalRisk },
                  { label: 'Water Risk', value: selected.waterRisk },
                  {
                    label: 'Infra Score',
                    value:
                      selected.infraScore > 7
                        ? 'Low'
                        : selected.infraScore > 5
                        ? 'Medium'
                        : 'High',
                  },
                ].map((r: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#9a9abf' }}>
                      {r.label}
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      {r.pct && (
                        <span
                          style={{
                            fontSize: 11,
                            color: '#5a5a8a',
                            fontFamily: 'JetBrains Mono',
                          }}
                        >
                          {r.pct}%
                        </span>
                      )}
                      <RiskBadge level={r.value} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Costs Breakdown */}
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  HIDDEN COSTS BREAKDOWN
                </div>
                {Object.entries(selected.hiddenCosts).map(([k, v]: [string, any], i: number) => {
                  const labels: Record<string, string> = {
                    stampDuty: 'Stamp Duty',
                    gst: 'GST',
                    registration: 'Registration',
                    maintenance: 'Maintenance Deposit',
                    plc: 'PLC Charges',
                  };
                  const pct = (v / totalHidden) * 100;
                  return (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#9a9abf' }}>
                          {labels[k]}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: '#ccc',
                            fontFamily: 'JetBrains Mono',
                          }}
                        >
                          {fmt(v)}
                        </span>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: `hsl(${220 + i * 30}, 70%, 60%)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div
                  style={{
                    borderTop: '1px solid #1a1a3a',
                    marginTop: 12,
                    paddingTop: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: '#FFB800' }}
                  >
                    Total Hidden
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#FFB800',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {fmtCr(totalHidden)}
                  </span>
                </div>
              </div>

              {/* Negotiation Intelligence */}
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  NEGOTIATION INTELLIGENCE
                </div>
                <div
                  style={{
                    background: '#0a0a20',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#5b5bf0',
                      marginBottom: 6,
                      fontWeight: 700,
                    }}
                  >
                    AI RECOMMENDATION
                  </div>
                  <div
                    style={{ fontSize: 12, color: '#b0b0d0', lineHeight: 1.6 }}
                  >
                    {gap > 0
                      ? `Listed ${gapPct}% above true market value. Counter at ${fmtCr(
                          selected.trueValue
                        )} — this is the 6-month median of similar sales in this building.`
                      : `This property is listed below true value. Market data supports buying near ask price.`}
                  </div>
                </div>
                <div
                  style={{ fontSize: 11, color: '#4a4a7a', marginBottom: 8 }}
                >
                  SIMILAR RECENT SALES
                </div>
                {selected.similarSales.map((s: number, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid #1a1a3a',
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#7a7a9a' }}>
                      Unit {i + 1} (same floor type)
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#00C896',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      {fmtCr(s)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Builder */}
          {tab === 'builder' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div
                className="metric-box"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                  }}
                >
                  BUILDER TRUST SCORE
                </div>
                <ScoreArc score={selected.builderScore} />
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  {selected.builder}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#7a7a9a',
                    textAlign: 'center',
                  }}
                >
                  Based on delivery track record, court disputes, RERA
                  compliance, and buyer sentiment
                </div>
              </div>

              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  RERA & COMPLIANCE
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    RERA Number
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono',
                      color: '#ccc',
                    }}
                  >
                    {selected.rera.slice(0, 20)}...
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    RERA Compliant
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: selected.reraCompliant ? '#00C896' : '#FF2D55',
                    }}
                  >
                    {selected.reraCompliant ? '✓ YES' : '✗ NO'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Escrow Health
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        selected.escrowHealth > 70
                          ? '#00C896'
                          : selected.escrowHealth > 50
                          ? '#FFB800'
                          : '#FF2D55',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {selected.escrowHealth}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Active Disputes
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color:
                        selected.disputes === 0
                          ? '#00C896'
                          : selected.disputes < 3
                          ? '#FFB800'
                          : '#FF2D55',
                    }}
                  >
                    {selected.disputes} cases
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Promised Completion
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: '#ccc' }}
                  >
                    {selected.completionDate}
                  </span>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 11, color: '#5a5a8a' }}>
                      Delay probability
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                        color:
                          selected.delayPercent > 60
                            ? '#FF2D55'
                            : selected.delayPercent > 30
                            ? '#FFB800'
                            : '#00C896',
                      }}
                    >
                      {selected.delayPercent}%
                    </span>
                  </div>
                  <div className="bar-bg">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${selected.delayPercent}%`,
                        background:
                          selected.delayPercent > 60
                            ? '#FF2D55'
                            : selected.delayPercent > 30
                            ? '#FFB800'
                            : '#00C896',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Financials */}
          {tab === 'financials' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  RENTAL YIELD ANALYSIS
                </div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      color:
                        selected.rentalYield > 4
                          ? '#00C896'
                          : selected.rentalYield > 3
                          ? '#FFB800'
                          : '#FF6B35',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {selected.rentalYield}%
                  </div>
                  <div style={{ fontSize: 12, color: '#6a6a9a', marginTop: 8 }}>
                    Annual rental yield (market actual)
                  </div>
                </div>
                <div
                  style={{
                    background: '#0a0a20',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: '#5a5a8a', marginBottom: 6 }}
                  >
                    Builder's promised yield
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#FF6B35',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {(selected.rentalYield + 1.2).toFixed(1)}%{' '}
                    <span style={{ fontSize: 12, color: '#5a5a8a' }}>
                      (inflated)
                    </span>
                  </div>
                </div>
              </div>

              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  5-YEAR PROJECTION
                </div>
                {[
                  {
                    label: 'Projected Value (5yr)',
                    value: fmtCr(selected.trueValue * 1.35),
                    color: '#5b5bf0',
                  },
                  {
                    label: 'Annual Rent Income',
                    value: fmt(
                      (selected.trueValue * selected.rentalYield) / 100
                    ),
                    color: '#00C896',
                  },
                  {
                    label: 'Break-even Horizon',
                    value: `${Math.round(100 / selected.rentalYield)} years`,
                    color: '#FFB800',
                  },
                  {
                    label: 'Capital Appreciation',
                    value: '6-8% p.a.',
                    color: '#c84bff',
                  },
                ].map((r: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: i < 3 ? '1px solid #1a1a3a' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 12, color: '#9a9abf' }}>
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: r.color,
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Legal */}
          {tab === 'legal' && (
            <div className="metric-box">
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: '#4a4a7a',
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                LEGAL DUE DILIGENCE REPORT
              </div>
              {[
                {
                  check: 'Title Chain Verified',
                  status: selected.legalRisk === 'Low',
                  note: '7-generation title search clean',
                },
                {
                  check: 'Encumbrance Certificate',
                  status: selected.legalRisk !== 'High',
                  note: 'No active mortgages or liens detected',
                },
                {
                  check: 'Land Use (Zoning)',
                  status: true,
                  note: 'Residential zoning confirmed with BBMP/BDA',
                },
                {
                  check: 'Court Litigation',
                  status: selected.disputes < 3,
                  note: `${selected.disputes} active consumer disputes found`,
                },
                {
                  check: 'RERA Compliance',
                  status: selected.reraCompliant,
                  note: selected.reraCompliant
                    ? 'Filing up to date'
                    : '⚠ Non-compliant — high risk',
                },
                {
                  check: 'Occupation Certificate',
                  status: selected.legalRisk === 'Low',
                  note: 'OC status pending (project under construction)',
                },
              ].map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: i < 5 ? '1px solid #1a1a3a' : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: item.status ? '#00C89622' : '#FF2D5522',
                      border: `1px solid ${
                        item.status ? '#00C896' : '#FF2D55'
                      }44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>
                      {item.status ? '✓' : '✗'}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: item.status ? '#fff' : '#FF6B6B',
                        marginBottom: 4,
                      }}
                    >
                      {item.check}
                    </div>
                    <div style={{ fontSize: 12, color: '#6a6a9a' }}>
                      {item.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Locality */}
          {tab === 'locality' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  INFRASTRUCTURE SCORE
                </div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 800,
                      fontFamily: 'JetBrains Mono',
                      color:
                        selected.infraScore > 7
                          ? '#00C896'
                          : selected.infraScore > 5
                          ? '#FFB800'
                          : '#FF2D55',
                    }}
                  >
                    {selected.infraScore}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a5a8a' }}>
                    out of 10
                  </div>
                </div>
                {[
                  {
                    label: 'Metro Connectivity',
                    score: selected.infraScore * 0.9 + 1,
                  },
                  {
                    label: 'Road Quality',
                    score: selected.infraScore * 1.1 - 0.5,
                  },
                  {
                    label: 'School Access',
                    score: selected.infraScore * 0.85 + 1.5,
                  },
                  { label: 'Hospital Access', score: selected.infraScore },
                ].map((r: any, i: number) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 11, color: '#9a9abf' }}>
                        {r.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: '#ccc',
                          fontFamily: 'JetBrains Mono',
                        }}
                      >
                        {Math.min(10, parseFloat(r.score.toFixed(1)))}
                      </span>
                    </div>
                    <div className="bar-bg">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.min(100, r.score * 10)}%`,
                          background: '#5b5bf0',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="metric-box">
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: '#4a4a7a',
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  WATER & ENVIRONMENT
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Water Availability
                  </span>
                  <RiskBadge
                    level={
                      selected.waterRisk === 'Low' ? 'Low' : selected.waterRisk
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Flood Zone
                  </span>
                  <RiskBadge level="Low" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #1a1a3a',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Air Quality Index
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#FFB800',
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    AQI 87
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                  }}
                >
                  <span style={{ fontSize: 12, color: '#9a9abf' }}>
                    Green Cover
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: '#00C896' }}
                  >
                    22% within 1km
                  </span>
                </div>
                <div
                  style={{
                    background: '#0a0a20',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#5b5bf0',
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    SATELLITE ANALYSIS
                  </div>
                  <div
                    style={{ fontSize: 12, color: '#7a7a9a', lineHeight: 1.6 }}
                  >
                    {selected.waterRisk === 'High'
                      ? '⚠ Low water table detected. Area experienced supply disruptions in 2023 summer. Verify tanker dependency.'
                      : 'Water infrastructure appears stable. Civic supply lines active and no major disruption history.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
