# SQL for BigQuery and Cloud SQL
```sql
-- SQL is used for structured data like Google Sheets (tables, rows and columns)
-- Database is a collection of one or more tables
SELECT -- specifies the fields (columns) to pull from
FROM -- specifies the table from data
WHERE -- supplements the query by filtering the rows where the column has a specific value
-- example query
SELECT * FROM `bigquery-public-data.london_bicycles.cycle_hire` WHERE duration>=1200;
GROUP BY -- will aggregate (combine) results that share common criteria such as a name or a price
        -- will return unique entires of such criteria because the ones with similar will be combined into one
-- example query group by
SELECT start_station_name FROM `bigquery-public-data.london_bicycles.cycle_hire` GROUP BY start_station_name;

COUNT() -- is a function that returns the number of rows that share the same criteria (e.g. column value)
SELECT start_station_name, COUNT(*) FROM `bigquery-public-data.london_bicycles.cycle_hire` GROUP BY start_station_name;
AS -- creates an alias for a table or column
ORDER BY -- sorts returned data from a query in ascending or descending order
ASC -- the keywords for ORDER BY
DESC

-- create a database
CREATE DATABASE bike;
-- to enter a database in a SQL session
USE bike;
CREATE TABLE london1 (start_station_name VARCHAR(255), num INT);
USE bike;
CREATE TABLE london2 (end_station_name VARCHAR(255), num INT);

SELECT * FROM london1;
SELECT * FROM london2;

DELETE -- keyword for deleting entires in a table
-- example of delete
DELETE FROM london1 WHERE num=0;
DELETE FROM london2 WHERE num=0;

INSERT INTO -- for adding entries into a table
-- example of insert
INSERT INTO london1 (start_station_name, num) VALUES ("test destination", 1);

UNION -- keyword that combines the output of two or more select queries
-- example of union
SELECT start_station_name AS top_stations, num FROM london1 WHERE num>100000
UNION
SELECT end_station_name, num FROM london2 WHERE num>100000
-- suppplement query by ordering the rows from both queries
ORDER BY top_stations DESC;
```