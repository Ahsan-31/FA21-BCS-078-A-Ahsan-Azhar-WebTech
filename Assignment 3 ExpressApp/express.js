const express=require('express')

const app=express()

app.get('/',(req,res)=>{
    res.send("Working Server")
})


app.listen(4000)