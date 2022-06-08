const app= require('./app')

const port= process.env.PORT

const cloudinary= require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

app.listen(port,()=>{
    console.log(`port ${port} is listening`)
})
