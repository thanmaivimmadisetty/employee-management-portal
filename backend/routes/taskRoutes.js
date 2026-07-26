console.log("✅ taskRoutes loaded");

const express = require("express");

const router = express.Router();

const taskController=require("../controllers/taskController");

const { authenticateToken } = require("../middleware/auth");

router.get("/my", authenticateToken, taskController.getMyTasks);

router.get("/",taskController.getTasks);

router.post("/",taskController.createTask);

router.put("/:id",taskController.updateTask);

router.delete("/:id",taskController.deleteTask);

module.exports=router;
