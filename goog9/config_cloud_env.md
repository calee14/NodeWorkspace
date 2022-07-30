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
# Multiple VPC Networks
```bash
# make a new VPC network that a custom mode network with a subnet in it
gcloud compute networks create managementnet --project=qwiklabs-gcp-04-4281fedd4f69 --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional 
gcloud compute networks subnets create managementsubnet-us --project=qwiklabs-gcp-04-4281fedd4f69 --range=10.130.0.0/20 --stack-type=IPV4_ONLY --network=managementnet --region=us-east1

# make a new VPC network in the project
gcloud compute networks create privatenet --subnet-mode=custom
# make a subnet in the new network, specify the IP ranges
gcloud compute networks subnets create privatesubnet-us --network=privatenet --region=us-east1 --range=172.16.0.0/24
# make a second subnet for the eu region
gcloud compute networks subnets create privatesubnet-eu --network=privatenet --region=europe-west4 --range=172.20.0.0/20
# list subnets and mainnets
gcloud compute networks list
gcloud compute networks subnets list --sort-by=NETWORK

# command line for making a firewall rule to apply to all instances in a VPC network
gcloud compute --project=qwiklabs-gcp-04-4281fedd4f69 firewall-rules create managementnet-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=managementnet --action=ALLOW --rules=tcp:22,tcp:3389,icmp --source-ranges=0.0.0.0/0
# make a firewall rule for privatenet to allow certain internet traffic at ports and source IP ranges
gcloud compute firewall-rules create privatenet-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=privatenet --action=ALLOW --rules=icmp,tcp:22,tcp:3389 --source-ranges=0.0.0.0/0
# list firewall rules
gcloud compute firewall-rules list --sort-by=NETWORK

# commandline for making a VM in the managementnet subenet
gcloud compute instances create managementnet-us-vm --project=qwiklabs-gcp-04-4281fedd4f69 --zone=us-east1-c --machine-type=e2-micro --network-interface=network-tier=PREMIUM,subnet=managementsubnet-us --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=262959039289-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --create-disk=auto-delete=yes,boot=yes,device-name=managementnet-us-vm,image=projects/debian-cloud/global/images/debian-11-bullseye-v20220719,mode=rw,size=10,type=projects/qwiklabs-gcp-04-4281fedd4f69/zones/us-east1-c/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any
# make the VM that will sit in the privatenet network
gcloud compute instances create privatenet-us-vm --zone="us-east1-c" --machine-type=e2-micro --subnet=privatesubnet-us

# ping the mynet-eu-vm from the us vm that lives in mynet
ping -c 3 <external IP address of vm>
# ping the management-us-vm from the us vm that lives in mynet
# should be fast than the eu vm bc they are in the same region and zone
ping -c 3 <external IP address of vm>

# ping the mynet-eu-vm from the us vm that lives in mynet using the internal IP address
ping -c 3 <internal IP address of vm> # works

# can't communicate between networks using internal IP addresses
# this is because the VPC networks are isolated using private networking domains
# can bypass this using the VPC peering or VPN

# can make a VM instance that is connected to many network up to 8
# however, the CIDR ranges (IP ranges) of the subnets can not overlap
# here's the commandline to make the VM that is connected to many networks and the subnets
gcloud compute instances create vm-appliance --project=qwiklabs-gcp-04-4281fedd4f69 --zone=us-east1-c --machine-type=e2-standard-4 --network-interface=network-tier=PREMIUM,subnet=privatesubnet-us --network-interface=network-tier=PREMIUM,subnet=managementsubnet-us --network-interface=network-tier=PREMIUM,subnet=mynetwork --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=262959039289-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --create-disk=auto-delete=yes,boot=yes,device-name=vm-appliance,image=projects/debian-cloud/global/images/debian-11-bullseye-v20220719,mode=rw,size=10,type=projects/qwiklabs-gcp-04-4281fedd4f69/zones/us-east1-c/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any
```