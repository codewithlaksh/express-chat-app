const socket = io(window.location.origin);
const name = prompt('Enter your name: ');
const messageContainer = document.querySelector('#msgContainer');
const msgForm = document.querySelector('form#msgForm');
const msgInput = document.querySelector('textarea#msgInput');

const appendMessage = (message, position) => {
    let msgElement = document.createElement('div');
    msgElement.classList.add(position);
    msgElement.innerText = message;

    messageContainer.appendChild(msgElement);
}

socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat!`, 'center');
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const textMessage = msgInput.value;

    appendMessage(`You: ${textMessage}`, 'right');

    socket.emit('send', textMessage);
    msgInput.value = '';
})

socket.on('receive', data => {
    appendMessage(`${data.user}: ${data.message}`, 'left');
})

socket.on('leave', (name) => {
    appendMessage(`${name} left the chat`, 'center');
})