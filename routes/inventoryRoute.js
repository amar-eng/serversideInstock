const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const validateInventory = require("../utils/validateInventory");

//function that takes a json filepath and returns that file as a js object
readFile = (filepath) => {
  const buffer = fs.readFileSync(filepath);
  const obj = JSON.parse(buffer);
  return obj;
};

//Backend API to get list of ALL inventory items
//For feature TOR20Q1HG-21
router.get("/", (_req, res) => {
  //read data file for inventory
  //use readFileSync, I think this makes sense in the context and avoids async issues
  let inventoryObj = readFile("./data/inventories.json");

  //if it can't get the data return 404 error
  if (!inventoryObj) {
    res.status(404).send("ERROR: Could not retrieve inventory data!");
  } else {
    //if it does get the data, returns a json object containing an array of all inventory items
    res.status(200).json(inventoryObj);
  }
});


// Backend API to post a new Inventory item 
// For feature TOR20Q1HG-24

router.post ('/', validateInventory, (req,res)=>{
  // reading the data file 
  let data = readFile("./data/inventories.json"); 

  console.log(req.body);
  const {itemName,description, category, status, quantity, warehouseName,warehouseID} = req.body; 

  const inventory = {
    id: uuidv4(), 
    warehouseID,
    warehouseName,
    itemName, 
    description, 
    category,
    status, 
    quantity 
  };
  data.push(inventory);
  fs.writeFileSync(
    "./data/inventories.json",
    JSON.stringify(data, null, 4)
  );

  res.status(201).json(inventory); 
})

//Backend API Endpoint to get single inventory item
//For feature TOR20Q1HG-22
router.get("/:itemId", (req, res) => {
  //get item id from path
  const itemId = req.params.itemId;
  const inventoryObj = readFile("./data/inventories.json");
  //find item of given id in the item inventory
  const item = inventoryObj.find((item) => item.id === itemId);
  if (!item) {
    return res.status(404).send("Error: could not find item!");
  }
  res.status(200).json(item);
});

//Backend API Endpoint to edit single inventory item
//For feature TOR20Q1HG-25
router.put("/:itemId", validateInventory, (req, res) => {
  //get item id from path
  const itemId = req.params.itemId;
  const inventoryObj = readFile("./data/inventories.json");
  //find item index of given id in the item inventory
  const itemIndex = inventoryObj.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).send("Error: could not find item!");
  }

  // get all the items from body, by this time the middleware validateInventory has already done the validation
  const {
    warehouseID,
    warehouseName,
    itemName,
    description,
    category,
    status,
    quantity,
  } = req.body;

  // at index X for that array of objects apply these changes, we are using spread to get the items that we missed from
  // the body, i.e the inventory id. We could also hardcode it.
  inventoryObj[itemIndex] = {
    ...inventoryObj[itemIndex],
    warehouseID,
    warehouseName,
    itemName,
    description,
    category,
    status,
    quantity,
  };

  // now that we have the updated file we are wrtiting it here to our json
  fs.writeFileSync(
    "./data/inventories.json",
    JSON.stringify(inventoryObj, null, 4)
  );

  res.status(200).json({
    message: "item updated successfully",
    data: inventoryObj[itemIndex],
  });
});

// Backend DELETE a single Item
router.delete("/:itemId", (req, res) => {
  const inventoryObj = readFile("./data/inventories.json");
  const itemId = req.params.itemId;

  const found = inventoryObj.find((item) => item.id === itemId);

  if (found) {
    fs.writeFileSync(
      "./data/inventories.json",
      JSON.stringify(inventoryObj.filter((item) => item.id !== itemId))
    );
    res
      .status(200)
      .json({
        message: "Item Deleted",
        inventory: inventoryObj.filter((item) => item.id !== itemId),
      });
  } else {
    res.status(404).json({ message: `Error: Can not find item!` });
  }
});

module.exports = router;
