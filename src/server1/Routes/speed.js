// routes/SpeedRouter.js

let SpeedData = {
    "Velocity" : {
        "x": 0.0,
        "y": 0.0
    },
    "Angular":{
        "z":0.0
    }
}

export default function SpeedRouter(fastify, options, done) {
    // POST route to update speed data
    fastify.post('/Speed', async (request, reply) => {
        //const data = request.body;
        let { Velocity ,Angular } = request.body ;
        SpeedData.Velocity.x = Velocity.x ; 
        SpeedData.Velocity.y = Velocity.y ; 
        SpeedData.Angular.z = Angular.z ;
        console.log(`Status: ${reply.statusCode}`);
        console.table(SpeedData)
        return reply.send(SpeedData);
    });

    // GET route to retrieve the current speed data
    fastify.get('/Speed', async (request, reply) => {
        console.log(SpeedData);
        return reply.send(SpeedData);
    });

    done(); // Signal that the route definitions are complete
}