const router = require("express").Router();
const city = require("../models/citys");
const { verifyToken } = require("../validation");


function mapArray(inputArray) {

    let outputArray = inputArray.map(element => (
            mapData(element)
    ));

    return outputArray;
}

function mapData(element) {
    let outputObject = {
        city_id: element._id,
            name: element.name,
            description: element.description,
            KnownFor: element.KnownFor,
            population: element.population,
            Capital: element.Capital,
            uri: "/api/city/" + element._id
    }

    return outputObject;
} 

// CRUD setup

// /api/city/
// Create city - post
router.post("/", verifyToken, (req, res) => {
    data = req.body;

    city.insertMany(data)
    .then(data => { res.send(data); })
    .catch(err => { res.status(500).send( {message: err.message }); })
});


// /api/city/
// Read all citys - get
router.get("/", (req, response) => {
    city.find()
    .then(data => { 
        response.send(mapArray(data)); 
    })
    .catch(err => { response.status(500).send( {message: err.message }); })
});


// Read Random city 
router.get("/random", (request, response) => {
    city.countDocuments({})
    .then(count => {
        // Get a random index
        let random = Math.floor(Math.random() * count);

        //Query all document, but skip (fetch) only one with the ofset of "random"
        city.findOne().skip(random)
        .then(data => {response.status(200).send(mapData(data))})
        .catch(err => {
            response.status(500).send({message: err.message});
        })
    })
});


// Read specific city - get by Id
router.get("/:id", (request, response) => {
    city.findById(request.params.id)
    .then(data => { response.send(mapData(data)); })
    .catch(err => { response.status(500).send( {message: err.message }); })
});


// Read specific city - get by any property 
// This is not longer Case Sensitive because of ($options:'i')
router.get("/:field/:value", (request, response) => {   
    
    const field = request.params.field;
    const value = request.params.value;
    
    city.find({ [field]: { $regex: request.params.value, $options:'i' } })
    .then (data => { response.send(data) })  
    .catch (err => { 
        response.status(500).send( { message: err.message } )
    })
});


// GET citys/population/lt/1000
router.get("/population/:operator/:population", (request, response) => {
    const operator = request.params.operator;
    const population = request.params.population;

    let filterExpression;

    if (operator == "lt") //less than
    {
        filterExpression = { $lte: population }
    }
    else {
        filterExpression = { $gte: population }
    }

    city.find({ population: filterExpression })
        .then(data => { response.status(200).send(mapArray(data))})
        .catch(err => {response.status(500).send({message: err.message})})
});



// Update specific city - put
router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    city.findByIdAndUpdate(id, req.body)
    .then(data => {
        if (!data)
        {
            res.status(404).send({ message: "cannot update city with id=" + id + ". Maybe city was not found!"})
        }
        else
        {
            res.send(
                { 
                    message: "City was succesfully updated."
                })
        }
    })
    .catch(err => { res.status(500).send( {message: "Error updating city with id=" + id }); })
});


//Delete specific city - delete

router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    city.findByIdAndDelete(id)
    .then(data => {
        if (!data)
        {
            res.status(404).send({ message: "cannot delete city with id=" + id + ". Maybe city was not found!"})
        }
        else
        {
            res.send(
                { 
                    message: "city was succesfully deleted."
                })
        }
    })
    .catch(err => { res.status(500).send( {message: "Error deleting city with id=" + id }); })
});







module.exports = router;