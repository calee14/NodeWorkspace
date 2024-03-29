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
- How kubernetes works:
    - **Object model** - represents a resource that Kubernetes manages and you can manage and change the states and attributes
        - aka. persistent entity that represents state of something running in the cluster (the desired and current state)
        - some objects represent containzed apps, resource available to them, and policies that affect apps
        - two important elements of obj:
            - **Object spec** - desired state described by dev
            - **Object status** - current state described by **Kubernetes control plane** (part of GKE cluster)
        - **Pods** = basic building block of Kubernetes module. also smallest deployable Kubernetes object
            - embody the env where containers live. (can have one or more containers). 
                - thse containers share networks and storage and other resources
            - each pod has a unique IP address
                - the containers in the pods share the network namepsace including IP address and network ports 
                    - the containers can communicate through localhost
        - Example of pods:
            - declare the Pods object to run three nginx containers. Have kubernetes run those pods and keep in existence
            - when initially declared and ran Kubernetes compares the desired state with the current state
                - the **Kubernetes Control Plane** will monitor and launch actions to bring the env to the desired state
    - **Declarative management** - programmer tells the state of the object and the Kubernetes management will work to bring the env to that state and keep it there
        - uses the **'watch loop'**
- Kubernetes Components:
    - GKE clusters need computers. In GKE, those computers are usually VMs
        - one computer is a control plane and the others are nodes
        - the nodes are to run the parts (contaized apps)
        - the control plane is to coordinate the entire cluster (all nodes)
    - In the control plane there are some critical components:
        -  the main interactive comp. is called **kube-APIserver** - accept commands that view or change the cluster such as launching pods
            - interact with this API using the `kubectl` command in the cli
            - is the point of control of Kubernetes cluster
            - requests are automatically authenticated and authorized
        - **etcd** - another comp. that is the clusters DB. stores the state of the cluster. stores cluster config and dynamic info such as nodes in the cluster, pod status and details
            - never a direct interaction with etcd but the kube-APIserver interacts with it
        - **kube-scheduler** - schedule pods onto nodes
            - evaluates requirements of each pod and selects which node is suitable
            - writes the name of the node into pod object for another service to launch the pod
            - will choose nodes based on current data of the pods and dev-defined policies
        - **kube-controller-manager** - monitors state of the cluster through kube-APIserver.
            - when the current state doesn't match desired then it will make changes to match
            - **controllers** = loops of code that handle remediation (fixing something broken/diff)
            - there are many types of controllers. one is controller object is called **deployment**
                - this contorller keeps them running and scales them and group them to a frontend
        - **kube-cloud-manager** - manages controllers that interact with cloud providers
            - if working with Google Cloud, then its responsible for bringing cloud features like load balancers and storage when needed
- Each node in a kubernetes cluster needs a control plane component
    - this control plane is called **kubelet** = a kubernetes agent on each node 
    - when kube-APIserver wants to start a pod then it connects to the Node's Kubelet
        - kubelet then uses the **container's runtime** to start the pod and monitors it to report back to kube-APIserver
        - the term containe runtime means the software to launch a container from an image
            - GKE uses the Linux distributed runtime called Containerd, part of Docker
    - Inside the Node there is the **Kube-proxy** component, which maintains the network connectivity among the pods in a cluster
        - in Kubernetes, it uses the firewall capabilities of IP tables, which are part of the linux kernel
- `kubeadm` command can set up the initial Kubernetes cluster, but nodes will have to be manually maintained
    - in a GKE cluster all components are managed, including the control plane comp.
    - exposes the cluster with an IP address
    - Kubernetes doesn't make nodes but the cluster admin does. 
        - GKE automates this process by launching VMs and registers as nodes
        - can make **node pools** = group of nodes in a cluster where the nodes share VM configs (vCPU, mem.)
        - NOTE: some of each nodes CPU and mem. will be used to run GKE and Kubernetes components
- by default clusters launches in one compute zone with three identical nodes all in one node pool
    - can also make GKE regional clusters
        -  the control planes and nodes are sprad accross multiple zones in a region
    - there is a single API endpoint for the cluste
    - regional or zonal cluster can be set up as a private cluster
        - can be accessed by internal IP addresses, can have Private Google Accesss for outbound connections, set up firewalls for authorized IP ranges
