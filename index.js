const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const PORT = 3000;
const app = express();

app.use(cors({origin: "*"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./app/controllers/AuthenticationController'));
app.use(require('./app/controllers/MessageController'));
app.use(require('./app/controllers/UserController'));

const server = require('http').Server(app);

server.listen(PORT, function () {
  console.log('Social Hub is listening on port ' + PORT + ' !');
});

const chatSocket = require('./app/sockets/ChatSocket');
chatSocket.listen(server);