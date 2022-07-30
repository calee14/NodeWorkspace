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
# Managing Deployments Using Kubenetes Engine
```bash
# Heterogenous deployments are called hybrid, multi-cloud, public-private deployments
# challenges to an env or region
# max out resources, limited geographic reach, limited availability, 
# vendor lockin (can't import apps due to not enough resources), 
# inflexible resources

# set the zone for the deployment 
gcloud config set compute/zone us-central1-a
# get code for lab
gsutil -m cp -r gs://spls/gsp053/orchestrate-with-kubernetes .
cd orchestrate-with-kubernetes/kubernetes
# create a cluster
gcloud container clusters create bootcamp --num-nodes 5 --scopes "https://www.googleapis.com/auth/projecthosting,storage-rw"
# get information about the deployment object
kubectl explain deployment
kubectl explain deployment --recursive

# create a deployment of the auth container image described in the auth.yaml manifest file
kubectl create -f deployments/auth.yaml
kubectl get deployments
# get the ReplicaSet for our Deployment (ReplicaSet manages the pods)
kubectl get replicasets
kubectl get pods
# make a sevice for our specifc Deployments
kubectl create -f services/auth.yaml
# make the frontends for our services
# this sits infront of the Service to our deployments
# the frontend will be have our HTTP proxies and load balancers 
# the services frontend will be a Load Balancer using TCP conenctions with the Backend Services
# the load balancer is exposed at an External IP
kubectl create secret generic tls-certs --from-file tls/
kubectl create configmap nginx-frontend-conf --from-file=nginx/frontend.conf
kubectl create -f deployments/frontend.yaml
kubectl create -f services/frontend.yaml
# describe what the replicas are
kubectl explain deployment.spec.replicas
# scale them up or down
kubectl scale deployment hello --replicas=5
kubectl scale deployment hello --replicas=3
# editing the deployment by using the command then changing the manifest file
kubectl edit deployment hello
kubectl get replicaset # views all deployments
# view the rollout history for a deployment
kubectl rollout history deployment/hello
# other commands for contoolling rollouts
kubectl rollout pause deployment/hello
kubectl rollout status deployment/hello
kubectl rollout resume deployment/hello
kubectl get pods -o jsonpath --template='{range .items[*]}{.metadata.name}{"\t"}{"\t"}{.spec.containers[0].image}{"\n"}{end}'
# can undo the latest rollout
kubectl rollout undo deployment/hello

# create the canary deployment. this new deployment is just deploying another container with a new version of the apps
# the main difference of the manifest file is that it has the label track:canary 
# remember canary deployments rollout the new versions slowly for minimal downtime
kubectl create -f deployments/hello-canary.yaml

# blue-green deployments are mainly instantanious because it changes the Load Balancer to point to the new version only
# to do this change the service manifest file to point to the new version
# before switching to the new version must create a new deployment (green) of that new version
```
# Set Up and Configure a Cloud Enviroment in Google Cloud: Challenge Lab
```bash
gcloud compute networks create griffin-dev-vpc --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional 
gcloud compute networks subnets create griffin-dev-wp --network=griffin-dev-vpc --region=us-east1 --range=192.168.16.0/20
gcloud compute networks subnets create griffin-dev-mgmt --network=griffin-dev-vpc --region=us-east1 --range=192.168.32.0/20

gcloud compute networks create griffin-prod-vpc --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional 
gcloud compute networks subnets create griffin-prod-wp --network=griffin-prod-vpc --region=us-east1 --range=192.168.48.0/20
gcloud compute networks subnets create griffin-prod-mgmt --network=griffin-prod-vpc --region=us-east1 --range=192.168.64.0/20

gcloud compute firewall-rules create griffin-dev-vpc-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=griffin-dev-vpc --action=ALLOW --rules=tcp:22,tcp:3389,icmp --source-ranges=0.0.0.0/0

gcloud compute firewall-rules create griffin-prod-vpc-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=griffin-prod-vpc --action=ALLOW --rules=tcp:22,tcp:3389,icmp --source-ranges=0.0.0.0/0

# connect to SQL instance
gcloud sql connect griffin-dev-db --user=root --quiet

# for the kubernetes section
gcloud config set compute/zone us-east1-b
gcloud container clusters create griffin-dev --num-nodes 2 --network=griffin-dev-vpc --subnetwork=griffin-dev-wp
gsutil -m cp -r gs://cloud-training/gsp321/wp-k8s .

# create the Volume and secrets for the cluster
# the secrets are the username and password to the DB in the SQL instance
kubectl create -f wp-env.yaml

# add the service account to access the db for the kubernetes cluster
gcloud iam service-accounts keys create key.json \
    --iam-account=cloud-sql-proxy@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com
kubectl create secret generic cloudsql-instance-credentials \
    --from-file key.json

# update the wp-deployment.yaml file to add the DB username and password to have access to the SQL instance
# deploy the deployments and services to GKE
kubectl create -f wp-deployment.yaml
kubectl create -f wp-service.yaml

kubectl get services
kubectl get deployments
```