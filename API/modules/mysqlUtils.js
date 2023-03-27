const mysql = require('mysql');

class MysqlRequests{
    constructor(){
        //Create a connection pool with the user details
        this.db = mysql.createPool({
            connectionLimit: 1,
            host: "localhost",
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            debug: false,
        });
    }
    
    checkUserDetails(email,res){
        email = this.db.escape(email);

        //inserts data into table - user credentials on sign up
        let sql = `SELECT * FROM users WHERE email = ${email}`;

        let db = this.db;
        return new Promise(function(resolve, reject){
            db.query(sql,
                function(err, rows){
                    if(err){
                        res.sendStatus(500);
                    }
                    if (rows === undefined){//Check for errors
                        reject(new Error("Error rows is undefined"))
                    }
                    else{
                        resolve(rows);
                    }
                }
            )
        })
    }

    uploadUserDetails(email,password,firstname,lastname,phoneNumber,firstLineAddress,city,postcode,hash,res){
        email = this.db.escape(email);
        password = this.db.escape(password);
        firstname = this.db.escape(firstname);
        lastname = this.db.escape(lastname);
        phoneNumber = this.db.escape(phoneNumber);
        firstLineAddress = this.db.escape(firstLineAddress);
        city = this.db.escape(city);
        postcode = this.db.escape(postcode);

        //inserts data into table - user credentials on sign up
        let sql = `INSERT INTO users (email,firstname,lastname,phoneNumber,firstLineAddress,city,postcode,hash)
            VALUES(${email},${firstname},${lastname},${phoneNumber},${firstLineAddress},${city},${postcode},\"${hash}\")`;

        let db = this.db;
        return new Promise(function(resolve, reject){
            db.query(sql, (err, rows)=>{
                    //Check for errors with the query
                    if (err){
                        if (err.code === "ER_DUP_ENTRY"){
                           if (err.sqlMessage.includes("email")){
                                res.send({"registerUser": false, "message":"An account with this email already exists."});
                            }
                        } else {
                            res.sendStatus(500);
                        }
                    }else{
                        res.send({"registerUser": true, "message": "You have successfully registered."});
                    }

            })
        })
    }
}



module.exports.MysqlRequests = MysqlRequests;