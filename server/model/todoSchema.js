const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Todolist',todoSchema);