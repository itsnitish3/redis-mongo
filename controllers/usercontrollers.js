const User = require('../models/usermodel');
const mongoose = require('mongoose');
const redis = require("redis");
const e = require('express');
const client = redis.createClient();


exports.create = (req, res) => {
    // Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }

    // Create a new User
    const user = new User({
        name: req.body.name, 
        phone: req.body.phone,
        credit:100
    });

    // Save user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while creating new user."
        });
    });
};




exports.findOne = (req, res) => {
    console.log("fetching ....");
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        
        res.send(user);       
        console.log(user)
        const a=JSON.stringify(user)
        client.setex('userdata',60,a)
        
        console.log('userdata')
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error getting user with id " + req.params.id
        });
    });
};

exports.redis_user = (req,res)=>{
    client.get('userdata',(err,redis_user)=>{
if (err)console.log(err)
else(redis_user)
    res.send(JSON.parse(redis_user))
    console.log(redis_user)
    })
}



exports.findcredit = (req,res)=>{
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        const creditbal = user.credit;
        res.send(user);   
        console.log(creditbal);    
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error getting user with id " + req.params.id
        });
    });
}

exports.update = (req, res) => {
    var newcredit;
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }
    // console.log(user);

    // Find user and update it with the request body
    User.findOneAndUpdate(req.params.id, {

        credit:req.body.credit
    } )
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });
        }
        else{
console.log(req.params);
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
};