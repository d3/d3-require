# d3-require

A minimal, promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD). (Like [Alameda](https://github.com/requirejs/alameda), but in ~40 lines of code rather than ~1,300.) This implementation supports a strict subset of AMD and is designed to work with browser-compatible libraries that implement one of the [recommended UMD patterns](https://github.com/umdjs/umd). The constraints of this require implementation are:

* The `define` method must be called synchronously by the library on load.

* Only anonymous module definitions are allowed; no named modules.

* Only the built-in `exports` dependency is allowed; no `require` or `module` as in CommonJS.

By default, `require` loads modules from [unpkg](https://unpkg.com/); the module *name* can be any package (or scoped package) name optionally followed by the at sign (`@`) and a semver range. For example, `d3@4` would load the highest version of [D3](https://d3js.org) 4.x. You can change this behavior using [*require*.resolve](#require_resolve).

## Installing

If you use NPM, `npm install d3-require`. Otherwise, download the [latest release](https://github.com/d3/d3-require/releases/latest). You can also load directly from [unpkg.com](https://unpkg.com/d3-require/). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `require` global is exported:

```html
<script src="https://unpkg.com/d3-require@0"></script>
<script>

require("d3-array").then(d3 => {
  console.log(d3.range(100));
});

</script>
```

## API Reference

<a href="#require" name="require">#</a> <b>require</b>(<i>name</i>)

To load a module:

```js
require("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```

Or, with a version range:

```js
require("d3-array@1").then(d3 => {
  console.log(d3.range(100));
});
```

<a href="#require_resolve" name="require_resolve">#</a> <i>require</i>.<b>resolve</b>(<i>resolver</i>)

Requires a new [require function](#require) using the specified *resolver*, which is a function that takes a module name and returns the corresponding URL. For example, the default implementation of [require](#require) uses [unpkg](https://unpkg.com) and works something like this:

```js
var requireUnpkg = require.resolve(name => `https://unpkg.com/${name}`);

requireUnpkg("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```
