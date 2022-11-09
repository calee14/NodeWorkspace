# Gauchocourse setup and installation
- what is marven?
- dev-webpack
	- used to bundle js files together so it won't be a hassle to locate them and use them
- what db are we using? PostgresSQL or CosmosDB (NoSQL and relational db)
- how is redis implemented in this proj?
- we want to use dev containers? docker??

# CI/CD
- **inner loop**
	- code -> build -> test -> code (loop)
	- when code is ready to be **pushed** it will be sent to outer loop
		- pushing to an open pull request it is generally good to publish the code to a **staging env**
		- staging env - a test env that mimics production 
			- sits betweeen build and production
- **outer loop**
	- integrate -> test -> release -> deploy 
- **automation**
	- implement security and rules for developers and their privileges
	- 
