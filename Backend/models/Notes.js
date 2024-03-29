const mongoose=require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:
        {type: Schema.Types.ObjectId,
             ref: 'user'}
    ,
  title: {
      type:String,
      require:true
  }, // String is shorthand for {type: String}
 description:{
     type:String,
     require:true
    
 },
 tag:{
     type:String
     

 },
 date:{
     type:Date,
     default:Date.now
 }
});
module.exports=mongoose.model("notes",NotesSchema);