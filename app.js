const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session  = require('express-session');
const cookieParser  = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override')

const Contact = require('./model/contact');

require('./utils/db');
const contact = require('./model/contact');

const app = express();
const port = 3000

// settup methodOverride
app.use(methodOverride('_method'))


// setup ejs
app.set ('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))


// setup flash
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge : 6000 },
        secret: 'secret',
        resave:true,
        saveUninitialized: true,
    })
)

app.use(flash())



app.get('/', (req, res) => {
    // res.send('Hello World!')
    // res.sendFile('./index.html', { root: __dirname })

    const mahasiswa = [
        {
            nama : 'Reza',
            email : 'reza@mail.com',
        },
        {
            nama : 'Bud',
            email : 'budi@mail.com',
        },
        {
            nama : 'handokok',
            email : 'hancoco@mail.com',
        },
    ]

    res.render('index', { nama : 'rezaasd', mahasiswa,  title : 'Halaman Index', layout : 'layouts/main-layouts' });
})

app.get('/about', (req, res) => {
    res.render('about',{ title : 'Halaman About' , layout : 'layouts/main-layouts' })
})

// index
app.get('/contact',async (req, res) => {
    const contacts = await Contact.find();

    res.render('contact',{ 
        title : 'Halaman Contact',
        layout : 'layouts/main-layouts',
        contacts,
        msg: req.flash('msg')
    })
})

// create
app.get('/contact/create', (req, res) => {
    res.render('create',{ 
        title : 'Halaman Form tambah data',
        layout : 'layouts/main-layouts'
    })
})

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne(
        {
            nama: req.params.nama
        }
    );

    res.render('detail',{ 
        title : 'Halaman Detail Contact',
        layout : 'layouts/main-layouts',
        contact
    })
})

// edit
app.get('/contact/edit/:nama',async (req, res) => {
    const contact = await Contact.findOne(
        {
            nama : req.params.nama
        }
    );

    res.render('update',{ 
        title : 'Halaman Form update data',
        layout : 'layouts/main-layouts',
        contact
    })
})
// update
app.put(
    '/contact', 
    body('nama').custom( async (value, {req} ) => {
        const duplicate = await Contact.findOne(
            {
                nama: value
            }
        );
        if(value !== req.body.oldname && duplicate){
            throw new Error ('nama sudah di pakai')
        }
        return true;
    }),
    check('email', 'Email boss').isEmail(),
    (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('update',{ 
            title : 'Halaman Form tambah data',
            layout : 'layouts/main-layouts',
            errors : errors.array(),
            contact: req.body
        })
    }else {
        Contact.updateOne(
            {
                _id : req.body._id
            },
            {
                $set: {
                    nama : req.body.nama,
                    email : req.body.email,
                    nohp : req.body.nohp
                }
            }
        ).then((result) => {
            req.flash('msg', 'Berhasil Update');
            res.redirect('/contact')
        })
    } 
})

// delete
app.delete('/contact', (req, res) => {
    Contact.deleteOne(
        {
            nama: req.body.nama
        }
    ).then((result) => {
        req.flash('msg', 'Berhasil Hapus ');
        res.redirect('/contact')
    })
});

// store
app.post('/contact', 
    body('nama').custom(async (value) => {
        const duplicate = await Contact.findOne({
            nama: value
        });
        if(duplicate){
            throw new Error ('nama sudah di pakai')
        }
        return true;
    }),
    check('email', 'Email boss').isEmail(),
    (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('create',{ 
            title : 'Halaman Form tambah data',
            layout : 'layouts/main-layouts',
            errors : errors.array()
        })
    }else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Berhasil');
            res.redirect('/contact')
        });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})