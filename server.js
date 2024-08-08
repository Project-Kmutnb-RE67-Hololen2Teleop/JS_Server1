import express from 'express';
import { config } from 'dotenv'
config()
let central = express()
let IP = process.env.HOST   || "0.0.0.0"
let PORT = process.env.PORT || 11233

central.get('/', (req , res) => {
    res.send('Hello World!')
    console.log(`GET Status from path "/": ${res.statusCode}`);
  });


central.listen(PORT, IP , ()=>{
    console.log("JA")
})