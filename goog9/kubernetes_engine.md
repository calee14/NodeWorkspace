# Intro to Google Cloud Platform (again??)
- Cloud = on-demand service, no need to interact with human to get service
    - resources are elastic = can get more resources when needed
- Kubernetes Engine (GKE) service - run containerized applications on a cloud enviroment managed 
    - a way to orchestrate or direct code in the cluster
    - built on top of Compute Engine
- three regions: us, eur, asia
    - within regions there are zones with millisecond connectivity
- Google Cloud Network interconnects with the internet at 90 internet exchanges and 100 Points of Presence
    - Google directs user requests to the closest edge point for faster response times
- nodes in a GKE cluster are zonal
    - GKE clusters represent a region
- projects are where resources are organized and billed
    - More security is handled by Google
- there is a billing account that pays for project(s)
    - there are subaccounts that can pay for specific projects
    - there are alerts when billing accounts reach thresholds
    - can set quotas from resources being used too much
        - good for stopping hackers and cause unwanted billing
- download Cloud SDK which is a set of command line tools for `gcloud kubectl bq gsutil`
    - or use Cloud Shell in the browser
        - the shell has a web preview feature
## Lab notes
```bash
# make storage buckets and VMs. 
# make a new service account that has editor access
# downlaod the private key (credentials.json) for that service account

# make a few env variables
MY_BUCKET_NAME_1=[BUCKET_NAME]
MY_BUCKET_NAME_2=[BUCKET_NAME_2]
MY_REGION=us-central1

# create a bucket in the cloud shell
gsutil mb gs://$MY_BUCKET_NAME_2

# list zones in the specified region
gcloud compute zones list | grep $MY_REGION
# choose a zone from the output and save it to the env variable
MY_ZONE=[ZONE]
# set the default zone for the cloud shell to be the env var
gcloud config set compute/zone $MY_ZONE

# make a name for the VM and store in the env
MY_VMNAME=second-vm
# make the VM 
gcloud compute instances create $MY_VMNAME \
--machine-type "e2-standard-2" \
--image-project "debian-cloud" \
--image-family "debian-9" \
--subnet "default"
# list the VMs in the project
gcloud compute instances list
# if we visit the IP addresses of the VMs there is nothing there because we have no web server despite having firewall rules allow HTTP traffic

# make a new service account
gcloud iam service-accounts create test-service-account2 --display-name "test-service-account2"
# give this new service accoutn the viewer role for the project
gcloud projects add-iam-policy-binding $GOOGLE_CLOUD_PROJECT --member serviceAccount:test-service-account2@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role roles/viewer

# copy a file into the storage bucket
gsutil cp cat.jpg gs://$MY_BUCKET_NAME_1
# take that file in the first bucket and copy it to the second bucket
gsutil cp gs://$MY_BUCKET_NAME_1/cat.jpg gs://$MY_BUCKET_NAME_2/cat.jpg

# get the acls of the storage bucket
gsutil acl get gs://$MY_BUCKET_NAME_1/cat.jpg  > acl.txt
cat acl.txt
[
  {
    "entity": "project-owners-560255523887",
    "projectTeam": {
      "projectNumber": "560255523887",
      "team": "owners"
    },
    "role": "OWNER"
  },
  {
    "entity": "project-editors-560255523887",
    "projectTeam": {
      "projectNumber": "560255523887",
      "team": "editors"
    },
    "role": "OWNER"
  },
  {
    "entity": "project-viewers-560255523887",
    "projectTeam": {
      "projectNumber": "560255523887",
      "team": "viewers"
    },
    "role": "READER"
  },
  {
    "email": "google12345678_student@qwiklabs.net",
    "entity": "user-google12345678_student@qwiklabs.net",
    "role": "OWNER"
  }
]
# this access control list pretty much says the creator of the project as given by the email and anyone with the project owner, editor, viewer role has access to the storage bucket
# set the acl of the object in the storage bucket to private
gsutil acl set private gs://$MY_BUCKET_NAME_1/cat.jpg
# run the command to see the acl again
[
  {
    "email": "google12345678_student@qwiklabs.net",
    "entity": "user-google12345678_student@qwiklabs.net",
    "role": "OWNER"
  }
]
# now only the creator of the project has access

# view the current authenticated user in the current cloud shell session
gcloud config list
# use the service account private key (credentials) to authenticate and login
gcloud auth activate-service-account --key-file credentials.json
# run the config list again and it should say that the account the shell is using is the servce account
# view the auth users in the shell
gcloud auth list
# copying anything from the bucket or editing will be denied because the service account has no privileges

# make the storage bucket readable by everyone even unauth users
gsutil iam ch allUsers:objectViewer gs://$MY_BUCKET_NAME_1

# install nginx in one of the VMs we created as a webserver (like apache)
# to securely copy a file over to another VM instance from Cloud shell
gcloud compute scp index.html first-vm:index.nginx-debian.html --zone=us-central1-c
# then in the SSH of the VM run the command below to copy
sudo cp index.nginx-debian.html /var/www/html
```
- **NOTE:** - customers that need to manage resources for a product being consumed should make a billing account at the product folder in the resource hierarchy to limit spending with quotas and make budgets and alerts
    - Measured service = pay for resources that one consumes
    - when making a new product for organization, make a new folder representing that product with projects inside of it to use the resources
