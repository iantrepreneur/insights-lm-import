var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var checkFfmpegMiddleware = (req, res, next) => {
  if (req.url === "/api/check-ffmpeg") {
    const { exec } = __require("child_process");
    exec("ffmpeg -version", (error, stdout, stderr) => {
      if (error) {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          installed: false,
          error: "FFMPEG is not installed or not in PATH"
        }));
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        installed: true,
        version: stdout.split("\n")[0]
      }));
    });
    return;
  }
  next();
};
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    configureServer: (server) => {
      server.middlewares.use(checkFfmpegMiddleware);
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "configure-server",
      configureServer(server) {
        server.middlewares.use(checkFfmpegMiddleware);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbi8vIE1pZGRsZXdhcmUgcG91ciBzaW11bGVyIGwnQVBJIGRlIHZcdTAwRTlyaWZpY2F0aW9uIEZGTVBFR1xuY29uc3QgY2hlY2tGZm1wZWdNaWRkbGV3YXJlID0gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGlmIChyZXEudXJsID09PSAnL2FwaS9jaGVjay1mZm1wZWcnKSB7XG4gICAgY29uc3QgeyBleGVjIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG4gICAgZXhlYygnZmZtcGVnIC12ZXJzaW9uJywgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBcbiAgICAgICAgICBpbnN0YWxsZWQ6IGZhbHNlLCBcbiAgICAgICAgICBlcnJvcjogJ0ZGTVBFRyBpcyBub3QgaW5zdGFsbGVkIG9yIG5vdCBpbiBQQVRIJ1xuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBcbiAgICAgICAgaW5zdGFsbGVkOiB0cnVlLCBcbiAgICAgICAgdmVyc2lvbjogc3Rkb3V0LnNwbGl0KCdcXG4nKVswXVxuICAgICAgfSkpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBuZXh0KCk7XG59O1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyZVNlcnZlcjogKHNlcnZlcikgPT4ge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjaGVja0ZmbXBlZ01pZGRsZXdhcmUpO1xuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxuICAgIGNvbXBvbmVudFRhZ2dlcigpLFxuICAgIHtcbiAgICAgIG5hbWU6ICdjb25maWd1cmUtc2VydmVyJyxcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShjaGVja0ZmbXBlZ01pZGRsZXdhcmUpO1xuICAgICAgfVxuICAgIH1cbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7OztBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sd0JBQXdCLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDaEQsTUFBSSxJQUFJLFFBQVEscUJBQXFCO0FBQ25DLFVBQU0sRUFBRSxLQUFLLElBQUksVUFBUSxlQUFlO0FBQ3hDLFNBQUssbUJBQW1CLENBQUMsT0FBTyxRQUFRLFdBQVc7QUFDakQsVUFBSSxPQUFPO0FBQ1QsWUFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsWUFBSSxJQUFJLEtBQUssVUFBVTtBQUFBLFVBQ3JCLFdBQVc7QUFBQSxVQUNYLE9BQU87QUFBQSxRQUNULENBQUMsQ0FBQztBQUNGO0FBQUEsTUFDRjtBQUVBLFVBQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBQ2hELFVBQUksSUFBSSxLQUFLLFVBQVU7QUFBQSxRQUNyQixXQUFXO0FBQUEsUUFDWCxTQUFTLE9BQU8sTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUFBLE1BQy9CLENBQUMsQ0FBQztBQUFBLElBQ0osQ0FBQztBQUNEO0FBQUEsRUFDRjtBQUNBLE9BQUs7QUFDUDtBQUdBLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sZ0JBQWdCO0FBQUEsSUFDaEIsaUJBQWlCLENBQUMsV0FBVztBQUMzQixhQUFPLFlBQVksSUFBSSxxQkFBcUI7QUFBQSxJQUM5QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsSUFDaEI7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGVBQU8sWUFBWSxJQUFJLHFCQUFxQjtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0YsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
