(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const root = document.documentElement;
  const stage = $(".composition");
  const artwork = $(".artwork");
  const control = $("#balance");
  const rule = $(".rule");
  const captionBlock = $("#caption-block");
  const captionLead = $("#caption");
  const captionText = $("#caption-text");
  const announcement = $("#announcement");
  const toggle = $("#readings-toggle");
  const siteLabel = $("#site-label");
  const readingsPanel = $("#readings");
  const readingsList = $("#readings-list");
  const readingsCount = $("#readings-count");
  const readingsBack = $("#readings-back");
  const motionToggle = $("#motion-toggle");
  const hello = $("#hello");
  const themeColor = $('meta[name="theme-color"]');
  const glyphs = ["first-i", "first-o", "second-i", "second-o"].map(id => document.getElementById(id));
  const letterWords = [...document.querySelectorAll(".words-letters .word")];
  const binaryWords = [...document.querySelectorAll(".words-binary .word")];
  const measures = [...document.querySelectorAll(".measure")];
  const gridLines = $(".grid-lines");
  const bounds = $(".bounds");
  const portrait = matchMedia("(max-width: 600px), (max-aspect-ratio: 4/5)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  const grids = {
    landscape: { u: 68, x: 22, y: 34, cols: 17, rows: 9, width: 1200, height: 680 },
    portrait: { u: 56, x: 32, y: 12, cols: 11, rows: 16, width: 680, height: 920 }
  };

  // [column, row, width, height] in modules. Disjoint slots keep the forms
  // separate throughout interpolation; portrait frames use two stacked pairs.
  const frames = {
    landscape: [
      [[1, 1, 4, 1], [6, 5, 3, 3], [10, 3, 1, 5], [12, 1, 4, 4]],
      [[1, 1, 2, 7], [4, 4, 4, 4], [9, 1, 1, 3], [11, 3, 5, 5]],
      [[1, 2, 1, 5], [3, 2, 5, 5], [9, 2, 1, 5], [11, 2, 5, 5]],
      [[1, 3, 1, 6], [3, 1, 6, 6], [10, 7, 3, 1], [14, 2, 2, 2]],
      [[1, 1, 1, 8], [3, 7, 2, 2], [6, 1, 2, 1], [9, 2, 7, 7]]
    ],
    portrait: [
      [[1, 1, 5, 1], [7, 3, 3, 3], [3, 8, 1, 6], [6, 11, 4, 4]],
      [[1, 1, 2, 6], [4, 3, 4, 4], [1, 9, 1, 3], [3, 9, 6, 6]],
      [[2, 2, 1, 5], [4, 2, 5, 5], [2, 9, 1, 5], [4, 9, 5, 5]],
      [[1, 3, 1, 5], [3, 1, 6, 6], [2, 12, 3, 1], [7, 10, 3, 3]],
      [[1, 1, 1, 8], [3, 6, 2, 2], [1, 10, 3, 1], [5, 10, 5, 5]]
    ]
  };

  // Biography order is independent of discovery order.
  const readings = [
    {
      id: "signature", hint: "Find the center.",
      line: "I’m Alex, also known as ItsOkayItsOfficial.",
      lead: "Its Okay Its Official.", text: "I’m Alex. There’s more than one way to read this."
    },
    {
      id: "binary", hint: "Touch a letter. Or type 1.",
      line: "I’m director of AI operations for Insight’s finance organization.",
      lead: "Or one, zero, one, zero.", text: "I’m director of AI operations for Insight’s finance organization."
    },
    {
      id: "thunder", hint: "Back and forth, quickly.",
      line: "I lead Insight’s dedicated “Thundercats” team,",
      lead: "Thunder, thunder.", text: "I lead Insight’s dedicated “Thundercats” team."
    },
    {
      id: "edge", hint: "Go as far as you can.",
      line: "with a mandate to pioneer AI adoption across finance",
      lead: "All the way to the edge.", text: "My mandate is to pioneer AI adoption across finance."
    },
    {
      id: "construction", hint: "Press and hold. Or hold Space.",
      line: "and translate AI strategy into measurable business outcomes.",
      lead: "Everything here is measured.", text: "I translate AI strategy into measurable business outcomes."
    },
    {
      id: "agents", hint: "Leave it alone for a while.",
      line: "My work spans building and deploying AI agents,",
      lead: "Left alone, it carries on.", text: "I build and deploy AI agents."
    },
    {
      id: "adoption", hint: "Keep at it.",
      line: "tracking adoption across hundreds of finance users,",
      lead: "Twenty compositions. Noted.", text: "I track adoption across hundreds of finance users."
    },
    {
      id: "levels", hint: "Turn it sideways. Or press R.",
      line: "and providing thought leadership to the organization at every level.",
      lead: "Stacked or in a line, it still reads.", text: "I provide thought leadership to the organization at every level."
    }
  ];
  const readingById = Object.fromEntries(readings.map(reading => [reading.id, reading]));

  const found = new Set();
  const loadedAt = performance.now();
  const construct = { pointer: false, key: false, toggled: false };
  const shake = { dir: 0, extreme: null, reversals: [], quietUntil: 0 };
  const captionQueue = [];
  let layout = portrait.matches ? "portrait" : "landscape";
  let position = Number(control.value) / 1000;
  let target = position;
  let morph = 0;
  let morphTarget = 0;
  let animation = 0;
  let lastTime = 0;
  let aligned = false;
  let binary = false;
  let gesture = null;
  let holdTimer = 0;
  let keyHoldTimer = 0;
  let agent = null;
  let agentRuns = 0;
  let motionPaused = false;
  let lastActivity = performance.now();
  let compositions = 0;
  let burstTimer = 0;
  let controlPointer = false;
  let captionUntil = 0;
  let captionTimer = 0;
  let captionSwap = 0;
  let captionShown = "";
  let pulseTimer = 0;
  let titleTimer = 0;

  const now = () => performance.now();
  const mix = (a, b, t) => a + (b - a) * t;
  const clamp = value => Math.max(0, Math.min(1, value));
  const modules = value => {
    const whole = Math.round(value);
    return Math.abs(value - whole) < .02 ? String(whole) : value.toFixed(1);
  };
  const flagWidth = ({ w, h }, flag) => Math.min(w * .9, h - Math.min(w, h) * .9) * flag;

  function geometry() {
    const set = frames[layout];
    const grid = grids[layout];
    const segment = Math.min(3, Math.floor(position * 4));
    const fraction = position * 4 - segment;
    const eased = fraction * fraction * (3 - 2 * fraction);
    return set[segment].map((from, i) => {
      const [c, r, w, h] = from.map((value, k) => mix(value, set[segment + 1][i][k], eased));
      return { x: grid.x + c * grid.u, y: grid.y + r * grid.u, w: w * grid.u, h: h * grid.u };
    });
  }

  function bar(box, flag) {
    const { x, y, w, h } = box;
    if (flag <= 0) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
    const reach = flagWidth(box, flag);
    const thickness = Math.min(w, h) * .9;
    return `M${x} ${y}H${x + w}V${y + h}H${x}V${y + thickness}` +
      `L${x - reach} ${y + thickness + reach}V${y + reach}Z`;
  }

  function ring({ x, y, w }, squeeze) {
    const r = w / 2;
    const cx = x + r;
    const cy = y + r;
    const rx = r * (1 - .28 * squeeze);
    const stroke = w * .2;
    const ix = rx - stroke;
    const iy = r - stroke;
    return `M${cx} ${cy - r}A${rx} ${r} 0 1 0 ${cx} ${cy + r}A${rx} ${r} 0 1 0 ${cx} ${cy - r}Z` +
      `M${cx} ${cy - iy}A${ix} ${iy} 0 1 1 ${cx} ${cy + iy}A${ix} ${iy} 0 1 1 ${cx} ${cy - iy}Z`;
  }

  function render() {
    const grid = grids[layout];
    const boxes = geometry();
    let outline = "";
    boxes.forEach((box, i) => {
      const isRing = i % 2 === 1;
      const inset = isRing ? box.w / 2 * .28 * morph : -flagWidth(box, morph);
      const left = box.x + inset;
      const width = box.w - inset * (isRing ? 2 : 1);
      glyphs[i].setAttribute("d", isRing ? ring(box, morph) : bar(box, morph));
      for (const word of [letterWords[i], binaryWords[i]]) {
        word.setAttribute("x", left.toFixed(1));
        word.setAttribute("y", (box.y + box.h + grid.u * .62).toFixed(1));
      }
      outline += `M${left} ${box.y}h${width}v${box.h}h${-width}Z`;
      measures[i].textContent = `${modules(width / grid.u)} × ${modules(box.h / grid.u)}`;
      measures[i].setAttribute("x", left.toFixed(1));
      measures[i].setAttribute("y", (box.y - grid.u * .22).toFixed(1));
    });
    bounds.setAttribute("d", outline);

    const shown = agent ? position : target;
    rule.style.left = `${1 + shown * (stage.clientWidth - 2)}px`;
    if (agent) control.value = String(Math.round(position * 1000));

    const nowAligned = target === .5 && Math.abs(position - .5) < .002;
    if (nowAligned !== aligned) {
      aligned = nowAligned;
      stage.classList.toggle("is-aligned", aligned);
      if (aligned) {
        if (!discover("signature")) say("Aligned: I O I O.");
      } else {
        stage.classList.remove("over-glyph");
        setBinary(false);
      }
      refreshCaption();
    }
  }

  function frame(time) {
    const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
    lastTime = time;
    position = mix(position, target, 1 - Math.exp(-delta / (agent ? 520 : 65)));
    if (Math.abs(position - target) < .0001) position = target;
    morph = mix(morph, morphTarget, 1 - Math.exp(-delta / 90));
    if (Math.abs(morph - morphTarget) < .001) morph = morphTarget;
    render();
    if (position !== target || morph !== morphTarget) {
      animation = requestAnimationFrame(frame);
    } else {
      animation = 0;
      lastTime = 0;
    }
  }

  function kick() {
    // Input can observe a preference change before its media-query event arrives.
    const reduce = reducedMotion.matches;
    motionToggle.hidden = reduce || !agentRuns;
    if (reduce) {
      cancelAnimationFrame(animation);
      animation = 0;
      lastTime = 0;
      position = target;
      morph = morphTarget;
      render();
    } else if (!animation && !document.hidden) {
      animation = requestAnimationFrame(frame);
    }
  }

  function compose(value, { snap = false, source = "user", input = "pointer" } = {}) {
    if (source === "agent" && reducedMotion.matches) {
      stopAgent();
      return;
    }
    if (source === "user") stopAgent();
    const next = Math.round(clamp(value) * 100) / 100;
    const previous = target;
    target = snap && Math.abs(next - .5) <= .015 ? .5 : next;
    if (source === "user") {
      trackShake(previous, target, input === "key" ? .009 : .03);
      if (target >= .99) discover("edge");
    }
    if (target !== .5) setBinary(false);
    control.value = String(Math.round(target * 1000));
    control.setAttribute("aria-valuetext", target === .5 ? "Center: the IOIO signature" : `${Math.round(target * 100)} percent`);
    kick();
  }

  function composeAt(clientX) {
    const box = stage.getBoundingClientRect();
    compose((clientX - box.left - 1) / (box.width - 2), { snap: true });
  }

  function setBinary(on) {
    if (on === binary) return;
    binary = on;
    morphTarget = on ? 1 : 0;
    stage.classList.toggle("is-binary", on);
    if (on && !discover("binary")) say("One, zero, one, zero.");
    refreshCaption();
    kick();
  }

  function updateConstruction() {
    const on = construct.pointer || construct.key || construct.toggled;
    stage.classList.toggle("is-constructing", on);
    if (on) discover("construction");
  }

  function drawGrid() {
    const grid = grids[layout];
    let d = "";
    for (let c = 0; c <= grid.cols; c++) d += `M${grid.x + c * grid.u} ${grid.y}V${grid.y + grid.rows * grid.u}`;
    for (let r = 0; r <= grid.rows; r++) d += `M${grid.x} ${grid.y + r * grid.u}H${grid.x + grid.cols * grid.u}`;
    gridLines.setAttribute("d", d);
  }

  function overGlyph({ clientX, clientY }) {
    return glyphs.some(glyph => {
      const box = glyph.getBoundingClientRect();
      return clientX >= box.left - 10 && clientX <= box.right + 10 && clientY >= box.top - 10 && clientY <= box.bottom + 10;
    });
  }

  // Five reversals inside 1.4 seconds reveal the storm without flashing.
  function trackShake(from, value, threshold) {
    const time = now();
    if (time < shake.quietUntil) return;
    if (shake.extreme === null) shake.extreme = from;
    const delta = value - shake.extreme;
    if (shake.dir === 0) {
      if (Math.abs(delta) >= threshold) {
        shake.dir = Math.sign(delta);
        shake.extreme = value;
      }
      return;
    }
    if (Math.sign(delta) === shake.dir) {
      shake.extreme = value;
      return;
    }
    if (Math.abs(delta) < threshold) return;
    shake.dir = -shake.dir;
    shake.extreme = value;
    shake.reversals = shake.reversals.filter(stamp => time - stamp < 1400);
    shake.reversals.push(time);
    if (shake.reversals.length >= 5) {
      shake.reversals = [];
      shake.dir = 0;
      shake.extreme = null;
      shake.quietUntil = time + 1200;
      toggleStorm();
    }
  }

  function toggleStorm() {
    const on = root.classList.toggle("storm");
    themeColor.setAttribute("content", on ? "#111111" : "#ffffff");
    if (!on) say("The storm passes.");
    else if (!discover("thunder")) say("Thunder, thunder.");
  }

  function countComposition() {
    compositions += 1;
    if (compositions >= 20) discover("adoption");
  }

  function startAgent() {
    agentRuns += 1;
    lastActivity = now();
    discover("agents");
    // Keep the reading available without autonomous movement under reduced motion.
    if (reducedMotion.matches) return;
    motionToggle.hidden = false;
    const route = target < .5 ? [.8, .22, .5] : [.2, .78, .5];
    agent = { timers: [] };
    route.forEach((value, i) => {
      agent.timers.push(setTimeout(() => {
        compose(value, { source: "agent" });
        if (i === route.length - 1 && agent) agent.timers.push(setTimeout(() => stopAgent(false), 2600));
      }, 900 + i * 2600));
    });
  }

  function stopAgent(interrupted = true) {
    if (!agent) return;
    agent.timers.forEach(clearTimeout);
    agent = null;
    if (interrupted) target = Math.round(position * 100) / 100;
    control.value = String(Math.round(target * 1000));
    control.setAttribute("aria-valuetext", target === .5 ? "Center: the IOIO signature" : `${Math.round(target * 100)} percent`);
    lastActivity = now();
    kick();
  }

  function discover(id) {
    if (found.has(id)) return false;
    found.add(id);
    const reading = readingById[id];
    queueCaption([reading.lead, reading.text]);
    updateReadings(true);
    if (found.size === readings.length) {
      queueCaption(["That’s all eight.", "Thanks for reading closely. Say hello."]);
      hello.classList.add("is-invited");
    }
    return true;
  }

  function say(message) {
    announcement.textContent = message;
  }

  function ambientCaption() {
    if (aligned && binary) return ["1010.", "One, zero, one, zero: ten, in binary."];
    if (aligned) return ["IOIO.", "Its Okay Its Official."];
    if (found.size === readings.length) return ["Move the red rule.", "All eight readings found."];
    return ["Move the red rule.", finePointer.matches ? "Drag to compose. Arrow keys work, too." : "Drag to compose."];
  }

  function showCaption([lead, text], tone) {
    const key = `${tone}|${lead}|${text}`;
    if (key === captionShown) return;
    captionShown = key;
    clearTimeout(captionSwap);
    const apply = () => {
      captionLead.textContent = lead;
      captionText.textContent = text;
      captionBlock.dataset.tone = tone;
      captionBlock.classList.remove("is-changing");
    };
    if (reducedMotion.matches) return apply();
    captionBlock.classList.add("is-changing");
    captionSwap = setTimeout(apply, 180);
  }

  function queueCaption(lines) {
    captionQueue.push(lines);
    pumpCaption();
  }

  // Ambient copy waits while each discovered line has its moment.
  function pumpCaption() {
    if (now() < captionUntil) return;
    const next = captionQueue.shift();
    if (!next) return showCaption(ambientCaption(), "ambient");
    showCaption(next, "reading");
    say(next.join(" "));
    captionUntil = now() + 5200;
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => {
      captionUntil = 0;
      pumpCaption();
    }, 5200);
  }

  function refreshCaption() {
    if (now() >= captionUntil && !captionQueue.length) showCaption(ambientCaption(), "ambient");
  }

  function updateReadings(fresh) {
    const count = found.size;
    for (const item of readingsList.children) {
      const reading = readingById[item.dataset.reading];
      const isFound = found.has(reading.id);
      item.classList.toggle("is-hint", !isFound);
      item.replaceChildren();
      if (!isFound) {
        const label = document.createElement("span");
        label.className = "sr-only";
        label.textContent = "Not yet found. Hint: ";
        item.append(label);
      }
      item.append(isFound ? reading.line : reading.hint);
    }
    toggle.hidden = count === 0;
    siteLabel.hidden = count > 0;
    toggle.textContent = `${count} of ${readings.length} readings`;
    readingsCount.textContent = count === readings.length
      ? "All eight readings. Thank you for looking closely."
      : `${count} of ${readings.length} readings found.`;
    if (fresh) {
      toggle.classList.add("is-new");
      clearTimeout(pulseTimer);
      pulseTimer = setTimeout(() => toggle.classList.remove("is-new"), 1600);
    }
  }

  function setReadings(open, focusTarget) {
    if (open === !readingsPanel.hidden) return;
    readingsPanel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-reading", open);
    stage.inert = open;
    if (open) {
      stopAgent();
      readingsPanel.focus({ preventScroll: true });
    } else {
      focusTarget?.focus({ preventScroll: true });
    }
  }

  function relayout(next = portrait.matches ? "portrait" : "landscape") {
    const changed = next !== layout;
    const grid = grids[next];
    layout = next;
    root.dataset.layout = next;
    artwork.setAttribute("viewBox", `0 0 ${grid.width} ${grid.height}`);
    drawGrid();
    render();
    if (changed && now() - loadedAt > 800) discover("levels");
  }

  control.addEventListener("pointerdown", () => { controlPointer = true; });
  addEventListener("pointerup", () => { controlPointer = false; });
  addEventListener("pointercancel", () => { controlPointer = false; });
  function settleComposition() {
    clearTimeout(burstTimer);
    burstTimer = setTimeout(countComposition, 600);
  }

  const keySteps = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 1, PageDown: -1 };
  function steer(event) {
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else if (event.key in keySteps) {
      const direction = keySteps[event.key];
      // Shift and Page keys move to the next tenth, so the center remains reachable.
      next = event.shiftKey || event.key.startsWith("Page")
        ? (direction > 0 ? Math.floor(target * 10 + 1e-6) + 1 : Math.ceil(target * 10 - 1e-6) - 1) / 10
        : target + direction * .01;
    } else {
      return false;
    }
    event.preventDefault();
    compose(next, { input: "key" });
    settleComposition();
    return true;
  }

  control.addEventListener("input", () => {
    compose(Number(control.value) / 1000, { input: controlPointer ? "pointer" : "key" });
    settleComposition();
  });

  // Keep the range focused after clicking the artwork; otherwise focus falls back to the body.
  stage.addEventListener("mousedown", event => {
    if (event.target !== control) event.preventDefault();
  });

  stage.addEventListener("pointerdown", event => {
    if (event.target === control || !event.isPrimary || event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    control.focus({ preventScroll: true });
    const onGlyph = aligned && overGlyph(event);
    gesture = {
      id: event.pointerId, x: event.clientX, y: event.clientY, type: event.pointerType,
      onGlyph, moved: false, held: false, composed: !onGlyph
    };
    if (!onGlyph) composeAt(event.clientX);
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      if (!gesture || gesture.moved) return;
      gesture.held = true;
      construct.pointer = true;
      updateConstruction();
    }, 550);
  });

  stage.addEventListener("pointermove", event => {
    if (!gesture) {
      stage.classList.toggle("over-glyph", aligned && overGlyph(event));
      return;
    }
    if (event.pointerId !== gesture.id) return;
    if (!gesture.moved && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 6) {
      gesture.moved = true;
      if (!gesture.held) clearTimeout(holdTimer);
    }
    if (gesture.moved || !gesture.onGlyph) {
      composeAt(event.clientX);
      gesture.composed = true;
    }
  });

  function release(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    const ended = gesture;
    gesture = null;
    clearTimeout(holdTimer);
    if (stage.hasPointerCapture(ended.id)) stage.releasePointerCapture(ended.id);
    if (event.type === "pointerup" && ended.onGlyph && !ended.moved && !ended.held) setBinary(!binary);
    if (event.type === "pointerup" && ended.composed) countComposition();
    if (construct.pointer) {
      construct.pointer = false;
      updateConstruction();
    }
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("lostpointercapture", release);
  stage.addEventListener("contextmenu", event => {
    if (gesture && gesture.type !== "mouse") event.preventDefault();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !readingsPanel.hidden) {
      event.preventDefault();
      setReadings(false, toggle);
      return;
    }
    if (!readingsPanel.hidden || event.metaKey || event.ctrlKey || event.altKey) return;
    const free = event.target === control || event.target === document.body;
    if (!free && !event.target.matches?.("button, a")) return;
    if (steer(event) || !free) return;
    const key = event.key.toLowerCase();
    if (key === "escape") {
      event.preventDefault();
      compose(.5);
    } else if (aligned && (key === "1" || key === "0")) {
      setBinary(true);
    } else if (aligned && (key === "i" || key === "o")) {
      setBinary(false);
    } else if (key === "r" && !event.repeat) {
      relayout(layout === "portrait" ? "landscape" : "portrait");
    } else if (key === "g" && !event.repeat) {
      construct.toggled = !construct.toggled;
      updateConstruction();
    } else if ((key === " " || key === "enter") && event.target === control) {
      event.preventDefault();
      if (!event.repeat && !keyHoldTimer) {
        keyHoldTimer = setTimeout(() => {
          construct.key = true;
          updateConstruction();
        }, 550);
      }
    }
  });

  function releaseKey() {
    clearTimeout(keyHoldTimer);
    keyHoldTimer = 0;
    if (construct.key) {
      construct.key = false;
      updateConstruction();
    }
  }
  document.addEventListener("keyup", event => {
    if (event.key === " " || event.key === "Enter") releaseKey();
  });
  control.addEventListener("blur", releaseKey);

  function cancelGesture() {
    if (gesture) release({ pointerId: gesture.id, type: "pointercancel" });
    releaseKey();
    controlPointer = false;
  }
  addEventListener("blur", cancelGesture);

  toggle.addEventListener("click", () => setReadings(readingsPanel.hidden, toggle));
  readingsBack.addEventListener("click", () => setReadings(false, control));
  motionToggle.addEventListener("click", () => {
    motionPaused = !motionPaused;
    motionToggle.textContent = motionPaused ? "Resume motion" : "Pause motion";
    motionToggle.setAttribute("aria-pressed", String(motionPaused));
    stopAgent();
    lastActivity = now();
  });

  const markActive = event => {
    lastActivity = now();
    if (event.type === "pointerdown" || event.type === "keydown") stopAgent();
  };
  for (const type of ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"]) {
    addEventListener(type, markActive, { capture: true, passive: true });
  }

  setInterval(() => {
    if (motionPaused || agent || gesture || controlPointer || keyHoldTimer || document.hidden || !readingsPanel.hidden) return;
    if (now() - lastActivity >= (agentRuns ? 60000 : 16000)) startAgent();
  }, 1000);

  const title = document.title;
  document.addEventListener("visibilitychange", () => {
    clearTimeout(titleTimer);
    if (document.hidden) {
      cancelGesture();
      stopAgent();
      cancelAnimationFrame(animation);
      animation = 0;
      lastTime = 0;
      document.title = "It’s okay.";
    } else {
      lastActivity = now();
      document.title = "It’s official.";
      titleTimer = setTimeout(() => { document.title = title; }, 3000);
      kick();
    }
  });

  readingsList.replaceChildren(...readings.map(reading => {
    const item = document.createElement("li");
    item.dataset.reading = reading.id;
    return item;
  }));
  new ResizeObserver(() => render()).observe(stage);
  portrait.addEventListener("change", () => relayout());
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) stopAgent();
    motionToggle.hidden = reducedMotion.matches || !agentRuns;
    kick();
  });
  finePointer.addEventListener("change", refreshCaption);
  control.disabled = false;
  updateReadings(false);
  relayout();
  refreshCaption();
})();
