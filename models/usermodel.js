const mongoose = require('mongoose');
const userSchema = mongoose.Schema ({
name :String,
credit :Number,
phone: Number
});
module.exports = mongoose.model('user',userSchema);