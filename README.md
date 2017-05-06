# d3-require

A minimal, promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD). This implementation is [about 40 lines of code](https://github.com/d3/d3-require/blob/master/index.js) and supports a strict subset of AMD. It is designed to work with browser-targeting libraries that implement one of the [recommended UMD patterns](https://github.com/umdjs/umd). The constraints of this implementation are:

* The `define` method must be called synchronously by the library on load.

* Only anonymous module definitions are allowed; no named modules.

* Only the built-in `exports` dependency is allowed; no `require` or `module` as in CommonJS.

By default, [require](#require) loads modules from [unpkg](https://unpkg.com/); the module *name* can be any package (or scoped package) name optionally followed by the at sign (@) and a semver range. For example, `require("d3@4")` loads the highest version of [D3](https://d3js.org) 4.x. You can change this behavior using [*require*.from](#require_from).

## Installing

If you use NPM, `npm install d3-require`. Otherwise, download the [latest release](https://github.com/d3/d3-require/releases/latest). You can also load directly from [unpkg.com](https://unpkg.com/d3-require/). AMD, CommonJS, and vanilla environments are supported. In vanilla, `require` and `define` globals are exported:

```html
<script src="https://unpkg.com/d3-require@0"></script>
<script>

require("d3-array").then(d3 => {
  console.log(d3.range(100));
});

</script>
```

## API Reference

<a href="#require" name="require">#</a> <b>require</b>(<i>names…</i>) [<>](https://github.com/d3/d3-require/blob/master/index.js#L6 "Source")

To load a module:

```js
require("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```

To load two modules and merge them into a single object:

```js
require("d3-array", "d3-color").then(d3 => {
  console.log(d3.range(360).map(h => d3.hsl(h, 1, 0.5)));
});
```

To load a module within a version range:

```js
require("d3-array@1").then(d3 => {
  console.log(d3.range(100));
});
```

<a href="#require_from" name="require_from">#</a> <i>require</i>.<b>from</b>(<i>source</i>) [<>](https://github.com/d3/d3-require/blob/master/index.js#L22 "Source")

Returns a new [require function](#require) which loads modules from the specified *source*, which is a function that takes a module name and returns the corresponding URL. For example, the default implementation works something like this:

```js
var requireUnpkg = require.from(name => `https://unpkg.com/${name}`);

requireUnpkg("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```
