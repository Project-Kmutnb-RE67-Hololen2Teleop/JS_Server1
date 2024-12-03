import express from 'express';
import { config } from 'dotenv'
import cors from 'cors'
// >> router path >>
import SpeedRouter from './Routes/speed.js';
import PointCloudRouter from './Routes/pointcloud.js';
// << router path <<

config()
let server = express()
let IP = process.env.HOST   || "0.0.0.0"
let PORT = process.env.PORT || 11233

server.use(cors()) ;
server.use(express.json());  // Parse JSON body content
server.use('/pointCloud',PointCloudRouter) ;
server.use('/Speed',SpeedRouter) ;

server.get('/',(req,res) =>{
  res.send('Welcome to My Server')
  console.log(`Status ${res.statusCode}`) ; 
});
server.listen(PORT, IP , ()=>{
  console.log(`Initialize with http://${IP}:${PORT}`) ; 
})