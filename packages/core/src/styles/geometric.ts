import { defineStyle } from "../create.ts";
import { h, type SvgNode } from "../node.ts";

/** GitHub風 5x5 左右対称ドット */
export const pixel = defineStyle({
  name: "pixel",
  render({ rng, palette, customColors }) {
    const hue = rng.int(0, 359);
    const [custom] = palette(1);
    const fg = customColors ? custom : `hsl(${hue} 65% 55%)`;
    let d = "";
    for (let col = 0; col < 3; col++)
      for (let row = 0; row < 5; row++)
        if (rng.bool())
          for (const c of new Set([col, 4 - col])) d += `M${10 + c * 16} ${10 + row * 16}h16v16h-16z`;
    if (!d) d = "M42 42h16v16h-16z";
    return [
      h("rect", { width: 100, height: 100, fill: "#f0f0f0" }),
      h("path", { d, fill: fg, "shape-rendering": "crispEdges" }),
    ];
  },
});

/** 円・四分円・回転した正方形の重ね合わせ（Bauhaus 調） */
export const shapes = defineStyle({
  name: "shapes",
  render({ rng, palette }) {
    const [bg, a, b, c] = palette(4);
    const sq = rng.int(30, 48);
    return [
      h("rect", { width: 100, height: 100, fill: bg }),
      h("circle", { cx: rng.pick([0, 100]), cy: rng.pick([0, 100]), r: rng.int(40, 60), fill: c }),
      h("circle", { cx: rng.int(25, 75), cy: rng.int(25, 75), r: rng.int(20, 32), fill: a }),
      h("rect", {
        x: 50 - sq / 2,
        y: 50 - sq / 2,
        width: sq,
        height: sq,
        fill: b,
        opacity: 0.9,
        transform: `translate(${rng.int(-20, 20)} ${rng.int(-20, 20)}) rotate(${rng.int(0, 90)} 50 50)`,
      }),
      h("circle", { cx: rng.int(20, 80), cy: rng.int(20, 80), r: rng.int(5, 9), fill: bg }),
    ];
  },
});

/** 4x4 の三角形タイル */
export const mosaic = defineStyle({
  name: "mosaic",
  render({ rng, palette }) {
    const cs = palette(3);
    const out: SvgNode[] = [];
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const X = x * 25, Y = y * 25, X2 = X + 25, Y2 = Y + 25;
        const tris = rng.bool()
          ? [`${X},${Y} ${X2},${Y} ${X},${Y2}`, `${X2},${Y} ${X2},${Y2} ${X},${Y2}`]
          : [`${X},${Y} ${X2},${Y} ${X2},${Y2}`, `${X},${Y} ${X},${Y2} ${X2},${Y2}`];
        for (const points of tris) out.push(h("polygon", { points, fill: rng.pick(cs) }));
      }
    return out;
  },
});
