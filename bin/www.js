var app = require("../app");
var https = require('https');
var http = require("http");
var config = require("../server/config/config");
var path = require('path');
const fs = require('fs');
const express = require("express");


var server=null;
if(config.isHosted()){
  const options = {
    key: fs.readFileSync(path.join(__dirname,'ssl','private.key')),
    cert: fs.readFileSync(path.join(__dirname,'ssl','certificate.crt'))
  };
  app.set("port", 443);
  server = https.createServer(options,app);
  server.listen(443);

  var redirectApp = express();
  redirectApp.all('*', function(req, res) {  
      res.redirect('https://' + req.headers.host + req.url);
  })
  redirectApp.set("port", 80);
  var httpServer = http.createServer(redirectApp);
  httpServer.listen(80);

  console.log("Application Hosted")
}else{
  var port = normalizePort(config.get("server.port"));
  app.set("port", port);
  server = http.createServer(app);
  server.listen(port);
}



server.on("error", onError);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
  case "EACCES":
    console.error(bind + " requires elevated privileges");
    process.exit(1);
    break;
  case "EADDRINUSE":
    console.error(bind + " is already in use");
    process.exit(1);
    break;
  default:
    throw error;
  }
}
