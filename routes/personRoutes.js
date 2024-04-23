const express = require("express");
const router = express.Router();
const db = require("./db");
const passport = require("./auth");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Import the Person Model

const Person = require("../models/Person");

// Middleware Function

const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to:  ${req.originalUrl}`
  );

  next(); // Move on to the next phase
};

// To use middleware at all routes
router.use(logRequest);

// const localAuthMiddleware = passport.authenticate("local", { session: false });

// Post Route to add a person

//* To only apply middleware at "/person" route
//? router.post("/person", logRequest, async(req, res, next)=>{})

router.post("/signup", async (req, res) => {
  try {
    const data = req.body; // Get the data from the request body

    // Create a new person object using the Person Model
    const newPerson = new Person(data);

    // Save the person object to the database
    const response = await newPerson.save();
    console.log("data saved", response);


    // Generate token using payload
    const payload = {
      id: response.id,
      username: response.username
    }

    console.log(JSON.stringify(payload));

    const token = generateToken(payload);

    console.log("Token is: ", token);

    return res.status(200).json({response: response, token: token});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Abb yadi mere token ki expiry date hai toh usske liye hum baar baar user toh create nai karenge toh iss case mai hum user ko login karenge fir wo token generate karega

router.post("/login", async(req,res,next)=>{
  try{
    // Extract username and password from request body

    const {username, password} = req.body;

    // Find the user by username

    const user = await Person.findOne({username: username});

    // If user doesn't exist or password doesn't match, return error

    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // generate Token

    const payload = {
      id: user.id,
      username: user.username
    }

    const token = generateToken(payload); 

    // return toke as response

    res.json({token});
  }catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

// Profile Route

router.get("/profile", jwtAuthMiddleware, async(req, res) => {
  try{
    // Iske userData ke andar payload ka data hoga
    const userData = req.user;
    console.log("User Data: ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({user});
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})


// Get Method to get the person data
router.get("/",jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find();
    console.log("data fetched");
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Dynamic routing
router.get("/:workType", async (req, res, next) => {
  try {
    const workType = req.params.workType;

    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });

      console.log("response fetched");
      return res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const person_Id = req.params.id;

    const updatedPersonData = req.body; // Get the updated data from the request body

    // Ye id ke dwara find karega or Body ko update karega
    const response = await Person.findByIdAndUpdate(
      person_Id,
      updatedPersonData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update operation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person Not Found" });
    }

    console.log("Data Updated");

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const person_Id = req.params.id; // Get the person id from the request params

    const response = await Person.findByIdAndDelete(person_Id);

    if (!response) {
      return res.status(404).json({ error: "Person Not Found" });
    }
    console.log("Person Deleted");

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
