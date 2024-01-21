const mongoose=require('mongoose');
const mongoURL="mongodb://0.0.0.0:27017/?readPreference=primary&tls=false";
const connectToMongo=()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));
}

module.exports=connectToMongo;