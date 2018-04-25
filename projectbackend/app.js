/* import modules */
const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require("pg");
const pgp = require("pg-promise")({});
const app = express();
const tools = require("./models/tools.js")
/* connection string to for db */
var config = {
  user: 'postgres',
  database: 'careersearchdb', 
  password: 'capsdatabase', 
  port: 5432, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var connectionString = "postgres://postgres:capsdatabase@localhost:5432/careersearchdb";
var pool = new pg.Pool(config);
var db = pgp(config);

app.use(express.static('public'));

/* set main layout to be main.handlebars */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
/* set our view engine to be handlebars */
app.set('view engine', 'handlebars');

/* renders the home page: lists the major occupations from the majoroccupations table */
app.get('/', function(req, res) {
	pool.connect(function (err, client, done) {
		if(err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}
		client.query(`SELECT * FROM major`, function(err, result) {
			done();
			if(err) {
				console.log(err);
				res.status(400).send(err);
			}
			var rows = result.rows;
			var mo_list = [];
			for(var i=0;i<rows.length;i++) {
				if(i == 0) continue;
				var row = rows[i];
				const mo = {
					title: row["title"],
					average_salary: row["average_median_salary"],
					employment: row["employment_2016"],
					outlook: row["change_201626"],
					link: row["occupation_group"]
				}
				mo_list.push(mo);
			}
			/* Sending data from database to the website */
			res.status(200).render("home", {msg: mo_list})
		});
	});
	// pool.end();
});

app.get('/occupations/:id', function(req, res) {
	const occupationName = req.params.id.replace(" occupations", "").split(' ').join('_');
	pool.connect(function (err, client, done) {
		if(err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}
		client.query(`SELECT * FROM careergroup WHERE title = '${occupationName}';`, function(err, result) {
			done();
			if(err) {
				console.log(err);
				res.status(400).send(err);
			}
			var rows = result.rows;
			var career_list = [];
			for(var i=0;i<rows.length;i+=3) {
				career_row = [];
				for(var j=0;j<3;j++) {
					if(i+j >= rows.length) continue;
					var row = rows[i+j];
					const career = {
						title: row["occupation"],
						discription: row["job_summary"],
						education: row["entrylevel_eduation"],
						salary: row["median_pay"]
					}
					career_row.push(career);
				}
				career_list.push({careers: career_row});
			}
			res.status(200).render("career", {row: career_list});
		});
	});
	// pool.end();
	// res.render("career", {row: row});
})

app.get('/occupations/:id/info', function(req, res) {
	var occupationName = req.params.id;
	var specialOccupationName = tools.cleanString(occupationName);
	console.log(specialOccupationName);
	db.tx(t => {
        return t.batch([
            t.any(`SELECT * FROM careerdetails WHERE job_title = '${occupationName}';`),
			t.any(`SELECT * FROM summaries WHERE job_title = '${occupationName}';`),
			t.any(`SELECT * FROM outlook WHERE title = '${specialOccupationName}'`)
        ]);
    })
    .then(data => {
        // success;
        res.status(200).send(data)
    })
    .catch(error => {
        console.log(error); // print error;
    });
	// res.render("careerinfo");
	// res.status(200).send(graph_data);
})
/* Hello World (Temporary)*/
app.get('/Hello World', function(req, res) {
	res.send("Hello World")
})
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})