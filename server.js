import express from 'express';
import { config } from 'dotenv'
import axios from 'axios';
config()
let central = express()
let IP = process.env.HOST   || "0.0.0.0"
let PORT = process.env.PORT || 11233

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
    console.log("JA")
})