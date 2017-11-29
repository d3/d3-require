var queue = [], map = queue.map, some = queue.some, hasOwnProperty = queue.hasOwnProperty;

export var require = requireFrom(function source(name, base) {
  if (/^(\w+:)?\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name)) return new URL(name, base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  return "https://unpkg.com/" + name;
});

export function requireFrom(source) {
  var modules = new Map, require = requireRelative(name, location);

  function requireRelative(base) {
    return function(name) {
      var url = source(name + "", base), module = modules.get(url);
      if (!module) modules.set(url, module = new Promise(function(resolve, reject) {
        var script = document.createElement("script");
        script.onload = function() {
          try { resolve(queue.pop()(requireRelative(url.replace(/\/[^/]*$/, "/")))); }
          catch (error) { reject(new Error("invalid module")); }
        };
        script.onerror = function() {
          reject(new Error("unable to load module"));
        };
        script.async = true;
        script.src = url;
        window.define = define;
        document.head.appendChild(script);
      }));
      return module;
    };
  }

  return function(name) {
    return arguments.length > 1 ? Promise.all(map.call(arguments, require)).then(merge) : require(name);
  };
}

function merge(modules) {
  var o = {}, i = -1, n = modules.length, m, k;
  while (++i < n) {
    for (k in (m = modules[i])) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return function() { return object[name]; };
}

function isexports(name) {
  return (name + "") === "exports";
}

function define(name, dependencies, factory) {
  if (arguments.length < 3) factory = dependencies, dependencies = name;
  if (arguments.length < 2) factory = dependencies, dependencies = [];
  queue.push(some.call(dependencies, isexports) ? function(require) {
    var exports = {};
    return Promise.all(map.call(dependencies, function(name) {
      return isexports(name += "") ? exports : require(name);
    })).then(function(dependencies) {
      factory.apply(null, dependencies);
      return exports;
    });
  } : function(require) {
    return Promise.all(map.call(dependencies, require)).then(function(dependencies) {
      return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
    });
  });
}

define.amd = {};
