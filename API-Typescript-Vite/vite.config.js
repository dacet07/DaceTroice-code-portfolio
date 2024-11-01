import path from "node:path";
import process from "node:process";

export default {
  server: {
    open: "index.html",
    port: 3000,
  },
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
  },
  resolve: {
    alias: { "/src": path.resolve(process.cwd(), "src") },
  },
};
