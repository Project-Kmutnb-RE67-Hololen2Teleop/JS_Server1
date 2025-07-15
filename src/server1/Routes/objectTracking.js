
let OBJ = {
    "x":0.0,
    "y":0.0,
    "z":0.0,
    "Rx":0.0,
    "Ry":0.0,
    "Rz":0.0,
    "first_piority":false
}

export default function objectTracking(fasify,option,done){
    fasify.post("/object/tracking/update",async (request,reply)=>{
        let { x, y, z, Rx, Ry, Rz ,first_piority} = request.body;
        OBJ.x = x ;
        OBJ.y = y ;
        OBJ.z = z ;
        OBJ.Rx = Rx ;
        OBJ.Ry = Ry ;
        OBJ.Rz = Rz ;
        OBJ.first_piority = first_piority;
        console.log("object tracking Updated")
        return reply.send(reply.statusCode)
    })
    fasify.get("/object/tracking/current",async (request,reply)=>{
        console.log("send current object location successed")
        return reply.send(OBJ);
    });
    done();


}
