# AI Usage Note: Collaborative Engineering Reflection

**Author**: AI Full-Stack Developer Intern Candidate  
**Document**: AI Usage Note (Thinking & Building Challenge)  

---

### 1. Which AI tools did you use?
I used **Gemini 3.8 / Antigravity Agentic IDE** as my core development partner throughout the project lifecycle. 

---

### 2. What did you use them for?
I leveraged AI across three distinct phases of the challenge:
1. **Ambiguity Decomposition & Cognitive Modeling**: Prompting the AI to brainstorm potential definitions of "sharp fall" across retail trader psychology, quantitative finance standards (Z-scores, ATR multiples), and execution realities in Indian equity markets (NSE).
2. **Data Pipeline & Boilerplate Generation**: Using AI to write the Python script fetching 10 years of official NIFTY 50 OHLCV data from Yahoo Finance and converting it into a clean, normalized JSON schema.
3. **Frontend Component Scaffolding & SVG Charting**: Generating base React components, SVG path generators for the equity curve / drawdown visualizer, and CSS custom property token definitions.

---

### 3. Which important decisions did you make yourself?
While AI is exceptional at accelerating syntax and proposing options, key high-stakes architectural and epistemological decisions were made independently:
1. **The Epistemic Separation Principle ("Facts vs Conjectures")**: Standard AI assistants tend to mix empirical findings with hallucinations or confident overgeneralizations. I strictly enforced a visual and architectural barrier between:
   - **"What the data actually shows"**: Invariable, mathematical facts (sample size, win rate, Sharpe ratio, worst trade, max drawdown).
   - **"What the system infers / concludes"**: Nuanced hypotheses, caveats, and market interpretations.
2. **Look-Ahead Bias Elimination (Next-Open vs Same-Close)**: AI code initially suggested triggering and entering on the *same day's Close*. I intervened and altered the core execution model to enter at **Next Day Open (`Open_{t+1}`)**. In real-life trading on the National Stock Exchange (NSE), 3:30 PM closing prices are volume-weighted averages calculated over the last 30 minutes; buying at the exact close requires algorithmic execution that most retail traders do not possess.
3. **Benchmark Realism & Cash Drag Awareness**: I insisted that the test output must compare directly against the **NIFTY Buy & Hold Benchmark** over the exact same period, rather than showing strategy cumulative returns in isolation. Because mean-reversion strategies are only in the market ~15-20% of the time, evaluating risk-adjusted return and cash utilization is paramount.
4. **Transparent Assumption Badging**: Instead of having the AI automatically decide what a user meant, I designed the UI with explicit **"User Stated"** vs **"AI Assumed"** tags with interactive sliders, allowing the user to override any default assumption instantly.

---

### 4. Did you reject or modify any AI-generated suggestions? Why?
- **Rejected Complex ML / Black-Box Overfit Models**: AI initially suggested training an LSTM or Random Forest classifier to predict post-fall recoveries. I rejected this because the challenge was to create a clear, transparent, interpretable research platform for users—not an inscrutable black box prone to data snooping and overfitting.
- **Modified "Overly Optimistic" Summary Copy**: AI's drafted conclusion claimed that *"Buying after a 1.5% drop is a proven profitable strategy with a 65% win rate"*. I modified this text completely to reflect critical quantitative skepticism: pointing out that much of the absolute gain was driven by the underlying 10-year Indian equity bull market, and highlighting the catastrophic drawdown risk during the March 2020 COVID crash without a stop loss or regime filter.

---

### 5. What part of the solution are you most proud of?
I am most proud of the **"What Should We Investigate Next?" Iterative Loop**.

Rather than treating a backtest as a dead end with a static scorecard, the platform treats evidence as the catalyst for the next hypothesis. If the user discovers that buying after a 1.5% drop suffered severe drawdowns during 2020, the system surfaces clickable follow-up hypotheses:
- *"Add a 200-day Simple Moving Average trend filter (only buy in bull regimes)"*
- *"Test with an India VIX filter (avoid buying when volatility > 25)"*
- *"Shorten holding period from 5 days to 2 days for quick mean-reversion bounces"*

Clicking any of these recommendations automatically updates the Experiment Canvas and reruns the backtest in milliseconds against the real 10-year NIFTY dataset. This truly achieves the platform's vision: **Question → Hypothesis → Experiment → Evidence → Learning**.