- Object Management:
    - Example: run 3 nginx webservers using GKE
    - Goal: declare three Pod objects and specify state: create an nginx container from image
    - define objects with YAML file for GKE
        - can define the Kubernestes version we want, specify the type of object we want to make and the metadata (properties of obj.)
        - objects can have unique names to identify them along with a UID
        - objects can also be assigned labels for organizing objects
        - pods are meant to be epheremal (meant go away and start again new)
    - can declare a controller object whose job is to manage state of pods
        - use the **deployment controller obj.** 
            - deployment controller will manage the pods and launch new ones if health is bad
        - can use the deployment yaml to launch three replicas of the same container
            - can specify num. replicas, the container to replicate, etc.
        - **namespace** = a list of names of objects within a cluster
            - there are no duplicates names in a namespace.
            - namespaces used to identify objects. this lets you set resource quotas across the cluster
        - **labels** = namespace alternative
        - default namespace, 
        - there are three initial namespace
            - the default namespace for workload resources that don't have anywhere to go yet
            - kube-system namespace for objects created by the Kubernetes sys. itself
            - kube-public namespace for objects that are publicly readable to all users
        - better to apply namespaces at the commandline level rather than in the YAML. this makes the YAML files more flexible
- In practice the **Deployment Controller Object** would launch the three nginx pods. It would do so using a **ReplicaSet** object to manage the pods
    - The deployment controller has a feature where it can make a rolling update.
        - It would make a new ReplicaSet and increase the pods in the new set while decreasing the older one
- **NOTE:** - the Deployment object will manage a set of Pods, meaning it will make sure that new Pods are launched if the desired set of Pods isn't met
- there are three main **Services** in Kubernetes that give load-balanced access to Pods:
    - ClusterIP - expose service on an IP address that is accessible to only devices within the cluster (default value)
    - NodePort - expose service on an IP address of each node in the cluster at a specified port
    - LoadBalancer - expose the service externally, using a load balancing service provided by a cloud service
        - the load balancer for GKE by default give regional network load balancing.
        - can get access to Global HTTP(S) Load Balancing but need an Ingress Obj
- here are some controller objects in Kubernetes:
- **ReplicaSet Controller** - ensure that a group of identical pods are running at the same time. ReplicaSets are managed by the Deployment Controller object which allows for declarative policies. 
    - Can declare updates to the ReplicaSets and Pods from the Deployment object
- **Deployment Controller Object** - create, update, roll back, and scale pods using the ReplcaSets controller. Can handle rolling updates by making a second ReplicaSet and increasing pods in the new set while decreasing the old
- **Replication Controllers object** - work similarly to the combination of ReplicaSets and Deployments
-  **StatefulSet controller object** - gives Pods created by this controller the ability to have their applications maintain a local state.
    - this means that they have unique persistent ids with network identity and disk storage
- **DaemonSet controller object**- ensures that a specific pod is running on all/subset of nodes
    - **daemon** - means non-interactive process that provides services to other processes
    - the DaemonSet might ensure a logging agent like fluent is running on all nodes in the cluster
- **Job controller** creates one or more Pods requred to run a task. after completing the task the pods created for the task will be terminated
    - related to CronJob, which runs pods on a time-based schedule
- **NOTE:** - **Service** in Kubernetes Engine is for allowing Pods to be exposed to the internet or to others devices in an internal network. 
    - Service also is a load-balancing network endpoint for Pods
## Lab notes
```bash
# command for making a GKE cluster. this one resides in a single zone
gcloud beta container --project "qwiklabs-gcp-02-03683b7e9df8" clusters create "standard-cluster-1" --zone "us-central1-a" --no-enable-basic-auth --cluster-version "1.22.8-gke.202" --release-channel "regular" --machine-type "e2-medium" --image-type "COS_CONTAINERD" --disk-type "pd-standard" --disk-size "100" --metadata disable-legacy-endpoints=true --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --max-pods-per-node "110" --num-nodes "3" --logging=SYSTEM,WORKLOAD --monitoring=SYSTEM --enable-ip-alias --network "projects/qwiklabs-gcp-02-03683b7e9df8/global/networks/default" --subnetwork "projects/qwiklabs-gcp-02-03683b7e9df8/regions/us-central1/subnetworks/default" --no-enable-intra-node-visibility --default-max-pods-per-node "110" --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 --enable-shielded-nodes --node-locations "us-central1-a"

# the Cloud Console can resize the nodes in the cluster
# can deploy containers to the cluster using the workloads tab
# this will create pods in each node
```
- **Migrate for Anthos** - gets workloads into containerized deployments on GC
    - moves existing apps into a Kubernetes env.
    - all automated, can be on-premise moving to cloud
    - most migrations are under 10 min.
        - can also migrate app data to the cloud by moving it in one go or streaming it
    - Anthos is installed on a GKE processing cluster. Builds all the deployment elements then ships it to a production cluster 
