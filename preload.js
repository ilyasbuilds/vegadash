const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("telemetryAPI", {
  connectToDrone: (url, callback) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to drone WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data from WebSocket:", event.data);
        callback(data);
      } catch (error) {
        console.error("Error parsing telemetry data:", error);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.onclose = () => {
      console.log("Disconnected from quadcopter");
    };
  }
});

// Expose environment information safely to the renderer process
contextBridge.exposeInMainWorld('env', {
  isDevelopment: process.env.NODE_ENV === 'development',
  baseUrl: process.env.ELECTRON_START_URL || '.'
});
