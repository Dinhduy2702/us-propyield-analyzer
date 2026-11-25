(function () {
  "use strict";

  const THEME_KEY = "propyield_us_theme_v1";
  const STATE_KEY = "propyield_us_state_v1";
  const CONFIG = window.PROPYIELD_CONFIG;

  const TOOL_META = {
    rentbuy: {
      title: "2026 US Rent vs. Buy Break-Even Calculator",
      desc: "Compare buying a home against renting and investing your down payment in the S&P 500 — including 6% selling costs, property tax, maintenance, and rent inflation."
    },
    rental: {
      title: "Rental Property Cash Flow, Cap Rate & Reverse Max Offer",
      desc: "Underwrite any US rental property in seconds: NOI, Cap Rate, Cash-on-Cash Return, DSCR lender ratio, 1% Rule, and Reverse Max Offer Price."
    },
    brrrr: {
      title: "2026 BRRRR Deal & 75% LTV Refinance Analyzer",
      desc: "Simulate Buy, Rehab, Rent, and 75% LTV Cash-Out Refinance to see Cash Left in Deal, Post-Refi Cash Flow, DSCR, and Infinite Return — 100% free with zero paywall."
    }
  };

  const PRESETS = {
    rentbuy: [
      { label: "US Median ($450k vs $2.3k Rent)", set: { rbPrice: 450000, rbRent: 2300, rbYears: 10, rbDownPct: 20, rbApr: 6.5, rbApprec: 3.5, rbInvest: 8.0, rbRentGrow: 3.0, rbTaxMaint: 2.3, rbSellCost: 6.0 } },
      { label: "High-Cost Coastal ($850k vs $3.6k)", set: { rbPrice: 850000, rbRent: 3600, rbYears: 7, rbDownPct: 20, rbApr: 6.5, rbApprec: 4.0, rbInvest: 8.5, rbRentGrow: 3.5, rbTaxMaint: 2.1, rbSellCost: 6.0 } },
      { label: "Midwest Value ($310k vs $2.0k)", set: { rbPrice: 310000, rbRent: 2000, rbYears: 8, rbDownPct: 15, rbApr: 6.375, rbApprec: 3.5, rbInvest: 8.0, rbRentGrow: 3.0, rbTaxMaint: 2.4, rbSellCost: 6.0 } }
    ],
    rental: [
      { label: "Midwest Cash Flow ($280k · $2,650)", set: { rnPrice: 280000, rnRent: 2650, rnDownPct: 25, rnApr: 7.0, rnClosing: 8000, rnVacPct: 6, rnMaintPct: 10, rnMgmtPct: 8, rnTaxInsMo: 390, rnTerm: "30", rnTargetCoc: 8 } },
      { label: "Duplex House Hack ($390k · $3,900)", set: { rnPrice: 390000, rnRent: 3900, rnDownPct: 20, rnApr: 6.75, rnClosing: 10000, rnVacPct: 5, rnMaintPct: 10, rnMgmtPct: 8, rnTaxInsMo: 520, rnTerm: "30", rnTargetCoc: 10 } },
      { label: "Sunbelt Appreciation ($420k · $2,900)", set: { rnPrice: 420000, rnRent: 2900, rnDownPct: 25, rnApr: 7.125, rnClosing: 11000, rnVacPct: 6, rnMaintPct: 8, rnMgmtPct: 8, rnTaxInsMo: 560, rnTerm: "30", rnTargetCoc: 7 } }
    ],
    brrrr: [
      { label: "Textbook BRRRR ($175k -> $310k ARV)", set: { brPurchase: 175000, brRehab: 45000, brArv: 310000, brHolding: 9500, brLtv: 75, brRefiApr: 7.0, brRefiClosePct: 2.5, brRent: 2550, brExpPct: 40 } },
      { label: "Heavy Rehab ($130k -> $275k ARV)", set: { brPurchase: 130000, brRehab: 65000, brArv: 275000, brHolding: 11000, brLtv: 75, brRefiApr: 7.25, brRefiClosePct: 2.5, brRent: 2350, brExpPct: 42 } },
      { label: "Cosmetic Flip-Hold ($240k -> $345k)", set: { brPurchase: 240000, brRehab: 25000, brArv: 345000, brHolding: 8500, brLtv: 75, brRefiApr: 6.875, brRefiClosePct: 2.0, brRent: 2800, brExpPct: 38 } }
    ]
  };

  const RESULT_CTA_COPY = {
    rentbuy: {
      title: "Track Your Down Payment Fund & Net Worth Trajectory in Google Sheets",
      desc: "Pair PropYield US with the 2026 US Personal Finance & Wealth OS to build your home down payment faster."
    },
    rental: {
      title: "Track Rental Equity, CapEx Reserves & Total Net Worth in One Sheet",
      desc: "Keep property reserves, mortgage balances, and S&P 500 portfolios synced inside one Google Sheet."
    },
    brrrr: {
      title: "Track BRRRR Rehab Cash, Equity Pulled & Portfolio Net Worth",
      desc: "Combine your BRRRR properties with personal cash flow inside the 2026 US Personal Finance & Wealth OS."
    }
  };

  const SAVED_FIELDS = [
    "rbPrice", "rbRent", "rbYears", "rbDownPct", "rbApr", "rbApprec", "rbInvest", "rbRentGrow", "rbTaxMaint", "rbSellCost",
    "rnPrice", "rnRent", "rnDownPct", "rnApr", "rnClosing", "rnVacPct", "rnMaintPct", "rnMgmtPct", "rnTaxInsMo", "rnTerm", "rnTargetCoc",
    "brPurchase", "brRehab", "brArv", "brHolding", "brLtv", "brRefiApr", "brRefiClosePct", "brRent", "brExpPct"
  ];

  const URL_MAP = {
    rentbuy: { price: "rbPrice", rent: "rbRent", yrs: "rbYears", down: "rbDownPct", apr: "rbApr", appr: "rbApprec", inv: "rbInvest", rg: "rbRentGrow", tm: "rbTaxMaint", sell: "rbSellCost" },
    rental: { price: "rnPrice", rent: "rnRent", down: "rnDownPct", apr: "rnApr", close: "rnClosing", vac: "rnVacPct", maint: "rnMaintPct", mgmt: "rnMgmtPct", ti: "rnTaxInsMo", term: "rnTerm", tcoc: "rnTargetCoc" },
    brrrr: { buy: "brPurchase", rehab: "brRehab", arv: "brArv", hold: "brHolding", ltv: "brLtv", apr: "brRefiApr", rclose: "brRefiClosePct", rent: "brRent", exp: "brExpPct" }
  };

  let activeTool = "rentbuy";
  let lastSummaryText = "";
  let lastRbRows = [];
  let lastMaxOffer = 0;
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);

  function fmtUSD(n) {
    const val = Math.round(Number(n) || 0);
    return (val < 0 ? "-$" : "$") + Math.abs(val).toLocaleString("en-US");
  }

  function showToast(msg) {
    const box = $("toastBox");
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, 2600);
  }

  function downloadCsv(filename, headers, rows) {
    const lines = [headers.join(",")].concat(
      rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  }

  function calcMonthlyPI(loan, aprPct, termYears) {
    if (loan <= 0) return 0;
    const r = (aprPct / 100) / 12;
    const n = termYears * 12;
    return r > 0 ? (loan * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1) : loan / n;
  }

  function saveState() {
    const data = {};
    SAVED_FIELDS.forEach((id) => {
      const el = $(id);
      if (el) data[id] = el.value;
    });
    try { localStorage.setItem(STATE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      SAVED_FIELDS.forEach((id) => {
        const el = $(id);
        if (el && data[id] !== undefined) el.value = data[id];
      });
    } catch (_) {}
  }

  function buildShareUrl() {
    const params = new URLSearchParams();
    params.set("tab", activeTool);
    const map = URL_MAP[activeTool] || {};
    Object.entries(map).forEach(([k, id]) => {
      const el = $(id);
      if (el) params.set(k, el.value);
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const targetTab = TOOL_META[tabParam] ? tabParam : null;
    if (!targetTab) return null;
    const map = URL_MAP[targetTab] || {};
    Object.entries(map).forEach(([k, id]) => {
      if (params.has(k) && $(id)) $(id).value = params.get(k);
    });
    return targetTab;
  }

  function syncSliders() {
    $("rbPriceSlider").value = Math.min(1500000, Math.max(150000, Number($("rbPrice").value) || 150000));
  }

  /* TAB 1: RENT VS BUY BREAK-EVEN */
  function updateRentBuy() {
    const price = Math.max(50000, Number($("rbPrice").value) || 450000);
    const rent0 = Math.max(200, Number($("rbRent").value) || 2300);
    const years = Math.min(30, Math.max(1, Number($("rbYears").value) || 10));
    const downPct = Math.min(80, Math.max(3, Number($("rbDownPct").value) || 20));
    const apr = Math.max(0, Number($("rbApr").value) || 6.5);
    const apprec = Math.max(0, Number($("rbApprec").value) || 3.5) / 100;
    const investRet = Math.max(0, Number($("rbInvest").value) || 8.0) / 100;
    const rentGrow = Math.max(0, Number($("rbRentGrow").value) || 3.0) / 100;
    const taxMaint = Math.max(0, Number($("rbTaxMaint").value) || 2.3) / 100;
    const sellPct = Math.max(0, Number($("rbSellCost").value) || 6.0) / 100;

    $("rbPriceHint").textContent = fmtUSD(price);

    const downAmt = price * (downPct / 100);
    const buyClose = price * 0.03;
    const loan0 = price - downAmt;
    const pi = calcMonthlyPI(loan0, apr, 30);
    const rMo = (apr / 100) / 12;
    const invMo = investRet / 12;

    let homeVal = price;
    let loanBal = loan0;
    let renterPort = downAmt + buyClose;
    let buyerSidePort = 0; // If renting becomes MORE expensive than buying in later years, buyer invests the surplus
    let curRent = rent0;
    let breakEvenYr = null;
    const rows = [];

    for (let y = 1; y <= years; y++) {
      const annualCarry = homeVal * taxMaint;
      const monthlyCarry = annualCarry / 12;
      const pmiMo = (loanBal / price > 0.80 && downPct < 20) ? (loan0 * 0.0065) / 12 : 0;
      const monthlyBuyCost = pi + monthlyCarry + pmiMo;

      for (let m = 0; m < 12; m++) {
        const intr = loanBal * rMo;
        const prin = Math.min(loanBal, Math.max(0, pi - intr));
        loanBal = Math.max(0, loanBal - prin);

        const diff = monthlyBuyCost - curRent;
        if (diff >= 0) {
          renterPort = renterPort * (1 + invMo) + diff;
          buyerSidePort = buyerSidePort * (1 + invMo);
        } else {
          renterPort = renterPort * (1 + invMo);
          buyerSidePort = buyerSidePort * (1 + invMo) + Math.abs(diff);
        }
      }

      homeVal = homeVal * (1 + apprec);
      const buyNetWealth = Math.max(0, homeVal * (1 - sellPct) - loanBal) + buyerSidePort;
      const advantage = buyNetWealth - renterPort;
      if (advantage >= 0 && breakEvenYr === null) breakEvenYr = y;

      rows.push({ year: y, rent: curRent, buyNet: buyNetWealth, rentNet: renterPort, advantage });
      curRent = curRent * (1 + rentGrow);
    }

    lastRbRows = rows;
    const fin = rows[rows.length - 1];
    const yr1MonthlyBuy = pi + (price * taxMaint) / 12 + (downPct < 20 ? (loan0 * 0.0065) / 12 : 0);

    $("rbWinnerLabel").textContent = `Net Wealth Winner at Year ${years}`;
    if (fin.advantage >= 0) {
      $("rbWinnerVal").textContent = `Buying Wins (+${fmtUSD(fin.advantage)})`;
      $("rbWinnerSub").textContent = `Buying builds ${fmtUSD(fin.advantage)} more net wealth than renting + investing at ${(investRet * 100).toFixed(1)}%.`;
    } else {
      $("rbWinnerVal").textContent = `Renting Wins (+${fmtUSD(Math.abs(fin.advantage))})`;
      $("rbWinnerSub").textContent = `Renting + investing your down payment beats buying by ${fmtUSD(Math.abs(fin.advantage))} over ${years} years.`;
    }

    const badge = $("rbBreakEvenBadge");
    if (breakEvenYr !== null) {
      badge.className = "status-pill pass tabular";
      badge.textContent = `Break-Even: Year ${breakEvenYr}`;
    } else {
      badge.className = "status-pill warn tabular";
      badge.textContent = `No Break-Even in ${years} Yrs`;
    }

    $("rbBuyNet").textContent = fmtUSD(fin.buyNet);
    $("rbRentNet").textContent = fmtUSD(fin.rentNet);
    $("rbMonthlyBuy").textContent = `${fmtUSD(yr1MonthlyBuy)}/mo`;

    $("rbInsightBox").innerHTML = `<strong>Behavioral Reality Check:</strong> Renting only wins if you <em>actually invest</em> your ${fmtUSD(downAmt + buyClose)} upfront cash plus monthly savings every single month at ${(investRet * 100).toFixed(1)}%. If that cash sits in a checking account, buying wins much earlier through forced mortgage equity.`;

    const smartMtgUrl = `${CONFIG.ecosystem.smartMoneyUrl}?tab=mortgage&price=${Math.round(price)}&down=${downPct}&rate=${apr}`;
    $("rbBridgeBox").innerHTML = `
      <div>
        <strong>Want the Exact Monthly PITI &amp; Extra-Payment Payoff Schedule?</strong><br>
        Send this <strong>${fmtUSD(price)}</strong> home directly into SmartMoney US to model biweekly payoffs &amp; 28/36 affordability.
      </div>
      <a class="btn btn-primary btn-sm" href="${smartMtgUrl}" target="_blank" rel="noopener noreferrer" style="flex-shrink:0;">Open Mortgage PITI &rarr;</a>
    `;

    $("rbTableBody").innerHTML = rows.map((r) => {
      const advPill = r.advantage >= 0
        ? `<span class="status-pill pass">Buy +${fmtUSD(r.advantage)}</span>`
        : `<span class="status-pill warn">Rent +${fmtUSD(Math.abs(r.advantage))}</span>`;
      return `
        <tr class="${r.year === breakEvenYr ? "is-active-row" : ""}">
          <td>Year ${r.year}${r.year === breakEvenYr ? " · Break-Even" : ""}</td>
          <td>${fmtUSD(r.rent)}/mo</td>
          <td><strong>${fmtUSD(r.buyNet)}</strong></td>
          <td>${fmtUSD(r.rentNet)}</td>
          <td>${advPill}</td>
        </tr>
      `;
    }).join("");

    if (activeTool === "rentbuy") {
      lastSummaryText = `PropYield US Rent vs Buy (${fmtUSD(price)} home vs ${fmtUSD(rent0)}/mo rent, ${years} yrs): ${fin.advantage >= 0 ? "Buying" : "Renting"} wins by ${fmtUSD(Math.abs(fin.advantage))}.`;
    }
  }

  /* TAB 2: RENTAL PROPERTY CASH FLOW & REVERSE MAX OFFER */
  function evalRentalAtPrice(price, rent, downPct, apr, closing, vacPct, maintPct, mgmtPct, taxInsMo, termYrs) {
    const down = price * (downPct / 100);
    const loan = Math.max(0, price - down);
    const pi = calcMonthlyPI(loan, apr, termYrs);
    const totalCashIn = down + closing;

    const vacLoss = rent * (vacPct / 100);
    const effGross = rent - vacLoss;
    const maint = rent * (maintPct / 100);
    const mgmt = rent * (mgmtPct / 100);
    const totalOpEx = vacLoss + maint + mgmt + taxInsMo;
    const monthlyNoi = rent - totalOpEx;
    const annualNoi = monthlyNoi * 12;
    const monthlyCf = monthlyNoi - pi;
    const annualCf = monthlyCf * 12;
    const capRate = price > 0 ? (annualNoi / price) * 100 : 0;
    const coc = totalCashIn > 0 ? (annualCf / totalCashIn) * 100 : 0;
    const dscr = pi > 0 ? monthlyNoi / pi : 0;
    const onePctRatio = price > 0 ? (rent / price) * 100 : 0;

    return { down, loan, pi, totalCashIn, vacLoss, effGross, maint, mgmt, totalOpEx, monthlyNoi, annualNoi, monthlyCf, annualCf, capRate, coc, dscr, onePctRatio };
  }

  function updateRental() {
    const price = Math.max(20000, Number($("rnPrice").value) || 280000);
    const rent = Math.max(100, Number($("rnRent").value) || 2650);
    const downPct = Math.min(100, Math.max(5, Number($("rnDownPct").value) || 25));
    const apr = Math.max(0, Number($("rnApr").value) || 7.0);
    const closing = Math.max(0, Number($("rnClosing").value) || 8000);
    const vacPct = Math.max(0, Number($("rnVacPct").value) || 6);
    const maintPct = Math.max(0, Number($("rnMaintPct").value) || 10);
    const mgmtPct = Math.max(0, Number($("rnMgmtPct").value) || 8);
    const taxInsMo = Math.max(0, Number($("rnTaxInsMo").value) || 390);
    const termYrs = Number($("rnTerm").value) || 30;
    const targetCoc = Math.max(0.5, Number($("rnTargetCoc").value) || 8);

    const m = evalRentalAtPrice(price, rent, downPct, apr, closing, vacPct, maintPct, mgmtPct, taxInsMo, termYrs);

    $("rnCashFlow").textContent = `${fmtUSD(m.monthlyCf)}/mo`;
    $("rnAnnualCfSub").textContent = `Annual Cash Flow: ${fmtUSD(m.annualCf)} · Total Cash Invested: ${fmtUSD(m.totalCashIn)}`;
    $("rnCoc").textContent = `${m.coc.toFixed(1)}%`;
    $("rnCapRate").textContent = `${m.capRate.toFixed(1)}%`;
    $("rnDscr").textContent = `${m.dscr.toFixed(2)}x`;
    $("rnNoi").textContent = fmtUSD(m.annualNoi);

    const ruleBadge = $("rnRuleBadge");
    if (m.onePctRatio >= 0.95) {
      ruleBadge.className = "status-pill pass tabular";
      ruleBadge.textContent = `${m.onePctRatio.toFixed(2)}% Rule (Strong)`;
    } else {
      ruleBadge.className = "status-pill warn tabular";
      ruleBadge.textContent = `${m.onePctRatio.toFixed(2)}% Rule (<1%)`;
    }

    // Reverse Max Offer Price linear scan from high to low to find highest price meeting targetCoc
    let maxOffer = 0;
    for (let p = 1500000; p >= 40000; p -= 2500) {
      if (evalRentalAtPrice(p, rent, downPct, apr, closing, vacPct, maintPct, mgmtPct, taxInsMo, termYrs).coc >= targetCoc) {
        maxOffer = p;
        break;
      }
    }
    lastMaxOffer = maxOffer;
    $("rnMaxOffer").textContent = maxOffer > 0 ? fmtUSD(maxOffer) : "Rent Too Low";

    $("rnBreakdownBody").innerHTML = `
      <tr><td><span class="swatch" style="background:var(--accent-emerald);"></span>Gross Monthly Rent</td><td class="tabular">${fmtUSD(rent)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-slate);"></span>Vacancy (${vacPct}%) + Maint/CapEx (${maintPct}%) + Mgmt (${mgmtPct}%)</td><td class="tabular">-${fmtUSD(m.vacLoss + m.maint + m.mgmt)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-amber);"></span>Property Tax, Insurance &amp; HOA</td><td class="tabular">-${fmtUSD(taxInsMo)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-navy);"></span>Mortgage Principal &amp; Interest (${apr.toFixed(2)}%)</td><td class="tabular">-${fmtUSD(m.pi)}</td></tr>
      <tr><td>Net Monthly Cash Flow</td><td class="tabular">${fmtUSD(m.monthlyCf)}</td></tr>
    `;

    $("rnInsightBox").innerHTML = m.dscr >= 1.25
      ? `<strong>Lender-Ready Deal (DSCR ${m.dscr.toFixed(2)}x):</strong> Your Net Operating Income covers debt service by ${m.dscr.toFixed(2)}x (above the 1.25x DSCR bank threshold), generating <strong>${m.coc.toFixed(1)}%</strong> Cash-on-Cash return.`
      : `<strong>DSCR Caution (${m.dscr.toFixed(2)}x):</strong> Most DSCR investment lenders want <strong>1.25x+</strong>. To hit your ${targetCoc}% Cash-on-Cash target, negotiate the purchase price down to <strong>${maxOffer > 0 ? fmtUSD(maxOffer) : "a lower entry"}</strong> or increase rent.`;

    if (activeTool === "rental") {
      lastSummaryText = `PropYield US Rental (${fmtUSD(price)} / ${fmtUSD(rent)} rent): ${fmtUSD(m.monthlyCf)}/mo cash flow, ${m.coc.toFixed(1)}% CoC, ${m.capRate.toFixed(1)}% Cap Rate, ${m.dscr.toFixed(2)}x DSCR.`;
    }
  }

  /* TAB 3: BRRRR DEAL & 75% LTV REFINANCE ANALYZER */
  function updateBrrrr() {
    const buy = Math.max(10000, Number($("brPurchase").value) || 175000);
    const rehab = Math.max(0, Number($("brRehab").value) || 45000);
    const arv = Math.max(20000, Number($("brArv").value) || 310000);
    const holding = Math.max(0, Number($("brHolding").value) || 9500);
    const ltv = Math.min(85, Math.max(50, Number($("brLtv").value) || 75));
    const refiApr = Math.max(0, Number($("brRefiApr").value) || 7.0);
    const refiClosePct = Math.max(0, Number($("brRefiClosePct").value) || 2.5);
    const rent = Math.max(100, Number($("brRent").value) || 2550);
    const expPct = Math.min(70, Math.max(10, Number($("brExpPct").value) || 40));

    const allIn = buy + rehab + holding;
    const refiLoan = arv * (ltv / 100);
    const refiCloseCost = refiLoan * (refiClosePct / 100);
    const netCashOut = Math.max(0, refiLoan - refiCloseCost);
    const cashLeft = Math.max(0, allIn - netCashOut);
    const excessCashPulled = Math.max(0, netCashOut - allIn);
    const instantEquity = Math.max(0, arv - refiLoan);

    const refiPi = calcMonthlyPI(refiLoan, refiApr, 30);
    const monthlyNoi = rent * (1 - expPct / 100);
    const monthlyCf = monthlyNoi - refiPi;
    const annualCf = monthlyCf * 12;
    const dscr = refiPi > 0 ? monthlyNoi / refiPi : 0;
    const isInfinite = cashLeft <= 0 && monthlyCf > 0;
    const cocTxt = isInfinite ? "Infinite!" : (cashLeft > 0 ? `${((annualCf / cashLeft) * 100).toFixed(1)}%` : "0%");

    $("brCashLeft").textContent = fmtUSD(cashLeft);
    $("brEquitySub").textContent = `Instant Equity: ${fmtUSD(instantEquity)} · 75% Refi Loan: ${fmtUSD(refiLoan)}${excessCashPulled > 0 ? ` (+${fmtUSD(excessCashPulled)} extra cash out)` : ""}`;
    $("brCashFlow").textContent = `${fmtUSD(monthlyCf)}/mo`;
    $("brCoc").textContent = cocTxt;
    $("brDscr").textContent = `${dscr.toFixed(2)}x`;
    $("brAllIn").textContent = fmtUSD(allIn);

    const badge = $("brReturnBadge");
    if (isInfinite) {
      badge.className = "status-pill pass tabular";
      badge.textContent = "Infinite Return BRRRR!";
    } else if (cashLeft <= arv * 0.10 && monthlyCf > 0) {
      badge.className = "status-pill pass tabular";
      badge.textContent = "Strong BRRRR Deal";
    } else {
      badge.className = "status-pill warn tabular";
      badge.textContent = "Cash Trapped / Tight CF";
    }

    $("brBreakdownBody").innerHTML = `
      <tr><td><span class="swatch" style="background:var(--accent-navy);"></span>Purchase + Rehab + Holding (All-In)</td><td class="tabular">${fmtUSD(allIn)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-emerald);"></span>Cash-Out Refi Loan (${ltv}% of ${fmtUSD(arv)} ARV)</td><td class="tabular">${fmtUSD(refiLoan)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-amber);"></span>Refinance Closing Costs (${refiClosePct}%)</td><td class="tabular">-${fmtUSD(refiCloseCost)}</td></tr>
      <tr><td><span class="swatch" style="background:var(--accent-slate);"></span>Post-Refi Monthly P&amp;I (${refiApr.toFixed(2)}%)</td><td class="tabular">${fmtUSD(refiPi)}/mo</td></tr>
      <tr><td>Net Cash Left in Deal</td><td class="tabular">${fmtUSD(cashLeft)}</td></tr>
    `;

    $("brInsightBox").innerHTML = isInfinite
      ? `<strong>Home-Run BRRRR:</strong> Your ${ltv}% LTV refinance pulls back <strong>100% of your ${fmtUSD(allIn)}</strong> all-in cash while leaving <strong>${fmtUSD(instantEquity)}</strong> in equity and <strong>${fmtUSD(monthlyCf)}/mo</strong> positive cash flow to repeat on deal #2.`
      : `<strong>BRRRR Capital Check:</strong> You leave <strong>${fmtUSD(cashLeft)}</strong> in the deal after refinance (${Math.round((cashLeft / allIn) * 100)}% of all-in cost). To achieve a zero-cash-left BRRRR, keep Purchase + Rehab + Holding at or below <strong>${fmtUSD(netCashOut)}</strong> (the 70%–73% ARV rule).`;

    if (activeTool === "brrrr") {
      lastSummaryText = `PropYield US BRRRR (${fmtUSD(buy)} buy + ${fmtUSD(rehab)} rehab -> ${fmtUSD(arv)} ARV): ${fmtUSD(cashLeft)} cash left in deal, ${fmtUSD(monthlyCf)}/mo post-refi cash flow (${cocTxt} CoC).`;
    }
  }

  /* Presets Bar */
  function renderPresets() {
    const list = PRESETS[activeTool] || [];
    $("quickPresetsRow").innerHTML = list.map((p, idx) =>
      `<button type="button" class="preset-chip" data-preset-idx="${idx}">${p.label}</button>`
    ).join("");

    $("quickPresetsRow").querySelectorAll(".preset-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = list[Number(btn.dataset.presetIdx)];
        if (!preset || !preset.set) return;
        Object.entries(preset.set).forEach(([id, val]) => {
          const el = $(id);
          if (el) el.value = val;
        });
        syncSliders();
        recalcAll();
        saveState();
        showToast(`Loaded scenario: ${preset.label}`);
      });
    });
  }

  /* Offers, Checklists & Ecosystem Links (Zero Coming Soon / (Soon)) */
  function openModal() {
    const m = $("wealthOsModal");
    if (m && typeof m.showModal === "function") m.showModal();
  }

  function renderOffers() {
    const matched = CONFIG.affiliates.filter((a) => a.context.includes(activeTool));
    const displayList = matched.length >= 3 ? matched.slice(0, 3) : CONFIG.affiliates.slice(0, 3);

    $("offersGrid").innerHTML = displayList.map((offer) => {
      const hasUrl = Boolean(offer.url && offer.url.trim());
      let actionHtml = "";
      if (hasUrl) {
        actionHtml = `<a class="btn btn-primary btn-sm" href="${offer.url}" target="_blank" rel="noopener noreferrer sponsored">${offer.ctaLabel}</a>`;
      } else {
        const itemsHtml = (offer.checklist || []).map((line) => `<li>${line}</li>`).join("");
        actionHtml = `
          <details class="offer-guide">
            <summary class="btn btn-sm">${offer.checklistTitle || "View 2026 Playbook"}</summary>
            <ul class="offer-guide-list">${itemsHtml}</ul>
          </details>
        `;
      }
      return `
        <article class="offer-card">
          <div>
            <span class="offer-badge">${offer.badge}</span>
            <h3>${offer.title}</h3>
            <p>${offer.summary}</p>
          </div>
          <div>${actionHtml}</div>
        </article>
      `;
    }).join("");

    const sheetOffer = CONFIG.ecosystem.gumroadWealthOs;
    const ytOffer = CONFIG.ecosystem.youtubeFinance;
    const hasSheetUrl = Boolean(sheetOffer.url && sheetOffer.url.trim());
    const hasYtUrl = Boolean(ytOffer.url && ytOffer.url.trim());

    const ecoBtns = [
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.smartMoneyUrl}" target="_blank" rel="noopener noreferrer">SmartMoney US</a>`,
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.debtFreeUrl}" target="_blank" rel="noopener noreferrer">DebtFree US</a>`,
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.soloTaxUrl}" target="_blank" rel="noopener noreferrer">SoloTax US</a>`,
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.retireSmartUrl}" target="_blank" rel="noopener noreferrer">RetireSmart US</a>`
    ];
    if (hasYtUrl) ecoBtns.push(`<a class="btn btn-sm" href="${ytOffer.url}" target="_blank" rel="noopener noreferrer">${ytOffer.label}</a>`);
    if (hasSheetUrl) {
      ecoBtns.push(`<a class="btn btn-sm btn-primary" href="${sheetOffer.url}" target="_blank" rel="noopener noreferrer">${sheetOffer.label}</a>`);
    } else {
      ecoBtns.push(`<button type="button" class="btn btn-sm btn-primary" data-open-os-modal="1">Preview 2026 Wealth OS (Free Lite)</button>`);
    }
    $("ecoLinksContainer").innerHTML = ecoBtns.join("");

    document.querySelectorAll("[data-result-cta]").forEach((box) => {
      const key = box.dataset.resultCta;
      const copy = RESULT_CTA_COPY[key] || RESULT_CTA_COPY.rentbuy;
      const btn = hasSheetUrl
        ? `<a class="btn btn-primary btn-sm" href="${sheetOffer.url}" target="_blank" rel="noopener noreferrer">${sheetOffer.label}</a>`
        : `<button type="button" class="btn btn-primary btn-sm" data-open-os-modal="1">Preview 2026 Wealth OS</button>`;
      box.innerHTML = `
        <div class="result-cta-copy">
          <strong>${copy.title}</strong>
          <p>${copy.desc}</p>
        </div>
        <div style="flex-shrink:0;">${btn}</div>
      `;
    });

    document.querySelectorAll("[data-open-os-modal]").forEach((b) => {
      b.addEventListener("click", openModal);
    });
  }

  function switchTool(toolId, updateHash) {
    if (!TOOL_META[toolId]) toolId = "rentbuy";
    activeTool = toolId;

    document.querySelectorAll(".tool-tab").forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.dataset.tool === toolId));
    });
    document.querySelectorAll(".calc-panel").forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + toolId;
    });

    $("activeToolHeading").textContent = TOOL_META[toolId].title;
    $("activeToolDesc").textContent = TOOL_META[toolId].desc;

    if (updateHash) history.replaceState(null, "", "#" + toolId);

    renderPresets();
    recalcAll();
    renderOffers();
  }

  function recalcAll() {
    updateRentBuy();
    updateRental();
    updateBrrrr();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    $("themeToggleBtn").textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  function init() {
    $("brandNameText").textContent = CONFIG.brand.name;
    $("brandSubText").textContent = CONFIG.brand.subtitle;

    restoreState();
    const urlTab = applyUrlParams();
    syncSliders();
    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    document.querySelectorAll(".tool-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTool(btn.dataset.tool, true));
    });

    $("themeToggleBtn").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    $("shareLinkBtn").addEventListener("click", () => {
      const url = buildShareUrl();
      history.replaceState(null, "", url);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => showToast("Shareable deal link copied to clipboard!")).catch(() => showToast("Share link updated in address bar."));
      } else {
        showToast("Share link updated in address bar.");
      }
    });

    $("copyScenarioBtn").addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastSummaryText).then(() => showToast("Deal summary copied to clipboard.")).catch(() => showToast(lastSummaryText));
      } else {
        showToast(lastSummaryText);
      }
    });

    $("printReportBtn").addEventListener("click", () => window.print());

    $("resetDefaultsBtn").addEventListener("click", () => {
      try { localStorage.removeItem(STATE_KEY); } catch (_) {}
      window.location.href = window.location.pathname;
    });

    $("rbExportCsvBtn").addEventListener("click", () => {
      downloadCsv(
        "propyield-us-rent-vs-buy-2026.csv",
        ["Year", "Monthly Rent ($)", "Home Net Equity After Fees ($)", "Renter Invested Portfolio ($)", "Buy vs Rent Advantage ($)"],
        lastRbRows.map((r) => [r.year, Math.round(r.rent), Math.round(r.buyNet), Math.round(r.rentNet), Math.round(r.advantage)])
      );
    });

    $("rnApplyOfferBtn").addEventListener("click", () => {
      if (lastMaxOffer > 0) {
        $("rnPrice").value = lastMaxOffer;
        updateRental();
        saveState();
        showToast(`Applied Max Offer Price: ${fmtUSD(lastMaxOffer)}`);
      }
    });

    const closeModal = () => {
      const m = $("wealthOsModal");
      if (m && m.open) m.close();
    };
    $("closeModalBtn").addEventListener("click", closeModal);
    $("modalCloseFooterBtn").addEventListener("click", closeModal);
    $("modalPrintBtn").addEventListener("click", () => { closeModal(); window.print(); });

    const bind = (id, fn) => {
      const el = $(id);
      if (!el) return;
      const h = () => { fn(); saveState(); };
      el.addEventListener("input", h);
      el.addEventListener("change", h);
    };

    $("rbPrice").addEventListener("input", (e) => {
      $("rbPriceSlider").value = Math.min(1500000, Math.max(150000, Number(e.target.value) || 150000));
      updateRentBuy(); saveState();
    });
    $("rbPriceSlider").addEventListener("input", (e) => {
      $("rbPrice").value = e.target.value;
      updateRentBuy(); saveState();
    });
    ["rbRent", "rbYears", "rbDownPct", "rbApr", "rbApprec", "rbInvest", "rbRentGrow", "rbTaxMaint", "rbSellCost"].forEach((id) => bind(id, updateRentBuy));
    ["rnPrice", "rnRent", "rnDownPct", "rnApr", "rnClosing", "rnVacPct", "rnMaintPct", "rnMgmtPct", "rnTaxInsMo", "rnTerm", "rnTargetCoc"].forEach((id) => bind(id, updateRental));
    ["brPurchase", "brRehab", "brArv", "brHolding", "brLtv", "brRefiApr", "brRefiClosePct", "brRent", "brExpPct"].forEach((id) => bind(id, updateBrrrr));

    const initialHash = (window.location.hash || "").replace("#", "");
    const startTab = urlTab || (TOOL_META[initialHash] ? initialHash : "rentbuy");
    switchTool(startTab, false);
  }

  init();
})();