# Introduction to Containers and Kubernetes
- virtualization helps with running multiple (virtual) servers on OS on the same physical computer
    - **hypervise** = software that breaks the dependencies of an OS with its underlying harware, to allow several virtual machines share that same hardware
        - KVM is a pop. hypervisor
    - this means that resources are wasted less and more portable
    - however, VMs still need time to boot and multiple applications on the same VM might starve the VM of its resources for the other apps
- to solve the dependency problems of multiple apps on the same VM is to virtualize (abstract) the operating system
    - only need to abstract the **userspace** which is the code that sits above the kernel, which includes the apps and dependencies
    - this is essentially **containers** - isolated user spaces for running application code
        - containers are lightweight bc they don't carry the full OS
        - fast to start up because its just starting and stopping processes (containers are just a process). not booting a VM and OS
        - its packaged code with all the dependencies it needs and the **engine** executing the container will be responsible for making them available at runtime
    - this allows developers to make assumptions about the hardware
    - containers are good microservices designs
- **Image** = application with its dependencies
    - container = running instance of the image (like process with program)
    - Docker = tool to run apps and containers
    - containers are based off a Linux feature called the **linux process**
        - linux processes have their own virtual memory address spaces, separate from others
    - **containers** use **linux namespaces** to control what the app can see (linux namespaces != kubernetes namespaces)
        - also uses linux **cgroups** to determine what the app can use:
            - CPU time, memory, I/O bandwidth, etc.
    - **union file systems** to encapsulate apps and their dependencies into a set of _clean minimal layers_
        - container image is structured in layers.
            - tool (Docker) used to build the image reads instructions from a container manifest (file)
                - for docker the container manifest is called Dockerfile
                - each instruction in the Dockerfile specifies a layer inside the container image
                - each layer is read only
- **Container manifest** (Dockerfile) example:
    - line 1: `FROM ubuntu: 18.04` - adds layer which specifies the ubuntu linux runtime env. about 184mb
    - line 2: `COPY ./app` - copies some files from developer local curr dir.
    - line 3: `RUN make /app` - builds application using the make command
    - line 4: `CMD python /app/app.py` - command to specify what to run when container is launched
    - each line is a layer. organize from least likely to change to most
    - Pros make a seperate container using only what's necessary to run app for production.
        - test dev. containers are messy
    - when launching a container from an image, the container runtime makes a new layer at the top
        - this layer is called the **container layer**
            - changes to the container such as writing, deleting files are written to this layer
        - container layers are deleted when the container stops and is removed (the image still remains intact)
        - thus when storing data permanently then must do so from outside the containers
