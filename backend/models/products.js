const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        type:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:[true,"price must be provided"]

        },
        topproduct:{
            type:Boolean,
            default:true
        },
        img:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:[true, "rating must be provided"]
        },
        discount:{
            type:Number,
            default:10
        },
        quantity:{
            type:Number,
            default:0
        },
        

})
module.exports=mongoose.model("Products",productSchema);