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
server.use('/pointCloud',PointCloudRouter) ;
server.use('/Speed',SpeedRouter) ;

server.get('/',(req,res) =>{
  res.send('Welcome to My Server')
  console.log(`Status ${res.statusCode}`) ; 
});
server.listen(PORT, IP , ()=>{
  console.log(`Initialize with http://${IP}:${PORT}`) ; 
})
/*
central.get('/', (req , res) => {
    res.send('Hello World!')
    console.log(`GET Status from path "/": ${res.statusCode}`);
  });

central.post("/api/upload",(req , res) =>{
    let recievingData = req.body
    res.send(`${res.statusCode}`)
    console.log("Recieved")
  })
central.listen(PORT, IP , ()=>{
    console.log(`Initialize with http://${IP}:${PORT}`)
})
*/