let Pose = {
    "x":0.0,
    "y":0.0,
    "row":0.0,
    "pitch":0.0,
    "yaw":0.0
}



export default function MobilePose(fastify,options,done){

    fastify.post("/MyAGV/Position/update",async (request,reply)=>{
       let {x , y , row , pitch , yaw } = request.body;
       Pose.x = x ; Pose.y = y ; Pose.row = row ; Pose.pitch = pitch ; Pose.yaw = yaw
       console.log("mobile Pose Updated")
       return reply.send(reply.statusCode)
    });
    fastify.get("/MyAGV/Position/current",async (request,reply)=>{
        console.log("send current mobile location successed")
        return reply.send(Pose)
    });
    done();
}