const mongoose=require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
      type:String,
      required:true
  }, // String is shorthand for {type: String}
 email:{
     type:String,
     require:true,
    //  uniqued: true
 },
 password:{
     type:String,
     required:true,
     

 },
 date:{
     type:Date,
     default:Date.now
 }
});
const Users=mongoose.model("user",UserSchema);
Users.createIndexes();
module.exports=Users;