const express = require("express");
let router = express.Router();

router.get("/", async (req, res) => {
    res.render("homepage");
  });

router.get("/contact-us", async (req, res) => {
  res.render("contact-us");
});

router.get("/storyAPI", async (req, res) => {
  res.render("storyAPI");
});

module.exports = router;