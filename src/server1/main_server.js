import { WebSocketServer } from 'ws';
import fastify from 'fastify';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import sharp from 'sharp';
import fs from 'fs';
import SpeedRouter from './Routes/Speed.js';
import PointCloudRouter from './Routes/pointcloud.js';
import { PostDataIMG } from './Routes/2Dimage.js';
import ImagesStream from './Routes/2Dimage.js';
import ControlJoint from './Routes/Manipulator.js';
import fastifyCors from '@fastify/cors'; // Importing CORS plugin

config(); // Load environment variables

let frameCount = 0;
let startTime = Date.now();
const IP = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT_MAIN || 11111;
const HTTP_PORT = process.env.PORT_HTTP || 8080; // HTTP Port

// Create Fastify server with HTTPS configuration
const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // Support HTTP/1
    key: readFileSync('./private.key'),
    cert: readFileSync('./certificate.crt'),
  },
});


// WebSocket setup
const wss = new WebSocketServer({ noServer: true });

server.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  let buffer = Buffer.alloc(0); // To store incoming data
  let expectedSize = null; // Expected size of data (image)

  ws.on('message', (data) => {
    if (expectedSize === null) {
      // Read image size (first 4 bytes)
      expectedSize = data.readUInt32BE(0);
      console.log(`Expecting image of size: ${expectedSize} bytes`);
    } else {
      buffer = Buffer.concat([buffer, data]);
      
      // Check if the complete image data is received
      if (buffer.length >= expectedSize) {
        console.log(`Image received! Size: ${buffer.length} bytes`);
        PostDataIMG(buffer); // Process image data
        const fileName = 'image.jpg';
        fs.writeFileSync(fileName, buffer); // Save the image
        
        // Reset buffer and expected size
        buffer = Buffer.alloc(0);
        expectedSize = null;
      }
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Register routers
server.register(SpeedRouter);
server.register(PointCloudRouter);
server.register(ImagesStream);
server.register(ControlJoint);

// Start Fastify server
const startServer = async () => {
  try {
    // Start HTTPS server
    await server.listen({ host: IP, port: PORT });
    console.log(`HTTPS Server running at https://${IP}:${PORT}`);

    // Create HTTP server for additional routes
    const httpServer = fastify();
    // Enable CORS with correct configuration
    httpServer.register(fastifyCors, {
      origin: '*', // Allow all origins
      methods: ['*'], // Allow all HTTP methods (GET, POST, OPTIONS, etc.)
      allowedHeaders: ['*'], // Allow all headers (like Content-Type, Authorization, etc.)
      preflightContinue: false, // Let Fastify handle OPTIONS requests automatically
      optionsSuccessStatus: 204, // Successful OPTIONS request response status
      exposedHeaders: ['Content-Type', 'Authorization'], // Expose headers to the client
      credentials: true, // Allow cookies and credentials in cross-origin requests
    });

    httpServer.register(SpeedRouter);
    httpServer.register(PointCloudRouter);
    httpServer.register(ImagesStream);
    httpServer.register(ControlJoint);

    // Start HTTP server
    await httpServer.listen({ host: IP, port: HTTP_PORT });
    console.log(`HTTP Server running at http://${IP}:${HTTP_PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
