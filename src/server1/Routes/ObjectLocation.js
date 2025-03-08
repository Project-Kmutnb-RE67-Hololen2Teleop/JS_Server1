

let VIRTUAL_FRAME_LOCATION_OBJ = {
    "BLUE":[240,118,15],    //DEFAULT TESTING DATA
    "GREEN":[240,105,15],   //DEFAULT TESTING DATA
    "YELLOW":[240,112,15]   //DEFAULT TESTING DATA
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