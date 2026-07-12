const express = require("express");
const router = express.Router();

const {
  getIssues,
  createIssue,
} = require("../controllers/jiraController");

router.get("/issues", getIssues);
router.post("/issue", createIssue);

module.exports = router;
