const path = require('path');
const express = require('express');
const userconrollers = require('../controllers/usercontrollers')
const router = express.Router();

router.post('/adduser', userconrollers.create);

router.get('/:id', userconrollers.findOne);
router.post('/addc/:id',userconrollers.update);
router.post('/subc');


module.exports = router;
