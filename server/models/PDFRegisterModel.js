import mongoose from "mongoose";

const PDFRegisterSchema = new mongoose.Schema({
    title:{
        type: String, 
        required: true
    },
    desc:{
        type:String,
        required: true
    },
    subId:{
        type: mongoose.Schema.ObjectId,
        ref:'classes'
    },
    actType:{
        type:String,
        enum:['learning']
    },
    FilePath:{
        type:String,
        require:true
    },
    FileName:{
        type:String,
        require:true
    },
    FileSize:{
        type:String,
        require:true
    }

},{timestamps: true})

const PDFRegisterModel = mongoose.model("PDFRegister",PDFRegisterSchema)
export default PDFRegisterModel