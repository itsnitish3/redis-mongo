const express = require('express');
const db =require('./database/database');
const mongoose = require('mongoose');
const app =express();
// const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

const routes = require('./routes/useroutes');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



  mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(result =>{
        console.log('mongoose connected');
    })
    .catch(err =>{
        console.log(err);
    });


app.use('/api',routes);

// listen for requests
app.listen(port, () => {
    console.log(`Node server is listening on port ${port}`);
});