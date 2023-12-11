const mongoose = require("mongoose");

const connectDatabase = () => {
    
    // const { MongoClient, ServerApiVersion } = require('mongodb');
    // const uri = "mongodb+srv://emregenc:emregenc12345@emregenc.v9hrw9e.mongodb.net/test?retryWrites=true&w=majority";
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    // client.connect(err => {
    //     const collection = client.db("test").collection("devices");
    //     // perform actions on the collection object
    //     console.log("connected!")
    // });

    
    
    
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: false
    })
    .then(() => {
        console.log("MongoDb Connection Succesfull!");
    })
    .catch(err => console.error(err))
}

module.exports = {
    connectDatabase
}