// For whoever opened the console: the tape, in plain text.
(() => {
  const now = new Date();
  const two = (n) => String(n).padStart(2, "0");
  const date = `${two(now.getMonth() + 1)}-${two(now.getDate())}-${two(now.getFullYear() % 100)}`;

  const head = "font: 700 11px/1.6 Helvetica, Arial, sans-serif; letter-spacing: .38em; color: #1c3d31;";
  const tape =
    "font: 13px/1.55 ui-monospace, Menlo, Consolas, monospace; color: #1c1d22; background: #f7f7f3; padding: 12px 16px;";
  const hand = "font: 15px/1.6 'Bradley Hand', 'Segoe Print', cursive; color: #4a4e55;";

  console.log("%cIOIO  PROOF 12", head);
  console.log(`%c${date.padStart(24)}  #`, tape);
  console.log(
    [
      "%cHi, I’m Alex.",
      "",
      "I’m director of AI operations for Insight’s finance organization. I lead",
      "Insight’s dedicated “Thundercats” team, with a mandate to pioneer AI",
      "adoption across finance and translate AI strategy into measurable",
      "business outcomes.",
      "",
      "My work spans building and deploying AI agents, tracking adoption across",
      "hundreds of finance users, and providing thought leadership to the",
      "organization at every level.",
      "",
      "github.com/ItsOkayItsOfficial",
      "linkedin.com/in/alexander-pugh",
      "alexp@itsokayitsofficial.io",
      "",
      "It’s okay. It’s official.  A.P.",
    ].join("\n"),
    hand
  );
})();
