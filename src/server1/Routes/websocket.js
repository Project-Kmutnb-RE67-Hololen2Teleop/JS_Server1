import { PostDataIMG } from "./2Dimage.js";
import fs from 'fs';
export default function DeclareWebsocket(variables , Portocol){

    Portocol.server.on('upgrade', (request, socket, head) => {
    variables.handleUpgrade(request, socket, head, (ws) => {
        variables.emit('connection', ws, request);
    });
    });

    // Handle WebSocket connections
    variables.on('connection', (ws) => {
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
}