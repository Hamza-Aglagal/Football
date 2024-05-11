 


const io = require('socket.io-client');
const socket = io('http://localhost:3000');


socket.on('connect', () => {
    console.log('Connected to the server');

    
    const conversationId = 1; 
    socket.emit('joinConversation', { conversationId });

    
    const message = 'Hello, this is a test message!';
    const joueurId = 3; 
    socket.emit('sendMessage', { conversationId, message, joueurId });
});




socket.on('newMessage', (data) => {
    console.log('New message received:', data);
});


socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});


 