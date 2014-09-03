var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/app.html');
});

app.listen(8080);