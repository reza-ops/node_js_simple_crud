const mongoose = require('mongoose');
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
    },
    nohp: {
        type: String
    }, 
    email: {
        type: String
    }
})


module.exports = Contact;