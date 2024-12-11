import path from 'path';
import fs from 'fs';

// Directory to save uploaded files
let uploadDirectory = './Picture';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

export default function PointCloudRouter(fastify, options, done) {
    // POST route for uploading files
    fastify.post('/PointCloud/upload', async (request, reply) => {
        const parts = request.parts(); // Retrieve the parts from the request (multipart form-data)

        let uploadedFiles = []; // Array to store info about uploaded files

        try {
            // Loop through the parts (files) and handle them
            for await (const part of parts) {
                if (part.file) {
                    // Handle file upload
                    const filePath = path.join(uploadDirectory, part.filename);
                    const writeStream = fs.createWriteStream(filePath);

                    // Pipe the file into the write stream
                    part.file.pipe(writeStream);

                    // Wait until the file is fully written
                    await new Promise((resolve, reject) => {
                        writeStream.on('finish', resolve);
                        writeStream.on('error', reject);
                    });

                    // Add file info to uploadedFiles array
                    uploadedFiles.push({
                        filename: part.filename,
                        mimetype: part.mimetype,
                        size: part.file.byteLength,
                    });

                    console.log('Uploaded file:', part.filename);
                } else {
                    console.log('No file found in part:', part);
                    return reply.status(400).send('No file uploaded.');
                }
            }

            // If there were no files uploaded, send a message
            if (uploadedFiles.length === 0) {
                return reply.status(400).send('No files uploaded.');
            }

            // Respond with the details of the uploaded files
            return reply.send({
                message: 'File(s) uploaded successfully!',
                files: uploadedFiles,
            });
        } catch (error) {
            console.error('Error handling file upload:', error);
            return reply.status(500).send({
                message: 'Error handling file upload.',
                error: error.message,
            });
        }
    });

    // GET route for downloading files manually
    fastify.get('/PointCloud/download/:filename', (request, reply) => {
        const { filename } = request.params;
        const filePath = path.join(uploadDirectory, filename);

        if (fs.existsSync(filePath)) {
            // Manually send the file content
            const fileStream = fs.createReadStream(filePath);
            reply.type('application/octet-stream'); // Set appropriate MIME type
            fileStream.pipe(reply.raw); // Pipe the file to the response stream
            console.log('succesfull_transfer:', filePath);
        } else {
            return reply.status(404).send('File not found');
        }
    });

    done(); // Signal that the route definitions are complete
}