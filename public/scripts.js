(() => {
    const socket = io();
    const username = document.querySelector('#username');
    const textarea = document.querySelector('#textarea');
    const chatArea = document.querySelector('#chatWindow');
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

    send.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = {
            name: username.value,
            message: textarea.value.trim()
        }

        appendMessage(msg, 'outgoing');
        textarea.value = '';
        scrollToBottom();

        socket.emit('send message', msg);
    });

    socket.on('usernames', (data) => {
        let user = '';
        for (let i = 0; i < data.length; i++) {
            user += data[i] + '<br>';
        }
        users.innerHTML = user;
    });

    socket.on('new message', (msg) => {
        appendMessage(msg, 'incoming');
        scrollToBottom();
    });

    socket.emit('disconnect', () => {

    })

    function appendMessage({ name, message } = {}, type) {
        let div = document.createElement('div');
        div.classList.add(type, 'message');

        let markup;

        if (type === 'outgoing') {
            markup = `
                <h4>${message} :<span>${name}</span> </h4>
            `
        } else {
            markup = `
                <h4>${name}: <span>${message}</span> </h4>
            `
        }


        div.innerHTML = markup;
        chatArea.appendChild(div);
    }

    function scrollToBottom() {
        chatArea.scrollTop = chatArea.scrollHeight;
    }

})();