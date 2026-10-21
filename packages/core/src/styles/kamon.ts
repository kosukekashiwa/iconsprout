import { defineStyle } from "../create.ts";
import { h, type SvgNode } from "../node.ts";

// 藍・朱・常磐・山吹・江戸紫・蘇芳・群青
const INK = ["#1f3a5f", "#c9462c", "#2f6f5e", "#d9a62e", "#745399", "#8b3a3a", "#3e5f8a"];
// 生成・白練・砥粉
const PAPER = ["#f6f1e7", "#fbfaf5", "#efe6d3"];

const r2 = (n: number) => Math.round(n * 100) / 100;

/** 家紋風：3〜8 回の回転対称モチーフ（花弁・丸・葉・菱）＋任意の外輪・中心 */
export const kamon = defineStyle({
  name: "kamon",
  render({ rng, palette, customColors }) {
    const ink = rng.pick(INK), paper = rng.pick(PAPER);
    const [cFg, cBg] = palette(2);
    const fg = customColors ? cFg : ink;
    const bg = customColors ? cBg : paper;

    const n = rng.pick([3, 4, 5, 6, 8]);
    const kind = rng.pick(["petal", "circle", "leaf", "diamond"] as const);
    const ring = rng.bool(0.7);
    const reach = ring ? 34 : 40;
    const top = 50 - reach;

    const motif = (): SvgNode => {
      switch (kind) {
        case "petal":
          return h("path", {
            d: `M50 50C37 ${r2(50 - reach * 0.45)} 42 ${top} 50 ${top}C58 ${top} 63 ${r2(50 - reach * 0.45)} 50 50Z`,
            fill: fg,
          });
        case "circle":
          return h("circle", { cx: 50, cy: r2(50 - reach * 0.62), r: r2(reach * (n > 5 ? 0.26 : 0.34)), fill: fg });
        case "leaf":
          return h(
            "g",
            {},
            h("path", { d: `M50 44Q34 ${r2(50 - reach * 0.6)} 50 ${top}Q66 ${r2(50 - reach * 0.6)} 50 44Z`, fill: fg }),
            h("path", { d: `M50 42V${top + 4}`, stroke: bg, "stroke-width": 1.4 }),
          );
        case "diamond":
          return h("path", { d: `M50 43L41 ${r2(50 - reach * 0.55)}L50 ${top}L59 ${r2(50 - reach * 0.55)}Z`, fill: fg });
      }
    };

    const out: SvgNode[] = [h("rect", { width: 100, height: 100, fill: bg })];
    if (ring) out.push(h("circle", { cx: 50, cy: 50, r: 42, fill: "none", stroke: fg, "stroke-width": 4.5 }));
    for (let k = 0; k < n; k++) out.push(h("g", { transform: `rotate(${r2((360 / n) * k)} 50 50)` }, motif()));
    if (rng.bool(0.6)) out.push(h("circle", { cx: 50, cy: 50, r: 6, fill: bg, stroke: fg, "stroke-width": 2.5 }));
    return out;
  },
});
