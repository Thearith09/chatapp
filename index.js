const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Message = require('./public/connection');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
let usernames = [];


io.on('connection', (socket) => {
	socket.on('new user', (data, callback) => {
		try {
			if (usernames.includes(data)) {
				return callback(false);
			} else {
				callback(true);
				socket.username = data;
				usernames.push(socket.username);
				updateUsernames();
			}

		} catch (error) {
			return console.log('Error: ', error);
		}
	});

	function updateUsernames() {
		io.emit('usernames', usernames);
	}

	socket.on('send message', async ({ name, message } = {}) => {
		try {
			const msg = new Message({
				name,
				message
			});
			const savedMessage = await msg.save();
			console.log('Message has been saved.');

			socket.broadcast.emit('new message', msg);

		} catch (error) {
			return console.log('Error: ', error);

		} finally {
			console.log('Message posted!');
		}

	});

	socket.on('disconnect', () => {
		if (!socket.username) {
			return;
		}

		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	})
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server is up on port ${port}.`));