const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/government')
const { User } = require('./models/user');
app.use(bodyParser.json());



app.post('/api/user', (req,res)=>{
    //---------find if that document already exits

		//console.log('Entered!!!');

    User.findOne({citizenNo: req.body.citizenNo},(err,doc)=>{
    	//console.log('entered');
        if(err) res.status(400).send(err)
        else if(doc === null){
           
//if not then create it--------------------------
                const user = new User({
                    citizenNo: req.body.citizenNo,        
                });

                

                user.save((err,doc)=>{
                    if(err) res.status(400).send(err)
                    res.status(200).send({"citizenNo":`${doc.citizenNo}`,"message": " Registration successfull"})
                })
            }
//if already exitsts then ==alert===
        else{
            // console.log(doc);
             res.status(200).send({"citizenNo":`${doc.citizenNo}`,"message": " is Already Registered !!!"})
        }
    })
})

app.post('/api/check', (req,res)=>{
    // const user = {
         var citizenNo =  req.body.citizenNo;      
    // };     
    // const find = JSON.stringify(user);
//console.log(req.body.citizenNo);
        User.findOne({citizenNo: req.body.citizenNo},(err,doc)=>{
            if(err) res.status(400).send(err)
             else if(doc === null) res.status(200).send({"citizenNo":`${citizenNo}`,"message": " is Not Registered !!!"})
             else res.status(200).send({"citizenNo":`${doc.citizenNo}`,"message": " is Already Registered !!!"}) 
            
        })
})






app.use('/', express.static('client'))


const port = process.env.PORT || 3000;
app.listen( port, ()=>{
    console.log(`started on port ${port}`);
})