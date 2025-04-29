const express = require("express");

const router = express.Router();

const {
  createMenu,
  getMenuItems,
  getMenuItemByID,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuItemController");
const validateToken = require("../middlewares/validateToken");
const upload = require("../middlewares/uploadImage");

router.post(
  "/create-menu/:restaurantID",
  validateToken,
  upload.single("image"),
  createMenu
);
router.get("/get-menu/:restaurantID", getMenuItems);
router.get("/get-menu/:restaurantID/:menuItemID", getMenuItemByID);
router.put(
  "/update-menu/:restaurantID/:menuItemID",
  validateToken,
  upload.single("image"),
  updateMenuItem
);
router.delete(
  "/delete-menu/:restaurantID/:menuItemID",
  validateToken,
  deleteMenuItem
);

module.exports = router;
