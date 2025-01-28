
let Joint_all = {
    "j1":0.0,
    "j2":0.0,
    "j3":0.0,
    "j4":0.0,
    "j5":0.0,
    "j6":0.0,
    "speed":30,
    "gripper":true
};

let Coordinate = {
    "X":0.0,
    "Y":0.0,
    "Z":0.0,
    "Rx":0.0,
    "Ry":0.0,
    "Rz":0.0,
    "speed":30,
    "gripper":true
}
export default function ControlJoint(fastify,options,done){
    fastify.post('/set_Manipulator/:mode', async (request, reply) => {
        let Mode = request.params.mode;
        let data = request.body;

        //if (!data.j1 || !data.j2 || !data.j3 || !data.j4 || !data.j5 || !data.j6 || !data.speed) {
        //    return reply.code(400).send({ error: 'Missing required data' });
        //}

        switch(Mode){
            case 'setMovementJoint':
                Joint_all.j1 = data.j1
                Joint_all.j2 = data.j2
                Joint_all.j3 = data.j3
                Joint_all.j4 = data.j4
                Joint_all.j5 = data.j5
                Joint_all.j6 = data.j6
                Joint_all.speed = data.speed
                Joint_all.gripper = data.gripper
                console.log(`Status-Manipulator: ${reply.statusCode}`);
                console.table(Joint_all)
                return reply.code(200).send({ message: 'Movement joint set successfully' });
            case 'setCoordinate':
                Coordinate.X = data.X
                Coordinate.Y = data.X
                Coordinate.Z = data.X
                Coordinate.Rx = data.Rx
                Coordinate.Ry = data.Ry
                Coordinate.Rz = data.Rz
                Coordinate.speed = data.speed
                Coordinate.gripper = data.gripper
            default:
                console.log('Missing Argument')
                return reply.code(400).send({ error: 'Invalid mode specified' });

        }

    });
    fastify.get('/get_Manipulator', async (request, reply) => {
        console.table(Joint_all);
        return reply.code(200).send(Joint_all);
    });
    fastify.get('/get_Manipulator/Coordinate', async (request, reply) => {
        console.table(Coordinate);
        return reply.code(200).send(Coordinate);
    });
    done()
}