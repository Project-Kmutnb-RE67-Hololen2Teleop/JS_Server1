import { readFileSync } from 'fs'
import fastify from 'fastify';
import { config } from 'dotenv';


config();
const IP = process.env.HOST             || "0.0.0.0" ;
const PORT = process.env.PORT_SERVER2   || 11111;
const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true, // fallback support for HTTP1
    key: readFileSync('./private.key'),
    cert: readFileSync('./certificate.crt')
  }
});

// this route can be accessed through both protocols
server.get('/', function (request, reply) {
  reply.code(200).send({ hello: 'world' });
});

// Fix here: specify host and port correctly
server.listen({ host: IP, port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});