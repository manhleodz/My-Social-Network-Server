require('dotenv').config()
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();
const Redis = require('redis');

const redisClient = Redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.connect().catch(console.error);

if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
};
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3040", "https://my-social-network-umber.vercel.app"],
    methods: ["GET", "POST"],
  },
});

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

app.use(express.static('public'));
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
    console.log(user.nickname + " is online");
    socket.join(user.id);
    io.sockets.emit("connected", user.id);
    let user1 = await redisClient.get(`account-${user.id}`);

    if (user1) {
      await redisClient.del(`account-${user.id}`);
      await redisClient.SET(`account-${user.id}`, JSON.stringify({ online: true }));
    }

    socket.on("disconnect", async () => {
      console.log(user.nickname + " is offline");
      socket.leave(user.id);
      io.sockets.emit('disconnected', user.id);
      let user2 = await redisClient.get(`account-${user.id}`);

      if (user2) {
        await redisClient.del(`account-${user.id}`);
        await redisClient.SET(`account-${user.id}`, JSON.stringify({ online: false }));
      }
    });

  });

  socket.on("notification", async (data) => {
    io.sockets.to(data.receiver).emit("notification", data);
  });

  socket.on("delete_message", async (data) => {
    // io.sockets.to(data.receiver).emit("delete_message_receiver", data);
    io.sockets.to(data.room).emit("delete_message_receiver", data);
  });

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("typing", (data) => {
    socket.in(data.room).emit("typing")
  });
  socket.on("stop typing", (data) => {
    socket.in(data.room).emit("stop typing")
  });

  socket.on("send_message", (data) => {
    if (data.receiver) {
      socket.to(data.receiver).emit(`receiver`, data);
    }
    console.log(data.sender + " send message " + data.receiver + " in room " + data.room);
    socket.in(data.room).emit("receive_message", data);
  });

});

// Database synchronization (optional)
(async () => {
  try {
    await db.sequelize.sync();

    server.listen(port, () => {
      console.log('Server listening on port:', port);
    });
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();