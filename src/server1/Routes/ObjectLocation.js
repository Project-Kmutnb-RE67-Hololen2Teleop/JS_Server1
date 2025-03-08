

let VIRTUAL_FRAME_LOCATION_OBJ = {
    "BLUE":[],
    "GREEN":[],
    "YELLOW":[]
}
export default function Location_Object(fasify,option,done){
    fasify.post("/object/update",async (request,reply)=>{
        let {BLUE , GREEN , YELLOW } = request.body;
        VIRTUAL_FRAME_LOCATION_OBJ.BLUE = BLUE ;
        VIRTUAL_FRAME_LOCATION_OBJ.GREEN = GREEN ;
        VIRTUAL_FRAME_LOCATION_OBJ.YELLOW = YELLOW ;
        console.log("object location Updated")
        return reply.send(reply.statusCode)

    });
    fasify.get("/object/current",async (request,reply)=>{
        console.log("send current location successed")
        return reply.send(VIRTUAL_FRAME_LOCATION_OBJ)
    });
    done();
}