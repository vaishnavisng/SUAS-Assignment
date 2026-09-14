import React, { useState } from 'react';

export default function EquityChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) return null;

  // Downsample if more than 300 points for crisp SVG rendering
  const step = Math.max(1, Math.floor(data.length / 280));
  const points = [];
  for (let i = 0; i < data.length; i += step) {
    points.push(data[i]);
  }
  // Always include last bar
  if (points[points.length - 1] !== data[data.length - 1]) {
    points.push(data[data.length - 1]);
  }

  // Find min and max across strategy and benchmark
  let minVal = Infinity;
  let maxVal = -Infinity;

  points.forEach(p => {
    if (p.strategyEquity < minVal) minVal = p.strategyEquity;
    if (p.strategyEquity > maxVal) maxVal = p.strategyEquity;
    if (p.benchmarkEquity < minVal) minVal = p.benchmarkEquity;
    if (p.benchmarkEquity > maxVal) maxVal = p.benchmarkEquity;
  });

  // Give 8% padding
  const padding = (maxVal - minVal) * 0.08 || 1000;
  const yMin = Math.max(0, minVal - padding);
  const yMax = maxVal + padding;

  const width = 800;
  const height = 280;
  const chartPadding = { top: 20, right: 30, bottom: 30, left: 60 };
  const innerWidth = width - chartPadding.left - chartPadding.right;
  const innerHeight = height - chartPadding.top - chartPadding.bottom;

  const getX = (idx) => chartPadding.left + (idx / (points.length - 1)) * innerWidth;
  const getY = (val) => chartPadding.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;

  // Build SVG path strings
  let strategyPath = '';
  let benchmarkPath = '';

  points.forEach((p, idx) => {
    const x = getX(idx);
    const yStrat = getY(p.strategyEquity);
    const yBench = getY(p.benchmarkEquity);

    if (idx === 0) {
      strategyPath += `M ${x} ${yStrat}`;
      benchmarkPath += `M ${x} ${yBench}`;
    } else {
      strategyPath += ` L ${x} ${yStrat}`;
      benchmarkPath += ` L ${x} ${yBench}`;
    }
  });

  // Gradient area under strategy
  const firstX = getX(0);
  const lastX = getX(points.length - 1);
  const bottomY = chartPadding.top + innerHeight;
  const strategyArea = `${strategyPath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // Grid lines
  const gridLines = [0.25, 0.5, 0.75].map(ratio => {
    const val = yMin + ratio * (yMax - yMin);
    const y = getY(val);
    return { val: Math.round(val), y };
  });

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : lastX;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Growth of ₹1,00,000 Capital (2016 – 2026)
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comparing Strategy performance vs NIFTY 50 Buy & Hold benchmark
          </p>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot strategy"></span>
            <span style={{ color: 'var(--font-accent)', fontWeight: 600 }}>
              Strategy: ₹{activePoint.strategyEquity.toLocaleString()}
            </span>
          </div>
          <div className="legend-item">
            <span className="legend-dot benchmark"></span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Buy & Hold: ₹{activePoint.benchmarkEquity.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= chartPadding.left && relX <= width - chartPadding.right) {
              const fraction = (relX - chartPadding.left) / innerWidth;
              const idx = Math.min(points.length - 1, Math.max(0, Math.round(fraction * (points.length - 1))));
              setHoverIndex(idx);
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="stratGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-strategy, #10b981)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--chart-strategy, #10b981)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={chartPadding.left}
                y1={g.y}
                x2={width - chartPadding.right}
                y2={g.y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={chartPadding.left - 8}
                y={g.y + 4}
                fill="#64748b"
                fontSize="9"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                ₹{(g.val / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Fill under Strategy */}
          <path d={strategyArea} fill="url(#stratGradient)" />

          {/* Benchmark line (grey dashed) */}
          <path
            d={benchmarkPath}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.8"
            strokeDasharray="3 3"
          />

          {/* Strategy line (accent solid) */}
          <path
            d={strategyPath}
            fill="none"
            stroke="var(--chart-strategy, #10b981)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover crosshair line */}
          {hoverIndex !== null && (
            <line
              x1={activeX}
              y1={chartPadding.top}
              x2={activeX}
              y2={bottomY}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeDasharray="2 2"
            />
          )}

          {/* X Axis Labels */}
          <text
            x={chartPadding.left}
            y={height - 8}
            fill="#64748b"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {points[0].date}
          </text>
          <text
            x={width / 2}
            y={height - 8}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
          >
            {points[Math.floor(points.length / 2)].date}
          </text>
          <text
            x={width - chartPadding.right}
            y={height - 8}
            fill="#64748b"
            fontSize="10"
            textAnchor="end"
            fontFamily="var(--font-mono)"
          >
            {points[points.length - 1].date}
          </text>
        </svg>

        {hoverIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: `${Math.min(75, Math.max(15, (activeX / width) * 100))}%`,
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--border-focus)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.75rem',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{activePoint.date}</div>
            <div style={{ color: 'var(--font-accent)', fontWeight: 600 }}>Strategy: ₹{activePoint.strategyEquity.toLocaleString()}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Buy & Hold: ₹{activePoint.benchmarkEquity.toLocaleString()}</div>
            <div style={{ color: activePoint.drawdownPct < 0 ? '#f43f5e' : 'var(--success)', fontSize: '0.7rem', marginTop: '2px' }}>
              Drawdown: {activePoint.drawdownPct}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
