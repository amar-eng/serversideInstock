const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const validation = require("../utils/validation");

// Reading and parsing JSON datafile
function readWarehouseFile() {
  const warehouseFileRead = fs.readFileSync("./data/warehouses.json");
  const warehouseFileParse = JSON.parse(warehouseFileRead);

  return warehouseFileParse;
}

// Reading and parsing JSON inventory datafile
function readInventoryFile() {
  const inventoryFileRead = fs.readFileSync("./data/inventories.json");
  const inventoryFileParse = JSON.parse(inventoryFileRead);
  return inventoryFileParse;
}

const writeFileSync = (data) => {
  return fs.writeFileSync(
    "./data/warehouses.json",
    JSON.stringify(data, null, 4)
  );
};
//add new warehouse
router.post("/add", validation, (req, res) => {
  const data = readWarehouseFile();
  const { name, address, city, country, contact } = req.body;

  const warehouse = {
    id: uuidv4(),
    name,
    address,
    city,
    country,
    contact: {
      name: contact.name,
      postion: contact.position,
      phone: contact.phone,
      email: contact.email,
    },
  };

  data.push(warehouse);
  writeFileSync(data);

  res.status(201).json(warehouse);
});

router.get("/", (req, res) => {
  const warehouseData = readWarehouseFile();

  if (!warehouseData) {
    res.status(404).send("ERROR: Could not retrieve warehouse data!");
  } else {
    res.status(200).json(warehouseData);
  }
});

// Get specific warehouse details by ID
router.get("/:id", (req, res) => {
  const reqWarehouseId = req.params.id;

  const warehouseData = readWarehouseFile();
  const foundWarehouse = warehouseData.find(
    (warehouse) => warehouse.id === reqWarehouseId
  );

  // Early return if invalid warehouse ID
  if (!foundWarehouse) {
    res.status(404).send("ERROR: Could not retrieve warehouse data!");
  } else {
    const fullWarehouseData = [];

    // Find all inventory associated with ID
    const inventoryData = readInventoryFile();
    const foundWarehouseInventory = inventoryData.filter(
      (warehouse) => warehouse.warehouseID === reqWarehouseId
    );

    // Push warehouse object and inventory array to single respose array
    fullWarehouseData.push(foundWarehouse);
    fullWarehouseData.push(foundWarehouseInventory);

    res.status(200).json(fullWarehouseData);
  }
});

// Get specific warehouse details by ID
router.put("/:id", validation, (req, res) => {
  const reqWarehouseId = req.params.id;

  const { name, address, city, country, contact } = req.body;

  const warehouseData = readWarehouseFile();
  const foundWarehouseIndex = warehouseData.findIndex((warehouse) => {
    return warehouse.id === reqWarehouseId;
  });

  // Early return if invalid warehouse ID
  if (foundWarehouseIndex === -1) {
    return res.status(404).send("ERROR: Could not retrieve warehouse data!");
  }

  warehouseData[foundWarehouseIndex] = {
    ...warehouseData[foundWarehouseIndex],
    name,
    address,
    city,
    country,
    contact: {
      name: contact.name,
      position: contact.position,
      phone: contact.phone,
      email: contact.email,
    },
  };

  writeFileSync(warehouseData);

  res.status(200).json({
    message: "warehouse updated successfully",
    data: warehouseData[foundWarehouseIndex],
  });
});

router.get("/inventory/:warehouseId", (req, res) => {
  //get warehouse id from req params
  const warehouseId = req.params.warehouseId;

  // Find all inventory associated with ID  -store in array
  const inventoryData = readInventoryFile();
  const foundWarehouseInventory = inventoryData.filter(
    (warehouse) => warehouse.warehouseID === warehouseId
  );

  //if we did find warehouse inventory, return array data
  if (!foundWarehouseInventory) {
    return res.status(404).send("ERROR: could not find warehouse inventory!");
  }
  res.status(200).json(foundWarehouseInventory);
});


// Delete a single warehouse by warehouse ID 

router.delete("/:id", (req, res)=> {
  const warehouseObj = readFile('./data/warehouses.json');
  const itemId = req.params.id;

  const found = warehouseObj.find(item => item.id===itemId)

  if(found){
      fs.writeFileSync('./data/warehouses.json',JSON.stringify(warehouseObj.filter(item => item.id !==itemId)));
      res.status(200).json
      ({message: 'Item Deleted', 
      warehouse: warehouseObj.filter(item => item.id !==itemId)
      
  })
  } else{
      res.status(404).json ({message:`Error: Can not find item!`})
  }
  
  
});

module.exports = router;
