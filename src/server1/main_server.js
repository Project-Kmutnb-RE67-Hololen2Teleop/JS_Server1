import fastify from "fastify";
import fastifyMultipart from '@fastify/multipart'; // Updated import
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import SpeedRouter from "./Routes/speed.js";
import PointCloudRouter from "./Routes/pointcloud.js";

config(); // Load .env

const IP = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT_MAIN || 11111;

const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    key: readFileSync('./private.key'),
    cert: readFileSync('./certificate.crt'),
  },
});

// Register the multipart plugin with no file size limit
server.register(fastifyMultipart, {
  limits: {
    fileSize: Infinity  // No limit for file size
  }
});

// Register your custom routes
server.register(SpeedRouter);
server.register(PointCloudRouter);

// Basic route
server.get('/', (request, reply) => {
  reply.code(200).send("Welcome to mine API server with Fastify");
  console.log(reply.statusCode)
});

// Start the server
server.listen({ host: IP, port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});