const path = require('path');
const express = require('express');
const userconrollers = require('../controllers/usercontrollers')
const router = express.Router();

router.post('/adduser', userconrollers.create);

router.get('/:id', userconrollers.find);

// add credit

router.get('/add/:id', userconrollers.addcredit);
    
router.put('/add/:id/:credit', userconrollers.addcredit);
//deduct credit
router.put('/sub/:id/:credit', userconrollers.subcredit);



// router.post('/addc/:id',userconrollers.update);
// router.post('/subc');

router.get('get/getjson',userconrollers.getjson);


module.exports = router;
