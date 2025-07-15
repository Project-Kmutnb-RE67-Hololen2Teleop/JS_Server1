import SpeedRouter from './speed.js';
import MobilePose from './Mobile_Pose.js';
import ControlJoint from './Manipulator.js';
import UPLOAD_FILES from './FIlesHandler.js';
import Location_Object from './ObjectLocation.js';
import HololensGestures from './HololensGesture.js';
import objectTracking from './objectTracking.js';
export default function Routes_Registered(fastify){
    fastify.register(SpeedRouter);
    fastify.register(ControlJoint);
    fastify.register(UPLOAD_FILES);
    fastify.register(Location_Object);
    fastify.register(MobilePose);
    fastify.register(HololensGestures);
    fastify.register(objectTracking);
}