- **Migrate for Compute Engine** - brings existing apps into VMs
    - can make a pipeline for streaming or migrating data from on-premises to cloud
- Migration is a multi-step process:
    - create a processing cluster. Install Migrate for Anthos on it
        - need to be a GKE admin to create the cluster
        - need filewalls in place to allow communications migrate for anthos and compute engine (for creating processing cluster)
        - once created need to install Migrate for Anthos software
    - then it needs a migration source: VMware, AWS, Azure, GC
    - generate a YAML file to template the cluster
        - the plan can be created using a `migctl` command
    - next will need to generate container images (artifacts) for apps in the YAML files for deployment
        - there is another `migctl` command for generating the artifacts
            - the YAML config file created defines the resources to deploy. can be edited
    - test the artifacts
    - if the tests are successful then deploy to the production clusters
        - another `migctl` command to deploy the workload
- **NOTES:** placing containers in the same Pod minimizes latency because they are scheduled together in the same node
    - best to have the namespaces: test, staging, and production then add policies (resrouce quotas) for the test and staging namespaces so that production can be prioritized
    - When deploying stateful apps in containers for GKE, must create **Volumes?** using network based storage. this provides durable storage remotely to the pods. However, must specify these remote storage devices to the pods
    - In the GKE, control plane nodes are not billed against the account. if the default pool in the default zone is configured then the other zones copy the default zone. there are three zones by default in a regional cluster
# Introduction to Kubernetes Workloads
- `kubectl` = utility used by admin of Kubernetes clusters
    - used for communicating with the kube-APIserver
    - one command `get pods` is transformed into an API call to kube-APIserver through HTTPS
        - the server processes requests by querying etcd return returns the results
    - kubectl needs to be authenticated in order to connect with clusters
        - use the gcloud command (needs to be auth first with an admin user) to retrieve the credentials
            - this is how we configure the kubectl commandline interface
    - kubectl can only administer the internal state of an existing cluster
        - use gcloud commands to access the GKE control plane and create or change shape of clusters
    - `kubectl [command] [type] [name] [flags]`
        - command specifies the action wanted to perform: get, describe, logs, exec (some are view and others change state)
        - type specifies the kubernetes object that the command is acting on
            - pods, deployments, nodes, or other obj. or cluster itself
        - name specifies the object specified in type
        - flags = are special requests. some are for formatting an output in a certain way.
            - `-o=yaml` is one of those ways to give output in YAML format
            - `-o=wide` is a way to display output in a wide format. this means more information
    - be sure to configure the kubectl commandline so that the commands act on the intended cluster
- **Deployments** describe a desired state of Pods
    - its defined by a declarative policy so that the GKE will make sure that the configuration is running exactly
    - to roll out new updates, the pods with the new version are put into a new ReplicaSet and slowly increased until the old ReplicaSet is totally gone and replaced
    - can be configured to manually or automatically manage the workload of Pods
    - best designed for stateless applications
    - the desired state is written in a Deployment YAML
        - contains info on Pods, and how to run them and their lifecycle events
        - once submitting this file to the GKE control plane it makes a **deployment controller** that makes the desired state into reality and keeps it that way
            - **controllers** = loop process created by kubernetes that is a routine task to keep desired state of an object in the cluster matching with the current state
            - During initial creation of Pods, a **ReplicaSet controller** is made to ensure a number of Pod replicas are running at any time
    - has three states:
        - **progressing** indicates that a task has been performed to make a new ReplicaSet or scale up or down a Replica set
        - **complete** indicates that all new replicas are updated to the latest version. no old replicas are running
        - **failed** indicates when the creation of a new ReplicaSet could not be completed. 
- 3 ways to make a deployment:
    - create a deployment declaratively using a YAML file (manifest file) then run the **kubectl apply** command 
    - imperatively make a deployment using the kubectl run command specifying params
    - use the GKE workloads tab in the GCP console
        - this tab also gives the YAML format for the deployment
- REVIEW: the ReplicaSet is created by the deployment obj and ensures that a given num of pods are running and up
    - auto launches a new pod, if one fails or is evicted
- Can scale a deployment manually with a kubectl command or Cloud Console
    - can auto scale with the shell or Cloud Console
    - scaling the pods is called **Horizontal Pod Autoscaler**
        - scales the deployment and not the cluster
