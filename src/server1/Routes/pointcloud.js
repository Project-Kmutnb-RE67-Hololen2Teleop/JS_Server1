import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import fastifyMultipart from '@fastify/multipart';





// Directory to save uploaded files
const uploadDirectory = './Picture';


export default function PointCloudRouter(fastify, options, done) {
    // Register multipart plugin globally before defining routes
    // Register multipart plugin with unlimited size settings
    fastify.register(fastifyMultipart, {
        throwFileSizeLimit: true,
        limits: {
          files: 1,
          fileSize: 999999999999999,
        },
      });
    // ✅ POST route for uploading files
    fastify.post('/PointCloud/upload', async (request, reply) => {
        try {
            const parts = await request.parts(); // Await parts to retrieve files
            let uploadedFiles = [];

            for await (const part of parts) {
                if (part.file) {
                    const filePath = path.join(uploadDirectory, part.filename);
                    const writeStream = fs.createWriteStream(filePath);

                    part.file.pipe(writeStream);

                    await new Promise((resolve, reject) => {
                        writeStream.on('finish', resolve);
                        writeStream.on('error', reject);
                    });

                    // Get actual file size after writing
                    const fileSize = fs.statSync(filePath).size;

                    uploadedFiles.push({
                        filename: part.filename,
                        mimetype: part.mimetype,
                        size: fileSize,
                    });

                    console.log('Uploaded file:', part.filename);
                } else {
                    console.log('No file found in part:', part);
                    return reply.status(400).send({ message: 'No file uploaded.' });
                }
            }

            if (uploadedFiles.length === 0) {
                return reply.status(400).send({ message: 'No files uploaded.' });
            }

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

    // ✅ GET route for downloading files
    fastify.get('/PointCloud/download/:filename', (request, reply) => {
        const { filename } = request.params;
        const filePath = path.join(uploadDirectory, filename);

        if (!fs.existsSync(filePath)) {
            return reply.status(404).send({ message: 'File not found' });
        }

        console.log('Successful transfer:', filePath);

        return reply
            .header('Content-Disposition', `attachment; filename=${filename}`)
            .header('Content-Type', 'application/octet-stream')
            .send(fs.createReadStream(filePath));
    });

    done(); // Signal that the route definitions are complete
}
