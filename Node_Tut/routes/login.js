const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/login(.html)?', (req,res) => {
    res.sendFile(path.join(__dirname,'..','views','login','signlog.html'));
});

module.exports = router;