- Making chagnes to a deployment pod's specification will make an automatic rollout (only occurs with Pod's specs)
    - can use the `kubectl apply` command or `kubectl set/edit` commands for imperative changes
    - can also change the deployment manifest from the Cloud Console
    - REVIEW: Rolling updates launch a new ReplicaSet with the new Pods
        - the new pods are slowly launched while the old pods from the old ReplciaSet are deleted
        - this is called a **ramped strategy** (takes time and no control over how traffic is directed to old or new pods)
- Pods themselves are **transient**??
    - **Kubernetes Service** is a static IP address that represents a service or function in the infrastructure
        - its a network abstraction for a set of Pods that deliver that service (directs traffic to the pods)
            - hides the ephemeral (gets deleted and restarted) nature of the pods
- Blue/Green deployment with Kubernetes:
    - creates a new deployment with the newer version
    - when the pods in the new Deployment are ready then all traffic can be switched from the old blue version to the new green version
    - switching from the two versions uses a **Kubernetes Service**
        - manages the network traffic to a selection of Pods using labels
    - this allows rollouts to be instantanious
- **Canary Deployments** - update strategy based on the blue/green method
    - traffic is gradually shifted to the new version
    - The Kubernetes service that directs traffic to the pods uses labels
        - it has a selector specification and chooses pods with a certain label regardless of version
        - thus, scale up the new pods and down the old
        - can quickly roll back
    - each request is treated independently so a request might go from a Pod with the old version to the new which might cause issues
        - can use session affinity so that the client connects to the same Pod
- **A/B testing** = used to make business decisions to route a subset of users to new functionality
    - compare two versions and route users based on HTTP headers, geolocation
        - choose the most effective software then make that the production env
    - can **traffic shadow tet** by mirroring the request to the new version. (lets test with real production traffic)
- Rollback a deployment - can use commands
    - can view the history of deployments and rollback from there
- Pause rollouts so group minor changes into one. less clutter
    - can also easily delete deployments and GKE will remove all running resources like pods
## Lab notes
```bash
# premade clusters and define zone
export my_zone=us-central1-a
export my_cluster=standard-cluster-1
# activate the tab completion for the kubectl command
source <(kubectl completion bash)
# get the credentials for the cluster for the kubectl commandline tool
gcloud container clusters get-credentials $my_cluster --zone $my_zone
# then clone a git repo and then make a shortcut to it
git clone https://github.com/GoogleCloudPlatform/training-data-analyst
ln -s ~/training-data-analyst/courses/ak8s/v1.1 ~/ak8s
cd ~/ak8s/Deployments/

# the deployment manifest which is configured to run three pod replicas 
# each pod has a single nginx container and each pod is listening on TCP port 80
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
# deploy the manifest to the cloud
kubectl apply -f ./nginx-deployment.yaml
# view the current deployments
kubectl get deployments

# can scale up or down the pods in GKE > workloads tab
# or can do it in the commandline with kubectl
kubectl scale --replicas=3 deployment nginx-deployment

# update a deployment template to cause a rollout. in command update the image version
# updates such as scaling deployment doesn't affect. labels and container images do affect
kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record
# view the rollout status
kubectl rollout status deployment.v1.apps/nginx-deployment

# view the rollout history
kubectl rollout history deployment nginx-deployment
# roll back to a previous deployment
kubectl rollout undo deployments nginx-deployment
# viewing the rollout history will show that there's a new revision point
# get more information about the latest deployment
kubectl rollout history deployment/nginx-deployment --revision=3
# it should display information about the containers and the pod templates. it should have the new image version

# Kubernete Services can be configured to be ClusterIP, NodePort, or LoudBalancer
# service-nginx.yaml Kubernetes manifest file for putting a Kubernetes service (Load Balancer) behind the pods to connect traffic on the TCP port 60000 to port 80 for the containers with the label = app: nginx
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 60000
    targetPort: 80
# deploy the manifest file to add the service to the GKE cluster
kubectl apply -f ./service-nginx.yaml
# defines a service and applies it to the pods that are in the selector
# this manifes applies to the containers created earlier
# get the Kubernetes service and the external IP for it. external IP looks like (http://[EXTERNAL_IP]:60000/)
kubectl get service nginx

# to perform a canary deployment make a manifest file like this:
# this file deploys a new single pod with the new version of nginx
# this new pod uses the label app:nginx so that the Kubernetes Service will route traffic to it still
# thus, the canary deployment and the original deployment get traffic
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-canary
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
        track: canary
        Version: 1.9.1
    spec:
      containers:
      - name: nginx
        image: nginx:1.9.1
        ports:
        - containerPort: 80
# apply the deployment to the cluster
kubectl apply -f nginx-canary.yaml
# see the deployments and there is a new deployment with the new image
kubectl get deployments

# can scale down the old deployment to 0 pods
kubectl scale --replicas=0 deployment nginx-deployment

# can add sessionAffinity property field to route requests to the same pod add the following:
sessionAffinity: ClientIP
```
- **Pod networking** 
    - REVIEW: Pod = a group of containers with shared storage and networking
    - each pod has a single, unique IP address
        - the containers in the pod share the same network namespace
        - the containers despite running on diff TCP ports, they appears as if they are on the same machine
        - the containers can communicate with each other by establishing connections to each other through **localhost** on the TCP ports
    - pods are connected to each other through the nodes **root network namespace**
        - pods can communicate with other pods on the same node
    - the VM's **NIC** allows the root network namespace to maek forwarding traffic out of node
        - this also means that the IP addresses of the pods must be routable on the network that the node is connected to.
        - where do the IP addresses come from for the pods?
            - GKE nodes will give pods the IP addresses from the address range assigned by the VPC
            - REVIEW: **VPC** = virtualized isolated networks that provide connectivity for resources in GCP
                - VPC can be made up IP subnets in regions all over the world
                - VPC by default has a IP subnet for each region in the world
                    - then the IP addresses in the subnet are given to the compute instances
            - Nodes are VMs thus they are assigned IP addresses from the VPC subnet the VMs are in
            - In GCP, **Alias IPs** allow user to configure secondary IP addresses or IP ranges for Compute Engine VMs
            - NOTE: GKE clusters auto create an Alias IP range to reserve 4000 IP addresses for cluster-wide Services for later use
            - NOTE: GKE clusters also make Alias IP range for pods  
                - Each pod must have a unique address so this address space will be large
                - uses a `/14` block which contains 250000 IP addresses
                - uses this IP address range to divide amongst the nodes
                    - thus each node is allocated a `/24 block`(250 addresses) for the pods
                    - = 1000 nodes with 100 pods each
