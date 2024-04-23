const express = require("express");
const router = express.Router();
const db = require("./db");
const passport = require("./auth");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Import the Menu Model
const Menu = require("../models/Menu");

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

// Post Route to add a menu
router.post("/", async (req, res) => {
  try {
    const data = req.body; // Get the data from the request body

    // Create a new menu object using the Menu Model
    const newMenu = new Menu(data);

    // Save the menu object to the database
    const response = await newMenu.save();
    console.log("Menu data saved", response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET method to get the menu:-
router.get("/", async (req, res) => {
  try {
    const data = await Menu.find();
    console.log("Menu data fetched");
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:taste", async (req, res, next) => {
  try {
    const food_Taste = req.params.taste;

    if (
      food_Taste == "Sweet" ||
      food_Taste == "Spicy" ||
      food_Taste == "Sour" ||
      food_Taste == "Salty"
    ) {
      const response = await Menu.find({ taste: food_Taste });

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
    const menu_Id = req.params.id;

    const updatedMenuData = req.body; // Get the updated data from the request body

    const response = await Menu.findByIdAndUpdate(menu_Id, updatedMenuData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update operation
    });

    if (!response) {
      return res.status(404).json({ error: "Menu Not Found" });
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
    const menu_Id = req.params.id; // Get the menu id from the request params

    const response = await Menu.findByIdAndDelete(menu_Id);

    if (!response) {
      return res.status(404).json({ error: "Menu Not Found" });
    }
    console.log("Menu Deleted");

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
