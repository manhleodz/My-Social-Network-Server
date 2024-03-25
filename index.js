require('dotenv').config()
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const port = process.env.PORT;

// rate limit
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 100,
  message: 'Too many connection',
  handler: (request, response, next, options) => {
    if (request.rateLimit.used === request.rateLimit.limit + 1) {
      // onLimitReached code here
    }
    response.status(options.statusCode).send(options.message)
  },
});

app.set('trust proxy', (ip) => {
  if (ip === 'http://localhost:3040' || ip === 'https://my-social-network-umber.vercel.app') return true
  else return false
})

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const db = require('./models');

//rate limit
app.use(apiLimiter);
// Routers
const postRouter = require("./routes/Posts");
app.use("/api/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/api/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/api/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/api/likes", likesRouter);

const profileRouter = require("./routes/UserInfo");
app.use("/api/info", profileRouter);

const relaRouter = require("./routes/UserRela");
app.use("/api/relationship", relaRouter);

const reelRouter = require("./routes/Reel");
app.use("/api/reel", reelRouter);

const storyRouter = require("./routes/Story");
app.use("/api/story", storyRouter);

const inboxRouter = require("./routes/Inbox");
app.use("/api/inbox", inboxRouter);

const imageRouter = require("./routes/Images");
app.use("/api/images", imageRouter);

const searchRouter = require("./routes/Search");
app.use("/api/search", searchRouter);

const notificationRouter = require("./routes/Notifications");
app.use("/api/notification", notificationRouter);

io.on("connection", (socket) => {

  socket.on('online', async (user) => {
    io.sockets.emit('joined', reply);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${JSON.stringify(data)}`);
  });

  socket.on("typing", (data) => {
    socket.in(data.room).emit("typing")
  });
  socket.on("stop typing", (data) => {
    socket.in(data.room).emit("stop typing")
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });

  socket.on("disconnect", async (userId) => {
    io.sockets.emit('joined', []);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
  });
});

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});