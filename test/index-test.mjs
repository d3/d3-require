import * as d3 from "../src/index.mjs";
import assert from "assert";

const {resolveFrom} = d3;

it("resolveFrom() defaults to jsDelivr", async () => {
  const resolve1 = resolveFrom();
  assert.strictEqual(await resolve1("d3@7.4.4/dist/d3.min.js"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3.min.js");
  const resolve2 = resolveFrom(undefined);
  assert.strictEqual(await resolve2("d3@7.4.4/dist/d3.min.js"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3.min.js");
});

it("resolveFrom(origin) respects the specified origin", async () => {
  const resolve1 = resolveFrom("https://unpkg.com/");
  assert.strictEqual(await resolve1("d3@7.4.4/dist/d3.min.js"), "https://unpkg.com/d3@7.4.4/dist/d3.min.js");
  const resolve2 = resolveFrom("https://cdn.jsdelivr.net/npm/");
  assert.strictEqual(await resolve2("d3@7.4.4/dist/d3.min.js"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3.min.js");
});

it("resolveFrom(origin) requires the origin to have a trailing slash", async () => {
  assert.throws(() => resolveFrom("https://unpkg.com"), /origin lacks trailing slash/);
});

it("resolveFrom(…) adds the file extension only if necessary", async () => {
  const resolve = resolveFrom();
  assert.strictEqual(await resolve("d3@7.4.4/dist/d3.js"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3.js"); // yes
  assert.strictEqual(await resolve("d3@7.4.4/dist/d3.min"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3.min"); // no
  assert.strictEqual(await resolve("d3@7.4.4/dist/d3/"), "https://cdn.jsdelivr.net/npm/d3@7.4.4/dist/d3/"); // no
});
