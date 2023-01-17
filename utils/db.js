const mongoose = require('mongoose');

mongoose.connect(
    'mongodb://127.0.0.1:27017/laravel',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true
    }
)

// 



// // create
// const contact1 = new Contact({
//     nama : 'Budi',
//     nohp : '1234',
//     email : 'bud@mail.com',
// })

// // simpan to collection
// contact1.save().then((result) => {
//     console.log(result)
// })