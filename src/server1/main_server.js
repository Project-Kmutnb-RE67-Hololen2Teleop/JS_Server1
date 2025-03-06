import { WebSocketServer } from 'ws';
import fastify from 'fastify';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import sharp from 'sharp';

import Routes_Registered from './Routes/Router.js';
import { PostDataIMG } from './Routes/2Dimage.js';
import DeclareWebsocket from './Routes/websocket.js';
import fastifyCors from '@fastify/cors'; // Importing CORS plugin

config(); // Load environment variables

let frameCount = 0;
let startTime = Date.now();
const IP = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT_MAIN || 11111;
const HTTP_PORT = process.env.PORT_HTTP || 8080; 


// >>>>>>>>>>>>>>>>>> HTTPS >>>>>>>>>>>>>>>>>>>>>>>>>>

const https_server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // Support HTTP/1
    key: readFileSync('./private.key'),
    cert: readFileSync('./certificate.crt'),
  },
});


// WebSocket setup
//const wss = new WebSocketServer({ noServer: true });
//const ws  = new WebSocketServer({ noServer: true });

// <<<<<<<<<<<<<<<<<< HTTPS <<<<<<<<<<<<<<<<<<<<<<<<<<


// >>>>>>>>>>>>>>>>>> HTTP >>>>>>>>>>>>>>>>>>>>>>>>>>

const http_server = fastify();
http_server.register(fastifyCors, {
  origin: '*', // Allow all origins
  methods: ['*'], // Allow all HTTP methods (GET, POST, OPTIONS, etc.)
  allowedHeaders: ['*'], // Allow all headers (like Content-Type, Authorization, etc.)
  preflightContinue: false, // Let Fastify handle OPTIONS requests automatically
  optionsSuccessStatus: 204, // Successful OPTIONS request response status
  exposedHeaders: ['Content-Type', 'Authorization'], // Expose headers to the client
  credentials: true, // Allow cookies and credentials in cross-origin requests
});


// <<<<<<<<<<<<<<<<<< HTTP <<<<<<<<<<<<<<<<<<<<<<<<<<



// >>>>>>>>>>>>>>>> Register routers >>>>>>>>>>>>>>>>>

Routes_Registered(https_server)
Routes_Registered(http_server)
//DeclareWebsocket(wss,https_server)
//DeclareWebsocket(ws,http_server)
// <<<<<<<<<<<<<<<< Register routers <<<<<<<<<<<<<<<<<



// >>>>>>>>>>>>>>>> Start Server >>>>>>>>>>>>>>>>>

const startServer = async () => {
  try {

    // Start HTTPS server
    await https_server.listen({ host: IP, port: PORT });
    console.log(`HTTPS Server running at https://${IP}:${PORT}`);
    //console.log(`Websocket Server running at wss://${IP}:${PORT}`);
    // Start HTTP server
    await http_server.listen({ host: IP, port: HTTP_PORT });
    console.log(`HTTP Server running at http://${IP}:${HTTP_PORT}`);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

// <<<<<<<<<<<<<<<< Start Server <<<<<<<<<<<<<<<<<