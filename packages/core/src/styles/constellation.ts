import { defineStyle } from "../create.ts";
import { h, type SvgNode } from "../node.ts";

const r2 = (n: number) => Math.round(n * 100) / 100;

/** 夜空に星座：背景の小さな星＋最近傍で結んだ 5〜7 個の主星 */
export const constellation = defineStyle({
  name: "constellation",
  render({ rng, palette, customColors }) {
    const hue = rng.int(200, 280);
    const [cBg, cStar] = palette(2);
    const bg = customColors ? cBg : `hsl(${hue} 45% 14%)`;
    const star = customColors ? cStar : `hsl(${(hue + 160) % 360} 90% 80%)`;

    const out: SvgNode[] = [h("rect", { width: 100, height: 100, fill: bg })];
    for (let i = 0; i < 24; i++)
      out.push(
        h("circle", {
          cx: rng.int(2, 98),
          cy: rng.int(2, 98),
          r: rng.pick([0.5, 0.7, 1]),
          fill: "#fff",
          opacity: r2(0.3 + rng.next() * 0.5),
        }),
      );

    const rest = Array.from({ length: rng.int(5, 7) }, () => [rng.int(15, 85), rng.int(15, 85)] as const);
    const path = [rest.shift()!];
    while (rest.length) {
      const [lx, ly] = path[path.length - 1];
      rest.sort((p, q) => Math.hypot(p[0] - lx, p[1] - ly) - Math.hypot(q[0] - lx, q[1] - ly));
      path.push(rest.shift()!);
    }

    out.push(
      h("path", {
        d: "M" + path.map(([x, y]) => `${x} ${y}`).join("L"),
        fill: "none",
        stroke: "#fff",
        "stroke-width": 1,
        "stroke-linejoin": "round",
        opacity: 0.55,
      }),
    );
    for (const [cx, cy] of path)
      out.push(h("circle", { cx, cy, r: 5, fill: star, opacity: 0.25 }), h("circle", { cx, cy, r: 2.4, fill: star }));
    return out;
  },
});
