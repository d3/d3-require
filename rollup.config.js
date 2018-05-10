import uglify from "rollup-plugin-uglify";
import meta from "./package.json";

const copyright = `// ${meta.name} Version ${meta.version} Copyright ${new Date().getFullYear()} Observable, Inc.`;

export default [
  {
    input: "index",
    output: {
      extend: true,
      file: "dist/d3-require.js",
      banner: copyright,
      format: "umd",
      name: "d3"
    }
  },
  {
    input: "index",
    plugins: [
      uglify({
        output: {
          preamble: copyright
        }
      })
    ],
    output: {
      extend: true,
      file: "dist/d3-require.min.js",
      format: "umd",
      name: "d3"
    }
  }
];
