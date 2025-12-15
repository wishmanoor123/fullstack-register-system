const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mysql');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');

const app =express();
const port = process.env.PORT || 5002;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));




//mysql connection

const db = sql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'register_db',
});


// file upload settings
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/');
    },
    filename: ( req,file,cb) =>
     {
        cb(null,Date.now() + '-' + file.originalname);
    }
    
});

const upload = multer ({storage:storage});

// Register User

app.post('/register',upload.single('image'), async(req,res)=>{
    const {name,email,password} = req.body;
    // store only the filename in DB; frontend will build the full URL
    const image = req.file ? req.file.filename : null;

    if(!name || !email || !password)
        return res.status(400).json({msg: 'Please enter all fields'});


        try {
            const hashedPassword = await bcrypt.hash(password,10);

            const insertQuery = 'INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)';

            db.query(insertQuery, [name, email, hashedPassword, image], (err,result) =>{
                if(err) {
                    console.error('DB insert error:', err);
                    return res.status(500).json({msg: 'Server error', error: err.message});
                }

                return res.status(201).json({msg: 'User registered successfully'});
            });
        } catch (err) {
            console.error('Hashing error:', err);
            return res.status(500).json({msg: 'Server error', error: err.message});
        }
});

// Login User

app.post ('/login', (req,res)=>{
    const {email, password} = req.body;

    if (!email || !password)
        return res.status(400).json({msg: "Please enter all fields"});

    const selectQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(selectQuery, [email], async(err, results)=>{
        if(err) {
            console.error('DB select error:', err);
            return res.status(500).json({msg: 'Server error', error: err.message});
        }

        if(results.length === 0)
            return res.status(400).json({msg: 'User not found'});

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            return res.status(400).json({msg: 'Invalid credentials'});

        res.send({
            msg: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ? `http://localhost:${port}/uploads/${user.image}` : null,

            },
        });
    });
});

app.listen(port,()=>console.log(`Listen on Port ${port}`));