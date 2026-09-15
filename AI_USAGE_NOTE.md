# AI Usage Note: Collaborative Engineering Reflection

**Author**: Vaishnavi Singh  

---

### 1. Which AI tools did you use?
I used **Gemini 3.8 / Antigravity Agentic IDE** as a specialized assistant strictly for complex computational, analytical, and algorithmic tasks throughout the project.

---

### 2. What did you use them for? (Complex Tasks Only)
I intentionally restricted AI usage to **high-complexity, mathematically or analytically demanding tasks**, rather than mundane coding or unguided development:

1. **Vectorized Quantitative Algorithms & Financial Mathematics**:
   - Formulating vectorized time-series calculation algorithms for compounded equity curves, continuous maximum drawdown underwater series, rolling annualized Sharpe ratio math, and dynamic position holding state tracking across 2,467 trading sessions.
   - Modeling statistical significance thresholds to flag insufficient sample sizes ($N < 30$) based on standard error propagation.

2. **Complex SVG Geometry & Responsive Coordinate Transformations**:
   - Formulating the dynamic coordinate projection algorithms for the custom SVG chart engine (`EquityChart.jsx`), computing dynamic scale normalization across asymmetric domains (strategy return vs benchmark buy-and-hold vs drawdown depth), and calculating smooth multi-point polygon paths without external charting library dependencies.

3. **Multi-Dimensional Ambiguity Decomposition & Edge-Case Modeling**:
   - Decomposing the open-ended query *"Does buying NIFTY after a sharp fall work?"* across combinatorial market dimensions (evaluating retail trader psychology against quantitative indicators like ATR multiples, Z-scores, and NSE-specific market structure nuances).

---

### 3. Which important decisions did you make yourself? (Every Key Decision)
**Every important architectural, quantitative, methodological, and strategic decision was made entirely by me.** AI was never permitted to make executive or domain-level decisions; it functioned purely as a computational engine executing my specific design:

1. **End-to-End System Architecture & Research Workflow**:
   - I architected the 5-stage progressive disclosure pipeline: **Question (Ask) → Ambiguity Matrix (Clarify) → Scientific Canvas (Define) → Deterministic Engine (Test) → Epistemic Synthesis (Learn)**, ensuring users are never presented with uncalibrated results.

2. **The Epistemic Separation Principle ("Facts vs Conjectures")**:
   - I conceived and strictly enforced the foundational boundary separating:
     - **"What the data actually shows"**: Invariable, deterministic mathematical facts (sample size, win rate, Sharpe ratio, worst trade, max drawdown).
     - **"What we can reasonably conclude"**: Contextual hypotheses, regime dependencies, and market interpretations.
   - This prevents the common AI failure mode of blurring empirical evidence with hallucinated or subjective claims.

3. **Look-Ahead Bias Elimination (`Open_{t+1}` vs `Close_t`)**:
   - AI code initially drafted the execution model entering on the *same day's Close*. I identified this as a critical quantitative flaw (look-ahead bias) and intervened to mandate execution at **Next Day Open (`Open_{t+1}`)**. In real-world Indian equity markets (NSE), the 3:30 PM closing price is a volume-weighted average finalized after market close; retail traders cannot reliably execute at that exact price without algorithmic Market-On-Close facilities.

4. **Complete Quantitative Parameter & Cost Modeling**:
   - I established the baseline trigger threshold at **$\le -1.5\%$** by calculating that NIFTY daily standard deviation is $\approx 0.95\%$, making $-1.5\%$ a statistically meaningful $\approx 1.6\sigma$ event yielding robust sample sizes (~140 trades over 10 years).
   - I established the **5-day holding horizon** based on index mean-reversion cycle decay characteristics.
   - I instituted a realistic **0.08% round-trip transaction friction** (STT + exchange turnover + slippage) to eliminate the illusion of risk-free alpha.
   - I mandated benchmarking against **NIFTY 50 Buy & Hold** over the exact same window to account for cash drag and the underlying 10-year Indian bull market drift.

5. **Human Agency & Transparent Assumption-Badging**:
   - Rather than allowing the AI to silently guess user intent, I designed the UI with explicit **"User Stated"** vs **"AI Assumed"** badge tagging accompanied by interactive parameter sliders, ensuring the human researcher retains 100% override control over every variable.

6. **Iterative Hypothesis Feedback Engine**:
   - I designed the 1-click **"What Should We Investigate Next?"** loop (e.g., 200 SMA trend filters, India VIX volatility gates, holding period adjustments), transforming a static backtest into an active, continuous scientific learning cycle.

---

### 4. Did you reject or modify any AI-generated suggestions? Why?
Yes. Whenever AI generated suggestions that overstepped into decision-making or attempted black-box shortcuts, I rejected or overhauled them:

- **Rejected Complex ML / Black-Box Predictive Models**: AI initially suggested training an LSTM or Random Forest classifier to predict post-fall recoveries. I rejected this entirely because our objective was to build a transparent, interpretable, and falsifiable research platform—not an opaque black box susceptible to data-snooping and overfitting.
- **Overruled "Overly Optimistic" Summary Conclusions**: AI drafted a summary claiming that *"Buying after a 1.5% drop is a proven profitable strategy with a 65% win rate"*. I completely rewrote this to reflect quantitative rigor: pointing out that much of the absolute gain was attributable to the secular 10-year Indian bull market, and emphasizing the severe downside risk during cluster crashes (like March 2020) without a trend or regime filter.
- **Rejected Silent Parameter Inferences**: AI initially attempted to hide parameter derivations behind the scenes. I rejected this design and forced every single assumption into clear, exposed, user-editable controls.

---

### 5. What part of the solution are you most proud of?
I am most proud of designing the **Epistemic Integrity & Iterative Learning Architecture**.

By combining strict separation between objective data and subjective interpretation with an active follow-up hypothesis engine, the platform guarantees that the human researcher always understands *why* an outcome occurred and *what* to investigate next. The AI performs the heavy lifting of complex calculations and multidimensional ambiguity mapping, but every scientific conclusion, parameter override, and strategic decision remains firmly in human hands.
