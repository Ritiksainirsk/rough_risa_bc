const express = require('express');

const app = express();

app.post('/',(req,res)=>{
    res.send('hello world what up jhsdjf  sdjf jsd fj ')
})

app.listen(3000,()=>{
    console.log("listening on port 3000")
})