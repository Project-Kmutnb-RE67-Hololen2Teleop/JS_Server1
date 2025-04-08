import fastify from "fastify";

let Pose = {
    "x":0.0,
    "y":0.0,
    "row":0.0,
    "pitch":0.0,
    "yaw":0.0
}

let CMD_POSE = {
    "CMD_X":0.0,
    "CMD_Y":0.0,
    "STATUS":false
}

export default function MobilePose(fastify,options,done){
    // MARK:   HOLOLENS MOBILE ROBOT MOVEMENT 

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
    // -------------------------------
    // MARK:   COMMAND CONTROL NAVIGATION
    fastify.post("/MyAGV/Position/control",async (request,reply)=>{
        let {CMD_X , CMD_Y , STATUS } = request.body;
        CMD_POSE.CMD_X = CMD_X ; CMD_POSE.CMD_Y = CMD_Y ; CMD_POSE.STATUS = STATUS ;
        console.log(" upload control ");
        return reply.send(reply.statusCode)
    })
    fastify.get("/MyAGV/Position/control/setup",async (request,reply)=>{
        console.log("send current mobile location successed")
        return reply.send({
            "CMD_X":0.0,
            "CMD_Y":0.0
        })
    });
    //-----------------------------------
    // MARK:   Trigger NAV CTRL
    fastify.post('/MyAGV/status/update',async (request,reply)=>{
        let { STATUS } = request.body ; 
        CMD_POSE.STATUS = STATUS ;
        console.log(`trigger status code : ${reply.statusCode}`);
    });
    
    fastify.get('/MyAGV/status/current',async (request,reply)=>{
        return reply.send({"STATUS":CMD_POSE.STATUS});
    });
    done();
}
