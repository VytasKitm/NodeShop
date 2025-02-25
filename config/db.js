const mongoose = require("mongoose")

const connectingDB = async () => {
      try {
            const connecting = await mongoose.connect(process.env.MONGO_URL,{dbName: "Pratybos_Database"})
            console.log(`Connected!, ${connecting.connection.host}, port: ${process.env.PORT}`)
      }
      catch (error){
            console.log("Could not connect", error)
      }
}

module.exports = connectingDB;
      
