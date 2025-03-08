import path from 'path'
import fs from 'fs'
import fastifyMultipart from '@fastify/multipart'



const DIR = "./CSV"

let STATUS = {
    "trigger": false
}
export default function UPLOAD_FILES(fastify,options,done){

    fastify.register(fastifyMultipart, {
        throwFileSizeLimit: true,
        limits: {
          files: 1,
          fileSize: 999999999999999,
        },
    });

    fastify.post('/upload/csv',async (request,reply)=>{
        try {
            const parts = await request.parts(); // Await parts to retrieve files
            let uploadedFiles = [];

            for await (const part of parts) {
                if (part.file) {
                    const filePath = path.join(DIR, part.filename);
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
    fastify.get('/download/csv/:filename', (request, reply) => {
        const { filename } = request.params;
        const filePath = path.join(DIR, filename);

        if (!fs.existsSync(filePath)) {
            return reply.status(404).send({ message: 'File not found' });
        }

        console.log('Successful transfer:', filePath);

        return reply
            .header('Content-Disposition', `attachment; filename=${filename}`)
            .header('Content-Type', 'application/octet-stream')
            .send(fs.createReadStream(filePath));
    });

    fastify.post('/status/update',async (request,reply)=>{
        let { trigger } = request.body ; 
        STATUS.trigger = trigger ; 
        console.log(`trigger status code : ${reply.statusCode}`);

    });
    
    fastify.get('/status/current',async (request,reply)=>{
        return reply.send(STATUS);
    });
    done()
}