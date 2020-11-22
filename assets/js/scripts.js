// Variable assignment
let canvas = document.getElementById("canvas"),
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

// Drawing function to generate image
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
c.translate(w / 2, h);

// Keep Executing
iterate();

// Console Fun
let consoleGrey = "font-weight:bold; color:#777;";
let consoleBlue = "font-weight:bold; color:#0F669D";
let consoleHeaderStyle =
  "font-size:20px; font-weight:bold; letter-spacing:0.02em; line-height:1.4em; font-family:helvetica,arial; color:#0F669D;";
let consoleTitleStyle =
  "font-size:16px; font-weight:normal; letter-spacing:0.2em; line-height:1.4em; font-family:helvetica,arial; color:#0F669D;";
let consoleBodyStyle =
  "font-size:14px; font-weight:lighter; letter-spacing:0.2em; line-height:1.4em; font-family:helvetica,arial; color:#777;";
let consoleLogo = `
%cXX %cXXXXXX %cXX %cXXXXXX
%cXX %cXX  XX %cXX %cXX  XX
%cXX %cXX  XX %cXX %cXX  XX
%cXX %cXX  XX %cXX %cXX  XX
%cXX %cXXXXXX %cXX %cXXXXXX
`;
let consoleHeader = "%cSOFTWARE ENGINEER & KNOWN HUMAN";
let consoleTitle1 = "%cHello!";
let consoleTitle2 = "%cAbout";
let consoleTitle3 = "%cContact";
let consoleBody1 = `%c
Between growing up in Germany to hanging out in Montreal, studying in Kansas - then Beirut-, advocacy and designing in D.C. to banking and finance & now FINALLY developing in AZ I've tried my hand at a little bit of everything. I've managed to take part in the variety of human experiences!

I taught myself programming playing around with internet based virtual worlds and picked up markup by taking apart websites to see how they work. I haven't stopped learning since, even having completed the University of Arizona's Full-stack Developer program in 2017.
`;
let consoleBody2 = `%c
Currently I'm a Software Engineer at Albertsons Companies, where I serve as Solutions Architect for the Digital Workforce. In this role I'm in charge of the code health and implmentation for robtics and cognative services.

Always learning and growing, and in between my obsessions with my road bike and hockey I'm taking courses in Machine and Deep Learning (like everyone else), and kicking around in Golang or Javascript.
`;

console.log(
  consoleLogo,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue,
  consoleGrey,
  consoleBlue
);

console.group(consoleHeader, consoleHeaderStyle);
console.group(consoleTitle1, consoleTitleStyle);
console.info(consoleBody1, consoleBodyStyle);
console.groupEnd(consoleTitle1, consoleTitleStyle);
console.group(consoleTitle2, consoleTitleStyle);
console.info(consoleBody2, consoleBodyStyle);
console.groupEnd(consoleTitle2, consoleTitleStyle);
console.group(consoleTitle3, consoleTitleStyle);
Array.from(document.querySelectorAll("#logos > a")).forEach((link) => {
  console.info(link.getAttribute("href"));
});
console.groupEnd(consoleTitle3, consoleTitleStyle);
console.groupEnd(consoleHeader, consoleHeaderStyle);
