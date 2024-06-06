const express = require('express');
const db = require('./db');
const app = express();
const bodyparser = require('body-parser');
const passport = require('./auth');
const LocalStrategy = require('passport-local').Strategy;
app.use(bodyparser.json());

// mongoose.connect("mongodb://localhost:27017/crud")

const person = require('./models/person');
const menuitem = require('./models/menuitem');



app.use(passport.initialize());

const authMiddleWare = passport.authenticate('local',{session: false});

app.get('/',authMiddleWare,function(req,res){
    res.send('welcome to my hotel')
})



app.post('/person', async (req,res)=> {
    
    try{
        const data = req.body
    const newperson = new person(data);

    const response = await newperson.save();
    console.log('data saved');
    res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: "server error"});

    }
})

const logRequest = (req,res,next)=> {
    console.log(`${new Date().toLocaleString()} Request Made to : ${req.originalUrl}`);
    next(); //move on to the next phase
}

app.use(logRequest);

app.get('/person',authMiddleWare, logRequest,  async (req,res)=>{
    try{
        const data =  await person.find();
        console.log('data fetched');
    res.status(200).json(data);

    }catch(err){
        res.status(500).json({error: "internal server error"});
    }
})

app.post('/menuitem' , async (req,res)=> {
    try{
        const data = req.body
        const newfood = new menuitem(data);

        const response = await newfood.save();
        console.log('menu data saved');
        res.status(200).json(response);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "not able to save server"})

    }
})

app.get('/menuitem', async (req,res)=>{
    try{
        const data =  await menuitem.find();
        console.log('data milgaya');
        res.status(200).json(data);
    }
    catch(err){
        console.log('data not found due to error');
        res.status(500).json({error: "server error"});
    }
})

app.listen(3000, ()=>{
    console.log('Server is running on port ${PORT}');
})
