const express = require("express");
const {
  createList,
  updateList,
  deleteList,
  updatedListMenu,
  getListMenuById,
  getAllListById,
} = require("../controllers/listmenu-controller");
const router = express.Router();

router.post("/list", createList);
router.get("/list/:id", getAllListById);
router.get("/listmenu/:id", getListMenuById);
router.patch("/list/:id", updateList);
router.patch("/listmenu/:id", updatedListMenu);
router.delete("/list/:id", deleteList);

module.exports = router;