- multiple containers can share access to the same image but have different data states bc of container layer
    - this allows containers to pull down less layers from the image since there are similarities with the other containers on the same image
        - thus when building a container it creates a layer with just the differences and for the layers that are the same and shared it can refer to it
    - allows for fast start up times
- can get public containers premade
    - can use Cloud Registry and Cloud Build to securely store and build images
- **NOTE:** - union file systems hold the apps and the dependencies in layers. this is why its good for containers
    - top most layers is the container layer. it will be deleted permanently when the container stops running and applications in the container can modify it bc the app will be making changes to files within the container itself.
# Lab notes:
```bash
# make sure to enable cloud build and registry apis for project
# make a shell script quickstart.sh
#!/bin/sh
echo "Hello, world! The time is $(date)."

# make a Dockerfile to specify the layers of the image
# build the alpine linux base image
FROM alpine
# copy the quickstart file from the local dir and add it to the / dir of the image
COPY quickstart.sh /
# run the following commands when the container is created
CMD ["/quickstart.sh"]

# make the quickstart shell script executable
chmod +x quickstart.sh

# build the docker container image in Cloud Bulid
# the . at the end specifies the location of the source code in the working dir
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/quickstart-image .

# how to make a softlink, training data is a cloned repo
ln -s ~/training-data-analyst/courses/ak8s/v1.1 ~/ak8s
# visit a dir using softlink
cd ~/ak8s/Cloud_Build/a

# we can use configuration files for Cloud Build
cat cloudbuild.yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/quickstart-image', '.' ]
images:
- 'gcr.io/$PROJECT_ID/quickstart-image'
# the instructions include telling Cloud Build to use Docker to build an image with the Dockerfile in the current '.' dir. then push image to Container Registry

# run the config file using
gcloud builds submit --config cloudbuild.yaml .

# another example of the cloud build config file is to run tests
cat cloudbuild.yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/quickstart-image', '.' ]
- name: 'gcr.io/$PROJECT_ID/quickstart-image'
  args: ['fail']
images:
- 'gcr.io/$PROJECT_ID/quickstart-image'
# build the image then run the created image with an argument fail
# if the test failed then there would be an output
```
- Kubernetes - manage container infrastructure on-premise or cloud
    - manages automatically deployment, scaling, load balancing, logging, monitoring, etc.
    - fascilitates some infrastructure features such as user preferences and configuration
    - declarative config rather than listing a bunch of commands
        - kubernetes works to meet state of declaration
    - can also use imperative configuration = for quick fixes
    - good for stateless apps and stateful
        - support batch jobs and daemon tasks
        - auto scale in and out
        - specify resource request levels and limits
- Kubernetes Engine - powerful for managing, scaling, deploying kubernetes enviroments for containerized apps
    - part of the GCP compute offerings.
    - fully managed, has an optimal OS for containers, auto upgrade clusters of kubernetes software
    - the VMs in the clusters are called **nodes**
        - can auto repair unhealthy nodes
    - supports scaling containers and the cluster itself (nodes)
    - easily integrates with Cloud Build and Registry
        - works with IAM and can control access to the clusters
    - logs and monitors applications in the containers 
    - uses the integrated networking of Google Cloud
- Use compute engine for absolute control of OS and virtual hardware. easily migrate apps to the cloud. very flexible
- Use app engine for focusing on coding. can use to build websites, mobile apps, gaming backends, RESTful APIs
- Use Kubernetes Engine for orchestrating containers using Kubernetes software
    - automatically works with GCP resources and services
    - supports cluster scaling, persistent disks, upgrades, node repairs, 
    - portable and can work on any premise or cloud
    - use for container apps, cloud distributed systems, or hybrid systems
- Use Cloud Run because its serverless the infrastructure is abstracted away. good for stateless containers (only)
    - scales up or down automatically
    - good for APIs because it listens for requests or events
- Use Cloud Functions for event-driven compute service.
    - serverless because the infrastructure is auto managed
- **NOTE:** compute engines give fine-grained control of costs because of the per-second billing and customizable VMs
# Kubernetes Architecture
- 