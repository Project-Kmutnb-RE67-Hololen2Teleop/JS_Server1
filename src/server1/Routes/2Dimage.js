let currentImageBuffer = null ; 

export function PostDataIMG(Buffering){
    currentImageBuffer = Buffering ;
}



export default function ImagesStream(fastify,options,done){
    fastify.get('/2D_images', async (request, reply) => {
        let BufferImages = currentImageBuffer ;
        return reply.send(BufferImages);
    });
    done()
}