import { defineStyle } from "../create.ts";
import { h, type SvgNode } from "../node.ts";

const r2 = (n: number) => Math.round(n * 100) / 100;

const leaf = (x: number, y: number, angle: number, scale: number, color: string, vein: string): SvgNode =>
  h(
    "g",
    { transform: `translate(${r2(x)} ${r2(y)}) rotate(${angle}) scale(${r2(scale)})` },
    h("path", { d: "M0 0C6 -9 18 -9 26 0C18 9 6 9 0 0Z", fill: color }),
    h("path", { d: "M2 0H22", stroke: vein, "stroke-width": 1.2, "stroke-linecap": "round" }),
  );

/** 鉢植えの芽：茎の曲がり・葉の数と角度・先端（葉/つぼみ/花）・鉢の色・顔 */
export const sprout = defineStyle({
  name: "sprout",
  render({ rng, palette, customColors }) {
    const hue = rng.int(0, 359);
    const green = rng.int(85, 150);
    const potHue = rng.pick([18, 25, 45, 200, 260, 340]);
    const potSat = rng.int(45, 65), potLight = rng.int(55, 65);
    const [cBg, cPot, cAccent] = palette(3);

    const bg = customColors ? cBg : `hsl(${hue} 60% 92%)`;
    const pot = customColors ? cPot : `hsl(${potHue} ${potSat}% ${potLight}%)`;
    const accent = customColors ? cAccent : `hsl(${(hue + 180) % 360} 72% 68%)`;
    const leafC = `hsl(${green} 55% 48%)`, vein = `hsl(${green} 55% 34%)`;

    const top = rng.int(22, 36), bend = rng.int(-10, 10);
    const tx = 50 + bend / 2;
    const out: SvgNode[] = [
      h("rect", { width: 100, height: 100, fill: bg }),
      h("path", {
        d: `M50 70Q${50 + bend} ${(70 + top) / 2} ${tx} ${top}`,
        fill: "none",
        stroke: vein,
        "stroke-width": 3,
        "stroke-linecap": "round",
      }),
    ];

    const leaves = rng.int(2, 4);
    for (let i = 0; i < leaves; i++) {
      const t = 0.35 + (i / leaves) * 0.65;
      const angle = i % 2 === 0 ? rng.int(-170, -140) : rng.int(-40, -10);
      out.push(leaf(50 + (bend / 2) * t, 70 - (70 - top) * t, angle, 0.8 + rng.next() * 0.5, leafC, vein));
    }

    const tip = rng.pick(["bud", "flower", "leaf"] as const);
    if (tip === "leaf") out.push(leaf(tx, top, -90 + rng.int(-15, 15), 0.9, leafC, vein));
    if (tip === "bud") out.push(h("ellipse", { cx: tx, cy: top - 4, rx: 5, ry: 7, fill: accent }));
    if (tip === "flower") {
      for (let k = 0; k < 5; k++) {
        const a = ((k * 72 - 90) * Math.PI) / 180;
        out.push(h("circle", { cx: r2(tx + 6 * Math.cos(a)), cy: r2(top - 2 + 6 * Math.sin(a)), r: 5, fill: accent }));
      }
      out.push(h("circle", { cx: tx, cy: top - 2, r: 3.5, fill: "#f7c948" }));
    }

    out.push(
      h("path", { d: "M31 70H69L64 92H36Z", fill: pot }),
      h("rect", { x: 28, y: 64, width: 44, height: 9, rx: 3, fill: pot }),
      h("rect", { x: 28, y: 64, width: 44, height: 9, rx: 3, fill: "#000", opacity: 0.12 }),
    );
    if (rng.bool(0.55)) {
      const ink = "#2b2b2b";
      out.push(
        h("circle", { cx: 44, cy: 80, r: 1.8, fill: ink }),
        h("circle", { cx: 56, cy: 80, r: 1.8, fill: ink }),
        h("path", { d: "M47 84Q50 87 53 84", fill: "none", stroke: ink, "stroke-width": 1.5, "stroke-linecap": "round" }),
      );
    }
    return out;
  },
});
