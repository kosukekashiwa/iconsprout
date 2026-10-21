import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  constellation,
  createAvatar,
  defineStyle,
  h,
  kamon,
  mosaic,
  monster,
  pixel,
  pixelCharacter,
  robot,
  shapes,
  sprout,
  toSvgString,
} from "../src/index.ts";

const STYLES = [pixel, shapes, mosaic, constellation, kamon, monster, robot, pixelCharacter, sprout];
const SEEDS = Array.from({ length: 30 }, (_, i) => `user-${i}`);

for (const style of STYLES) {
  describe(style.name, () => {
    test("同じ seed なら同じ出力", () => {
      assert.equal(createAvatar(style, { seed: "kosuke" }).toString(), createAvatar(style, { seed: "kosuke" }).toString());
    });

    test("seed が違えばほぼ全て異なる", () => {
      const unique = new Set(SEEDS.map((seed) => createAvatar(style, { seed }).toString()));
      assert.ok(unique.size >= SEEDS.length - 1, `unique=${unique.size}`);
    });

    test("size / viewBox", () => {
      const svg = createAvatar(style, { seed: "a", size: 48 }).toString();
      assert.match(svg, /^<svg [^>]*width="48" height="48" viewBox="0 0 100 100"/);
      assert.ok(svg.endsWith("</svg>"));
    });

    test("colors 指定が反映される", () => {
      const svg = createAvatar(style, { seed: "a", colors: ["#123456", "#abcdef"] }).toString();
      assert.ok(svg.includes("#123456") || svg.includes("#abcdef"));
    });
  });
}

test("radius で clipPath が付き、id は seed ごとに異なる", () => {
  const a = createAvatar(pixel, { seed: "a", radius: 50 }).toString();
  const b = createAvatar(pixel, { seed: "b", radius: 50 }).toString();
  const idOf = (s: string) => s.match(/clipPath id="([^"]+)"/)?.[1];
  assert.ok(idOf(a));
  assert.notEqual(idOf(a), idOf(b));
});

test("title と属性値はエスケープされる", () => {
  const svg = createAvatar(pixel, { seed: "x", title: `<script>alert("x")</script>` }).toString();
  assert.ok(!svg.includes("<script>"));
  assert.equal(toSvgString(h("rect", { fill: `"><x` })), `<rect fill="&quot;&gt;&lt;x"/>`);
});

test("defineStyle で独自スタイルを追加できる", () => {
  const dot = defineStyle({
    name: "dot",
    render: ({ rng }) => [h("circle", { cx: 50, cy: 50, r: rng.int(10, 40), fill: "#000" })],
  });
  assert.match(createAvatar(dot, { seed: "a" }).toString(), /<circle cx="50" cy="50" r="\d+" fill="#000"\/>/);
});
