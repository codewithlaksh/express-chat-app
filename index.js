const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const PORT = 8080 || process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/static', express.static(path.join(__dirname, 'public')))

app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'base.hbs'
}))
app.set('view engine', 'hbs')

const users = {};

app.get('/', (req, res) => {
    res.render('index');
})

io.on('connection', (socket) => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    })

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, user: users[socket.id]});
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
})

server.listen(PORT, () => {
    console.log(`Chat app listening on http://localhost:${PORT}`);
})
