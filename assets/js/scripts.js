/* IOIO Proof 12: a printing calculator whose tape gets audited in pencil. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const SVG = "http://www.w3.org/2000/svg";
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const still = () => motion.matches;
  const sleep = (ms) => new Promise((done) => setTimeout(done, still() ? 0 : ms));
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {}
    },
  };

  const desk = $(".desk");
  const tape = $("#tape");
  const machine = $("#machine");
  const keys = $("#keys");
  const back = $("#back");
  const lcd = $("#lcd");
  const soundSwitch = $("#sound");
  let roll = $("#roll");
  let strip = null;

  /* Sound: synthesized on the spot, silent until switched on. */
  let armed = false;
  const arm = () => (armed = true);
  addEventListener("pointerdown", arm, { capture: true, once: true });
  addEventListener("keydown", arm, { capture: true, once: true });

  const sound = (() => {
    let on = store.get("ioio:sound") === "1";
    let ctx = null;
    let noise = null;

    function ready() {
      if (!on || !armed) return null;
      if (!ctx) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        ctx = new Context();
        noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function play(buffer, type, frequency, q, gain) {
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const level = ctx.createGain();
      source.buffer = buffer;
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = q;
      level.gain.value = gain;
      source.connect(filter).connect(level).connect(ctx.destination);
      source.start();
      return filter;
    }

    // One buffer per printed line: a short burst for every column the head strikes.
    function chatter(times, seconds) {
      if (!ready()) return;
      const rate = ctx.sampleRate;
      const buffer = ctx.createBuffer(1, Math.ceil((seconds + 0.03) * rate), rate);
      const data = buffer.getChannelData(0);
      const burst = Math.floor(0.0035 * rate);
      for (const time of times) {
        const start = Math.floor(time * rate);
        const amp = rand(0.5, 1);
        for (let i = 0; i < burst && start + i < data.length; i++) {
          data[start + i] += (Math.random() * 2 - 1) * amp * Math.exp(-i / (burst / 4));
        }
      }
      play(buffer, "bandpass", 2600, 0.9, 0.22);
    }

    function feed(steps, stepMs) {
      if (!ready()) return;
      const now = ctx.currentTime;
      for (let i = 0; i < steps; i++) {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const level = ctx.createGain();
        const t = now + (i * stepMs) / 1000;
        osc.type = "square";
        osc.frequency.value = rand(85, 105);
        filter.type = "lowpass";
        filter.frequency.value = 700;
        level.gain.setValueAtTime(0.0001, t);
        level.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
        level.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
        osc.connect(filter).connect(level).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      }
    }

    function click() {
      if (!ready()) return;
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const level = ctx.createGain();
      const t = ctx.currentTime;
      source.buffer = noise;
      filter.type = "highpass";
      filter.frequency.value = 1800;
      level.gain.setValueAtTime(0.08, t);
      level.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);
      source.connect(filter).connect(level).connect(ctx.destination);
      source.start(t, Math.random() * 0.5, 0.03);
    }

    function rip() {
      if (!ready()) return;
      const rate = ctx.sampleRate;
      const seconds = 0.32;
      const buffer = ctx.createBuffer(1, Math.ceil(seconds * rate), rate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        const crackle = Math.random() < 0.08 ? rand(0.6, 1) : rand(0.05, 0.3);
        data[i] = (Math.random() * 2 - 1) * crackle * Math.sin(Math.PI * Math.min(1, t * 1.3));
      }
      const filter = play(buffer, "bandpass", 1400, 0.7, 0.5);
      filter.frequency.linearRampToValueAtTime(3600, ctx.currentTime + seconds);
    }

    function scratch(ms) {
      if (!ready() || ms <= 0) return;
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const level = ctx.createGain();
      const start = ctx.currentTime;
      const end = start + ms / 1000;
      source.buffer = noise;
      source.loop = true;
      filter.type = "bandpass";
      filter.frequency.value = 5200;
      filter.Q.value = 0.6;
      level.gain.setValueAtTime(0.0001, start);
      for (let t = start; t < end; t += 0.07) level.gain.linearRampToValueAtTime(rand(0.004, 0.028), t);
      level.gain.linearRampToValueAtTime(0.0001, end + 0.05);
      source.connect(filter).connect(level).connect(ctx.destination);
      source.start(start);
      source.stop(end + 0.1);
    }

    return {
      get on() {
        return on;
      },
      set(value) {
        on = value;
        store.set("ioio:sound", value ? "1" : "0");
        click();
      },
      chatter,
      feed,
      click,
      rip,
      scratch,
    };
  })();

  /* The print head: 5x7 dot matrix through a two-color ribbon. */
  const GLYPHS = {
    0: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    3: ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
    4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
    7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    ".": ["00", "00", "00", "00", "00", "11", "11"],
    ",": ["00", "00", "00", "00", "01", "01", "10"],
    ":": ["00", "11", "11", "00", "11", "11", "00"],
    "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
    "×": ["00000", "10001", "01010", "00100", "01010", "10001", "00000"],
    "÷": ["00000", "00100", "00000", "11111", "00000", "00100", "00000"],
    "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
    "*": ["00000", "00100", "10101", "01110", "10101", "00100", "00000"],
    "#": ["01010", "01010", "11111", "01010", "11111", "01010", "01010"],
    C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    " ": ["000", "000", "000", "000", "000", "000", "000"],
  };
  const SAY = { "+": "plus", "-": "minus", "×": "times", "÷": "divided by", "=": "equals", "*": "total", C: "clear" };

  function metrics() {
    const w = roll.clientWidth || 260;
    const p = Math.max(1.55, Math.min(2.25, w / 136));
    return { w, p, h: Math.round(p * 10.5) };
  }

  // Dot centers for a string set flush right against `right`.
  function dots(text, right, p) {
    const glyphs = [...text].map((ch) => GLYPHS[ch] || GLYPHS[" "]);
    let x = right - glyphs.reduce((sum, g) => sum + (g[0].length + 1) * p, -p);
    const out = [];
    for (const g of glyphs) {
      g.forEach((row, r) => {
        for (let c = 0; c < row.length; c++) {
          if (row[c] === "1") out.push([x + c * p + p / 2, r * p + p / 2]);
        }
      });
      x += (g[0].length + 1) * p;
    }
    return out;
  }

  function strike(canvas, spec, m, pace) {
    const { w, p, h } = m;
    const g = canvas.getContext("2d");
    const scale = canvas.width / w;
    g.setTransform(scale, 0, 0, scale, 0, 0);
    const top = (h - 7 * p) / 2;
    const right = w - 16;
    const pts = [...dots(spec.sym || "", right, p), ...dots(spec.text, right - 8 * p, p)];
    pts.sort((a, b) => a[0] - b[0]);
    const ink = spec.red ? "184,50,42" : "27,28,32";
    const wear = rand(0.92, 1);
    const phase = rand(0, Math.PI * 2);
    const ms = still() || !pts.length ? 0 : Math.min(420, 140 + pts.length * 1.6) / pace;
    const minX = pts.length ? pts[0][0] : 0;
    const span = pts.length ? pts[pts.length - 1][0] - minX || 1 : 1;

    if (ms && sound.on) {
      const columns = [...new Set(pts.map(([x]) => Math.round(x / p)))];
      sound.chatter(columns.map((col) => ((col * p - minX) / span) * (ms / 1000)), ms / 1000);
    }

    return new Promise((done) => {
      let i = 0;
      const start = performance.now();
      const frame = (now) => {
        const reach = minX + span * (ms ? Math.min(1, (now - start) / ms) : 1);
        while (i < pts.length && pts[i][0] <= reach + 0.01) {
          const [x, y] = pts[i++];
          let alpha = wear * (0.94 + 0.06 * Math.sin(x * 0.045 + phase)) * rand(0.86, 1);
          if (Math.random() < 0.025) alpha *= 0.45;
          g.fillStyle = `rgba(${ink},${alpha.toFixed(3)})`;
          g.beginPath();
          g.arc(x + rand(-0.06, 0.06) * p, top + y + rand(-0.06, 0.06) * p, p * rand(0.5, 0.58), 0, Math.PI * 2);
          g.fill();
        }
        if (i < pts.length) requestAnimationFrame(frame);
        else done();
      };
      requestAnimationFrame(frame);
    });
  }

  /* The tape: every print, feed, and note waits its turn. */
  let chain = Promise.resolve();
  let backlog = 0;

  function job(task) {
    backlog++;
    chain = chain
      .then(task)
      .catch((error) => console.error(error))
      .finally(() => backlog--);
    return chain;
  }

  function trim() {
    while (roll.children.length > 240) roll.children[1].remove();
  }

  async function feed(h) {
    tape.scrollTop = tape.scrollHeight;
    if (still() || h <= 0) return;
    const steps = Math.max(2, Math.round(h / 7));
    const stepMs = backlog > 2 ? 12 : 24;
    sound.feed(steps, stepMs);
    await roll.animate([{ transform: `translateY(${h}px)` }, { transform: "translateY(0)" }], {
      duration: steps * stepMs,
      easing: `steps(${steps}, jump-start)`,
    }).finished;
  }

  function print(spec) {
    return job(async () => {
      const m = metrics();
      const li = document.createElement("li");
      const canvas = document.createElement("canvas");
      const said = document.createElement("span");
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      li.className = "line";
      li.style.height = `${m.h}px`;
      canvas.width = Math.round(m.w * dpr);
      canvas.height = Math.round(m.h * dpr);
      canvas.setAttribute("aria-hidden", "true");
      said.className = "sr-only";
      said.textContent = spec.say || `${spec.text} ${SAY[spec.sym] || ""}`.trim();
      li.append(canvas, said);
      roll.append(li);
      trim();
      await feed(m.h);
      await strike(canvas, spec, m, backlog > 2 ? 2 : 1);
      echo(spec.text, spec.sym, spec.red);
      if (spec.total) sleep(160).then(() => tick(li));
      if (spec.aside) write(aside(li, spec.aside));
      return li;
    });
  }

  /* The pencil: Alex's hand, one word at a time. */
  const TICK = "M2.5 11.2c2 1.1 3.7 3 5.1 5.7C11 10.3 16.2 5 23.6 1.6";

  function words(el, text) {
    text.split(" ").forEach((word, i) => {
      if (i) el.append(" ");
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = word;
      el.append(span);
    });
  }

  function stroke(className, viewBox, paths) {
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");
    for (const d of paths) {
      const path = document.createElementNS(SVG, "path");
      path.setAttribute("d", d);
      path.setAttribute("data-draw", "");
      svg.append(path);
    }
    return svg;
  }

  // Hide pencil strokes until they are drawn.
  function prime(el) {
    for (const path of el.querySelectorAll("path[data-draw]")) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      path.style.strokeDashoffset = still() ? "0" : `${len}`;
    }
  }

  function draw(path, ms = 260) {
    if (still()) return Promise.resolve();
    const len = path.getTotalLength();
    return path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: ms,
      easing: "cubic-bezier(.55,0,.25,1)",
      fill: "forwards",
    }).finished;
  }

  function write(el) {
    let t = 0;
    for (const w of el.querySelectorAll(".w")) {
      const ms = w.textContent.length * 38;
      w.style.setProperty("--d", `${t}ms`);
      w.style.setProperty("--t", `${ms}ms`);
      t += ms + 60;
    }
    if (still()) return Promise.resolve();
    el.classList.add("writing");
    sound.scratch(t);
    return sleep(t).then(async () => {
      for (const path of el.querySelectorAll("path[data-draw]")) await draw(path);
    });
  }

  function tick(li) {
    const svg = stroke("tick", "0 0 26 20", [TICK]);
    svg.style.rotate = `${rand(-9, 5).toFixed(1)}deg`;
    li.append(svg);
    prime(svg);
    return draw(svg.firstChild, 240);
  }

  function aside(li, text) {
    const span = document.createElement("span");
    span.className = "aside";
    span.setAttribute("aria-hidden", "true");
    words(span, text);
    li.append(span);
    return span;
  }

  function note(text, options = {}) {
    return job(async () => {
      const li = document.createElement("li");
      const line = document.createElement("p");
      li.className = "note";
      li.style.setProperty("--tilt", `${rand(-1.1, 0.4).toFixed(2)}deg`);
      words(line, text);
      li.append(line);
      if (options.initials) {
        const sign = document.createElement("p");
        sign.className = "initials";
        words(sign, options.initials);
        sign.append(stroke("tick", "0 0 26 20", [TICK]));
        li.append(sign);
      }
      if (options.arrow) li.append(stroke("arrow", "0 0 40 46", ["M9 3c-4 11 1 25 22 37", "M21 38.5l10.5 1.8-3.6-9.4"]));
      roll.append(li);
      prime(li);
      trim();
      const height = Math.ceil(li.getBoundingClientRect().height);
      li.style.height = `${height}px`;
      await feed(height);
      console.log(`%c${[text, options.initials].filter(Boolean).join("  ")}`, "font: italic 13px/1.5 Georgia, serif; color: #4a4e55; padding: 0 10px;");
      write(li);
      await sleep(140);
      return li;
    });
  }

  /* What the pencil writes, one total at a time: margin notes, with the full story on the back. */
  const NOTES = [
    "Me: Alex Pugh. Dir., AI ops, Insight.",
    "Team: Thundercats. Goal: AI adoption.",
    "AI agents: built, deployed. Adoption: tracked.",
    "Strategy in, outcomes out. Every level.",
  ];
  let told = 0;

  function audit(text, line) {
    if (text === "0.7734" || text === "7,734") note("hELLO to you, too.");
    if (told < NOTES.length) note(NOTES[told]);
    if (told === 1) note("Or tear it off. There’s more on the back.");
    if (told === NOTES.length) {
      line.then((li) => li && sleep(420).then(() => underline(li, text)));
      note("It adds up. It’s okay, it’s official.", { initials: "A.P." });
      note("Tear here to read the back.", { arrow: true });
    }
    told++;
  }

  // The accountant's double rule under the total being signed off.
  function underline(li, text) {
    const { p } = metrics();
    const width = [...text].reduce((sum, ch) => sum + ((GLYPHS[ch] || GLYPHS[" "])[0].length + 1) * p, -p);
    const svg = stroke("rule", "0 0 60 8", ["M2 2.2c18-.9 37-.6 56 .3", "M3 6.4c17-.7 35-.5 54 .2"]);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.width = `${Math.max(16, width + 6)}px`;
    svg.style.right = `${16 + 8 * p - 3}px`;
    li.style.zIndex = "1";
    li.append(svg);
    prime(svg);
    return [...svg.children].reduce((done, path) => done.then(() => draw(path, 200)), Promise.resolve());
  }

  // Developers get the tape in the console, too.
  function echo(text, sym, red) {
    console.log(`%c${text.padStart(16)}  ${sym || " "}`, `font: 12px/1.4 ui-monospace, Menlo, Consolas, monospace; color: ${red ? "#b8322a" : "#1c1d22"}; background: #f7f7f3; padding: 0 10px;`);
  }

  /* Arithmetic, adding-machine style: the symbol after a number says what happened to it. */
  const state = { entry: "", acc: null, mul: null, last: 0 };
  const apply = (a, op, b) => (op === "×" ? a * b : a / b);

  function fmt(n) {
    if (!Number.isFinite(n) || Math.abs(n) >= 1e12) return null;
    const abs = Math.abs(n);
    let text = abs.toFixed(Math.max(0, Math.min(6, 11 - String(Math.floor(abs)).length)));
    if (text.includes(".")) text = text.replace(/\.?0+$/, "");
    const [whole, part] = text.split(".");
    const out = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (part ? `.${part}` : "");
    return n < 0 && out !== "0" ? `-${out}` : out;
  }

  function reset() {
    state.entry = "";
    state.acc = null;
    state.mul = null;
  }

  function fail() {
    print({ text: "E", sym: "", red: true, say: "Error" });
    reset();
    state.last = 0;
    show("E");
    return false;
  }

  function out(n, sym, red = n < 0) {
    const text = fmt(n);
    if (text === null) return fail();
    print({ text, sym, red });
    return true;
  }

  function take() {
    const entry = state.entry;
    state.entry = "";
    return entry === "" || entry === "." ? null : parseFloat(entry);
  }

  function closeMul(value) {
    const { left, op } = state.mul;
    const right = value ?? left;
    state.mul = null;
    if (!out(right, "=")) return null;
    const result = apply(left, op, right);
    return fmt(result) === null ? (fail(), null) : result;
  }

  function digit(d) {
    if (state.entry.replace(/\D/g, "").length >= 12) return;
    state.entry = state.entry === "0" ? d : state.entry + d;
    show(state.entry);
  }

  function point() {
    if (!state.entry.includes(".")) state.entry = `${state.entry || "0"}.`;
    show(state.entry);
  }

  function addSub(op) {
    let value = take();
    if (state.mul && (value = closeMul(value)) === null) return;
    value ??= state.last;
    if (!out(value, op, op === "-")) return;
    state.acc = (state.acc ?? 0) + (op === "-" ? -value : value);
    if (fmt(state.acc) === null) return fail();
    show(fmt(state.acc));
  }

  function mulDiv(op) {
    const value = take();
    if (state.mul && value === null) {
      state.mul.op = op;
      return;
    }
    const operand = value ?? state.last;
    if (!out(operand, op)) return;
    if (state.mul) {
      const result = apply(state.mul.left, state.mul.op, operand);
      if (fmt(result) === null) return fail();
      state.mul = { left: result, op };
    } else {
      state.mul = { left: operand, op };
    }
    show(fmt(state.mul.left));
  }

  function total() {
    const value = take();
    let sum;
    if (state.mul) {
      const result = closeMul(value);
      if (result === null) return;
      if (state.acc === null) sum = result;
      else if (!out(result, "+")) return;
      else sum = state.acc + result;
    } else {
      if (value !== null) {
        if (!out(value, "+")) return;
        state.acc = (state.acc ?? 0) + value;
      }
      sum = state.acc ?? 0;
    }
    reset();
    const text = fmt(sum);
    if (text === null) return fail();
    const line = print({ text, sym: "*", red: sum < 0, total: true });
    state.last = sum;
    show(text);
    audit(text, line);
  }

  function clear() {
    if (state.entry) {
      state.entry = "";
      show(state.acc === null ? "0" : fmt(state.acc));
      return;
    }
    if (state.acc !== null || state.mul) print({ text: "0", sym: "C", say: "Cleared" });
    reset();
    state.last = 0;
    show("0");
  }

  function press(key) {
    sound.click();
    if (/^\d$/.test(key)) digit(key);
    else if (key === "00") digit("0"), digit("0");
    else if (key === ".") point();
    else if (key === "+" || key === "-") addSub(key);
    else if (key === "×" || key === "÷") mulDiv(key);
    else if (key === "=") total();
    else if (key === "C") clear();
    else if (key === "back") {
      state.entry = state.entry.slice(0, -1);
      show(state.entry || "0");
    }
  }

  /* The display: a twelve-digit seven-segment LCD. */
  const SEGMENTS = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", E: "adefg" };
  let shown = "0";

  function show(text) {
    shown = String(text).replace(/,/g, "");
    paintLCD();
  }

  function paintLCD() {
    const box = lcd.getBoundingClientRect();
    if (!box.width) return;
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    lcd.width = Math.round(box.width * dpr);
    lcd.height = Math.round(box.height * dpr);
    const g = lcd.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cells = [];
    for (const ch of shown) {
      if (ch === "." && cells.length) cells[cells.length - 1].dot = true;
      else cells.push({ ch: ch === "." ? "0" : ch, dot: ch === "." });
    }
    if (shown !== "E" && !cells.some((cell) => cell.dot)) cells[cells.length - 1].dot = true;

    const slots = 13;
    const h = box.height * 0.8;
    const w = Math.min(h * 0.5, (box.width - 6) / (slots * 1.38));
    const gap = w * 0.38;
    const t = Math.max(1.6, w * 0.2);
    const y = (box.height - h) / 2;
    const slant = w * 0.12;

    const cell = (x, lit, dot) => {
      const P = (u, v) => [x + u * w + (1 - v) * slant, y + v * h];
      const bar = (u1, v1, u2, v2) => {
        const horizontal = v1 === v2;
        const [x1, y1] = P(u1, v1);
        const [x2, y2] = P(u2, v2);
        const e = t * 0.75;
        g.beginPath();
        if (horizontal) {
          g.moveTo(x1 + e * 0.4, y1);
          g.lineTo(x1 + e, y1 - t / 2);
          g.lineTo(x2 - e, y2 - t / 2);
          g.lineTo(x2 - e * 0.4, y2);
          g.lineTo(x2 - e, y2 + t / 2);
          g.lineTo(x1 + e, y1 + t / 2);
        } else {
          const dx = (x2 - x1) * (e / (y2 - y1));
          g.moveTo(x1 + dx * 0.4, y1 + e * 0.4);
          g.lineTo(x1 + t / 2 + dx, y1 + e);
          g.lineTo(x2 + t / 2 - dx, y2 - e);
          g.lineTo(x2 - dx * 0.4, y2 - e * 0.4);
          g.lineTo(x2 - t / 2 - dx, y2 - e);
          g.lineTo(x1 - t / 2 + dx, y1 + e);
        }
        g.closePath();
        g.fill();
      };
      const shape = {
        a: [0, 0, 1, 0], b: [1, 0, 1, 0.5], c: [1, 0.5, 1, 1], d: [0, 1, 1, 1],
        e: [0, 0.5, 0, 1], f: [0, 0, 0, 0.5], g: [0, 0.5, 1, 0.5],
      };
      for (const [name, coords] of Object.entries(shape)) {
        g.fillStyle = lit.includes(name) ? "rgba(22,29,21,.86)" : "rgba(22,29,21,.055)";
        bar(...coords);
      }
      g.fillStyle = dot ? "rgba(22,29,21,.86)" : "rgba(22,29,21,.055)";
      g.beginPath();
      g.arc(x + w + gap * 0.48, y + h - t * 0.4, t * 0.55, 0, Math.PI * 2);
      g.fill();
    };

    const right = box.width - 6 - gap;
    for (let i = 0; i < slots; i++) {
      const c = cells[cells.length - slots + i];
      const x = right - (slots - i) * (w + gap) + gap;
      cell(x, c ? SEGMENTS[c.ch] || "" : "", Boolean(c && c.dot));
    }
  }

  /* Tearing off the tape: the strip flips over to the note on its back. */
  let tearing = false;

  function wideDesk() {
    return innerWidth / 2 - machine.offsetWidth / 2 - 48 - roll.offsetWidth >= 20;
  }

  function pencilButton(label, action, className = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pencil-btn ${className}`.trim();
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  // The printing shows faintly through the back of thin paper.
  function ghost(oldRoll, w, h) {
    const canvas = document.createElement("canvas");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.className = "ghost";
    canvas.setAttribute("aria-hidden", "true");
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const g = canvas.getContext("2d");
    g.setTransform(-dpr, 0, 0, dpr, w * dpr, 0);
    const bottom = oldRoll.getBoundingClientRect().bottom;
    for (const line of oldRoll.querySelectorAll(".line canvas")) {
      const box = line.getBoundingClientRect();
      const y = h - (bottom - box.top);
      if (y + box.height > 0) g.drawImage(line, 0, y, w, box.height);
    }
    return canvas;
  }

  function rest(el) {
    const wide = wideDesk();
    const w = el.offsetWidth;
    const needed = back.scrollHeight + 90;
    if (!wide) {
      // On a narrow desk the strip lands on top of the machine until it is put down.
      const height = Math.min(innerHeight - 32, needed);
      return { wide, left: (innerWidth - w) / 2, top: (innerHeight - height) / 2, height };
    }
    const height = Math.min(innerHeight - 48, Math.max(machine.getBoundingClientRect().top, needed));
    return {
      wide,
      left: Math.max(20, innerWidth / 2 - machine.offsetWidth / 2 - 48 - w),
      top: (innerHeight - height) / 2,
      height,
    };
  }

  function place(el) {
    const spot = rest(el);
    el.classList.toggle("wide", spot.wide);
    el.style.left = `${spot.left}px`;
    el.style.top = `${spot.top}px`;
    el.style.height = `${spot.height}px`;
    el.style.transform = `rotate(${el.dataset.tilt}deg)`;
  }

  function turn(el, toBack) {
    const card = $(".card", el);
    const flipped = toBack ?? !card.classList.contains("flipped");
    card.classList.toggle("flipped", flipped);
    $(".front", el).inert = flipped;
    $(".verso", el).inert = !flipped;
    return flipped;
  }

  // A strip that leaves keeps a copy of the note; the real one goes back in the drawer.
  function release(el) {
    if (!el.contains(back)) return;
    const copy = back.cloneNode(true);
    copy.removeAttribute("id");
    copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    copy.removeAttribute("aria-labelledby");
    back.replaceWith(copy);
    desk.append(back);
  }

  function discard(el, { refocus = false } = {}) {
    if (strip === el) strip = null;
    release(el);
    el.inert = true;
    if (refocus) $("#tear").focus();
    const done = () => el.remove();
    if (still()) return done();
    el.animate(
      [
        { transform: el.style.transform, opacity: 1 },
        { transform: `translate(-70vw, 12vh) rotate(-18deg)`, opacity: 0 },
      ],
      { duration: 650, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" }
    ).finished.then(done);
  }

  async function tear(focus = false) {
    if (tearing) return;
    tearing = true;
    await chain;
    if (strip) discard(strip);

    const old = roll;
    const from = old.getBoundingClientRect();
    const slot = machine.getBoundingClientRect().top + 2;
    const w = old.offsetWidth;

    const el = document.createElement("div");
    const card = document.createElement("div");
    const front = document.createElement("div");
    const verso = document.createElement("div");
    const actions = document.createElement("div");
    el.className = "strip";
    card.className = "card";
    front.className = "side front";
    verso.className = "side verso";
    actions.className = "verso-actions";
    el.dataset.tilt = (wideDesk() ? rand(-3.6, -1.8) : rand(-1.4, -0.6)).toFixed(2);
    el.style.width = `${w}px`;

    verso.append(back);
    actions.append(
      pencilButton("Turn over", () => turn(el)),
      pencilButton("Put down", () => discard(el, { refocus: true }), "put-down")
    );
    verso.append(actions);
    card.append(front, verso);
    el.append(card);
    document.body.append(el);
    el.style.height = `${rest(el).height}px`;
    const height = el.offsetHeight;
    verso.prepend(ghost(old, w, height));

    old.removeAttribute("id");
    old.removeAttribute("role");
    old.removeAttribute("aria-live");
    old.removeAttribute("aria-label");
    old.setAttribute("aria-hidden", "true");
    front.append(old, pencilButton("Turn over", () => turn(el)));

    roll = document.createElement("ol");
    roll.className = "roll fresh";
    roll.id = "roll";
    roll.setAttribute("role", "log");
    roll.setAttribute("aria-live", "polite");
    roll.setAttribute("aria-label", "Calculator tape");
    roll.innerHTML = '<li class="blank" aria-hidden="true"></li>';
    tape.append(roll);

    const startLeft = from.left;
    const startTop = slot - height;
    const spot = rest(el);
    el.classList.toggle("wide", spot.wide);
    el.style.left = `${spot.left}px`;
    el.style.top = `${spot.top}px`;
    el.style.height = `${spot.height}px`;
    el.style.transform = `rotate(${el.dataset.tilt}deg)`;
    card.style.transition = "none";
    turn(el, true);
    strip = el;
    sound.rip();

    if (!still()) {
      const dx = startLeft - spot.left;
      const dy = startTop - spot.top;
      const flight = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) rotate(0deg)` },
          { transform: `translate(${dx}px, ${dy - 18}px) rotate(0.8deg)`, offset: 0.14 },
          { transform: el.style.transform },
        ],
        { duration: 1150, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      card.animate(
        [{ transform: "rotateY(0deg)" }, { transform: "rotateY(0deg)", offset: 0.28 }, { transform: "rotateY(180deg)" }],
        { duration: 1150, easing: "cubic-bezier(.45,0,.2,1)" }
      );
      await flight.finished;
    }
    card.style.transition = "";
    if (focus) back.focus({ preventScroll: true });
    tearing = false;
  }

  /* Wiring. */
  function flash(key) {
    const cap = keys.querySelector(`[data-key="${key}"]`);
    if (!cap) return;
    cap.classList.add("down");
    setTimeout(() => cap.classList.remove("down"), 110);
  }

  keys.addEventListener("click", (event) => {
    const key = event.target.closest(".key");
    if (!key) return;
    flash(key.dataset.key);
    press(key.dataset.key);
  });

  const KEYBOARD = { Enter: "=", "=": "=", "*": "×", x: "×", X: "×", "/": "÷", Escape: "C", Delete: "C", c: "C", C: "C", Backspace: "back", ",": "." };

  addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    // Enter always totals, like the big key on a real machine; Space still presses a focused key.
    const onControl = event.target.closest?.("button, a");
    if ((event.key === "Enter" || event.key === " ") && onControl && !onControl.matches(".key")) return;
    if (event.key === " ") return;
    const key = /^[0-9.+-]$/.test(event.key) ? event.key : KEYBOARD[event.key];
    if (!key) return;
    event.preventDefault();
    flash(key);
    press(key);
  });

  // Clicking a key should not leave it holding focus (and Enter).
  keys.addEventListener("mousedown", (event) => {
    if (event.target.closest(".key")) event.preventDefault();
  });

  $("#tear").addEventListener("click", (event) => tear(event.detail === 0));

  $(".skip").addEventListener("click", (event) => {
    event.preventDefault();
    if (strip && strip.contains(back)) {
      turn(strip, true);
      back.focus({ preventScroll: true });
    } else {
      tear(true);
    }
  });

  const paintSwitch = () => soundSwitch.setAttribute("aria-checked", String(sound.on));
  soundSwitch.addEventListener("click", () => {
    sound.set(!sound.on);
    paintSwitch();
  });
  paintSwitch();

  let resizing = 0;
  addEventListener("resize", () => {
    cancelAnimationFrame(resizing);
    resizing = requestAnimationFrame(() => {
      paintLCD();
      if (strip) place(strip);
    });
  });

  /* Opening: the machine stamps the visit, then the pencil says hello. */
  const two = (n) => String(n).padStart(2, "0");
  const stamp = (d) => `${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getFullYear() % 100)}`;
  const clock = (d) => `${two(d.getHours())}:${two(d.getMinutes())}`;

  async function open() {
    show("0");
    const now = new Date();
    const before = new Date(store.get("ioio:last") || NaN);
    const returning = !Number.isNaN(before.getTime());
    store.set("ioio:last", now.toISOString());
    if (document.fonts) await document.fonts.ready;
    await sleep(420);
    if (returning && stamp(before) !== stamp(now)) {
      print({ text: stamp(before), sym: "#", say: `Your last visit, ${before.toLocaleDateString()}`, aside: "last time" });
    }
    print({ text: stamp(now), sym: "#", say: `Today, ${now.toLocaleDateString()}`, aside: "today" });
    print({ text: clock(now), sym: "#", say: `The time, ${now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` });
    note(returning ? "Welcome back. Go on, add something up." : "Go on, add something up.", { arrow: true });
  }

  open();
})();
