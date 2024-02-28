const mongoose=require('mongoose');
const mongoURL="mongodb://0.0.0.0:27017/inotebook?readPreference=primary&tls=false";
const connectToMongo=()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/inotebook?readPreference=primary&tls=false')
  .then(() => console.log('Connected!'));
}

module.exports=connectToMongo;