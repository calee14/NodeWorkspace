# Introducing Google Cloud
- Cloud-computing customers go through **automated interface** (no human)
    - scale usage and pay as go <- better bc no need to invest so much into infra
- Rent virtual computing, still maintain lots of control
- Infrastructure aaS - compute power, storage, network
- Platform aaS - libraries to connect to IaaS and build applications (APIs)
- **NOTE:** zones good for performance
- **NOTE:** pay-by-sec good for users with lots of VMs
- Deploy in diff zones prevent loss of application
- GC has security in the hardware (chips) and software (2FA, boot stack)
- Google Networks handle 40% of the internet 100 PoPs
    - 5ms latency for zones in network
- Kubernetes can set quotas on requests to API
    - **Kubernetes** is meant to run containerized applications across multiple nodes
# Getting started with Google Cloud
- **IAM = Identity and Access Management**
- Create organization roles, project manager roles
    - Policies created are inherited by children
- Services + resources per project basis
- Put projects in folders to share policies
- IAM - Instance Admin Role in Projects
- Control Google Cloud Platform; web interface; console, SDK, API
- Cloud marketplace: easily start up web apps, VMs
- **Apache HTTP server** - open-source server software that delivers data accross the internet.
    - Runs the server, helps the server accept HTTP requests and receive and send data
    - Competitors are **NGINX** (Flask is best run on this type of server software)
        - NGINX also is known as a **reverse proxy** web server 
        - web broswer (outside info) -> NGINX (reverse) -> webserver
# Virtual Machines in the CLoud
- Virtual Private Cloud Networks - contained in Projects
    - VMs IP. address will be in the VPC network.
        - New subnets will allocate new address to current IP
        - VPC subsets have regional scope
- **Compute Engine** - service that helps create VM
    - configure CPU, memory, SSD, disks
- **Preemptible VMs** - cheap but will restart if CPU is needed elsewhere
- **global Cloud Load Balancing** - one single IP address for project
    - sent to google backbone and route to nearest PoP
    - allows cross regional load-balancing
    - no warning/warming ticket needed for spike in traffic
    - Load Balancing options:
        - **Global HTTP(s)** - allows cross-regional load-balancing
        - **Global SSL Proxy** - load-balancing of non-HTTPS SSL traffic
        - **Global TCP Proxy** - LB for non-SSL TCP traffic
        - **Regional** - load-balance across a region
        - **Regional internal** - load-balance inside a VPC
- DNS translates domain names to IP address
- Google CP interconnect help with business current networks connect to GCP routes/apps
- Google has a CDN network.
    - It also may be part of the interconnected CDN network with other services
- **NOTE:** In GCP projects, VPC networks are global and the subnets are regional
- **NOTE:** VPC routers and firewalls are handled solely by Google
- **NOTE:** GC Load-balancing allows HTTP traffic across Compute Engines (regions)
    - 
## Lab notes
```bash
# display the zones in our region
gcloud compute zones list | grep us-central1
# set our current working dir's zone to be in the 'b' zone
gcloud config set compute/zone us-central1-b
# create a new vm in this the zone we chose
gcloud compute instances create "my-vm-2" \
--machine-type "n1-standard-1" \
--image-project "debian-cloud" \
--image-family "debian-10" \
--subnet "default"
# a nice exit out of the shell
exit

# open shell for vm in zone 'b' and we ping vm 'a'
ping my-vm-1.us-central1-a
# switch vm's install nginx for vm 'a'
sudo apt-get install nginx-light -y
# use text editor to change index page
sudo nano /var/www/html/index.nginx-debian.html
# make a request to the localhost on vm 'a'
curl http://localhost/
# go on vm 'b' and make a request to vm 'a'
curl http://my-vm-1.us-central1-a/
# as we can see these vm's although in diff zones have network access to each other.
```
# Storage in the Cloud
- **Cloud Storage** - binary large-object storage
    - high perf; scalable; _no capacity management_
    - give a piece of bytes data and the storage will associate that piece of binary with a **unique key** (urls)
    - **NOTE:** not a file system; instead it has buckets (geo loc, unique id, always encrypted)
        - all data is encrypted (in transit and on disk); objects in these buckets are **immutable**
            - However, there is **object versioning** keeps track of change; if do not use then new replaces old
    - **NOTE:** Good for image files, movies, videos
