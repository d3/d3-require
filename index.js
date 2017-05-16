var queue = [], map = queue.map, some = queue.some;

export var require = requireFrom(function(name) {
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  return "https://unpkg.com/" + name;
});

export function requireFrom(source) {
  var modules = new Map;

  function require(name) {
    var url = source(name + ""), module = modules.get(url);
    if (!module) modules.set(url, module = new Promise(function(resolve, reject) {
      var script = document.createElement("script");
      script.onload = function() {
        if (queue.length !== 1) return reject(new Error("invalid module"));
        resolve(queue.pop()(require));
      };
      script.onerror = reject;
      script.async = true;
      script.src = url;
      document.head.appendChild(script);
    }));
    return module;
  }

  return function(name) {
    return arguments.length > 1 ? Promise.all(map.call(arguments, require)).then(merge) : require(name);
  };
}

function merge(modules) {
  return Object.assign.apply(null, [{}].concat(modules));
}

function isexports(name) {
  return (name + "") === "exports";
}

self.define = function define(dependencies, factory) {
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
};

self.define.amd = {};
