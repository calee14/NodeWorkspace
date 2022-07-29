# Tour of Google Cloud Hands-on Labs
```bash
# nothing new. reviewing how to use Qwik labs and stuff
```
# Creating a Virtual Machine
```bash
# create the VM wusing defaults and then ssh into the VM
# install the web server software
sudo apt-get update
sudo apt-get install -y nginx

# make the VM using the shell
gcloud compute instances create gcelab2 --machine-type e2-medium --zone us-west4-a

# ssh into the new VM we made
gcloud compute ssh gcelab2 --zone us-west4-a 
```
# Getting Started with Cloud Shell and gcloud
```bash
# VMs and Persistent Disks sit in zones
# for VMs and disks to use each other they need to be in the same zone
# similarly the static IP addresses and instance need to be in the same region

# set the region in the shell
gcloud config set compute/region us-west3  
# view the current region
gcloud config get-value compute/region
# set the zone
gcloud config set compute/zone us-west3-b 
# view the zone
gcloud config get-value compute/zone

# view the project value for gcp and details of the project
gcloud config get-value project
gcloud compute project-info describe --project $(gcloud config get-value project) 

# make a VM instance using the env variables
# gcloud compute means we're accessing the compute engine resources
# instances create means we're creating a new VM
# gcelab2 is the name of the VM
# --machine-type is the type of machine
# --zone is the zone where the VM will live
gcloud compute instances create gcelab2 --machine-type e2-medium --zone $ZONE
# list all compute instances
gcloud compute instances list

# view the firewall rules int the project
gcloud compute firewall-rules list

# how to connect to a VM through ssh and install the nginx webserver
gcloud compute ssh gcelab2 --zone $ZONE
sudo apt install -y nginx
exit

# list the firewall rules for the project
# the VM created won't work because the nginx server is listening at tcp port 80
gcloud compute firewall-rules list

# add a tag to the VM so that we can attach a firewall rule to the tag so that the firewall will apply
gcloud compute instances add-tags gcelab2 --tags http-server,https-server

# create the firewall rule to allow tcp 80 connections from any IP address
gcloud compute firewall-rules create default-allow-http --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:80 --source-ranges=0.0.0.0/0 --target-tags=http-server
gcloud compute firewall-rules list --filter=ALLOW:'80'

# list logs sources and view some of the logs listed in the source
gcloud logging logs list 
gcloud logging logs list --filter="compute" 
gcloud logging read "resource.type=gce_instance" --limit 5
# its good to interact with GCP resources through the console and shell and client libraries (GCP SDK)
```
# Kubernetes Engine: Qwik Start
```bash
# set the zone and region
gcloud config set compute/zone us-east4-b
# create a GKE cluster
gcloud container clusters create --machine-type=e2-medium lab-cluster 

# have gcloud auth the shell session to access the cluster
# it will init the kube configuration
gcloud container clusters get-credentials lab-cluster 
# manually create a deployment rather than using a declarative manifest
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:1.0
# send the deployment to GKE 
# expose it to the load balancer and have the deployment sit at port 8080
kubectl expose deployment hello-server --type=LoadBalancer --port 8080

# delete the cluster
gcloud container clusters delete lab-cluster 
```
# Set up Network and HTTP Load Balancers
```bash
# make mulitple web server instances
# the first instance is called www1 and it will install the apache server
gcloud compute instances create www1 \
    --zone=us-east4-b \
    --tags=network-lb-tag \
    --machine-type=e2-medium \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --metadata=startup-script='#!/bin/bash
        apt-get update
        apt-get install apache2 -y
        service apache2 restart
        echo "<h3>Web Server: www1</h3>" | tee /var/www/html/index.html'
# make a second VM instance called www2 and a third called www3
# create a firewall rule that affects the VMs with the tag and allows tcp port 80 internet connections
gcloud compute firewall-rules create www-firewall-network-lb \
    --target-tags network-lb-tag --allow tcp:80
# create a static IP address for the Load balancer
gcloud compute addresses create network-lb-ip-1 \
    --region us-east4 
# create a default health check
gcloud compute http-health-checks create basic-check
# make a target pool to group VMs so that we can apply the health checks to them
gcloud compute target-pools create www-pool \
    --region us-east4 --http-health-check basic-check
# add the VM instances to the pool
gcloud compute target-pools add-instances www-pool \
    --instances www1,www2,www3
# add a forwarding rule to the pool for the load balancer
# the load balancer will route traffic to the pool now
gcloud compute forwarding-rules create www-rule \
    --region  us-east4 \
    --ports 80 \
    --address network-lb-ip-1 \
    --target-pool www-pool
# describe the forwarding rule
gcloud compute forwarding-rules describe www-rule --region us-east4
# access the IP address of the pool
while true; do curl -m1 $IPADDRESS; done

# to make an HTTP Load Balancer then need to create a Google Front End. 
# these frontends are distributed globally using the Google Global Network
# the VMs need to be in instance groups. traffic is router to the closest and most capacity VM
# create the template for the compute instance that's going to sit in the Load Balancer
gcloud compute instance-templates create lb-backend-template2 \
   --region=us-east4 \
   --network=default \
   --subnet=default \
   --tags=allow-health-check \
   --machine-type=e2-medium \
   --image-family=debian-11 \
   --image-project=debian-cloud \
   --metadata=startup-script="cat << EOF > startup.sh
#! /bin/bash
apt-get update
apt-get install -y nginx
service nginx start
sed -i -- 's/nginx/Google Cloud Platform - '"\$HOSTNAME"'/' /var/www/html/index.nginx-debian.html
EOF"
# create a managed instance group based on the VM template
gcloud compute instance-groups managed create lb-backend-group3 \
   --template=lb-backend-template2 --size=2 --zone=us-east4-b 
# create a fowarding firewall rule to allow health checks from IP addresses
# the health checking systems are located in the IP ranges specified
gcloud compute firewall-rules create fw-allow-health-check \
  --network=default \
  --action=allow \
  --direction=ingress \
  --source-ranges=130.211.0.0/22,35.191.0.0/16 \
  --target-tags=allow-health-check \
  --rules=tcp:80
# create a global static IP address for the HTTP load balancer and give it an ID
gcloud compute addresses create lb-ipv4-1 \
  --ip-version=IPV4 \
  --global
# create a health check for the Load Balancer
gcloud compute health-checks create http http-basic-check \
  --port 80
# create a backend service that uses the health check created previously and uses the HTTP protocol
gcloud compute backend-services create web-backend-service \
  --protocol=HTTP \
  --port-name=http \
  --health-checks=http-basic-check \
  --global
# connect the managed instance group created prior to the backend service
gcloud compute backend-services add-backend web-backend-service \
  --instance-group=lb-backend-group \
  --instance-group-zone=us-east4-b \
  --global
# route incoming requests to the default backend service using a URL map
# URL maps route HTTP(s) requests to a backend service 
# remember backend services can have totally different functionalities so...
# the URL Map can route requests if the URLs are different
# Ex: https://example.com/images map to the image router
gcloud compute url-maps create web-map-http \
    --default-service web-backend-service
# create a HTTP proxy to route requests from the internet to the URL map
gcloud compute target-http-proxies create http-lb-proxy \
    --url-map web-map-http
# use the address created earlier and have a Global forwarding rule to route incoming
# requests to the HTTP proxy
gcloud compute forwarding-rules create http-content-rule \
    --address=lb-ipv4-1\
    --global \
    --target-http-proxy=http-lb-proxy \
    --ports=80
```
# Create and Manage Cloud Resources: Challenge Lab
```bash
# set the zone and region
gcloud config set compute/zone us-east1-b
# create a GKE cluster
gcloud container clusters create --machine-type=e2-medium lab-cluster 

# have gcloud auth the shell session to access the cluster
# it will init the kube configuration
gcloud container clusters get-credentials lab-cluster 
# manually create a deployment rather than using a declarative manifest
kubectl create deployment hello-server --image=gcr.io/google-samples/hello-app:2.0
# send the deployment to GKE 
# expose it to the load balancer and have the deployment sit at port 8080
kubectl expose deployment hello-server --type=LoadBalancer --port 8080

# to make an HTTP Load Balancer then need to create a Google Front End. 
# these frontends are distributed globally using the Google Global Network
# the VMs need to be in instance groups. traffic is router to the closest and most capacity VM
# create the template for the compute instance that's going to sit in the Load Balancer
gcloud compute instance-templates create lb-backend-template2 \
   --region=us-east1 \
   --network=default \
   --subnet=default \
   --tags=allow-health-check \
   --machine-type=e2-medium \
   --image-family=debian-11 \
   --image-project=debian-cloud \
   --metadata=startup-script="
#! /bin/bash
apt-get update
apt-get install -y nginx
service nginx start
sed -i -- 's/nginx/Google Cloud Platform - '"\$HOSTNAME"'/' /var/www/html/index.nginx-debian.html"
# create a managed instance group based on the VM template
gcloud compute instance-groups managed create lb-backend-group \
   --template=lb-backend-template2 --size=2 --zone=us-east1-b 
# create a fowarding firewall rule to allow health checks from IP addresses
# the health checking systems are located in the IP ranges specified
gcloud compute firewall-rules create permit-tcp-rule-776 \
  --network=default \
  --action=allow \
  --direction=ingress \
  --source-ranges=130.211.0.0/22,35.191.0.0/16 \
  --target-tags=allow-health-check \
  --rules=tcp:80
# create a global static IP address for the HTTP load balancer and give it an ID
gcloud compute addresses create lb-ipv4-1 \
  --ip-version=IPV4 \
  --global
# create a health check for the Load Balancer
gcloud compute health-checks create http http-basic-check \
  --port 80
# create a backend service that uses the health check created previously and uses the HTTP protocol
gcloud compute backend-services create web-backend-service \
  --protocol=HTTP \
  --port-name=http:80 \
  --health-checks=http-basic-check \
  --global
# connect the managed instance group created prior to the backend service
gcloud compute backend-services add-backend web-backend-service \
  --instance-group=lb-backend-group \
  --instance-group-zone=us-east1-b \
  --global
# route incoming requests to the default backend service using a URL map
# URL maps route HTTP(s) requests to a backend service 
# remember backend services can have totally different functionalities so...
# the URL Map can route requests if the URLs are different
# Ex: https://example.com/images map to the image router
gcloud compute url-maps create web-map-http \
    --default-service web-backend-service
# create a HTTP proxy to route requests from the internet to the URL map
gcloud compute target-http-proxies create http-lb-proxy \
    --url-map web-map-http
# use the address created earlier and have a Global forwarding rule to route incoming
# requests to the HTTP proxy
gcloud compute forwarding-rules create http-content-rule \
    --address=lb-ipv4-1\
    --global \
    --target-http-proxy=http-lb-proxy \
    --ports=80

```