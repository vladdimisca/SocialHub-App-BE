const express = require('express');
const bodyParser = require("body-parser");
const Config = require('./app/env/Config');
const cors = require('cors');
const socketIO = require('socket.io');

const PORT = Config.port || 3000;
const app = express();

app.use(cors({origin: "*"}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(require('./app/controllers/AuthenticationController'));
app.use(require('./app/controllers/MessageController'));
app.use(require('./app/controllers/UserController'));
app.use(require('./app/controllers/PostController'));
app.use(require('./app/controllers/FriendsController'));
app.use(require('./app/controllers/CommentController'));

const server = require('http').Server(app);

server.listen(PORT, () => {
  console.log('Social Hub is listening on port ' + PORT + ' !');
});

const io = socketIO(server);

const chatSocket = require('./app/sockets/ChatSocket');
chatSocket.listen(io);

const userSocket = require('./app/sockets/UserSocket');
userSocket.listen(io);

const friendsSocket = require('./app/sockets/FriendsSocket');
friendsSocket.listen(io);

const commentSocket = require('./app/sockets/CommentSocket');
commentSocket.listen(io);