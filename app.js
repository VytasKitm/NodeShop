const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const connectingDB = require("./config/db.js")
const {errorHandler} = require("./middleware/errorHandler.js")

const app = express()
app.use(express.json())
app.use(errorHandler)
app.use(cors())
app.options("*",cors())
app.use(express.urlencoded({extended:false}))

require("dotenv").config()

connectingDB()

app.use("/users", require("./routes/userRoutes.js"))
app.use("/ads", require("./routes/adRoutes.js"))
app.use("/category", require("./routes/catRoutes.js"))





app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${process.env.PORT} port.`)
  })