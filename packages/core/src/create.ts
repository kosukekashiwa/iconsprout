import { h, toSvgString, type SvgNode } from "./node.ts";
import { PALETTES } from "./palettes.ts";
import { createRng, shortHash, type Rng } from "./rng.ts";

export type StyleContext = {
  rng: Rng;
  /** SVG 内 id。同一ページに複数並べても衝突しない */
  id: (name: string) => string;
  /** n 色を返す。colors 指定時はそこから選ぶ */
  palette: (n: number) => string[];
  /** 利用者が colors を指定したか */
  customColors: boolean;
};

/** 100x100 の座標系で子要素を返す */
export type Style = {
  name: string;
  render: (ctx: StyleContext) => SvgNode[];
};

export const defineStyle = (style: Style): Style => style;

export type AvatarOptions = {
  seed: string;
  /** px。default 64 */
  size?: number;
  /** 角丸 0〜50（50 で円）。default 0 */
  radius?: number;
  /** パレットの上書き */
  colors?: readonly string[];
  /** アクセシビリティ用ラベル */
  title?: string;
};

export type Avatar = {
  tree: SvgNode;
  toString: () => string;
  toDataUri: () => string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function createAvatar(style: Style, options: AvatarOptions): Avatar {
  const key = `${style.name}:${options.seed}`;
  const rng = createRng(key);
  const prefix = `is${shortHash(key)}`;
  const custom = options.colors && options.colors.length > 0 ? options.colors : undefined;

  const ctx: StyleContext = {
    rng,
    id: (name) => `${prefix}-${name}`,
    palette: (n) => {
      // colors 指定の有無で乱数の消費数を変えない（形が変わらないように）
      const base = rng.pick(PALETTES);
      const shuffled = rng.shuffle(custom ?? base);
      return Array.from({ length: n }, (_, i) => shuffled[i % shuffled.length]);
    },
    customColors: Boolean(custom),
  };

  const body = style.render(ctx);
  const size = options.size ?? 64;
  const radius = clamp(options.radius ?? 0, 0, 50);
  const clipId = ctx.id("clip");

  const tree = h(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 100 100", role: "img" },
    options.title ? h("title", {}, options.title) : null,
    radius > 0
      ? [
          h("defs", {}, h("clipPath", { id: clipId }, h("rect", { width: 100, height: 100, rx: radius }))),
          h("g", { "clip-path": `url(#${clipId})` }, body),
        ]
      : body,
  );

  return {
    tree,
    toString: () => toSvgString(tree),
    toDataUri: () => `data:image/svg+xml;utf8,${encodeURIComponent(toSvgString(tree))}`,
  };
}
