const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./Config/Database')
const { createServer } = require('http');
const socketIo = require("socket.io");
const sql = require('mssql')
const cors = require('cors');

const router = require('./Routers/Routes')


// database 
DB()






const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = createServer(app);




// routes 
app.use('/api', router)

app.get('/', (req, res) => {
    res.send('Hello World!');
});



// Socket io 

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});



io.on('connection', (socket) => {

    console.log('client connected: ', socket.id);


    socket.on('joinConversation', ({ conversationId }) => {
        socket.join(conversationId);
        console.log(`Joined conversation room: ${conversationId}`);

    });


    socket.on('sendMessage', async ({ conversationId, message, joueurId }) => {
        try {
            const query = `
            INSERT INTO Message_line (date_envoie, date, message, conversation_id, joueur_id)
            VALUES (@dateEnvoie, @date, @message, @conversationId, @joueurId);
          `;


            const pool = await DB();
            const result = await pool.request()
                .input('dateEnvoie', sql.Time, new Date())
                .input('date', sql.Date, new Date())
                .input('message', sql.NVarChar(sql.MAX), message)
                .input('conversationId', sql.Int, conversationId)
                .input('joueurId', sql.Int, joueurId)
                .query(query);



            io.to(conversationId).emit('receiveMessage', {
                message,
                joueurId
            });



        } catch (error) {
            console.error('Error saving message:', error);
        }
    });



    socket.on('disconnect', (reason) => {
        console.log(reason);
    });


});



setInterval(() => {
    io.to('clock-room').emit("time", new Date());
}, 1000);




// run server 

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



