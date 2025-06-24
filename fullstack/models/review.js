const mongoose=require("mongoose")

let reviewSchema= new mongoose.Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
})

let review= mongoose.model("review",reviewSchema);

module.exports=review;