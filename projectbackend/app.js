/* import modules */
const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require("pg");
const pgp = require("pg-promise")({});
const app = express();
const tools = require("./models/tools.js");
const query_tools = require("./models/query_tools");

/* connection string to for db */
var config = {
  user: 'postgres',
  database: 'careersearchdb', 
  password: 'capsdatabase', 
  port: 5432, 
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
/* connection string (no use) */
var connectionString = "postgres://postgres:capsdatabase@localhost:5432/careersearchdb";
/* setting pool to connect to the database */
var pool = new pg.Pool(config);
/* initializing pg-promise to connect to the database */
var db = pgp(config);

/* setting static tools (css, js, etc.) which will be located in the public folder*/
app.use(express.static('public'));
/* set main layout to be main.handlebars */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
/* set our view engine to be handlebars */
app.set('view engine', 'handlebars');

/* renders the home page: lists the major occupations from the majoroccupations table */
app.get('/', function(req, res) {
	db.tx(t => {
		return t.batch([
				/* data[0] is the table of major occupations and data about them */
				t.any(`SELECT * FROM major`),
				/* data[1] is the table which holds the description for the occupations */
				t.any(`SELECT * FROM occupationdesc`)
			]);
	})
	.then(data => {
		/* get the data from the first query */
		var rows = data[0];
		/* intialize a emtpy list to store the objects for the render */
		var mo_list = [];
		var title_list = [];
		/* loop through all th rows from the queried data */
		for(var i=0;i<rows.length;i++) {
			/* skip the first element  */
			if(i == 0) continue;
			/* make a new variable to hold the current row */
			var row = rows[i];
			/* make a json object to hold the data for the major occupation group */
			const mo = {
				/* data to display for the major occupation */
				/* data is located in the array row */
				/* the variables in the json object are about the major occuaption */
				title: row["title"],
				average_salary: row["average_median_wage"],
				employment: row["employment_2016"],
				outlook: row["change_201626"],
				link: row["occupation_group"],
				/* use the query tool to find the right description for the according row (major occupation) */
				description: query_tools.getDescription(row, data[1])
			}
			title_list.push(row["title"]);
			/* add the object to the list */
			mo_list.push(mo);
		}
		/* render the new list */
		res.status(200).render("home", {groupTitle: title_list, msg: mo_list})
	})
	.catch(error => {
		/* if there is an error print it to the console */
		/* send a status of 400 when error */
		console.log(error);
		res.status(400).send(error);
	})
});

/* renders career page where all careers in the occupation are displayed*/
app.get('/occupations/:id', function(req, res) {
	/* set occupation name */
	const occupationName = req.params.id.replace(" occupations", "").split(' ').join('_');
	/* connect to the database */
	pool.connect(function (err, client, done) {
		/* if error then send a status 400 */
		if(err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}
		/* make a query to the database to get the data on careers with occupation */
		client.query(`SELECT * FROM careergroup WHERE title = '${occupationName}';`, function(err, result) {
			done();
			/* send status 400 if error */
			if(err) {
				console.log(err);
				res.status(400).send(err);
			}
			/* get the rows from the result */
			var rows = result.rows;
			var career_list = [];
			var title_list = [];
			/* get all careers from data */
			/* loop through all the rows */
			for(var i=0;i<rows.length;i++) {
				/* get the row from array */
				var row = rows[i];
				/* make the career */
				const career = {
					title: row["occupation"],
					discription: row["job_summary"],
					education: row["entrylevel_eduation"],
					salary: row["median_pay"]
				}
				/* add title of careers */
				title_list.push(row["occupation"]);
				/* add it to the array of 3 */
				career_list.push(career);
				/* add the array size 3 to the final array */
			}
			/* send the response */
			res.status(200).render("career", {careerTitle: title_list, careers: career_list});
		});
	});
	// pool.end();
	// res.render("career", {row: row});
})

/* renders html file which displays data and info on the career the user has clicked on */
app.get('/occupations/:id/info', function(req, res) {
	/* set the new occupation name (for querying) */
	var occupationName = req.params.id;
	/* set another occupation name (for another query) */
	var specialOccupationName = tools.cleanString(occupationName);
	/* run all the queries to get the data */
	db.tx(t => {
		/* returns the results from the queries*/
        return t.batch([
        	/* data[0] is the */
            t.any(`SELECT * FROM careerdetails WHERE job_title = '${occupationName}';`),
			t.any(`SELECT * FROM summaries WHERE job_title = '${occupationName}';`),
			t.any(`SELECT * FROM outlook WHERE title = '${specialOccupationName}'`),
			t.any(`SELECT * FROM outlook WHERE NULLIF(replace(substring(projected_employment_2026_0, 2), ',', ''), '')::int = (SELECT max(NULLIF(replace(substring(projected_employment_2026_0, 2), ',', ''), '')::int) FROM outlook LIMIT 1);`),
			t.any(`SELECT * FROM outlook WHERE NULLIF(replace(substring(change_201626_0, 1), ',', ''), '')::int = (SELECT max(NULLIF(replace(substring(change_201626_0, 1), ',', ''), '')::int) FROM outlook LIMIT 1);`)
        ]);
    })
    .then(data => {
    	/* data is accessed here */
    	// res.send(data)
    	/* using data in objects to pass on to the render */
    	/* query_tools will assist in retrieving the right data from the results */
    	/* duties of career */
    	var career_duties = query_tools.getDuties(data, 0); // 0 is the index of array of career details table
    	/* get the skills data with query tools*/
    	var skills = query_tools.getSkills(data, 0);
    	/* temporary data for graph */
        var labels = ["2016", "2026"];
        /* get the graph data for the graph */
        var graph_data = query_tools.getEmployment(data, 2); // 2 is the index of the array of graph data table
        /* more temporary data */
        var labels2 = ["2016", "2026"];
        /* more temporary data */
        var data2 = [9, 3433];
        /* get the steps of how to become */
        var steps = query_tools.getHowToBecome(data, 0);
        /* more temporary data */
        var percent_e = query_tools.getEmploymentPercent(data, 2);
        /* send the data in raw form */
        // res.status(200).send(data);
        /* render the page to display the data */
        res.status(200).render("careerinfo", {step: steps, duty: career_duties, skill: skills, labels: labels, datas: graph_data, labels2: labels2, datas2: data2});
    })
    .catch(error => {
        console.log(error); // print error;
    });
	// res.status(200).render("careerinfo");
	// res.status(200).send(graph_data);
})

/* Hello World (Temporary) */
app.get('/hello-world', function(req, res) {
	res.send("Hello World")
})

/* The port the app is listening in */
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})