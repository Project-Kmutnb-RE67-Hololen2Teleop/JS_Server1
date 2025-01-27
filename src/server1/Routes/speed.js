// routes/SpeedRouter.js

let SpeedData = {
    "velocity" : {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
    }
}

export default function SpeedRouter(fastify, options, done) {
    // POST route to update speed data
    fastify.post('/Speed', async (request, reply) => {
        const data = request.body;
        console.log(`Status: ${reply.statusCode}`);
        console.table(SpeedData)
        SpeedData = data;
        return reply.send(SpeedData);
    });

    // GET route to retrieve the current speed data
    fastify.get('/Speed', async (request, reply) => {
        console.log(SpeedData);
        return reply.send(SpeedData);
    });

    done(); // Signal that the route definitions are complete
}