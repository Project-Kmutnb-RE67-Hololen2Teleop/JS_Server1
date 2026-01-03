import ControlJoint from './Manipulator.js';

import Location_Object from './ObjectLocation.js';
import HololensGestures from './HololensGesture.js';
import objectTracking from './objectTracking.js';
export default function Routes_Registered(fastify){
    fastify.register(ControlJoint);
    fastify.register(Location_Object);
    fastify.register(HololensGestures);
    fastify.register(objectTracking);
}