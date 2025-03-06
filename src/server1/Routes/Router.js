import SpeedRouter from './speed.js';
import PointCloudRouter from './pointcloud.js';
import ImagesStream from './2Dimage.js';
import ControlJoint from './Manipulator.js';
import UPLOAD_FILES from './FIlesHandler.js';

export default function Routes_Registered(fastify){
    fastify.register(SpeedRouter);
    //fastify.register(PointCloudRouter)
    //fastify.register(ImagesStream)
    fastify.register(ControlJoint);
    fastify.register(UPLOAD_FILES);
}