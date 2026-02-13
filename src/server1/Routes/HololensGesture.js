
let Head_Frame = {
    "x" : 0.0 , 
    "y" : 0.0 ,
    "z" : 0.0 ,
    "Rx" : 0.0 , 
    "Ry" : 0.0 ,
    "Rz" : 0.0 
}

let Hand_Left = {
    "x" : 0.0 , 
    "y" : 0.0 ,
    "z" : 0.0 ,
    "Rx" : 0.0 , 
    "Ry" : 0.0 ,
    "Rz" : 0.0 
}

let Hand_Right  = {
    "x" : 0.0 , 
    "y" : 0.0 ,
    "z" : 0.0 ,
    "Rx" : 0.0 , 
    "Ry" : 0.0 ,
    "Rz" : 0.0 
}



export default function HololensGestures(fastify , option ,done){
    fastify.post("/Hololens/Gesture/Head",async (request,reply) =>{
        let Head_Coordinate = request.body ;
        Head_Frame.x = Head_Coordinate.x
        Head_Frame.y = Head_Coordinate.y
        Head_Frame.z = Head_Coordinate.z
        Head_Frame.Rx = Head_Coordinate.Rx
        Head_Frame.Ry = Head_Coordinate.Ry
        Head_Frame.Rz = Head_Coordinate.Rz
        return reply.code(200).send({ message: 'Head Gesture set successfully' });
    })
    fastify.get("/Hololens/Gesture/Head",async (request , reply) =>{
        return reply.code(200).send(Head_Frame)
    })

    fastify.post("/Hololens/Gesture/Hand/Left",async (request,reply) =>{
        let LeftHand_Coordinate = request.body ;
        Hand_Left.x = LeftHand_Coordinate.x
        Hand_Left.y = LeftHand_Coordinate.y
        Hand_Left.z = LeftHand_Coordinate.z
        Hand_Left.Rx = LeftHand_Coordinate.Rx
        Hand_Left.Ry = LeftHand_Coordinate.Ry
        Hand_Left.Rz = LeftHand_Coordinate.Rz
        return reply.code(200).send({ message: 'Left Hand Gesture set successfully' });
    })
    fastify.get("/Hololens/Gesture/Hand/Left",async (request , reply) =>{
        return reply.code(200).send(Hand_Left)
    })

    fastify.post("/Hololens/Gesture/Hand/Right",async (request,reply) =>{
        let RightHand_Coordinate = request.body ;
        Hand_Right.x = RightHand_Coordinate.x
        Hand_Right.y = RightHand_Coordinate.y
        Hand_Right.z = RightHand_Coordinate.z
        Hand_Right.Rx = RightHand_Coordinate.Rx
        Hand_Right.Ry = RightHand_Coordinate.Ry
        Hand_Right.Rz = RightHand_Coordinate.Rz
        return reply.code(200).send({ message: 'Right Hand Gesture set successfully' });
    })
    fastify.get("/Hololens/Gesture/Hand/Right",async (request , reply) =>{
            return reply.code(200).send(Hand_Right)
        })

    done()
}