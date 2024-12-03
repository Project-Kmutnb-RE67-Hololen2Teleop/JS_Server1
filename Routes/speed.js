import { Router } from "express";

const SpeedRouter = Router() ;

let SpeedData = {
    "velocity" : {
        "x":0.0,
        "y":0.0,
        "z":0.0
    }
}
SpeedRouter.post("/",(req,res) =>{
    let data = req.body
    console.log(`Status : ${res.statusCode}`)
    SpeedData = data
    res.json(SpeedData)
})

SpeedRouter.get("/",(req,res) =>{
    console.log(SpeedData)
    res.json(SpeedData)
})
export default SpeedRouter;