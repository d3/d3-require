# d3-require

A minimal, promise-based implementation to require [asynchronous module definitions](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) (AMD). This implementation is [about 50 lines of code](https://github.com/d3/d3-require/blob/master/index.js) and supports a strict subset of AMD. It is designed to work with browser-targeting libraries that implement one of the [recommended UMD patterns](https://github.com/umdjs/umd). The constraints of this implementation are:

* The `define` method must be called synchronously by the library on load.

* Only the built-in `exports` dependency is allowed; no `require` or `module` as in CommonJS.

* Named module definitions (*e.g.*, jQuery) are treated as anonymous modules.

By default, [d3.require](#require) loads modules from [unpkg](https://unpkg.com/); the module *name* can be any package (or scoped package) name optionally followed by the at sign (@) and a semver range. For example, `d3.require("d3@4")` loads the highest version of [D3](https://d3js.org) 4.x. Relative paths and absolute URLs are also supported. You can change this behavior using [d3.requireFrom](#requireFrom).

## Installing

If you use NPM, `npm install d3-require`. Otherwise, download the [latest release](https://github.com/d3/d3-require/releases/latest). You can also load directly from [unpkg.com](https://unpkg.com/d3-require/). AMD, CommonJS, and vanilla environments are supported. In vanilla, `d3` and `define` globals are exported:

```html
<script src="https://unpkg.com/d3-require@0"></script>
<script>

d3.require("d3-array").then(d3 => {
  console.log(d3.range(100));
});

</script>
```

## API Reference

<a href="#require" name="require">#</a> d3.<b>require</b>(<i>names…</i>) [<>](https://github.com/d3/d3-require/blob/master/index.js#L6 "Source")

To load a module:

```js
d3.require("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```

To load a module within a version range:

```js
d3.require("d3-array@1").then(d3 => {
  console.log(d3.range(100));
});
```

To load two modules and merge them into a single object:

```js
d3.require("d3-array", "d3-color").then(d3 => {
  console.log(d3.range(360).map(h => d3.hsl(h, 1, 0.5)));
});
```

Note: if more than one *name* is specified, the promise will yield a new object with each of the loaded module’s own enumerable property values copied into the new object. If multiple modules define the same property name, the value from the latest module that defines the property is used; it is recommended that you only combine modules that avoid naming conflicts.

If a module’s property value is null or undefined on load, such as [d3.event](https://github.com/d3/d3-selection/blob/master/README.md#event), the value will be exposed via [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) rather than copied; this is to simulate ES module-style [live bindings](http://2ality.com/2015/07/es6-module-exports.html). However, property values that are neither null nor undefined on load are copied by value assignment, and thus **are not live bindings**!

<a href="#requireFrom" name="requireFrom">#</a> d3.<b>requireFrom</b>(<i>resolver</i>) [<>](https://github.com/d3/d3-require/blob/master/index.js#L22 "Source")

Returns a new [require function](#require) which loads modules from the specified *resolver*, which is a function that takes a module name and returns the corresponding URL. For example:

```js
var requireUnpkg = d3.requireFrom(name => `https://unpkg.com/${name}`);

requireUnpkg("d3-array").then(d3 => {
  console.log(d3.range(100));
});
```

The *resolver* implementation used by [d3.require](#require) is [d3.resolve](#resolve).

<a href="#resolve" name="resolve">#</a> d3.<b>resolve</b>(<i>name</i>, <i>base</i>)

Returns the URL to load the module with the specified *name*. The *name* may also be specified as a relative path, in which case it is resolved relative to the specified *base* URL.
