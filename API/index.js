const express    = require('express');
const path       = require('path');
const http       = require('http');
const bodyParser = require('body-parser');
const mysqlUtils = require('./modules/mysqlUtils.js');
// const requestUtils = require('./modules/requestUtils.js');
const validation = require('./modules/validation.js');
const bcrypt     = require('bcrypt');
const JWT        = require('jsonwebtoken');
const saltRounds = 12;

require('dotenv').config({ override: true });
const validator     = new validation.Validator();
const mysqlRequests = new mysqlUtils.MysqlRequests();

//Initialising server 
const app = express();

app.use(express.static('public'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..','public'),{index:false,extensions:['html']}));

//Configure express with body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// app.options('*', function (req,res) { res.sendStatus(200); });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.post("/registerUser", async(req,res) => {
    let email               = req.body.email;
    let password            = req.body.password;
    let firstname           = req.body.firstname;
    let lastname            = req.body.lastname;
    let phoneNumber         = req.body.phoneNumber;
    let firstLineAddress    = req.body.firstLineAddress;
    let city                = req.body.city;
    let postcode            = req.body.postcode;

    let validationResult = validator.validateRegister(req);

    //Validating user input
    if(validationResult.valid === false){
        res.send({"registerUser":"false","message":validationResult.message})
    }else{
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err){
                res.sendStatus(500);
            } else {
                bcrypt.hash(password, salt, function(err, hash) {
                    if(err){
                        res.sendStatus(500);
                    } else {
                        mysqlRequests.uploadUserDetails(email,password,firstname,lastname,phoneNumber,firstLineAddress,city,postcode,hash,res);
                    }
                });
            }
        });
    }
});



app.post("/loginUser", async (req,res) => {
    let email = req.body.email;
    let userPassword = req.body.password;
    let validationResult = validator.validateLogin(req);

    //Validating user input
    if(validationResult.valid === false){
        res.send({"loginUser":"false","message":validationResult.message});
    }else{
        mysqlRequests.checkUserDetails(email,res).then(function(results){
            if(results.length <= 0){
                res.send({"loginUser": false, "message": "Email or Password is incorrect."});
            } else {
                let hash = results[0].hash;
                let userID = results[0].userID;

                bcrypt.compare(userPassword, hash, function(err, result) {
                    if(err){
                        res.sendStatus(500);
                    }
                    if(result === false){
                        res.send({"loginUser": false, "message": "Email or Password is incorrect."});
                    }else{
                        if(result === true){
                            const token = JWT.sign({id: userID}, process.env.JWT_SECRET);
                            res.send({"loginUser": true, "message": "You have successfully logged in.","token":token});
                        }
                    }
                });
        }
        })
        
    }
});





const server = http.createServer(app);
server.listen(8000)