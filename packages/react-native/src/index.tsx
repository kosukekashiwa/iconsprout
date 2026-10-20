import { createElement, useMemo, type ComponentType, type ReactNode } from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  type SvgProps,
} from "react-native-svg";
import { camelAttrs, createAvatar, type AvatarOptions, type Style, type SvgChild } from "iconsprout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<string, ComponentType<any>> = {
  g: G,
  rect: Rect,
  circle: Circle,
  ellipse: Ellipse,
  path: Path,
  polygon: Polygon,
  defs: Defs,
  clipPath: ClipPath,
  linearGradient: LinearGradient,
  stop: Stop,
};

export type IconSproutProps = AvatarOptions & {
  /** 使用するスタイル（pixel, monster など） */
  variant: Style;
} & Omit<SvgProps, "width" | "height" | "viewBox">;

const render = (node: SvgChild, key?: number): ReactNode => {
  if (typeof node === "string") return null; // RN では <title> などのテキストは描画しない
  const Component = COMPONENTS[node.tag];
  if (!Component) return null;
  return createElement(Component, { key, ...camelAttrs(node.attrs) }, ...node.children.map(render));
};

export function IconSprout({ variant, seed, size = 64, radius, colors, title, ...svgProps }: IconSproutProps) {
  const colorKey = colors?.join(",");
  const tree = useMemo(
    () => createAvatar(variant, { seed, size, radius, colors }).tree,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variant, seed, size, radius, colorKey],
  );
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityRole="image"
      accessibilityLabel={title}
      {...svgProps}
    >
      {tree.children.map(render)}
    </Svg>
  );
}

export * from "iconsprout";
