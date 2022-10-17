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

const Requests = mongoose.model('login',requestSchema);
module.exports = Requests;