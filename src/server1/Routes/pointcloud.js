import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import fastifyMultipart from '@fastify/multipart';

const fastify = Fastify();

// Register multipart with unlimited file size
fastify.register(fastifyMultipart, {
    limits: {
        fileSize: 0 // 0 means no limit
    }
});

// Directory to save uploaded files
let uploadDirectory = './Picture';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

export default function PointCloudRouter(fastify, options, done) {
    fastify.post('/PointCloud/upload', async (request, reply) => {
        const parts = await request.file(); // Correct way to get a file

        if (!parts) {
            return reply.status(400).send('No file uploaded.');
        }

        try {
            const filePath = path.join(uploadDirectory, parts.filename);
            await fs.promises.writeFile(filePath, await parts.toBuffer());

            console.log('Uploaded file:', parts.filename);

            return reply.send({
                message: 'File uploaded successfully!',
                file: {
                    filename: parts.filename,
                    mimetype: parts.mimetype,
                    size: parts.file.size
                }
            });
        } catch (error) {
            console.error('Error handling file upload:', error);
            return reply.status(500).send({
                message: 'Error handling file upload.',
                error: error.message,
            });
        }
    });

    done();
}
