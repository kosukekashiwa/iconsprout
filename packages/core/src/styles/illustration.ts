import { defineStyle } from "../create.ts";
import { h, type SvgNode } from "../node.ts";

// 陰影は黒の半透明オーバーレイで付ける（colors 指定時も同じ見た目になる）
const shade = (node: SvgNode, opacity = 0.22): SvgNode[] => [
  node,
  h(node.tag, { ...node.attrs, fill: "#000", opacity }),
];

/** かわいい系モンスター：体の形・目の数・角・口 */
export const monster = defineStyle({
  name: "monster",
  render({ rng, palette, customColors }) {
    const hue = rng.int(0, 359);
    const [cBody, cBg] = palette(2);
    const body = customColors ? cBody : `hsl(${hue} 65% 60%)`;
    const bg = customColors ? cBg : `hsl(${(hue + 180) % 360} 60% 90%)`;
    const out: SvgNode[] = [h("rect", { width: 100, height: 100, fill: bg })];

    if (rng.bool(0.6)) out.push(...shade(h("path", { d: "M28 34L24 12L40 28ZM72 34L76 12L60 28Z", fill: body })));

    out.push(
      rng.pick([
        h("circle", { cx: 50, cy: 60, r: 34, fill: body }),
        h("rect", { x: 18, y: 26, width: 64, height: 70, rx: 22, fill: body }),
        h("path", { d: "M50 22C80 22 88 50 84 74C80 98 20 98 16 74C12 50 20 22 50 22Z", fill: body }),
      ]),
    );

    const n = rng.pick([1, 2, 2, 3]);
    const xs = n === 1 ? [50] : n === 2 ? [38, 62] : [33, 50, 67];
    const er = n === 1 ? 13 : n === 2 ? 9 : 7;
    const dx = rng.int(-3, 3);
    for (const x of xs)
      out.push(
        h("circle", { cx: x, cy: 52, r: er, fill: "#fff" }),
        h("circle", { cx: x + dx, cy: 53, r: er * 0.45, fill: "#222" }),
      );

    const mouth = "#3a1f2b";
    out.push(
      ...rng.pick([
        [
          h("path", { d: "M32 72Q50 88 68 72Z", fill: mouth }),
          h("path", { d: "M38 73L42 79L46 74ZM54 74L58 79L62 73Z", fill: "#fff" }),
        ],
        [h("ellipse", { cx: 50, cy: 76, rx: 9, ry: 6, fill: mouth })],
        [
          h("path", {
            d: "M34 74L40 79L45 74L50 79L55 74L60 79L66 74",
            fill: "none",
            stroke: mouth,
            "stroke-width": 2.5,
            "stroke-linejoin": "round",
          }),
        ],
      ]),
    );
    return out;
  },
});

/** ロボット：頭の角丸・目（LED/レンズ/バイザー）・口（グリル/スマイル） */
export const robot = defineStyle({
  name: "robot",
  render({ rng, palette, customColors }) {
    const hue = rng.int(0, 359);
    const [cMetal, cAccent] = palette(2);
    const metal = customColors ? cMetal : `hsl(${hue} 18% 72%)`;
    const accent = customColors ? cAccent : `hsl(${(hue + 150) % 360} 85% 55%)`;
    const edge = customColors ? "#4b5563" : `hsl(${hue} 18% 45%)`;
    const bg = customColors ? "#f3f4f6" : `hsl(${hue} 30% 92%)`;
    const dark = "#222";

    const out: SvgNode[] = [
      h("rect", { width: 100, height: 100, fill: bg }),
      h("path", { d: "M50 28V14", stroke: edge, "stroke-width": 3 }),
      h("circle", { cx: 50, cy: 12, r: 4.5, fill: accent }),
      h("rect", { x: 13, y: 44, width: 9, height: 18, rx: 2, fill: edge }),
      h("rect", { x: 78, y: 44, width: 9, height: 18, rx: 2, fill: edge }),
      h("rect", { x: 21, y: 27, width: 58, height: 54, rx: rng.pick([4, 10, 18]), fill: metal, stroke: edge, "stroke-width": 2.5 }),
    ];

    out.push(
      ...rng.pick([
        [
          h("rect", { x: 30, y: 42, width: 14, height: 10, rx: 2, fill: accent }),
          h("rect", { x: 56, y: 42, width: 14, height: 10, rx: 2, fill: accent }),
        ],
        [38, 62].flatMap((cx) => [
          h("circle", { cx, cy: 47, r: 7, fill: dark }),
          h("circle", { cx, cy: 47, r: 3.5, fill: accent }),
        ]),
        [
          h("rect", { x: 29, y: 41, width: 42, height: 12, rx: 6, fill: dark }),
          h("rect", { x: rng.int(32, 56), y: 44, width: 12, height: 6, rx: 3, fill: accent }),
        ],
      ]),
    );

    if (rng.bool(0.7)) {
      const bars = rng.int(3, 6);
      out.push(h("rect", { x: 34, y: 62, width: 32, height: 10, rx: 2, fill: "#333" }));
      for (let i = 1; i < bars; i++)
        out.push(h("path", { d: `M${34 + (32 / bars) * i} 63V71`, stroke: metal, "stroke-width": 1.5 }));
    } else {
      out.push(h("path", { d: "M38 68Q50 75 62 68", fill: "none", stroke: "#333", "stroke-width": 3, "stroke-linecap": "round" }));
    }
    return out;
  },
});

/** 8x8 ドット絵キャラ：左右対称シルエット＋固定位置の目・口 */
export const pixelCharacter = defineStyle({
  name: "pixel-character",
  render({ rng, palette, customColors }) {
    const hue = rng.int(0, 359);
    const [cBody] = palette(1);
    const body = customColors ? cBody : `hsl(${hue} 60% 55%)`;
    const N = 8, u = 10, pad = 10;
    const grid: ("" | "b" | "s" | "e")[][] = Array.from({ length: N }, () => Array(N).fill(""));

    for (let y = 0; y < N; y++)
      for (let x = 0; x < N / 2; x++) {
        const p = y === 0 || y === N - 1 ? 0.35 : x >= 2 ? 0.95 : 0.5;
        if (rng.bool(p)) grid[y][x] = grid[y][N - 1 - x] = rng.bool(0.15) ? "s" : "b";
      }
    for (let y = 2; y <= 5; y++) for (let x = 2; x <= 5; x++) grid[y][x] ||= "b";
    grid[3][2] = grid[3][5] = "e";
    if (rng.bool(0.7)) grid[5][3] = grid[5][4] = "e";

    let dBody = "", dShade = "", dEye = "";
    grid.forEach((row, y) =>
      row.forEach((v, x) => {
        const cell = `M${pad + x * u} ${pad + y * u}h${u}v${u}h-${u}z`;
        if (v === "b" || v === "s") dBody += cell;
        if (v === "s") dShade += cell;
        if (v === "e") dEye += cell;
      }),
    );

    return [
      h("rect", { width: 100, height: 100, fill: "#f3f1ec" }),
      h(
        "g",
        { "shape-rendering": "crispEdges" },
        h("path", { d: dBody, fill: body }),
        dShade ? h("path", { d: dShade, fill: "#000", opacity: 0.22 }) : null,
        h("path", { d: dEye, fill: "#222" }),
      ),
    ];
  },
});
