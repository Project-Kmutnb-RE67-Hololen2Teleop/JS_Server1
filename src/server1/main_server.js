import { WebSocketServer } from 'ws';
import fastify from 'fastify';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import sharp from 'sharp';
import fs from 'fs'
import SpeedRouter from './Routes/speed.js';
import PointCloudRouter from './Routes/pointcloud.js';
config(); // โหลด environment variables
let frameCount = 0;
let startTime = Date.now();
const IP = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT_MAIN || 11111;

// สร้าง HTTP/HTTPS Server ด้วย Fastify
const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // รองรับ HTTP/1
    key: readFileSync('./private.key'),
    cert: readFileSync('./certificate.crt'),
  },
});

// สร้าง WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// เชื่อมต่อ WebSocket กับ Fastify Server
server.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  let buffer = Buffer.alloc(0); // สำหรับเก็บข้อมูลที่รับมา
  let expectedSize = null; // ขนาดข้อมูลที่คาดว่าจะได้รับ

  ws.on('message', (data) => {
    if (expectedSize === null) {
      // อ่านขนาดภาพ (4 bytes)
      expectedSize = data.readUInt32BE(0);
      console.log(`Expecting image of size: ${expectedSize} bytes`);
    } else {
      // ต่อ buffer   buffer == image file
      buffer = Buffer.concat([buffer, data]);
      
      if (buffer.length >= expectedSize) {
        console.log(`Image received! Size: ${buffer.length} bytes`);

        // Decode JPEG image and save it
        const fileName = `image.jpg`;
        fs.writeFileSync(fileName, buffer);

        // รีเซ็ต state
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

server.register(SpeedRouter);
server.register(PointCloudRouter);
// Start Fastify Server
const startServer = async () => {
  try {
    await server.listen({ host: IP, port: PORT });
    console.log(`Server running at https://${IP}:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();