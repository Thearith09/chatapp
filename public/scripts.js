(() => {
    const socket = io();
    const username = document.querySelector('#username');
    const message = document.querySelector('#textarea');
    const chat = document.querySelector('#chatWindow');
    const userForm = document.querySelector('#usernameForm');
    const users = document.querySelector('#users');
    const send = document.querySelector('#send');

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('new user', username.value, (data) => {
            if (data) {
                document.querySelector('#namesWrapper').style.display = 'none';
                document.querySelector('#mainWrapper').style.display = 'block';
                document.querySelector('#userWrapper').style.display = 'block';
            } else {
                document.querySelector('#error').innerHTML = 'Username is taken';
            }
        })
    })

    send.addEventListener('click', () => {
        event.preventDefault();
        socket.emit('send message', {
            name: username.value,
            message: message.value
        });
        message.value = '';
    });

    socket.on('usernames', (data) => {
        let user = '';
        for (let i = 0; i < data.length; i++) {
            user += data[i] + '<br>';
        }
        users.innerHTML = user;
    });

    socket.on('new message', ({ name, message }) => {
        chat.innerHTML += `<h4> ${name}: <span> ${message} </span></h4>`;
    });

    socket.emit('disconnect', () => {

    })

})();