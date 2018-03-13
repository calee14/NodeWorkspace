var express = require('express');
var pg = require('pg');
var app = express();
var connectionString = "postgres://postgres:capsdatabase@localhost:5432/students";

var config = {
  user: 'postgres',
  database: 'postgres', 
  password: '123', 
  port: 5432, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);

app.get('/', function (req, res, next) {
    pg.connect(connectionString,function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM student where id = $1', [1],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.get('/sp', function(req, res, next) {
    pg.connect(connectionString, function(err,client,done) {
        if(err) {
          console.log("not able to get connection " + err);
          res.status(400).send(err);
        }
        client.query('SELECT * from GetAllStudent()', function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

app.get('/pool', function(req, res, next) {
   pg.connect(connectionString, function(err,client,done) {
      if(err) {
         console.log("not able to get connection" + err);
         res.status(400).send(err);
      }
      client.query('SELECT * FROM GetAllStudent()', function(err,result) {
          done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
   })
})

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});