- Storage Bucket classes:
    - **Multi-regional storage buckets** - good for storing frequent data but expensive
    - **Regional storage buckets** - good for putting data to where it will be accessed most (VMs, Kubernetes clusters)
    - **Nearline** - good for storing data that is accessed once a month
    - **Coldline** - good for backups, archiving, disaster recovery
- Online transfers; Transfer Appliance (download onto disk and ship)
- **Cloud Bigtable** - NoSQL database, persistent hashtable, store a lot with low latency
    - Always encrypted
    - has an API for applications
    - data can be streamed (an important feature)
- **Cloud SQL** - offers MySQL and PostgresSQL databases
    - can handle terabytes of data
    - However, we can run these database servers inside our Compute Engine VM.
    - Auto replicate data to diff zones (backup)
    - Compute Engines can be authorized to access Cloud SQL
    - Allows **Vertical Scaling = adding more hardware (cpu, mem, storage) to increase perf.** and horizontal scaling 
- **Cloud Spanner** - automatic replication and consistent queries (good for **horizontal scaling = ability to add a lot of new instances)**
- **Cloud Datastore** - another NoSQL database for application backends and structured data
    - Auto replications and backups
    - Cloud datastore can span App Engine and Compute Engine apps
    - Offer's SQL-like queries unlike _Cloud BigTable_
- Use Cases:
    - **Cloud Datastore** - semi-structure application from app engine apps.
    - **Cloud Bigtable** - (heavy analytical) Adtech, Financial and IoT data, for data to be streamed
    - **Cloud Storage** - unstructured binary/obj. data. (img files, movies, backups, long-term data, center of data being moved in the cloud)
    - **Cloud SQL** - Web frameworks, existing apps
    - **Cloud Spanner** - large scale apps (whenever there is high input/output, or global consistency is required)
## Lab Notes
```bash
# lines to download apache server software and boot php app
apt-get update
apt-get install apache2 php php-mysql -y
service apache2 restart

# make a env var that specifiies our proj location
export LOCATION=US

# make a bucket and give it a global unique id (we can use our proj id since that is a global unique id)
gsutil mb -l $LOCATION gs://$DEVSHELL_PROJECT_ID

# copy/download file from another cloud storage location
gsutil cp gs://cloud-training/gcpfci/my-excellent-blog.png my-excellent-blog.png

# copy the new file into our cloud storage bucket
gsutil cp my-excellent-blog.png gs://$DEVSHELL_PROJECT_ID/my-excellent-blog.png

# change the read access rule to the new bucket obj we made
gsutil acl ch -u allUsers:R gs://$DEVSHELL_PROJECT_ID/my-excellent-blog.png

# our MySQL db server will have network access to our VM in our compute engine
```
# Containers in the Cloud
- **Compute Engine** - IaaS; GCP allows you to run VMs in the cloud and gives persistent storage and networking
- **App Engine** - PaaS; easily deploy apps by using APIs to access IaaS
- **Containers** - role of a container is to give apps the independent ability to scale the hardware (IaaS)
    - The container acts as an invisble box around the code/app
        - _Allows us to virutalize the OS, so we can treat the OS as a **black box**_. We don't need to boot up a new instance of OS for each new container
            - They abstract the unecessary details and specificities of an OS. Thus, we no worry OS type and version
        - Makes the code very **portable**. _Can make a ton of new instances of web servers on new nodes/host_
