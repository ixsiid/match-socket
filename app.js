const express = require('express');
const path = require('path')
const crypto = require('crypto');
const PORT = process.env.PORT || 7000;
const SOCKET = process.env.SOCKET || 32000;
const socket_num = 5;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

for (let i = 0; i < socket_num; i++) {
    const io = require('socket.io')();
    io.on('connection', socket => {
        const id = crypto.randomBytes(4).toString('hex');
        socket.emit('join', { sender: 'admin', data: id });
        socket.on('send', data => { io.emit('recv', data); });
    });
    io.listen(SOCKET + i);
}
