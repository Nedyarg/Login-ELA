const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const requestSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const Request = mongoose.model('loginreq',requestSchema);
module.exports = Request;