- **NOTE:** IaaS = share resources with others by virtualizing the hardware. Each VM has an instance of an OS so that user can build and run apps on it
- **Kubernetes Engine** - allows to easily run many containers on many hosts; scale containers; change versions
    - we can create a single container with software like **Docker** to package an app with the _specifications of the VM_ to run our app
    - _Kubernetes controls a **set of nodes and its master** (this is known as a **cluster**)_
        - Nodes are computing instances (GCP nodes = VMs in Compute Engines)
    - when Kubernetes makes a container it puts it into a **pod**.
        - **pods** can have multiple containers that are shared and accessible to each other through local host ports.  
            - these containers share networking and disk space
        - Pods have unique IPs and are given ports for containers
    - Kubernetes include a **Load balancer** to attach a public IP address to our **"service"** _which is our nodes in our cluster_
        - the pods in our nodes might not be stable thus we would need to manage the client that would make requests to the backend. Thus, it's better to have one stable IP and have a load balancer direct the incoming requests
    - Kubernetes has a **configuration file** that allows to specify the number of pods in a cluster.
        - The config also has the ability to have **rolling updates** which helps remove down time when new versions of code come up
- **Anthos** is a hybrid multi-cloud systems and service management. Good for enterprises that want to keep some of their code on-premise
- **NOTE:** Kubernetes allows you to manage container clusters from multiple cloud providers
# Lab Notes
```bash
# create env var for zone
export MY_ZONE=us-central1-a

# create a cluster with two nodes
gcloud container clusters create webfrontend --zone $MY_ZONE --num-nodes 2

# check the verison of kubernetes
kubectl version

# creates a single pod with a container of an nginx container
kubectl create deploy nginx --image=nginx:1.17.10

# see the amount pods running in cluster
kubectl get pods

# expose the nginx container to the internet/www by creating a "service" and using a Loadbalancer to route requests
kubectl expose deployment nginx --port 80 --type LoadBalancer

# List the "service" info and IP address
kubectl get services

# scale the number of pods to increase amount of resources for an application
kubectl scale deployment nginx --replicas 3
```
# Applications in the Cloud
- **App Engine** - (**PaaS**) manages the hardware and networking infra. 
    - Just give the App Engine your code and the rest is taken care of. Focuses on deployment, maintenance, scalability
    - App Engine is well-suited for web apps and mobile dev. bc the workload is unpredictable
    - **App Engine Runtimes** (Enviroments):
    - **Standard Enviroment** - Usage based and free daily quotas (meaning low usage apps run at no charge*)
        - Has SDKs for deployment 
        - Runs in **sandboxes** -> Rules: no local files, 60 sec request timeout, limits on thirdparty software
        - There are APIs and services for App Engine instances
    - **Flexible Enivorment** - let's programmer specify the container and its details
        - Can choose any programmer langauge but instance startup times are slower
        - Flexible is better if the progammer wants more control over their app and features    
        - Let's the programmer chose where the container is located
- **API Application Programming Interface** - interface/controller for accessing software. 
    - New versions of an API might contain calls that the old version didn't have
    - **Cloud Endpoint** - easily expose APIs and manage them.
        - control json web tokens and Google API keys
        - Identity users with authentication
        - Has API proxies to route to service
        - **Apigee Edge** helps with takign legacy systems transition to APIs. It peels off parts of the old system into microsystems until the whole thing is on the Cloud w/ APIs
