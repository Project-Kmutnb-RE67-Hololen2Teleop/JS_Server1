

let VIRTUAL_FRAME_LOCATION_OBJ = {
    "aruco_1":[240,118,15],    //DEFAULT TESTING DATA
    "aruco_2":[240,105,15],   //DEFAULT TESTING DATA
    "aruco_3":[240,112,15]   //DEFAULT TESTING DATA
} 

export default function Location_Object(fasify,option,done){
    fasify.post("/object/update",async (request,reply)=>{
        let { aruco_1 , aruco_2, aruco_3 } = request.body;
        VIRTUAL_FRAME_LOCATION_OBJ.aruco_1 = aruco_1 ;
        VIRTUAL_FRAME_LOCATION_OBJ.aruco_2 = aruco_2 ;
        VIRTUAL_FRAME_LOCATION_OBJ.aruco_3 = aruco_3 ;
        console.log("object location Updated")
        return reply.send(reply.statusCode)

    });
    fasify.get("/object/current",async (request,reply)=>{
        console.log("send current object location successed")
        return reply.send(VIRTUAL_FRAME_LOCATION_OBJ)
    });
    done();
}