import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import https from 'node:https'; // Importing the https module
import { readFileSync } from 'node:fs'; // Importing the fs module to read files

// >> router path >>
import SpeedRouter from './Routes/speed.js';
import PointCloudRouter from './Routes/pointcloud.js';
// << router path <<

config();

// SSL/TLS certificates
const options = {
  key: readFileSync('private.key'),  // Ensure the correct path to the private key
  cert: readFileSync('certificate.crt'),  // Ensure the correct path to the certificate
};

let server = express();
let IP = process.env.HOST || "0.0.0.0";
let PORT = process.env.PORT_MAIN || 11233;

server.use(cors());
server.use(express.json()); // Parse JSON body content
server.use('/pointCloud', PointCloudRouter);
server.use('/Speed', SpeedRouter);

server.get('/', (req, res) => {
  res.send('Welcome to My Server');
  console.log(`Status ${res.statusCode}`);
});

// Create an HTTPS server instead of HTTP
https.createServer(options, server).listen(PORT, IP, () => {
  console.log(`Server running at https://${IP}:${PORT}`);
});