- **NOTE:** App Engine Standard = billing can be zero bc daily quota and no users :(, scaling requires more **details and attention**, google keeps track of r**untime binaries (libraries)**
- **NOTE:** App Engine Flexible - can ssh into apps, install third-party binaries (software/libs), app can write to local disk
- **NOTE:** Apigee Edge is good if working with Customer endpoints
## Lab notes
```bash
# the GCP shell is a VM that gives access to user GCP resources
# list accounts on the GCP proj.
gcloud auth list

# list all proj 
gcloud config list project

# use the app engine to make a new GCP app
# it will prompt to select region
gcloud app create --project=$DEVSHELL_PROJECT_ID

# download a starting repo to our vm
git clone https://github.com/GoogleCloudPlatform/python-docs-samples

# locate the proj
cd python-docs-samples/appengine/standard_python3/hello_world

# make a dockerfile
touch Dockerfile

# fill the docker file with this code
FROM python:3.7
WORKDIR /app
COPY . .
RUN pip install gunicorn
RUN pip install -r requirements.txt
ENV PORT=8080
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app

# build a container image of our Python virtual enviroment
# this will help run our python app
docker build -t test-python . 

# this will the container and our python app on a local host
docker run --rm -p 8080:8080 test-python 

'''
in the same dir as our proj deploy the applicaiton
the application must have a .yaml file to indicate where 
to look for the routes in the app
'''
gcloud app deploy

# use the browse command to view our app
gcloud app browse
```
# Developing, Deploying, and Monitoring in the Cloud
- **Cloud Source Repositories** - git repos hosted on GCP
- **Cloud Functions** - single purpose functions that respond to events without a server or runtime binaries
    - No need to worry about booting up servers to do this
        - Easy to scale to meet workload demand
    - only need to configure when to run the function (write JS code)
        - Choose an event and write JS functions for when events trigger
    - Don't need to worry about scaling too much and some projects that are built on microservices can run on cloud functions
- _Declarative vs. Imperative_ - declaritive is writing instructions to set something up whereas imperative is physicall/manually performing actions to set up an enviroment (in GCP context)
- **Deployment Manager** - Infrastructure management services that automates creation and management of GCP resources (aka. **infra as code**)
    - Use a template file (.yaml or .py) which describes the enviroment of the GCP
        - Version control the template manager
- **Monitoring: Proactive instrumentation**
    - **Stackdriver** - GCP tools for monitoring, logging and diagnostics.
        - It can give signals for the infrastructure, VMs, containers, and application levels of proj.
        - Gives insight to apps health
    - Core compoenents:
        - **Monitoring:** check endpoints of web apps on cloud env.; uptime and health checks; alerts
        - **Logging:** view logs, filter and search them; 
        - **Trace:** sample latency and performance speed of urls
        - **Error Reporting:** stacks and tracks errors (old and new)
        - **Debugger:** connects production data with source code (no need to add logging statements). view proj state when in production
- **NOTE:** Stackdriver filters logs from apps and search for them. It also helps define metrics based on logs
## Lab notes
```bash
# specify zone in env var
export MY_ZONE=us-central1-a

# copy a template yaml for deployment manager to local dir. in VM
gsutil cp gs://cloud-training/gcpfcoreinfra/mydeploy.yaml mydeploy.yaml

# use the sed command to replace the proj. id sections in the yaml file
sed -i -e "s/PROJECT_ID/$DEVSHELL_PROJECT_ID/" mydeploy.yaml

# use the sed command again to replace zone in the yaml file
sed -i -e "s/ZONE/$MY_ZONE/" mydeploy.yaml

# the yaml file looks something like 
resources:
  - name: my-vm
    type: compute.v1.instance
    properties:
      zone: us-central1-a
      machineType: zones/us-central1-a/machineTypes/n1-standard-1
      metadata:
        items:
        - key: startup-script
          value: "apt-get update; apt-get install nginx-light -y"
      disks:
      - deviceName: boot
        type: PERSISTENT
        boot: true
        autoDelete: true
        initializeParams:
          sourceImage: https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-9-stretch-v20180806
      networkInterfaces:
      - network: https://www.googleapis.com/compute/v1/projects/qwiklabs-gcp-dcdf854d278b50cd/global/networks/default
        accessConfigs:
        - name: External NAT
          type: ONE_TO_ONE_NAT

# build a deployment from the yaml file
gcloud deployment-manager deployments create my-first-depl --config mydeploy.yaml

# if changes are made to the yaml we can change the deployment to the new version and specification
gcloud deployment-manager deployments update my-first-depl --config mydeploy.yaml

# this command will artificially increase CPU usage for monitoring for Stackdriver
dd if=/dev/urandom | gzip -9 >> /dev/null &

# the two commands will help install the monitoring agent, Stackdriver, from GCP
curl -sSO https://dl.google.com/cloudagents/install-monitoring-agent.sh

sudo bash install-monitoring-agent.sh
```
# Big Data and Machine Learning in the Cloud
- "Every company is going to be a data company for that advantage"
- **Serverless** = don't worry about provisioning server instances to run jobs
    - Computation for services are fully managed by GCP and _pay-by-use_
    - All data services are integrated to be used together if wanted
- **Cloud Dataproc (Hadoop)** - Hadoop = open source framework for big data. Based on MapReduce model
    - **MapReduce model** = a way to quickly access and process big data stored on the Hadoop database system.
        - Divide and Conquer strats. There are several **mapper** funcs the partition the data and process them concurrently
            - The output from the **mapper** funcs are sent to the **reducer** funcs
    - Use **Dataproc** to boot up clusters. This process is scalable
        - Can run **Dataproc** clusters on **preemptible compute engine instances**
    - **Spark ML Libraries** are available in **Dataproc** to run classification algos.
- **Cloud Dataflow** - for data pipelines when data is continuously flowing/streaming in.
    - processes data using Compute Engine instances
    - Scales automatically. no need to manage clusters
    - **Extract/Transform/Load** pipelines to move data
        - Data analysis can occur.
        - Integrates with other GCP services and applications for live stream of data
- **BigQuery** - auto. managed data warehouse uses SQL syntax (real time interaction)
    - pay-by-use. and scalable. there is discount for long-term storage
    - Can write queries for BigQuery from other services like Cloud Dataflow, Spark, etc.
- **Cloud Pub/Sub** - reliable and scalable messaging
    - asyncronous messaging, apps sub to topics to receive messages
    - used for data ingestion, Internet of Things, Marketing analytics
        - good for streaming data.
        - connect apps across GCP for push/pull messages between Compute Engine and App Engine
- **Cloud Datalab** - Project Jupyter for interactive data exploration enviroment
    - runs in a Compute Engine VM
    - Integrated with BigQuery, Cloud Storage, Compute Engine
- **Machine Learning APIs** - provides pretrained models and tools to customize one
    - tensorflow open-source lib built by google
    - provides models for **structured data (class., regr., reccommendation, anamoly)** and **unstructured data (image rec., text analysis)**
    - **Cloud Vision** - analyze images
    - **Cloud Natural Language** - return text in realtime from diff. languages, audio, images
    - **Cloud Video Intelligence** - annotate vids, analyze
- **NOTE:** `gs://` stands for google (cloud) storage
- **NOTE:** **Cloud Dataproc** - does/migrate Hadoop process in cloud. analysis on datasets of known size
- **NOTE** Cloud Pub/Sub = good for IoT apps, Decoupling sys, streaming data
- **NOTE:** Cloud Dataflow - **orchestration (coordinate services that manage data)** of data, extract/transform/load
## Lab notes
```bash
# sql query for finding the amount of hits to server by hour
select int64_field_6 as hour, count(*) as hitcount from logdata.accesslog
group by hour
order by hour

# shell command to run query to BigQuery
bq query "select string_field_10 as request, count(*) as requestcount from logdata.accesslog group by request order by requestcount desc"
```
## Summary and Review
- **Interconnect options**:
    - Use **Cloud Router** to allow **VPNs** into Googel VPC despite the routing changes
    - **Direct Peering** privately connect with google servers for hybrid cloud network
    - **Carrier Peering** - connect through service providers
    - **Dedicated Interconnect** - connect transport circuits for private cloud traffic to Google Cloud at Google PoPs
- **App Engine** leaves most of the infrastructure work to Google but **Flexible Env** give some control to the programmer
- **Cloud Spanner** is a relational (SQL) db that scales horizontally, meaning it will allocate my resources automatically to store higher workload of data
- **Cloud Bigtable** vs **Cloud Datastore**
    - **Bigtable** is a NoSQL table for objects but only lookup based on single key
    - **Datastore** is also a NoSQL db for objects but has SQL-like queries
- **Loadbalancers:** for inbound traffic
    - **Global HTTP(S)** - connects one public IP to all backend instances including diff regions and routes incoming traffic from world
    - **Regional (internal)** - load balance TCP and UDP traffic for any **arbitrary port number**
