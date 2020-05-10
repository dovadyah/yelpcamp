const express = require("express");
    bodyParser = require("body-parser"),
    request = require("request"),
    mongoose = require("mongoose"),
    app = express(),
    mongoDB_NAME = "mongodb://127.0.0.1:27017/campgrounds";           //mongo default PORT is 27017

app.set("view engine", "ejs");
app.use(express.static( __dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoDB_NAME, {useNewUrlParser: true});                //open connection to mongoDB 
const db = mongoose.connection;                                         //make connection to the local database
db.on('error', console.error.bind(console, 'connection error:'));       //if there is an error this function will catch it and print out the error
db.once('open', function() {                                            //else if it connects it will print it
    console.log("We are Connected!")
});

const cmp = new mongoose.Schema({                                       //Create a Schema
    name: String,
    location: String,
    image: String,
    id: String
});

const Campground = mongoose.model('Campground', cmp);                   // Create a model which will serve to instantiate new object with the Schema, and store it in the collection which is the first param

//Landing page or main page route
route.get("/", (req, res) => {
    res.render("landing");
});

//Route for list of all campgrounds
app.get("/campgrounds", (req, res) => {
    //extract all documents from the collection and sent it to ejs
    Campground.find({}, null,  (err, c) => {
        res.render("list", {campgrounds: c});
    })
});

//dynamic route for each campground
app.get("/campgrounds/:id", (req, res) => {

    //find campground by id, it will return an array and send result to ejs
    Campground.findById(req.params.id, (err, c) => {
        res.render("campground", {ground: c});
    })
});

//Create a post route to add into list of campsite
app.post("/campgrounds", (req, res) => {
    var newCamp = {
        name: req.body.campName,
        image: req.body.campImage,
        location: req.body.campLocation,
        id: req.body.campName + "-camp",
    };

    //create new campground from input and save it to DB
    Campground.create(newCamp, (err, c) => {
        if (err) return handleError(err);
    })

    res.redirect("/campgrounds");
});

//Serve the IP and Port number
app.listen(8080, () => {
    console.log("Listening on port 8080...");
});