/** 描画先に依存しない SVG 要素ツリー。文字列化・React・react-native-svg が同じツリーを使う */

export type SvgAttrs = Record<string, string | number>;
export type SvgChild = SvgNode | string;
export type SvgNode = { tag: string; attrs: SvgAttrs; children: SvgChild[] };

type ChildInput = SvgChild | false | null | undefined | ChildInput[];

const flatten = (input: ChildInput[]): SvgChild[] =>
  input.flatMap((c) => (Array.isArray(c) ? flatten(c) : c === false || c == null ? [] : [c]));

export const h = (tag: string, attrs: SvgAttrs = {}, ...children: ChildInput[]): SvgNode => ({
  tag,
  attrs,
  children: flatten(children),
});

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeXml = (v: string) => v.replace(/[&<>"']/g, (c) => ESC[c]);

export function toSvgString(node: SvgChild): string {
  if (typeof node === "string") return escapeXml(node);
  const attrs = Object.entries(node.attrs)
    .map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`)
    .join("");
  return node.children.length
    ? `<${node.tag}${attrs}>${node.children.map(toSvgString).join("")}</${node.tag}>`
    : `<${node.tag}${attrs}/>`;
}

/** kebab-case 属性を React / react-native-svg 用の camelCase に変換 */
export const camelAttrs = (attrs: SvgAttrs): SvgAttrs =>
  Object.fromEntries(
    Object.entries(attrs).map(([k, v]) => [k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), v]),
  );
