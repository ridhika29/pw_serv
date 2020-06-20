const express = require('express');
const app=express();
const cors = require('cors');
var bodyParser = require('body-parser');
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "contacts",
  password: "test",
 
});



app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res)=>{
res.send("hello");
})

app.post('/register',(req,res)=>{
	var name=req.body.name;
	var email=req.body.email;
	var ph1=req.body.ph1;
	var ph2=req.body.ph2;
	var job=req.body.job;
	var pass=req.body.pass;
//console.log(req.body);
//	
  var query=`INSERT INTO users(name, email, job, ph1, ph2)VALUES('${name}','${email}','${job}',${ph1},${ph2})`;
  pool.query(query,
  (err, res) => {
    console.log(err);
    //pool.end();
  });
  var q=`INSERT INTO login(email,pass)VALUES('${email}','${pass}')`;
  pool.query(q,(err,res) =>{
    console.log(err);
})
    res.json("Registered");
})


app.post('/signin',(req,res)=>{
  
  var email=req.body.email;
  var pass=req.body.pass;
//console.log(req.body);
//  
  var query=`SELECT * FROM login WHERE email='${email}' AND pass='${pass}'`;
  pool.query(query)
  .then(data => res.status(200).json(data.rows[0]))
  .catch(err => res.status(400).json('notValid User'));

  //console.log(res);
})

app.get('/viewlist',function(req,res){
	
	getUsers(function (err, Result){ 
       //you might want to do something is err is not null...      
      // res.json(Result);
      res.json(Result.rows);
   });
})

function getUsers(callback) {    
        pool.query("SELECT * FROM users",
            function (err, rows) {
                //here we return the results of the query
                callback(err, rows); 
            }
        );    
}



app.listen(3000,()=>{
	console.log("app is running on server port : 3000");
});