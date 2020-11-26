// Variable assignment
let canvas = document.getElementById("canvas"),
  s = document.querySelector("#name"),
  f = getComputedStyle(s).color,
  w = innerWidth,
  h = innerHeight,
  c = canvas.getContext("2d"),
  x = Math.random(),
  y = Math.random(),
  coords = [
    {
      a: 0.05,
      b: 0,
      c: 0,
      d: 0.6,
      tx: 0,
      ty: 0,
      w: 0.17,
    },
    {
      a: 0.05,
      b: 0,
      c: 0,
      d: -0.5,
      tx: 0,
      ty: 1,
      w: 0.17,
    },
    {
      a: 0.46,
      b: -0.321,
      c: 0.386,
      d: 0.383,
      tx: 0,
      ty: 0.6,
      w: 0.17,
    },
    {
      a: 0.47,
      b: -0.154,
      c: 0.171,
      d: 0.423,
      tx: 0,
      ty: 1.1,
      w: 0.17,
    },
    {
      a: 0.433,
      b: 0.275,
      c: -0.25,
      d: 0.476,
      tx: 0,
      ty: 1,
      w: 0.16,
    },
    {
      a: 0.421,
      b: 0.257,
      c: -0.353,
      d: 0.306,
      tx: 0,
      ty: 0.7,
      w: 0.16,
    },
  ];

// Drawing function to fill a half pixel by half pixel at input coords
draw = (t, a, e) => {
  c.fillRect(t * e, -a * e, 0.5, 0.5);
};

// Calcultor function to generate new coords
calculate = () => {
  for (var t = Math.random(), a = 0; a < coords.length; a++) {
    var e = coords[a];
    if (t < e.w) return e;
    t -= e.w;
  }
};

// Recursive function to repeat Calculator and Drawing function
iterate = () => {
  for (var t = 0; t < 100; t++) {
    var a = calculate();
    (x1 = x * a.a + y * a.b + a.tx),
      (y1 = x * a.c + y * a.d + a.ty),
      (x = x1),
      (y = y1),
      draw(x, y, 300);
  }
  window.requestAnimationFrame(iterate);
};

// Execute by applying Canvas
canvas.width = w;
canvas.height = h;
c.fillStyle = f;
c.translate(w / 2, h);

// Keep Executing
iterate();

let console = element.dispatchEvent(
  new KeyboardEvent("keypress", { key: "f12" })
);