- **Volumes** - storage abstractions = objects that manage storage without worrying about implementation
    - Volumes are accessible to all containers in a pod
    - attached to pods not containers
        - some are ephemeral = last as long as the pod they are attached to
        - some are persistent and last after pod is destroyed
        - **PersistentVolume** - manage durable storage in a cluster. backed by a persistent disk
            - works independent of the cluster, meaning they exist whether the cluster and nodes do or not
            - managed by Kubernetes
        - can be created by an admin or dynamically created
- **Ephemeral Volume** types:
    - **emptyDir volume** = empty dir that allow containers within pods to read and write to it
        - exists as long as the pod exists.
            - usually a local disk or a memory-based file sys.
        - should be used for short term purposes
    - **configmap volume** = volume that is set up in a tree of files and directories.
        - best used for a webserver in a pod. use it for a config map to set the webserver parameters
    - **secrets volume** = like Configmap but used to pass sensitive information
        - based in-memory file sys. better security for secrets
        - obfuscate (unintelligible/obscure/not understandable) the values by using base64 encoding
    - **downwardAPI** = makes pod data available to the containers
        - can give unique data about the pod to the container
    - all these volumes are based off the emptyDir volume
        - these volumes are created when the node creates a pod and attaches it lifecycle to the pod (ephemeral)
        - data in emptyDir volumes are safe for container crashes
    - emptyDir use cases = scratch space, disc-based merge sort, checkpoint for long computation, recovery from crashes, hold files that is beign retrieved while a webserver serves the data (streaming?)
