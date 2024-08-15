import express from 'express';
import { config } from 'dotenv'
import Log from "./utils/function/Logging_msg.js"
config()
//-------------------------------------------------

let central = express()
let IP = process.env.HOST  || "1.0.0.0"
let PORT = process.env.PORT || 11233

central.get('/', (req , res) => {
    res.send('Hello World!')
    Log(`GET Status from path "/": ${res.statusCode}`);
  });

central.post("/api/upload",(req , res) =>{
    let recievingData = req.body
    res.send(`${res.statusCode}`)
    Log(`Recieved http://${IP}:${PORT}/api/upload ${res.statusCode} `)
  })

central.listen(PORT, IP , ()=>{
    Log(`connecting to http://${IP}:${PORT}`)

})