# 2–3 Minute Video Demo Script & Walkthrough

**Title**: AI-Native Trading Research Platform Demo  
**Duration**: 2 minutes 45 seconds  
**Speaker**: Candidate  

---

### [0:00 - 0:30] Introduction & The Problem Statement
**Visual**: Open browser on the clean, dark-mode landing screen showing the prompt box: *"Does buying NIFTY after a sharp fall work?"*

> **Audio / Script**:  
> *"Hello! Today, I'm presenting my submission for the AI Full-Stack Developer challenge: an AI-native trading research platform designed to turn ambiguous trader curiosity into rigorous, falsifiable scientific research.*  
>  
> *When a user asks: 'Does buying NIFTY after a sharp fall work?', standard LLMs either give a generic hand-waving answer or blindly assume numbers without telling the user. Our platform takes a completely different path: Question → Clarify → Define → Test → Learn."*

---

### [0:30 - 1:10] Step 1 & 2: Ask & Clarify (Exposing the Ambiguity)
**Visual**: Click 'Investigate Question'. The screen transitions into the **Clarify** view. Highlight the badge matrix and the toggleable assumption sliders.

> **Audio / Script**:  
> *"The moment we submit the question, our system decomposes the query into what the user actually said versus what the system had to assume.*  
>  
> *Notice here: 'sharp fall' is mathematically undefined. The system transparently flags this with an 'AI Assumed' badge, proposing a baseline of a 1-day decline of $\ge 1.5\%$, entered at the next morning's market open to eliminate look-ahead bias, held for 5 trading sessions, with realistic slippage of 8 basis points.*  
>  
> *The user can adjust the drop threshold, holding duration, or execution timing with zero cognitive friction."*

---

### [1:10 - 1:45] Step 3: Define (The Formal Research Canvas)
**Visual**: Click 'Formulate Experiment'. Show the structured Experiment Canvas with the formal scientific hypothesis, condition, entry, exit, test period, and cost models.

> **Audio / Script**:  
> *"Next, the system formalizes this into an institutional-grade research card. It states the exact falsifiable hypothesis, universe, entry signal, exit mechanics, and testing window.*  
>  
> *Nothing is black-box. Every variable is explicit and ready for empirical verification."*

---

### [1:45 - 2:20] Step 4: Test (10-Year Real Historical Backtest)
**Visual**: Click 'Run Backtest'. An interactive equity curve and drawdown chart appear instantly, comparing the Strategy vs the NIFTY 50 Buy & Hold benchmark from 2016 to 2026.

> **Audio / Script**:  
> *"When we click 'Run Backtest', the client-side deterministic engine runs across 2,467 real historical trading days of NIFTY 50 from 2016 through 2026—capturing the COVID crash, bull runs, and rate-hiking cycles.*  
>  
> *We immediately see the equity curve, win rate (approx 63%), profit factor, maximum drawdown, and an expandable trade-by-trade log with execution dates and percentage returns. Notice how the strategy stays in cash during extended consolidations, preserving capital."*

---

### [2:20 - 2:45] Step 5: Learn & Iterate (Facts vs Conjectures)
**Visual**: Scroll down to the **Learn** panel. Highlight the dual columns: 'What Data Shows' vs 'What We Can Conclude', and click a 'Next Hypothesis' card.

> **Audio / Script**:  
> *"Finally, the most critical part: the Learn panel.*  
> *We strictly enforce an epistemic boundary: on the left is 'What the data actually shows'—objective metrics and drawdown stats. On the right is 'What we can reasonably conclude'—our interpretation, with explicit warnings about look-ahead bias and market regime dependence.*  
>  
> *Best of all, research doesn't stop here. The system recommends logical next hypotheses—such as adding a 200-day moving average filter or dynamic profit targets. Clicking any suggestion immediately updates the canvas and reruns the test!*  
>  
> *This completes the loop from curious question to empirical learning. Thank you!"*
