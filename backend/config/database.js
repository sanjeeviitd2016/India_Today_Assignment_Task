const mongoose= require('mongoose');

const url= process.env.MONGO_URL

module.exports= mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data=> console.log(`database is connected with ${data.connection.host}`))

