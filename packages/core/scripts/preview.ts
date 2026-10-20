// README 用のプレビューシートを生成: pnpm preview → preview.svg
import { writeFileSync } from "node:fs";
import { createAvatar, mosaic, monster, pixel, pixelCharacter, robot, shapes, type Style } from "../src/index.ts";

const styles: Style[] = [pixel, shapes, mosaic, monster, robot, pixelCharacter];
const seeds = ["kosuke", "octocat", "alice", "bob", "mika", "taro"];
const W = 150 + seeds.length * 76, H = 20 + styles.length * 80;

let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#fff"/>`;
styles.forEach((style, i) => {
  const y = 16 + i * 80;
  out += `<text x="16" y="${y + 36}" font-family="sans-serif" font-size="14" fill="#555">${style.name}</text>`;
  seeds.forEach((seed, j) => {
    out += `<g transform="translate(${150 + j * 76},${y})">${createAvatar(style, { seed, size: 64, radius: 14 }).toString()}</g>`;
  });
});
writeFileSync(new URL("../../../preview.svg", import.meta.url), out + "</svg>");
console.log("preview.svg written");
