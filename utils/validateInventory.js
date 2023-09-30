module.exports = (req, res, next) => {
  const {
    warehouseID,
    warehouseName,
    itemName,
    description,
    category,
    status,
    quantity,
  } = req.body;
  if (!warehouseID) {
    return res.status(422).json({
      error: "WarehouseID field is required",
    });
  }

  if (!warehouseName) {
    return res.status(422).json({
      error: "Warehouse Name field is required",
    });
  }

  if (!itemName) {
    return res.status(422).json({
      error: "itemName field is required",
    });
  }

  if (!description) {
    return res.status(422).json({
      error: "description field is required",
    });
  }

  if (!category) {
    return res.status(422).json({
      error: "category field is required",
    });
  }

  if (!status) {
    return res.status(422).json({
      error: "Status field is required",
    });
  }

  if (!quantity) {
    return res.status(422).json({
      error: "Quanity field is required",
    });
  }
  next();
};
