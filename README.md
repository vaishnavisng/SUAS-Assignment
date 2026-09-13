# NIFTY AlphaLab: AI-Native Trading Research Platform

An AI-native trading research platform that guides users from ambiguous trading questions into rigorous, empirical, and falsifiable research experiments on Indian equities (NIFTY 50).

> **Core Research Flow**: Question → Hypothesis → Experiment → Evidence → Learning

---

## 1. Overview & The Problem

When a user asks:
> *"Does buying NIFTY after a sharp fall work?"*

Traditional AI platforms either provide generic, superficial answers or silently guess parameters without making them visible to the user. 

**NIFTY AlphaLab** solves this by establishing a disciplined quantitative research workflow:
1. **ASK**: Accepts natural language questions or curated research queries.
2. **CLARIFY**: Decomposes the question into **What the user actually said** vs **What the system assumed**, providing interactive controls to refine thresholds, execution timing, holding horizons, and filters.
3. **DEFINE**: Synthesizes the clarified parameters into a formal, falsifiable scientific hypothesis and institutional research canvas.
4. **TEST**: Runs a deterministic backtest against **10 years of real historical NIFTY 50 daily data (2016–2026, 2,467 trading sessions)**, generating interactive equity curves, drawdown benchmarks, and trade logs with realistic transaction frictions.
5. **LEARN**: Strictly enforces an epistemic boundary between **"What the data actually shows"** (empirical mathematical facts) and **"What we can reasonably conclude"** (inferences, caveats, look-ahead bias, regime shifts) — and surfaces 1-click **iterative follow-up hypotheses**.

---

## 2. Architecture

```
                       [User Prompt]
                             │
                             ▼
                    ┌─────────────────┐
                    │ 1. ASK Step     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 2. CLARIFY Step │ <── Ambiguity Matrix & Assumption Controls
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 3. DEFINE Step  │ <── Formal Scientific Hypothesis Canvas
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ 4. TEST Step    │ <── 10-Yr Historical NIFTY 50 Dataset
                    └────────┬────────┘     (Deterministic In-Browser Backtester)
                             │
                             ▼
                    ┌─────────────────┐
                    │ 5. LEARN Step   │ <── Dual-Layer Epistemic Synthesis
                    └────────┬────────┘     (Facts vs Inferences & Follow-up Loops)
                             │
                             └────────────> Re-feeds into 3 / 4 (Iterative Cycle)
```

### Key Modules:
- **`src/engine/researchInterpreter.js`**: Natural language parser, ambiguity mapper, and epistemic learning generator.
- **`src/engine/backtester.js`**: Deterministic simulation engine computing compounded equity, Buy & Hold benchmark comparisons, Sharpe ratios, maximum drawdowns, trade logs, and moving average trend filters.
- **`src/data/niftyData.js`**: 10-year daily historical OHLCV data of NIFTY 50 (from 2016 to 2026), capturing demonetization, the COVID-19 crash, post-pandemic recovery, and 2024–2026 all-time highs.
- **`src/components/EquityChart.jsx`**: High-performance SVG visualizer with hover crosshairs, comparison against Buy & Hold, and drawdown tracking.

---

## 3. Technology Choices

- **Frontend**: **React 18** with **Vite 6** for near-instant development reloading and sub-second production builds.
- **Styling**: Pure **Vanilla CSS** with a custom dark-mode token system (`--bg-main`, `--accent-primary`, glassmorphism, glowing borders) adhering strictly to assignment guidelines against heavy utility frameworks.
- **Icons**: `lucide-react` for clean semantic iconography.
- **Visualization**: Custom SVG engine (`EquityChart.jsx`) ensuring dependency-free, responsive, high-performance rendering.
- **Data Pipeline**: Python script (`fetch_nifty.py`) utilizing official historical NIFTY 50 market data from Yahoo Finance.

---

## 4. Key Assumptions

| Parameter | System Assumption | Justification |
| :--- | :--- | :--- |
| **"Sharp Fall"** | Daily decline $\le -1.5\%$ | Standard deviation of NIFTY daily returns is $\approx 0.95\%$. A $-1.5\%$ drop represents a $\approx 1.6\sigma$ move, yielding sufficient sample size (~140 trades) without excessive noise. |
| **Execution Timing** | Next-Day Market Open (9:15 AM IST) | Prevents look-ahead bias. Retail traders cannot accurately execute at the 3:30 PM weighted closing price. |
| **Holding Period** | 5 Trading Days (1 Calendar Week) | Equity index mean-reversion tends to decay within 3–7 sessions. |
| **Transaction Drag** | 0.08% roundtrip (8 basis points) | Factors in Securities Transaction Tax (STT), exchange turnover fees, and bid-ask slippage. |
| **Capital & Sizing** | ₹1,00,000 initial capital | 100% position equity compounding; non-leveraged. |

---

## 5. How to Run the Project Locally

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer)

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. AI Tools Used & Collaboration

- **AI Tools**: Gemini 3.8 / Antigravity Agentic IDE.
- **How AI Was Leveraged**: Used for rapid ideation of edge-case market anomalies, drafting initial data parsing scripts, and accelerating SVG rendering logic.
- **Human Decisions**:
  1. Enforced strict separation between **"Empirical Facts"** and **"System Inferences"** to avoid AI hallucination.
  2. Fixed look-ahead bias by mandating **Next Day Open (`Open_{t+1}`)** execution instead of naive same-day close.
  3. Rejected complex ML black-box models in favor of interpretable quantitative research.
  4. Designed the 1-click **"What Should We Investigate Next?"** iterative feedback loop.

*(For full details, see [AI_USAGE_NOTE.md](file:///c:/Rishabh/assignment/AI_USAGE_NOTE.md))*

---

## 7. What Would You Improve with More Time?

1. **Intraday Tick & Hourly Granularity**: Expand from daily bars to 15-minute or 1-hour candles to model intraday panic selling and precise market-on-close execution.
2. **Options & Volatility Integration**: Incorporate India VIX directly into the signal engine to measure implied volatility spikes and simulate option-buying/selling payoffs.
3. **Multi-Asset & Sector Breadth**: Allow comparative testing across NIFTY Bank, NIFTY IT, and individual heavyweights (Reliance, HDFC Bank, TCS) to test if dip-buying works better on indices or single stocks.
4. **Monte Carlo Permutation Testing**: Run synthetic data shuffling to verify whether strategy returns are statistically distinguishable from pure random chance.

---

## Deliverables Checklist
- [x] **Working Web Prototype** (React + Vite + Vanilla CSS)
- [x] **[Thinking Note](file:///c:/Rishabh/assignment/THINKING_NOTE.md)** (Answering all 5 questions on interpretation, assumptions, and risks)
- [x] **[AI Usage Note](file:///c:/Rishabh/assignment/AI_USAGE_NOTE.md)** (Complete reflection answering the 5 evaluation criteria)
- [x] **[Demo Script](file:///c:/Rishabh/assignment/DEMO_SCRIPT.md)** (2–3 minute video presentation script)
- [x] **[README](file:///c:/Rishabh/assignment/README.md)** (Full architectural documentation and setup instructions)
