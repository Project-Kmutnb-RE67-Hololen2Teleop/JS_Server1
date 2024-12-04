import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('private.key'),
  cert: readFileSync('certificate.crt'),
});

// ใช้ Map สำหรับเก็บเส้นทาง (routes) และ handler
let data = {
    "tester" : 1
}

// ฟังก์ชันสำหรับจัดการ GET requests
function handleGET(stream, path) {
  if (path === '/') {
    stream.respond({
      'content-type': 'application/json',
      ':status': 200,
    });
    stream.end(JSON.stringify(data));
  } else {
    stream.respond({
      'content-type': 'application/json',
      ':status': 404,
    });
    stream.end(JSON.stringify({ message: 'Not Found' }));
  }
}

// ฟังก์ชันสำหรับจัดการ POST requests
function handlePOST(stream, path, body) {
  if (path === '/submit') {
    stream.respond({
      'content-type': 'application/json',
      ':status': 200,
    });
    data = body ;
    stream.end(JSON.stringify({ message: 'Data received', data: body }));
  } else {
    stream.respond({
      'content-type': 'application/json',
      ':status': 404,
    });
    stream.end(JSON.stringify({ message: 'Not Found' }));
  }
}

// ฟังก์ชันสำหรับการตรวจสอบและประมวลผล requests
server.on('stream', (stream, headers) => {
  const path = headers[':path']; // Path ของ request
  const method = headers[':method']; // HTTP method (GET, POST, etc.)
  let body = '';

  // อ่านข้อมูลจาก request
  stream.on('data', chunk => {
    body += chunk;
  });

  stream.on('end', () => {
    // ถ้าเป็น GET request
    if (method === 'GET') {
      handleGET(stream, path);
    }
    // ถ้าเป็น POST request
    else if (method === 'POST') {
      try {
        body = JSON.parse(body); // พยายามแปลง body เป็น JSON
        handlePOST(stream, path, body);
      } catch (error) {
        stream.respond({
          'content-type': 'application/json',
          ':status': 400,
        });
        stream.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    }
    // หากไม่ได้กำหนด method หรือ path ไม่ตรง
    else {
      stream.respond({
        'content-type': 'application/json',
        ':status': 405,
      });
      stream.end(JSON.stringify({ message: 'Method Not Allowed' }));
    }
  });
});

server.listen(8443, () => {
  console.log('Server running at https://localhost:8443');
});