- **PersistentVolume** has two components:
    - PersistentVolume = durable, persistent storage at the cluster level
        - data exists despite a pod that might have been deleted
        - Persistent disks by GKE are called PersistentVolumes
    - **PersistentVolumeClaims (PVC)** = requests made by pods to use the volumes
        - in a claim, define volume size, access mode, and storage class
        - the claim is bounded to the PersistentVolume
        - decouples storage admin from the application configuration (don't worry about maintaining disk space. abstracted away)
    - to make a PersistentVolume must specify in the kubectl manifest yaml file
        - there are `storageClassName` fields to define the type of PV storage one wants to use
        - can also define custom storage classes
            - make it so that the storage is an ssd
    - can define a PersistentVolumeClaim object in the manifest file then reference the name in the pod
        - what if the claims excede the volumes has??
## Lab notes
```bash
# set up the env. variables for the zone and clusters.
# also download the git repo with the manifest files for GKE
# also set up the kubectl tab completion for the kubectl commandline tool
# also get the credentials to the cluster using the gcloud sdk
# create short links to the repo and navigate there
export my_zone=us-central1-a
export my_cluster=standard-cluster-1
source <(kubectl completion bash)
gcloud container clusters get-credentials $my_cluster --zone $my_zone
git clone https://github.com/GoogleCloudPlatform/training-data-analyst
ln -s ~/training-data-analyst/courses/ak8s/v1.1 ~/ak8s
cd ~/ak8s/Storage/

# don't need to configure a PersistentVolume object
# instead create a PersistentVolumeClaim and Kubernetes auto provides a persistent disk for you
# this is how to create a PVC in the yaml manifest file
# pvc-demo.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: hello-web-disk
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 30Gi

# run this command to show all the PersistentVolumeClaims made
# should be none right now
kubectl get persistentvolumeclaim
# have GKE read the manifest file to make a PVC 
kubectl apply -f pvc-demo.yaml

# here we're attaching the PersistentVolumeClaim to a pod
# we're mounting the storage to the directory /var/www/html inside the container
# data/files saved to that directory in the container will be saved on the persistent volume/disk whether or not the pod exists
# pod-volume-demo.yaml
kind: Pod
apiVersion: v1
metadata:
  name: pvc-demo-pod
spec:
  containers:
    - name: frontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: pvc-demo-volume
  volumes:
    - name: pvc-demo-volume
      persistentVolumeClaim:
        claimName: hello-web-disk
# create the pod by sending the manifest to GKE
kubectl apply -f pod-volume-demo.yaml
# list the pods in our GKE cluster. there should be one
kubectl get pods

# run this command to gain shell access to our pod
kubectl exec -it pvc-demo-pod -- sh
# echo a piece of text to a file in the directory where our PVC is located
echo Test webpage in a persistent volume!>/var/www/html/index.html
chmod +x /var/www/html/index.html
# display what's in the file and exit the interactive shell on the nginx container
cat /var/www/html/index.html
exit

# delete a pod in a cluster. this is meant to demonstrate that our PVC and its content persisted
# the number of pods should be zero and the PVC should be one
kubectl delete pod pvc-demo-pod
kubectl get persistentvolumeclaim
# redeploy the claim and connect with the pod using shell
# display what's in the PVC which should be the same thing
kubectl apply -f pod-volume-demo.yaml
kubectl get pods
kubectl exec -it pvc-demo-pod -- sh
cat /var/www/html/index.html

# delete the old pod
kubectl delete pod pvc-demo-pod
kubectl get pods

# created a 'StatefulSet' which is a cluster that involes a LoadBalancer Service and the StatefulSet controller object
# also 3 replicas of a Pod containing an nginx container and a volumeClaimTemplate for 30 GB PVCs with the name hello-web-disk
# the PVC template is a guide for GKE on how to create PVC for each pod
# attach the template to the specs of the pods
# the nginx containers mount the PVC to the dir /var/www/html
# statefulset-demo.yaml
kind: Service
apiVersion: v1
metadata:
  name: statefulset-demo-service
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  type: LoadBalancer
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: statefulset-demo
spec:
  selector:
    matchLabels:
      app: MyApp
  serviceName: statefulset-demo-service
  replicas: 3
  updateStrategy:
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: MyApp
    spec:
      containers:
      - name: stateful-set-container
        image: nginx
        ports:
        - containerPort: 80
          name: http
        volumeMounts:
        - name: hello-web-disk
          mountPath: "/var/www/html"
  volumeClaimTemplates:
  - metadata:
      name: hello-web-disk
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 30Gi
# make the changes to the GKE cluster
kubectl apply -f statefulset-demo.yaml
# describe the state of the StatefulSet cluster
# should be able to view the status of the pods and the template of the pods
kubectl describe statefulset statefulset-demo

# when displayin the pods should be able to see the them numbered
# demo-0, demo-1, demo-2
kubectl get pods

# getting the PVCs should display all of the VPCs in the cluser
# there should be four: one for each pod with them numbered and the VPC created earlier
# hello-web-disk, demo-0, demo-1, demo-2
kubectl get pvc

# command to display details of a VPC
# shows capacity and other details of storage type
kubectl describe pvc hello-web-disk-statefulset-demo-0
```