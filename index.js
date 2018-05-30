const metas = new Map;
const modules = new Map;
const queue = [];
const map = queue.map;
const some = queue.some;
const hasOwnProperty = queue.hasOwnProperty;
const origin = "https://unpkg.com/";
const parseRe = /^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/;

function string(value) {
  return typeof value === "string" ? value : "";
}

function parseIdentifier(identifier) {
  const match = parseRe.exec(identifier);
  return match && {
    name: match[1],
    version: match[2],
    path: match[3]
  };
}

function resolveMeta(target) {
  const url = `${origin}${target.name}${target.version ? `@${target.version}` : ""}/package.json`;
  let meta = metas.get(url);
  if (!meta) metas.set(url, meta = fetch(url).then(response => {
    if (!response.ok) throw new Error("unable to load package.json");
    if (response.redirected && !metas.has(response.url)) metas.set(response.url, meta);
    return response.json();
  }));
  return meta;
}

async function resolve(name, base) {
  if (name.startsWith(origin)) name = name.substring(origin.length);
  if (/^(\w+:)|\/\//i.test(name)) return name;
  if (/^[.]{0,2}\//i.test(name)) return new URL(name, base == null ? location : base).href;
  if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new Error("illegal name");
  const target = parseIdentifier(name);
  if (!target) return `${origin}${name}`;
  if (!target.version && base != null && base.startsWith(origin)) {
    const meta = await resolveMeta(parseIdentifier(base.substring(origin.length)));
    target.version = meta.dependencies && meta.dependencies[target.name] || meta.peerDependencies && meta.peerDependencies[target.name];
  }
  const meta = await resolveMeta(target);
  return `${origin}${meta.name}@${meta.version}/${target.path || string(meta.unpkg) || string(meta.browser) || string(meta.main) || "index.js"}`;
}

export const require = requireFrom(resolve);

export function requireFrom(resolver) {
  const requireBase = requireRelative(null);

  function requireAbsolute(url) {
    let module = modules.get(url);
    if (!module) modules.set(url, module = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.onload = () => {
        try { resolve(queue.pop()(requireRelative(url))); }
        catch (error) { reject(new Error("invalid module")); }
        script.remove();
      };
      script.onerror = () => {
        reject(new Error("unable to load module"));
        script.remove();
      };
      script.async = true;
      script.src = url;
      window.define = define;
      document.head.appendChild(script);
    }));
    return module;
  }

  function requireRelative(base) {
    return name => Promise.resolve(resolver(name, base)).then(requireAbsolute);
  }

  function require(name) {
    return arguments.length > 1
        ? Promise.all(map.call(arguments, requireBase)).then(merge)
        : requireBase(name);
  }

  require.resolve = resolver;

  return require;
}

function merge(modules) {
  const o = {};
  for (const m of modules) {
    for (const k in m) {
      if (hasOwnProperty.call(m, k)) {
        if (m[k] == null) Object.defineProperty(o, k, {get: getter(m, k)});
        else o[k] = m[k];
      }
    }
  }
  return o;
}

function getter(object, name) {
  return () => object[name];
}

function isexports(name) {
  return (name + "") === "exports";
}

function define(name, dependencies, factory) {
  const n = arguments.length;
  if (n < 2) factory = name, dependencies = [];
  else if (n < 3) factory = dependencies, dependencies = typeof name === "string" ? [] : name;
  queue.push(some.call(dependencies, isexports) ? require => {
    const exports = {};
    return Promise.all(map.call(dependencies, name => {
      return isexports(name += "") ? exports : require(name);
    })).then(dependencies => {
      factory.apply(null, dependencies);
      return exports;
    });
  } : require => {
    return Promise.all(map.call(dependencies, require)).then(dependencies => {
      return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
    });
  });
}

define.amd = {};
