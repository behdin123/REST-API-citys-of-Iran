const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const app = express();

const PORT = process.env.PORT || 3000;

// swagger deps
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

// swagger setup 
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


// loads environment variables from a .env
require("dotenv-flow").config();

// parse request
app.use(bodyParser.json());


// mongoose setup
mongoose.set('strictQuery', true);

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connecting to MongoDB"));

mongoose.connection.once('open', () => console.log('connected succesfully to MongoDB'))


// route setup
app.get("/api/", (req, res) => {
    res.status(200).send({message: "Homepage for the MEN RESTful API 'Iran citys'"});
})

// import city routes
const cityRoutes = require("./routes/citys");
const authRoutes = require("./routes/auth");

//post, put, delete -> CRUD
app.use("/api/city", cityRoutes);
app.use("/api/user", authRoutes);

app.listen(PORT, function() {
    console.log("Server is running on port:" + PORT);
})

module.exports = app;