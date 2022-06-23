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
- **Compute Engine** helps create VM
    - configure CPU, memory, SSD, disks
- **Preemptible VMs** - cheap but will restart if CPU is needed elsewhere
- **global Cloud Load Balancing** - one single IP address for project
    - sent to google backbone and route to nearest PoP
    - allows cross regional load-balancing
    - no warning/warming ticket needed for spike in traffic
    - Load Balancing options:
        - **Global HTTP(s) **- allows cross-regional load-balancing
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