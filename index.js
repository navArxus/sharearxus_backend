const express = require("express")
const cookieParser = require('cookie-parser');
const app = express();
const { Server } = require("socket.io");
const http = require('http')

// Room controllers import 
const { createRoom, checkRoom } = require('./controllers/Room')

const cors = require('cors')
app.use(cors(
    {
        credentials: true,
        origin: 'https://sharearxus.vercel.app',
    }
))

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

app.set("trust proxy", 1)
// mongoose connect 
const mongoose = require("mongoose")


mongoose.connect(process.env.MONGO_URL).then(console.log("Mongo Connected")).catch(err => console.log(err))

// Routes import 
const userRoutes = require('./routes/user');
const codeRoutes = require('./routes/code');

// CONFIGURE FOR DOT ENV 
require('dotenv').config();
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// ROutes 

app.use("/user", userRoutes)
app.use("/code", codeRoutes)

app.get("/", (req, res) => {
    // console.log(res.cookies)
    res.send("Hello world")
})


// Server of socket.io
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'https://sharearxus.vercel.app',
    }
})

// Testing github commit issue 

io.on('connection', (socket) => {
    console.log("some one connected and its id is", socket.id)
    socket.on("create-room", async msg => {
        try {
            await createRoom(msg.roomID, msg.tempararyID, msg.firstLanguage)
            socket.join(msg.roomID)
            console.log("Room joined", msg.roomID)
            io.to(msg.roomID).emit("room-joined", {
                roomID: msg.roomID,
                tempararyID: msg.tempararyID
            })
        } catch (error) {
            console.log(error);
        }
    })
    socket.on("join-room", async msg => {
        try {
            const roomExist = await checkRoom(msg.roomID)
            if (!roomExist) {
                io.to(socket.id).emit("No room Found")
            } else {

                socket.join(msg.roomID)
                console.log("Room joined", msg.roomID)
                io.to(msg.roomID).emit("room-joined", {
                    roomID: msg.roomID,
                    tempararyID: msg.tempararyID
                })
            }
        } catch (error) {
            console.log(error);
        }
    })
    socket.on("commit-message", async msg => {
        console.log("New commit avaiable")
        io.to(msg.roomID).emit("new-commit", {
            roomID: msg.roomID,
            tempararyID: msg.tempararyID,
            msg: "New commit avaiable"
        })
    })
})


server.listen(PORT, () => console.log(`Server Started at ${PORT}`))

