import { execFileSync } from "node:child_process";
import path from "node:path";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import compress from "@playform/compress";
import { defineConfig } from "astro/config";
import INConfig from "./config";

const integrations = [react(), tailwind({ applyBaseStyles: false })];

if (INConfig.server?.compress !== false) {
  integrations.push(
    compress({
      CSS: false,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 0,
    }),
  );
}

export default defineConfig({
  output: "static",
  base: "/Interstellar-Astro/",
  integrations,
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: false,
  },
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/UseInterstellar/**",
      },
    ],
  },
  vite: {
    logLevel: "warn",
    define: {
      __COMMIT_DATE__: JSON.stringify(
        (() => {
          try {
            return execFileSync("git", ["show", "--no-patch", "--format=%ci"])
              .toString()
              .trim()
              .replace(/[<>"'&]/g, "");
          } catch {
            return new Date().toISOString();
          }
        })(),
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
