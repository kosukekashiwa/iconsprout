import { createElement, useMemo, type ReactNode, type SVGProps } from "react";
import { camelAttrs, createAvatar, type AvatarOptions, type Style, type SvgChild } from "iconsprout";

export type IconSproutProps = AvatarOptions & {
  /** 使用するスタイル（pixel, monster など） */
  variant: Style;
} & Omit<SVGProps<SVGSVGElement>, "radius" | "colors">;

const render = (node: SvgChild, key?: number): ReactNode =>
  typeof node === "string"
    ? node
    : createElement(node.tag, { key, ...camelAttrs(node.attrs) }, ...node.children.map(render));

export function IconSprout({ variant, seed, size, radius, colors, title, ...svgProps }: IconSproutProps) {
  const colorKey = colors?.join(",");
  const tree = useMemo(
    () => createAvatar(variant, { seed, size, radius, colors, title }).tree,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, seed, size, radius, colorKey, title],
  );
  return createElement(
    "svg",
    { ...camelAttrs(tree.attrs), ...svgProps },
    ...tree.children.map(render),
  );
}

export * from "iconsprout";
