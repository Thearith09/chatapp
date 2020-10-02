const mongoose = require('mongoose');

const Message = mongoose.model('Message', {
    name: String,
    message: String
});


const dbUrl = 'mongodb+srv://puthearith:thearith09@cluster0.kjj8i.mongodb.net/chatapp?retryWrites=true&w=majority';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Connected...'))
    .catch((error) => console.log('Connection failed...', error));

module.exports = Message;