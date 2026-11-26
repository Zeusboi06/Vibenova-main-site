/* Instant Growth Audit (8-step Self-Assessment, Scoring, Fix Library, & Lead Capture) */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("instant-audit-root");
  if (!root) return;

  const STORAGE_KEY = "vibenova_instant_audit_v1";

  const BUSINESS_TYPES = [
    "Car detailing / PPF / coating studio",
    "Car wash or car care",
    "Garage or workshop",
    "Auto parts or accessories brand",
    "Something else",
  ];

  const QUESTIONS = {
    W1: {
      pillar: "Website",
      text: "Do you have a website?",
      options: [
        ["No website", 0],
        ["Yes, but it is outdated or slow", 1],
        ["Yes, it is decent", 2],
        ["Yes, recent and fast", 3],
      ],
    },
    W2: {
      pillar: "Website",
      text: "How does it look and work on a phone?",
      options: [
        ["Not sure", 0],
        ["Poorly", 0],
        ["Mostly fine", 2],
        ["Very well", 3],
      ],
    },
    W3: {
      pillar: "Website",
      text: "Can a visitor message, call or book in one tap?",
      options: [
        ["No", 0],
        ["Only through a contact page", 1],
        ["WhatsApp or call button", 3],
      ],
    },
    W4: {
      pillar: "Website",
      text: "Does it show your real work and your services clearly?",
      options: [
        ["No", 0],
        ["Somewhat", 2],
        ["Yes, clearly", 3],
      ],
    },
    G1: {
      pillar: "Google presence",
      text: "Do you have a Google Business Profile?",
      options: [
        ["No or not sure", 0],
        ["Yes, not verified", 1],
        ["Yes, verified", 3],
      ],
    },
    G2: {
      pillar: "Google presence",
      text: "Roughly how many Google reviews do you have?",
      options: [
        ["0 to 10", 0],
        ["11 to 50", 1],
        ["51 to 150", 2],
        ["More than 150", 3],
      ],
    },
    G3: {
      pillar: "Google presence",
      text: "How often do you add photos or posts to your profile?",
      options: [
        ["Never", 0],
        ["Rarely", 1],
        ["Monthly", 2],
        ["Weekly", 3],
      ],
    },
    G4: {
      pillar: "Google presence",
      text: "Do you reply to reviews?",
      options: [
        ["Never", 0],
        ["Sometimes", 1],
        ["Usually", 2],
        ["Always", 3],
      ],
    },
    S1: {
      pillar: "Social media",
      text: "How often do you post on Instagram or Facebook?",
      options: [
        ["Rarely or never", 0],
        ["A few times a month", 1],
        ["Weekly", 2],
        ["3 or more times a week", 3],
      ],
    },
    S2: {
      pillar: "Social media",
      text: "Do you post reels or short videos?",
      options: [
        ["Never", 0],
        ["Sometimes", 1],
        ["Regularly", 3],
      ],
    },
    S3: {
      pillar: "Social media",
      text: "Do your posts show finished or before/after work?",
      options: [
        ["Rarely", 0],
        ["Sometimes", 2],
        ["Most posts", 3],
      ],
    },
    S4: {
      pillar: "Social media",
      text: "Where does your Instagram bio link go?",
      options: [
        ["Nowhere", 0],
        ["Website only", 1],
        ["WhatsApp or a booking link", 3],
      ],
    },
    E1: {
      pillar: "Enquiry handling",
      text: "How fast do you usually reply to a new enquiry?",
      options: [
        ["Often I miss them", 0],
        ["Next day", 1],
        ["Within a few hours", 2],
        ["Within an hour", 3],
      ],
    },
    E2: {
      pillar: "Enquiry handling",
      text: "Do you follow up with people who enquired but did not book?",
      options: [
        ["Never", 0],
        ["Sometimes", 1],
        ["Always", 3],
      ],
    },
    E3: {
      pillar: "Enquiry handling",
      text: "Do you know where your enquiries come from?",
      options: [
        ["No", 0],
        ["Roughly", 1],
        ["Yes, I track it", 3],
      ],
    },
    E4: {
      pillar: "Enquiry handling",
      text: "Where do you keep a record of enquiries and customers?",
      options: [
        ["In my memory", 0],
        ["Notebook or WhatsApp", 1],
        ["Spreadsheet or CRM", 3],
      ],
    },
    E0: {
      pillar: "Enquiry handling",
      text: "How do most enquiries reach you? (Select all that apply)",
      multi: true,
      options: ["Phone calls", "WhatsApp", "Instagram DMs", "Walk-ins", "Website form"],
    },
  };

  const FIX_LIBRARY = [
    {
      id: "FX1",
      check: (a) => a.W1 === 0,
      title: "Get a simple, fast website live",
      free_quick_win: "Until then, make sure your Google profile and Instagram link to one WhatsApp number.",
      related_service: "Websites",
      tab: "websites",
    },
    {
      id: "FX2",
      check: (a) => typeof a.W3 === "number" && a.W3 <= 1,
      title: "Make it one tap to contact you",
      free_quick_win: "Add a click-to-chat WhatsApp link at the top of every page.",
      related_service: "Websites",
      tab: "websites",
    },
    {
      id: "FX3",
      check: (a) => typeof a.G1 === "number" && a.G1 <= 1,
      title: "Claim and verify your Google Business Profile",
      free_quick_win: "Search your business name on Google Maps and use the claim or manage option.",
      related_service: "Local Growth and Search",
      tab: "local",
    },
    {
      id: "FX4",
      check: (a) => typeof a.G2 === "number" && a.G2 <= 1,
      title: "Build a steady stream of reviews",
      free_quick_win: "After each job, send the customer your review link on WhatsApp the same day.",
      related_service: "Local Growth and Search",
      tab: "local",
    },
    {
      id: "FX5",
      check: (a) => typeof a.G3 === "number" && a.G3 <= 1,
      title: "Keep your profile fresh",
      free_quick_win: "Upload 10 recent photos of finished work and set your services and hours.",
      related_service: "Local Growth and Search",
      tab: "local",
    },
    {
      id: "FX6",
      check: (a) => typeof a.S3 === "number" && a.S3 <= 0,
      title: "Show finished work",
      free_quick_win: "Post one before and after of your best recent job this week.",
      related_service: "Social Media Marketing",
      tab: "social",
    },
    {
      id: "FX7",
      check: (a) => typeof a.S4 === "number" && a.S4 <= 1,
      title: "Send bio visitors straight to WhatsApp or booking",
      free_quick_win: "Change your Instagram bio link to a WhatsApp chat link.",
      related_service: "Social Media Marketing",
      tab: "social",
    },
    {
      id: "FX8",
      check: (a) => typeof a.E1 === "number" && a.E1 <= 1,
      title: "Reply faster",
      free_quick_win: "Turn on WhatsApp Business quick replies and an away message.",
      related_service: "Business Setups and Automations",
      tab: "automations",
    },
    {
      id: "FX9",
      check: (a) => typeof a.E2 === "number" && a.E2 <= 1,
      title: "Follow up on every enquiry",
      free_quick_win: "Once a day, message everyone who enquired in the last 7 days and did not book.",
      related_service: "Business Setups and Automations",
      tab: "automations",
    },
    {
      id: "FX10",
      check: (a) => typeof a.E4 === "number" && a.E4 <= 1,
      title: "Keep one list of every enquiry",
      free_quick_win: "Start a simple sheet with name, number, date, source and status.",
      related_service: "Business Setups and Automations",
      tab: "automations",
    },
  ];

  const defaultState = {
    step: 0,
    businessType: "",
    answers: {},
    channels: [],
    jobValue: "",
    enquiriesPerMonth: "",
    scenarioJobs: 3,
    selectedPlan: "",
    started: false,
    completed: false,
    submitted: false,
  };

  let state = { ...defaultState };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") state = { ...defaultState, ...saved };
  } catch {
    // Ignore storage errors
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }

  function getBand(score) {
    if (score < 40) return "Needs a foundation";
    if (score < 70) return "Partly in place";
    return "Strong base";
  }

  function computeScores() {
    const a = state.answers;
    const website = a.W1 === 0 ? 0 : Math.round((((a.W1 || 0) + (a.W2 || 0) + (a.W3 || 0) + (a.W4 || 0)) / 12) * 100);
    const google = a.G1 === 0 ? 0 : Math.round((((a.G1 || 0) + (a.G2 || 0) + (a.G3 || 0) + (a.G4 || 0)) / 12) * 100);
    const social = Math.round((((a.S1 || 0) + (a.S2 || 0) + (a.S3 || 0) + (a.S4 || 0)) / 12) * 100);
    const enquiries = Math.round((((a.E1 || 0) + (a.E2 || 0) + (a.E3 || 0) + (a.E4 || 0)) / 12) * 100);

    const pillarScores = {
      Website: website,
      "Google presence": google,
      "Social media": social,
      "Enquiry handling": enquiries,
    };

    const overall = Math.round((website + google + social + enquiries) / 4);

    // Biggest gap with tie-break order:
    // Website (only when no site), Google presence, Enquiry handling, Website, Social media
    const minScore = Math.min(website, google, social, enquiries);
    let biggestGap = "Google presence";
    if (a.W1 === 0 && website === minScore) biggestGap = "Website";
    else if (google === minScore) biggestGap = "Google presence";
    else if (enquiries === minScore) biggestGap = "Enquiry handling";
    else if (website === minScore) biggestGap = "Website";
    else biggestGap = "Social media";

    const topFixes = FIX_LIBRARY.filter((fx) => fx.check(a)).slice(0, 3);
    return { pillarScores, overall, biggestGap, topFixes };
  }

  const GAP_WHY = {
    Website: "When customers look you up and find no clear website—or one that is hard to use on a phone—they often move on before messaging.",
    "Google presence": "People searching nearby look at Google Maps and reviews first. Missing or inactive profiles leave ready buyers going elsewhere.",
    "Social media": "Without consistent proof of finished work and a direct link to message, attention rarely turns into enquiries.",
    "Enquiry handling": "Slow replies or unlogged enquiries mean you lose jobs you already paid time or effort to attract.",
  };

  function renderCheckSvg() {
    return `<svg class="audit-chip-check" viewBox="0 0 24 24" fill="none" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  }

  function renderQuestionGroup(qId) {
    const q = QUESTIONS[qId];
    const currentVal = state.answers[qId];
    return `
      <div class="audit-question-block" data-qid="${qId}">
        <span class="audit-question-label">${q.text}</span>
        <div class="audit-options" role="radiogroup" aria-label="${q.text}">
          ${q.options
            .map(([label, pts], idx) => {
              const selected = currentVal === pts && state.answers[`${qId}_idx`] === idx;
              return `
                <button type="button"
                  class="audit-chip ${selected ? "is-selected" : ""}"
                  role="radio"
                  aria-checked="${selected}"
                  data-q="${qId}"
                  data-pts="${pts}"
                  data-idx="${idx}">
                  <span>${label}</span>
                  ${renderCheckSvg()}
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function render() {
    const totalSteps = 6;
    const displayStep = Math.min(state.step + 1, totalSteps);
    const pct = state.step >= 6 ? 100 : Math.round((displayStep / totalSteps) * 100);

    let bodyHtml = "";

    if (state.step === 0) {
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">What kind of business?</h3>
        <div class="audit-options" role="radiogroup" aria-label="Business type">
          ${BUSINESS_TYPES.map((opt) => {
            const sel = state.businessType === opt;
            return `
              <button type="button" class="audit-chip ${sel ? "is-selected" : ""}" role="radio" aria-checked="${sel}" data-btype="${opt}">
                <span>${opt}</span>
                ${renderCheckSvg()}
              </button>
            `;
          }).join("")}
        </div>
      `;
    } else if (state.step === 1) {
      const skipW = state.answers.W1 === 0;
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Website</h3>
        ${renderQuestionGroup("W1")}
        ${skipW ? `<p class="meter-band" style="margin-top:0.75rem;">No website selected — we will skip the remaining website questions and mark this as a priority gap.</p>` : `${renderQuestionGroup("W2")}${renderQuestionGroup("W3")}${renderQuestionGroup("W4")}`}
      `;
    } else if (state.step === 2) {
      const skipG = state.answers.G1 === 0;
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Google presence</h3>
        ${renderQuestionGroup("G1")}
        ${skipG ? `<p class="meter-band" style="margin-top:0.75rem;">No Google Business Profile selected — we will skip the remaining Google questions.</p>` : `${renderQuestionGroup("G2")}${renderQuestionGroup("G3")}${renderQuestionGroup("G4")}`}
      `;
    } else if (state.step === 3) {
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Social media</h3>
        ${renderQuestionGroup("S1")}${renderQuestionGroup("S2")}${renderQuestionGroup("S3")}${renderQuestionGroup("S4")}
      `;
    } else if (state.step === 4) {
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Handling enquiries</h3>
        ${renderQuestionGroup("E1")}${renderQuestionGroup("E2")}${renderQuestionGroup("E3")}${renderQuestionGroup("E4")}
        <div class="audit-question-block">
          <span class="audit-question-label">${QUESTIONS.E0.text}</span>
          <div class="audit-options" role="group" aria-label="${QUESTIONS.E0.text}">
            ${QUESTIONS.E0.options
              .map((opt) => {
                const sel = state.channels.includes(opt);
                return `
                  <button type="button" class="audit-chip ${sel ? "is-selected" : ""}" aria-pressed="${sel}" data-channel="${opt}">
                    <span>${opt}</span>
                    ${renderCheckSvg()}
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    } else if (state.step === 5) {
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Your numbers (optional)</h3>
        <p class="meter-band" style="margin-bottom:1rem;">Optional: helps show simple arithmetic on your snapshot. You can skip this step.</p>
        <div class="audit-form">
          <div class="form-group">
            <label for="audit-job-val">Average value of one job in ₹</label>
            <input type="number" id="audit-job-val" min="0" placeholder="e.g. 15000" value="${state.jobValue}" />
          </div>
          <div class="form-group">
            <label for="audit-enq-mo">Enquiries per month (approx)</label>
            <input type="number" id="audit-enq-mo" min="0" placeholder="e.g. 25" value="${state.enquiriesPerMonth}" />
          </div>
        </div>
      `;
    } else if (state.step === 6) {
      const { pillarScores, overall, biggestGap, topFixes } = computeScores();
      const jobValNum = Number(state.jobValue) || 0;
      const waSummary = encodeURIComponent(
        `Hi VibeNova, I just took the Instant Growth Audit (${state.businessType || "Business"}).\nOverall: ${overall}/100 (${getBand(overall)})\nBiggest gap: ${biggestGap}\nPlease share the full walkthrough.`
      );

      bodyHtml = `
        <div class="snapshot-head">
          <div>
            <h3 class="audit-step-heading" tabindex="-1">Your growth snapshot</h3>
            <span class="meter-band">Based on your answers &bull; Overall: <strong>${overall}/100 (${getBand(overall)})</strong></span>
          </div>
          ${state.businessType ? `<span class="snapshot-tag">${state.businessType}</span>` : ""}
        </div>

        <div class="meters-grid">
          ${Object.entries(pillarScores)
            .map(
              ([name, val]) => `
            <div class="meter-card">
              <div class="meter-top"><span>${name}</span><span>${val}%</span></div>
              <div class="meter-bar"><div class="meter-fill" data-target-width="${val}%"></div></div>
              <div class="meter-band">${getBand(val)}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <button type="button" class="score-explain-btn" id="score-explain-btn" aria-expanded="false">How is this scored?</button>
        <div class="score-explain-box" id="score-explain-box" hidden>
          Each pillar (Website, Google presence, Social media, Enquiry handling) has 4 scored questions worth up to 3 points each (12 points max). Your percentage is your points out of 12. Overall readiness is the average of the four pillars.
        </div>

        <div class="gap-callout">
          <strong>Biggest gap: ${biggestGap}</strong>
          <p style="font-size:0.88rem; margin-top:0.25rem; color:#d7d2c8;">${GAP_WHY[biggestGap]}</p>
        </div>

        ${
          topFixes.length
            ? `<div class="fixes-list">
                ${topFixes
                  .map(
                    (fx, i) => `
                  <div class="fix-item">
                    <h4>${i + 1}. ${fx.title}</h4>
                    <p><strong>Quick win today:</strong> ${fx.free_quick_win}</p>
                    <a href="#pricing" class="fix-service-link" data-fix-tab="${fx.tab}">See ${fx.related_service} &rarr;</a>
                  </div>
                `
                  )
                  .join("")}
              </div>`
            : `<p class="meter-band" style="margin-bottom:1rem;">Your core foundations look solid across the board.</p>`
        }

        ${
          jobValNum > 0
            ? `<div class="scenario-box">
                <label for="scenario-slider" style="font-size:0.88rem;font-weight:700;display:block;">
                  If you won <span id="scenario-n">${state.scenarioJobs}</span> more jobs a month:
                </label>
                <input type="range" id="scenario-slider" min="1" max="10" value="${state.scenarioJobs}" />
                <p id="scenario-output" style="font-weight:700;font-size:0.95rem;">
                  ₹${(state.scenarioJobs * jobValNum).toLocaleString("en-IN")}/month &bull; ₹${(state.scenarioJobs * jobValNum * 12).toLocaleString("en-IN")}/year
                </p>
                <p class="scenario-disclaimer">This is arithmetic, not a forecast.</p>
              </div>`
            : ""
        }

        <div class="snapshot-actions">
          <button type="button" class="btn btn-black btn-full" id="go-to-report-btn">Get the full audit report &amp; walkthrough</button>
          <a href="https://wa.me/916363609485?text=${waSummary}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-full" data-track="whatsapp_click">WhatsApp us with results</a>
          <button type="button" class="score-explain-btn" id="retake-audit-btn" style="text-align:center;margin-top:0.25rem;">Retake the audit</button>
        </div>
      `;
    } else if (state.step === 7) {
      const { pillarScores, overall, biggestGap } = computeScores();
      const waFallback = encodeURIComponent(
        `Hi VibeNova, I completed the audit (${overall}/100, Gap: ${biggestGap}) and would like my detailed report.`
      );
      bodyHtml = `
        <h3 class="audit-step-heading" tabindex="-1">Get the full report</h3>
        <p class="meter-band" style="margin-bottom:1rem;">
          Share where to send your detailed review${state.selectedPlan ? ` (noted: ${state.selectedPlan})` : ""}.
        </p>
        <form id="audit-lead-form" class="audit-form" novalidate>
          <div class="hp-field" aria-hidden="true">
            <label for="lead-hp">Website</label>
            <input type="text" id="lead-hp" name="website_hp" tabindex="-1" autocomplete="off" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="lead-name">Name <span aria-hidden="true">*</span></label>
              <input type="text" id="lead-name" name="name" required autocomplete="name" aria-describedby="err-name" />
              <span class="field-error" id="err-name" hidden></span>
            </div>
            <div class="form-group">
              <label for="lead-biz">Business name <span aria-hidden="true">*</span></label>
              <input type="text" id="lead-biz" name="businessName" required aria-describedby="err-biz" />
              <span class="field-error" id="err-biz" hidden></span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="lead-wa">WhatsApp number <span aria-hidden="true">*</span></label>
              <input type="tel" id="lead-wa" name="whatsapp" required autocomplete="tel" placeholder="+91 98765 43210" aria-describedby="err-wa" />
              <span class="field-error" id="err-wa" hidden></span>
            </div>
            <div class="form-group">
              <label for="lead-email">Email (optional)</label>
              <input type="email" id="lead-email" name="email" autocomplete="email" placeholder="you@company.com" />
            </div>
          </div>
          <div class="form-group">
            <label for="lead-link">Website or Google Maps link (optional)</label>
            <input type="url" id="lead-link" name="link" placeholder="https://yourbusiness.com" />
          </div>
          <div class="form-check">
            <input type="checkbox" id="lead-consent" name="consent" required aria-describedby="err-consent" />
            <label for="lead-consent">I agree that VibeNova may contact me about this request.</label>
          </div>
          <span class="field-error" id="err-consent" hidden></span>

          <button type="submit" class="btn btn-black btn-full" id="lead-submit-btn">Send My Full Report</button>
          <div id="lead-feedback" class="form-feedback" role="status" aria-live="polite" hidden></div>
          <div id="lead-fallback" hidden style="margin-top:0.5rem;">
            <a href="https://wa.me/916363609485?text=${waFallback}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-full">Send via WhatsApp instead</a>
          </div>
        </form>
      `;
    }

    const showNav = state.step < 6 || state.step === 7;
    const nextLabel = state.step === 5 ? "See My Snapshot" : "Continue";

    root.innerHTML = `
      <div class="audit-progress-bar" aria-hidden="true">
        <div class="audit-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="audit-step-meta">
        <span>${state.step < 6 ? `Step ${displayStep} of ${totalSteps}` : state.step === 6 ? "Snapshot Ready" : "Full Report"}</span>
        <span>${pct}%</span>
      </div>
      <div class="audit-step-stage">
        ${bodyHtml}
      </div>
      ${
        showNav
          ? `<div class="audit-nav">
              ${state.step > 0 ? `<button type="button" class="btn btn-outline-dark btn-sm" id="audit-back-btn">&larr; Back</button>` : `<span></span>`}
              ${state.step < 6 ? `<button type="button" class="btn btn-black btn-sm" id="audit-next-btn">${nextLabel} &rarr;</button>` : ""}
            </div>`
          : ""
      }
    `;

    bindEvents();
  }

  function bindEvents() {
    // Animate meters on Step 6
    if (state.step === 6) {
      requestAnimationFrame(() => {
        root.querySelectorAll(".meter-fill[data-target-width]").forEach((bar) => {
          bar.style.width = bar.getAttribute("data-target-width");
        });
      });

      const explainBtn = document.getElementById("score-explain-btn");
      const explainBox = document.getElementById("score-explain-box");
      explainBtn?.addEventListener("click", () => {
        const open = explainBox.hidden;
        explainBox.hidden = !open;
        explainBtn.setAttribute("aria-expanded", String(open));
      });

      root.querySelectorAll("[data-fix-tab]").forEach((link) => {
        link.addEventListener("click", () => {
          window.vibeNovaActivateTab?.(link.getAttribute("data-fix-tab"));
        });
      });

      const slider = document.getElementById("scenario-slider");
      const nEl = document.getElementById("scenario-n");
      const outEl = document.getElementById("scenario-output");
      slider?.addEventListener("input", () => {
        const n = Number(slider.value);
        state.scenarioJobs = n;
        saveState();
        const val = Number(state.jobValue) || 0;
        if (nEl) nEl.textContent = String(n);
        if (outEl) {
          outEl.textContent = `₹${(n * val).toLocaleString("en-IN")}/month • ₹${(n * val * 12).toLocaleString("en-IN")}/year`;
        }
      });

      document.getElementById("go-to-report-btn")?.addEventListener("click", () => {
        state.step = 7;
        saveState();
        render();
        root.querySelector(".audit-step-heading")?.focus();
      });

      document.getElementById("retake-audit-btn")?.addEventListener("click", () => {
        state = { ...defaultState };
        saveState();
        render();
        root.querySelector(".audit-step-heading")?.focus();
      });
    }

    // Step 0 Business Type
    root.querySelectorAll("[data-btype]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!state.started) {
          state.started = true;
          window.vibeNovaTrack("audit_start");
        }
        state.businessType = btn.getAttribute("data-btype");
        saveState();
        render();
        setTimeout(() => {
          state.step = 1;
          saveState();
          render();
          root.querySelector(".audit-step-heading")?.focus();
        }, 320);
      });
    });

    // Single-select question chips
    root.querySelectorAll("[data-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-q");
        const pts = Number(btn.getAttribute("data-pts"));
        const idx = Number(btn.getAttribute("data-idx"));
        state.answers[q] = pts;
        state.answers[`${q}_idx`] = idx;
        saveState();
        render();

        // Auto-advance when W1=0 or G1=0
        if ((q === "W1" && pts === 0) || (q === "G1" && pts === 0)) {
          setTimeout(() => {
            state.step += 1;
            saveState();
            render();
            root.querySelector(".audit-step-heading")?.focus();
          }, 350);
        }
      });
    });

    // Multi-select E0 channels
    root.querySelectorAll("[data-channel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = btn.getAttribute("data-channel");
        if (state.channels.includes(ch)) {
          state.channels = state.channels.filter((c) => c !== ch);
        } else {
          state.channels.push(ch);
        }
        saveState();
        render();
      });
    });

    // Optional numbers
    const jobInput = document.getElementById("audit-job-val");
    const enqInput = document.getElementById("audit-enq-mo");
    jobInput?.addEventListener("input", () => {
      state.jobValue = jobInput.value;
      saveState();
    });
    enqInput?.addEventListener("input", () => {
      state.enquiriesPerMonth = enqInput.value;
      saveState();
    });

    // Back / Next buttons
    document.getElementById("audit-back-btn")?.addEventListener("click", () => {
      state.step = Math.max(0, state.step - 1);
      saveState();
      render();
      root.querySelector(".audit-step-heading")?.focus();
    });

    document.getElementById("audit-next-btn")?.addEventListener("click", () => {
      window.vibeNovaTrack("audit_step_complete", { step: state.step });
      state.step = Math.min(6, state.step + 1);
      if (state.step === 6 && !state.completed) {
        state.completed = true;
        const { overall, biggestGap } = computeScores();
        window.vibeNovaTrack("audit_complete", { band: getBand(overall), biggestGap });
      }
      saveState();
      render();
      root.querySelector(".audit-step-heading")?.focus();
    });

    // Step 7 Lead Form
    const leadForm = document.getElementById("audit-lead-form");
    if (leadForm) {
      leadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById("lead-name");
        const bizEl = document.getElementById("lead-biz");
        const waEl = document.getElementById("lead-wa");
        const consentEl = document.getElementById("lead-consent");
        const submitBtn = document.getElementById("lead-submit-btn");
        const feedbackEl = document.getElementById("lead-feedback");
        const fallbackEl = document.getElementById("lead-fallback");

        let valid = true;
        const checks = [
          [nameEl, "err-name", "Please enter your name."],
          [bizEl, "err-biz", "Please enter your business name."],
          [waEl, "err-wa", "Please enter a valid WhatsApp number."],
        ];
        checks.forEach(([input, errId, msg]) => {
          const errEl = document.getElementById(errId);
          if (!input.value.trim()) {
            input.setAttribute("aria-invalid", "true");
            errEl.textContent = msg;
            errEl.hidden = false;
            valid = false;
          } else {
            input.removeAttribute("aria-invalid");
            errEl.hidden = true;
          }
        });

        const errConsent = document.getElementById("err-consent");
        if (!consentEl.checked) {
          errConsent.textContent = "Please confirm consent so VibeNova can contact you.";
          errConsent.hidden = false;
          valid = false;
        } else {
          errConsent.hidden = true;
        }

        if (!valid) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        feedbackEl.hidden = true;
        fallbackEl.hidden = true;

        const { pillarScores, overall, biggestGap, topFixes } = computeScores();
        const payload = {
          name: nameEl.value.trim(),
          businessName: bizEl.value.trim(),
          whatsapp: waEl.value.trim(),
          email: document.getElementById("lead-email")?.value.trim() || "",
          link: document.getElementById("lead-link")?.value.trim() || "",
          website_hp: document.getElementById("lead-hp")?.value || "",
          businessType: state.businessType,
          answers: { ...state.answers, channels: state.channels },
          pillarScores,
          overall,
          biggestGap,
          topFixes,
          referrer: document.referrer || window.location.href,
          timestamp: new Date().toISOString(),
          consent: true,
        };

        try {
          const res = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Request failed");

          window.vibeNovaTrack("audit_lead_submit", { biggestGap, overall });
          feedbackEl.className = "form-feedback success";
          feedbackEl.innerHTML = `
            <p>Thanks, ${payload.name}. Your audit request has been received.</p>
            <p style="font-weight:500;margin-top:0.35rem;">VibeNova will review your links and send your detailed report shortly.</p>
          `;
          feedbackEl.hidden = false;
          submitBtn.textContent = "Request Sent";
        } catch {
          window.vibeNovaTrack("audit_lead_error");
          feedbackEl.className = "form-feedback error";
          feedbackEl.textContent =
            "Could not reach the audit server right now. Please retry or send your results directly on WhatsApp below.";
          feedbackEl.hidden = false;
          fallbackEl.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "Retry Sending Report";
        }
      });
    }
  }

  // Listen for plan prefill from Pricing CTAs
  window.addEventListener("vibenova:prefill-audit", (e) => {
    state.selectedPlan = e.detail?.plan || "";
    saveState();
    if (state.step === 7) render();
  });

  render();
});
