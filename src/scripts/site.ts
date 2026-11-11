// Poshan landing page behaviour: scroll reveals, mobile sticky CTA, signup panel.

declare global {
  interface Window { __revealFailsafe?: number }
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (window.__revealFailsafe) clearTimeout(window.__revealFailsafe);
document.documentElement.classList.add("js");

/* ─── Scroll reveals ─────────────────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal], .reveal-img");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

/* ─── Small storage helpers (storage can be blocked; never let it throw) ── */
const store = {
  get<T>(area: Storage | undefined, key: string): T | null {
    try { return area ? (JSON.parse(area.getItem(key) || "null") as T) : null; } catch { return null; }
  },
  set(area: Storage | undefined, key: string, value: unknown) {
    try { area?.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  },
  del(area: Storage | undefined, key: string) {
    try { area?.removeItem(key); } catch { /* ignore */ }
  },
};
const safeSession = (() => { try { return window.sessionStorage; } catch { return undefined; } })();

const DRAFT_KEY = "poshan:draft";

type Draft = Partial<Record<"goal" | "goal_other" | "first_name" | "email" | "suburb" | "mobile" | "blend", string>>;

/* ─── Signup panel ───────────────────────────────────────────────────────── */
function initSignup() {
  const dialog = document.getElementById("signup") as HTMLDialogElement | null;
  if (!dialog) return;

  const $ = <T extends Element>(sel: string) => dialog.querySelector<T>(sel)!;
  const panel = $<HTMLElement>("[data-panel]");
  const form = $<HTMLFormElement>("#signup-form");
  const steps: Record<string, HTMLElement> = {
    "1": $("[data-step='1']"),
    "2": $("[data-step='2']"),
    done: $("[data-step='done']"),
  };
  const headings: Record<string, string> = { "1": "signup-h1", "2": "signup-h2", done: "signup-h3" };
  const stepLabel = $<HTMLElement>("[data-step-label]");
  const progress = $<HTMLElement>("[data-progress]");
  const progressWrap = $<HTMLElement>("[role='progressbar']");
  const tiles = Array.from(dialog.querySelectorAll<HTMLButtonElement>("[data-goal-tile]"));
  const nextBtn = $<HTMLButtonElement>("[data-next]");
  const otherWrap = $<HTMLElement>("[data-other-wrap]");
  const otherInput = $<HTMLInputElement>("#su-other");
  const goalInput = $<HTMLInputElement>("[data-goal-input]");
  const blendOptions = Array.from(dialog.querySelectorAll<HTMLInputElement>("[data-blend-option]"));
  const goalLine = $<HTMLElement>("[data-goal-line]");
  const srcInput = $<HTMLInputElement>("[data-src-input]");
  const goalSummary = $<HTMLElement>("[data-goal-summary]");
  const addMobile = $<HTMLButtonElement>("[data-add-mobile]");
  const mobileField = $<HTMLElement>("[data-mobile-field]");
  const mobileInput = $<HTMLInputElement>("#su-mobile");
  const nameInput = $<HTMLInputElement>("#su-name");
  const emailInput = $<HTMLInputElement>("#su-email");
  const suburbInput = $<HTMLInputElement>("#su-suburb");
  const submitBtn = $<HTMLButtonElement>("[data-submit]");
  const submitLabel = $<HTMLElement>("[data-submit-label]");
  const spinner = $<HTMLElement>("[data-spinner]");
  const formError = $<HTMLElement>("[data-form-error]");
  const successTitle = $<HTMLElement>("[data-success-title]");
  const successText = $<HTMLElement>("[data-success-text]");
  const whatsapp = $<HTMLAnchorElement>("[data-whatsapp]");
  const summary = $<HTMLElement>("[data-summary]");
  const testNotice = $<HTMLElement>("[data-test-notice]");
  const shareBtn = $<HTMLButtonElement>("[data-share]");

  const endpoint = dialog.dataset.endpoint || "";
  const isDev = dialog.dataset.dev === "true";
  const successTemplate = dialog.dataset.successBody || "";
  const submitText = submitLabel.textContent || "";

  let current: "1" | "2" | "done" = "1";
  let opener: HTMLElement | null = null;
  let submitting = false;
  let closing = false;

  // Track which community link brought them here, e.g. ?src=tarneit-fb
  const params = new URLSearchParams(location.search);
  srcInput.value = (params.get("src") || params.get("utm_source") || "").slice(0, 60);

  const shareUrl = location.origin + location.pathname;
  const shareText = "Fresh atta, stone-ground to order in Melbourne. I've joined Poshan's early list:";
  whatsapp.href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  /* draft persistence */
  const saveDraft = () => {
    const draft: Draft = {
      goal: goalInput.value, goal_other: otherInput.value, first_name: nameInput.value,
      email: emailInput.value, suburb: suburbInput.value, mobile: mobileInput.value,
      blend: blendOptions.find((o) => o.checked)?.dataset.blendOption || "",
    };
    store.set(safeSession, DRAFT_KEY, draft);
  };
  const restoreDraft = () => {
    const d = store.get<Draft>(safeSession, DRAFT_KEY);
    if (!d) return;
    if (d.first_name) nameInput.value = d.first_name;
    if (d.email) emailInput.value = d.email;
    if (d.suburb) suburbInput.value = d.suburb;
    if (d.goal_other) otherInput.value = d.goal_other;
    if (d.blend) selectBlend(d.blend);
    if (d.mobile) { mobileInput.value = d.mobile; revealMobile(false); }
    if (d.goal) selectGoal(d.goal, false);
  };

  function setProgress(step: typeof current) {
    // Someone who chose a blend on the page skips the goal question entirely,
    // so step 2 is their only step.
    const goalSkipped = step === "2" && !goalInput.value;
    const pct = step === "1" ? 50 : step === "2" ? 85 : 100;
    progress.style.width = `${pct}%`;
    progressWrap.setAttribute("aria-valuenow", String(pct));
    stepLabel.textContent =
      step === "1" ? "Step 1 of 2" : step === "2" ? (goalSkipped ? "Last step" : "Step 2 of 2") : "All done";
    goalLine.hidden = !goalInput.value;
  }

  function showStep(step: typeof current, direction: "fwd" | "back" = "fwd", focus = true) {
    for (const [key, el] of Object.entries(steps)) el.hidden = key !== step;
    const el = steps[step];
    el.classList.remove("step-in", "step-back");
    void el.offsetWidth;
    if (!reduceMotion) el.classList.add(direction === "back" ? "step-back" : "step-in");
    current = step;
    setProgress(step);
    dialog.setAttribute("aria-labelledby", headings[step]);
    if (focus && dialog.open) document.getElementById(headings[step])?.focus({ preventScroll: true });
    panel.scrollTop = 0;
  }

  function selectGoal(id: string, advance: boolean) {
    const tile = tiles.find((t) => t.dataset.goalTile === id);
    if (!tile) return;
    tiles.forEach((t) => t.setAttribute("aria-pressed", String(t === tile)));
    goalInput.value = id;
    goalSummary.textContent = tile.dataset.label || id;
    nextBtn.disabled = false;
    otherWrap.hidden = id !== "other";
    saveDraft();
    if (id === "other") {
      if (advance) otherInput.focus();
      return;
    }
    if (advance) window.setTimeout(() => showStep("2"), reduceMotion ? 0 : 340);
  }

  // Pre-select the blend someone chose on the page; it is submitted as `blend`.
  function selectBlend(id: string) {
    const option = blendOptions.find((o) => o.dataset.blendOption === id);
    if (option) option.checked = true;
  }

  function revealMobile(focus = true) {
    mobileField.hidden = false;
    addMobile.hidden = true;
    if (focus) mobileInput.focus();
  }

  function showSuccess(details: Array<[string, string]>, testMode: boolean) {
    const name = details.find(([k]) => k === "Name")?.[1] || "";
    const email = details.find(([k]) => k === "Email")?.[1] || "";
    successTitle.textContent = name ? `Your sample request is in, ${name}.` : "Your sample request is in.";
    successText.textContent = successTemplate.replace("{email}", email || "you");
    summary.replaceChildren(
      ...details.filter(([, v]) => v).flatMap(([k, v]) => {
        const dt = document.createElement("dt");
        dt.className = "font-semibold text-ink-soft";
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.className = "font-bold text-charcoal break-words";
        dd.textContent = v;
        return [dt, dd];
      }),
    );
    testNotice.hidden = !testMode;
    const mark = dialog.querySelector(".success-mark");
    mark?.classList.remove("is-drawn");
    showStep("done");
    void (mark as HTMLElement | null)?.getBoundingClientRect();
    mark?.classList.add("is-drawn");
  }

  function open(opts: { goal?: string; blend?: string } = {}, trigger?: HTMLElement) {
    if (dialog.open) return;
    // Remember the trigger itself: Safari does not focus buttons on click.
    opener = trigger ?? (document.activeElement as HTMLElement | null);

    // Every visit goes through the form. Only someone who has just signed up
    // in this page view sees the confirmation again.
    if (current === "done") {
      showStep("done", "fwd", false);
    } else if (opts.blend) {
      // They already told us what they want: straight to their details.
      selectBlend(opts.blend);
      saveDraft();
      showStep("2", "fwd", false);
    } else if (opts.goal) {
      selectGoal(opts.goal, false);
      showStep(opts.goal === "other" ? "1" : "2", "fwd", false);
    } else {
      showStep(current, "fwd", false);
    }

    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    document.dispatchEvent(new CustomEvent("poshan:modal", { detail: { open: true } }));
    // Force a style flush so the transition runs from the closed state. Avoids rAF,
    // which browsers pause in background tabs and would leave the panel invisible.
    void panel.offsetWidth;
    dialog.classList.add("is-open");
    const focusTarget = opts.goal === "other" ? otherInput : document.getElementById(headings[current]);
    focusTarget?.focus({ preventScroll: true });
  }

  function close() {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove("is-open");
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      dialog.close();
      closing = false;
      document.documentElement.classList.remove("modal-open");
      document.dispatchEvent(new CustomEvent("poshan:modal", { detail: { open: false } }));
      opener?.focus({ preventScroll: true });
    };
    if (reduceMotion) return finish();
    panel.addEventListener("transitionend", (e) => { if (e.propertyName === "transform") finish(); }, { once: true });
    window.setTimeout(finish, 560);
  }

  /* validation */
  const fieldRules: Array<[HTMLInputElement, string, (v: string) => boolean]> = [
    [nameInput, "err-name", (v) => v.trim().length > 0],
    [emailInput, "err-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())],
    [suburbInput, "err-suburb", (v) => v.trim().length > 1],
  ];
  const setFieldError = (input: HTMLInputElement, errId: string, bad: boolean) => {
    input.setAttribute("aria-invalid", String(bad));
    const err = document.getElementById(errId);
    if (err) err.hidden = !bad;
  };
  function validate(): boolean {
    let firstBad: HTMLInputElement | null = null;
    for (const [input, errId, ok] of fieldRules) {
      const bad = !ok(input.value);
      setFieldError(input, errId, bad);
      if (bad && !firstBad) firstBad = input;
    }
    firstBad?.focus();
    return !firstBad;
  }

  function setLoading(on: boolean) {
    submitBtn.disabled = on;
    submitBtn.setAttribute("aria-busy", String(on));
    spinner.hidden = !on;
    submitLabel.textContent = on ? "Joining…" : submitText;
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (submitting || current !== "2") return;
    formError.hidden = true;
    if (!validate()) return;

    const data = new FormData(form);
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const details: Array<[string, string]> = [
      ["Name", name],
      ["Email", email],
      ["Suburb", suburbInput.value.trim()],
      ["Mobile", mobileInput.value.trim()],
      ["Goal", goalInput.value === "other" && otherInput.value.trim() ? otherInput.value.trim() : goalSummary.textContent || ""],
      ["Blend to try", blendOptions.find((o) => o.checked)?.value || ""],
    ];

    // Bots fill the honeypot. Show success, send nothing.
    if (String(data.get("_gotcha") || "")) { showSuccess(details, false); return; }

    data.set("first_name", name);
    data.set("email", email);
    data.set("suburb", suburbInput.value.trim());
    data.set("goal_label", goalSummary.textContent || "");
    data.set("page", location.href);

    submitting = true;
    setLoading(true);
    let testMode = false;
    try {
      if (!endpoint || endpoint === "PLACEHOLDER") {
        if (!isDev) throw new Error("not-configured");
        testMode = true;
        await new Promise((r) => setTimeout(r, 900));
        console.warn("[Poshan] PUBLIC_FORM_ENDPOINT is not set. Test mode: nothing was saved.", Object.fromEntries(data));
      } else {
        // URL-encoded body: read natively by Google Apps Script (e.parameter),
        // Formspree and Basin, and sent without a CORS preflight.
        const body = new URLSearchParams();
        data.forEach((v, k) => { if (typeof v === "string") body.append(k, v); });
        const res = await fetch(endpoint, { method: "POST", body, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(`http-${res.status}`);
        const reply = await res.json().catch(() => null);
        if (reply && reply.ok === false) throw new Error(reply.error || "rejected");
      }
      store.del(safeSession, DRAFT_KEY);
      showSuccess(details, testMode);
    } catch (err) {
      formError.textContent =
        err instanceof Error && err.message === "not-configured"
          ? "Sign-ups aren't switched on just yet. Please check back very soon."
          : "Something went wrong on our side. Please try again in a moment.";
      formError.hidden = false;
    } finally {
      submitting = false;
      setLoading(false);
    }
  }

  function resetAll() {
    store.del(safeSession, DRAFT_KEY);
    form.reset();
    tiles.forEach((t) => t.setAttribute("aria-pressed", "false"));
    goalInput.value = "";
    selectBlend("unsure");
    nextBtn.disabled = true;
    otherWrap.hidden = true;
    mobileField.hidden = true;
    addMobile.hidden = false;
    for (const [input, errId] of fieldRules) setFieldError(input, errId, false);
    showStep("1", "back");
  }

  /* wiring */
  document.addEventListener("click", (e) => {
    const trigger = (e.target as Element).closest<HTMLElement>("[data-open-signup]");
    if (!trigger) return;
    e.preventDefault();
    open({ goal: trigger.dataset.goal, blend: trigger.dataset.blend }, trigger);
  });

  dialog.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
  dialog.querySelectorAll<HTMLElement>("[data-close-signup]").forEach((el) =>
    el.addEventListener("click", (e) => {
      if (el.tagName !== "A") e.preventDefault();
      close();
    }),
  );

  tiles.forEach((t) => t.addEventListener("click", () => selectGoal(t.dataset.goalTile || "", true)));
  nextBtn.addEventListener("click", () => { if (goalInput.value) showStep("2"); });
  $<HTMLButtonElement>("[data-back]").addEventListener("click", () => showStep("1", "back"));
  addMobile.addEventListener("click", () => revealMobile(true));
  $<HTMLButtonElement>("[data-reset]").addEventListener("click", resetAll);

  form.addEventListener("input", (e) => {
    const input = e.target as HTMLInputElement;
    const rule = fieldRules.find(([i]) => i === input);
    if (rule && input.getAttribute("aria-invalid") === "true" && rule[2](input.value)) setFieldError(input, rule[1], false);
    saveDraft();
  });
  form.addEventListener("submit", submit);

  shareBtn.addEventListener("click", async () => {
    try {
      if (navigator.share) { await navigator.share({ title: "Poshan", text: shareText, url: shareUrl }); return; }
      await navigator.clipboard.writeText(shareUrl);
      shareBtn.textContent = "Link copied";
      window.setTimeout(() => (shareBtn.textContent = "Copy link"), 2200);
    } catch { /* user cancelled share */ }
  });

  restoreDraft();
}

/* ─── Mobile sticky CTA ──────────────────────────────────────────────────── */
function initSticky() {
  const bar = document.querySelector<HTMLElement>("[data-sticky-cta]");
  if (!bar || !("IntersectionObserver" in window)) return;
  const state = { heroOut: false, quiet: new Set<Element>(), modal: false };
  const update = () => {
    const show = state.heroOut && state.quiet.size === 0 && !state.modal;
    bar.classList.toggle("is-visible", show);
    bar.toggleAttribute("inert", !show);
  };

  const heroCta = document.querySelector("[data-hero-cta]");
  if (heroCta) {
    new IntersectionObserver(([entry]) => {
      state.heroOut = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    }).observe(heroCta);
  }

  // Hide the bar where a big CTA is already on screen, and over the footer.
  const quietZones = ["#join", "#final-cta", "footer"].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
  const quietIo = new IntersectionObserver((entries) => {
    for (const en of entries) en.isIntersecting ? state.quiet.add(en.target) : state.quiet.delete(en.target);
    update();
  }, { threshold: 0.15 });
  quietZones.forEach((z) => quietIo.observe(z));

  document.addEventListener("poshan:modal", (e) => {
    state.modal = (e as CustomEvent<{ open: boolean }>).detail.open;
    update();
  });
}

initReveal();
initSignup();
initSticky();

export {};
