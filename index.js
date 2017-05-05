var queue = [], map = queue.map;

export default (function requireResolve(resolver) {
  var modules = new Map;

  function requireAll(name) {
    return arguments.length > 1 ? Promise.all(map.call(arguments, require)).then(merge) : require(name);
  }

  function require(name) {
    var url = resolver(name + ""), module = modules.get(url);
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

  requireAll.resolve = requireResolve;

  return requireAll;
})(function resolver(name) {
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  return "https://unpkg.com/" + name;
});

function merge(modules) {
  return Object.assign.apply(null, [{}].concat(modules));
}

self.define = function define(dependencies, factory) {
  queue.push(arguments.length < 2 ? function() {
    return typeof factory === "function" ? new Promise(function(resolve) {
      return resolve(factory());
    }) : factory;
  } : function(require) {
    var exports = {};
    return Promise.all(dependencies.map(function(name) {
      return (name += "") === "exports" ? exports : require(name);
    })).then(function(dependencies) {
      factory.apply(null, dependencies);
      return exports;
    });
  });
};

self.define.amd = {};
