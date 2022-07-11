# Defining Services
- Building **requirements** for a project ask the questiosn:
    - who? - user, developers and stakeholders of app (who is being affected)
    - what? - main areas of functionality of app but it has to be clear. 
    - why? - reason for needing the system.
    - when? - timeline for users and developers
    - how? - how will the system work? number of users at a time? amount of data?
        - average payload size of service requests? latency requirements?
        - where users are
- **Qualatative requirements**:
- Roles represent the goal of a user. 
    - However, it can also be a microservice talking to another service
    - brainstorm roles of what users might do and then group together ones that belong to a specific action = role
    - **Persona** - a typical person who takes a role.
        - tells a story about that person and what they do
    - **User stories** - describe what the user wants the app to do and why the want to do it
        - **INVEST** criteria. evaluate user stories
            - Independent, Negotiable, Valuable, Estimatable, Small, Testable
- **Quantitative requirements** - measureable data based on constraints: time, finance, people
    - availability (accessibility), latency (time), throughput (durability, how much we can handle)
- **Key Performance Indicators (KPIs)** - measure success of product, app
    - for business: ROI, EBIT, Employee turnover, Customer churn
    - for tech: Page view, User registration, Clickthroughs, Checkouts
    - KPI's indicate if you're on track to acheive the goal
    - Need to define KPIs that mean success and signs that we're reaching the goal
    - KPIs must be **SMART**
        - Specific (more detail better), Measurable (know steps to reach objective), Achievable (attainable), Relevant (make sure it matters and is benefitial), Time-based (due dates, time available)
- **Service Level Indicators** - measurement of features of a service
    - Error rate, throughput, latency
    - must be countable/measureable and bound by time
        - Good to use percentile metrics for SLIs
- **Service Level Objectives** - agreed target of values for a measurement from an SLI
    - should improve user experience
    - shouldn't be too ambitious and out of reach.
        - _attainable_ and reasonable within costs
    - divide the SLO into parts for more performance gauge
        - 50% will be complete within 100 milliseconds
    - start with lower SLOS and something simple
    - don't deal in absolutes (100%)
    - don't have too many SLOs. only need to cover the key app attributes (features users care about)
- **Service Level Agreements** - agreement between service provider and consumer
    - service provider defines responsibilities and consequences if service not met
    - aka. a contract between the provider and the customer
        - better to be conservative with SLAs
            - there should be some saftey or threshold. lower than the SLO
- **NOTE:** - user experience isn't measureable or time bound, thus it's not a good KPI
    - user story = description of a feature written from the user's POV
# Microservice Design and Architecture
- **Microservices** = divide large program into independent services
    - this enables teams to work together better and faster
    - App Engine, Cloud Run, Kubernetes Engine, Cloud Functions help with building microservices 
    - Each service needs to have its **own** datastore for independence
    - better for scaling, logging errors, innovating, use different langauges for different services
    - Challanges: hard to define clear boundaries between services
        - more complex infrastructure between services: latency, security, different versions
        - backward compatibility as services might update
    - Microservices for an application should developed internalyl and be exposed through an API
        - The next layer should be the architectual layer where apps should be User Interfaces (web, iOS, android)
            - Last layer: Isolate services that provide data sharing by securing it with authentication
    - **Stateful services** (service connected to database) - harder to scale, upgrade, need to backup
        - avoid storign shared state in-memory on servers
            - this requries sticky sessions for the load balancer, meaning requests from one client go to the same server instance aka. **session affinity**
            - messes up elastic autoscaling
            - to fix use stateful services like Datastore or CloudSQL. then cache data for faster access speeds using Memorystore
                - allows for load balancer to scale backend and keep up with demand
    - **Stateless services** - easier to scale, update versions, and deploy
- **Twelve-Factor App** - set of practices for building web or SaaS
    - decouple components off an app so that each component can be deployed to cloud using Continuous Deployment and scale easily
    1. Codebase - use Git version control. Cloud Source Control
    2. Dependencies - use package manager, and declare dependencies in codebase (requirements file)
    3. Configuration - stored in enviroment. store secrets, connection strings, endpoints in env. variables
    4. Backing Services - DB, caches, queues, accessible via URL. 
    5. Build, Release, Run - build deployment package from source code, each package should be related to a specific release. The release is linked to the runtime enviroment config with a build. This allows history of every deployment in production (good for rollback). Run = execute application
    6. Processes - apps run in one or more processes (stateless), the instances of the app get data from a isolated db service
    7. Port binding - services should be exposed using a port number. The apps combines the webserver with the app itself so no need for a seperate Apache server.
    8. Concurrency - app run in containers and should be able to scale up and down to meet load by adding more instances
    9. Disposability - the app instances should be able to shutdown in case of failure and cause no errors or future ones. also must have fast bootup speeds
    10. Dev/prod parity - same enviroments in test/staging as production. can be achieved with Docker and Terraform (Infrastructure as Code)
    11. Logs - logs are event streams, write logs to a single source and monitor apps
    12. Admin processes - one-off processes that should be decoupled (not part of) from the application. Automated and repeatable. Not manual
- **REST** - Representational State Transfer
    - works on the HTTP protocol but others as well
        - gRPC (a streaming protocol)
    - microservices should provide a contract to its clients, microservices and applications
    - others might need older versions of the service, thus must be alble to roll back to older version
    - clients communicate with servers using HTTPS text based payloads (GET, POST, PUT, DELETE)
        - body of the request is formatted as JSON or XML
        - results returned as JSON, XML, HTML
        - services should add functionality without breaking current clients code. (thus can only add and not delete)
    - resources a identified by URIs (endpoints)
    - RESTful API must be consistent interfaces and can have additional resources (--help)
    - could use caching for a RESTful server
    - **Resource** - accessible through an URI (type of data we want)
        - server returns a **Representation**, json-formatted data which is a collection of items (performance better)or single items of that resource
        - considered as **Batch APIS** ^ 
    - Public-facing or external APIs - use JSON for passing representations between services
    - Internal services use gRPC
- **HTTP requests** - 3 parts: request line, header variables, and request body
    - request line has HTTP verb: GET, POST, PUT, etc.; requested URI and the protocol version
    - header variables contain key value pairs: user agent (client software), metadata about message formats or preferred formats
        - request body contains data to be sent to server for relevant HTTP commands such as POST and PUT
    - HTTP protocol has nine verbs but GET, POST, PUT (create or alter existing data, should be **idempotent** net effect on data is the same even if same request is made multiple times), DELETE are mainly used in RESTful APIs
- **HTTP responses** - returned responses defined by HTTP for a request. 3 parts: response line, header variables, and response body
    - Response line has response codes: 100s = N/A, 200s = Okay (201 = object created), 400 = client request is in error (403 = forbidden, and 404 = resource not found), 500 = internal server encounted error (503 = server not available bc overloaded)
    - Response header is a set of key-value pairs that indicate to the receiver the type of content in the body
        - Response body has the resource representation in JSON, XMl, HTMl, etc.
- **URI rules**:
    - collections use plural and individual resource use singular noun (no action words/verbs)
    - URI is case sensitive, thus consistent naming
- Important to design consistent APIs for services
    - for GCP each service has a REST API
        - functions are in the form of the service(endpoint).collection.verb
        - e.g. GET compute.googleapis.com/compute/v1/projects/{project}/zones/{zone}/instances
            - collections are instances, instanceTemplates, etc.
- **OpenAPI** - industry standard for exposing APIs to clients
    - formats URIs and can help programmers understand services
- **gRPC** = binary protocol that's lightweight for communication between services or instances
    - supports languages and it's easy to implement
    - works on Global Load Balancer, Cloud Endpoints, Kubernetes Engine, other GCP products
- **Cloud Endpoint** - develop, deploy and manage APIs on Google Cloud Backend
    - **Apigee** - API management platform built for enterprises where deployment might be cloud, on-premise or hybrid
    - both services have tools for user auth, security, and monitoring for APIs
# DevOps Automation
- **Continuous Integraion Pipelines** - automate building applications
    - developers check-in code -> run unit tests -> build deployment package (make docker image) -> deploy
    - **Cloud Source Repositories** - push to a central repository of the app they want to deploy
        - managed Git repos and control access with IAM
        - integrated with Cloud Pub/Sub, Cloud Debugger
    - Cloud Build - build system executes steps to make a deployment package or Docker image
        - build software quickly (based off Docker)
        - `gcloud builds submit --tag gcr.io/your-project-id/image-name`
            - must use a docker file if use tag
    - Build Triggers - watches for changes in the Git repo and starts the build
        - build a container when code is pushed to a specific branch
    - Container Registry - store Docker images or deployment packages for deployment
        - Cloud Build images are auto saved can also use the docker command line to push and pull images to Registry
- **Binary Authorization** - service based off Kritis specification
    - must be enabled on a Kubernetes cluster
    - allows that the images being deployed onto containers are trusted
        - prevents images from being deployed with a certain amount of vulnerabilities
- **Infrastructure as Code** - allows infrastructure to be automated which means less mistakes
    - **Terraform** = code to quickly provision and remove infrastructure
    - can be used for Continuous Integration pipeline and deployment
    - Terraform deploys resources in parallel but will consider which ones need to be created first
        - Blocks in Terraform can specify the resource type then give a label/name to that block for later reference
    - Terraform is already installed in GC Shell
        - There is a section for the Terraform Config to output to in the deployment to give information about the infra.
## Lab notes
```bash
# first create a git repo using the Cloud Source service
# use gcloud command to clone git repos
gcloud source repos clone devops-repo

# put the python app into a file
from flask import Flask, render_template, request
app = Flask(__name__)
@app.route("/")
def main():
    model = {"title": "Hello DevOps Fans."}
    return render_template('index.html', model=model)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True, threaded=True)

# add templates for the static pages (html)
# templates/layout.html
<!doctype html>
<html lang="en">
<head>
    <title>{{model.title}}</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        {% block content %}{% endblock %}
        <footer></footer>
    </div>
</body>
</html>

# templates/index.html
{% extends "layout.html" %}
{% block content %}
<div class="jumbotron">
    <div class="container">
        <h1>{{model.title}}</h1>
    </div>
</div>
{% endblock %}

# make a requirements.txt file
# push changes to git repo
# must set config of git config

# to start using docker must make a Docker file
# Dockerfile
# specify the base image
FROM python:3.7

# copy the source code in the current directory into the /app folder
WORKDIR /app
COPY . .

# run commands to install the python libraries
# gunicorn is a web server that will run the app
RUN pip install gunicorn
RUN pip install -r requirements.txt

# set an env variable to run the webserver on port 80
ENV PORT=80
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app

# build the docker image
# then upload it to Container Registry
gcloud builds submit --tag gcr.io/$DEVSHELL_PROJECT_ID/devops-image:v0.1 .

# can use the image deployed to Container Registry to make VMs
# images are located here
gcr.io/<your-project-id-here>/devops-image:v0.1

# can automate builds by making a trigger at the Container Registry page and link it with a git repo
# the trigger will make a new container with the name of the git repo
# create a VM and link that deployment with the trigger-activated container
# the build link will look like
gcr.io/<your-project-id-here>/devops-repo:<container-id>
```
# Choosing Storage Solutions
- multi-region data storage services have more availability with multi-regions than single regions (99.999 v 99.99)
- durability = chances of losing data
    - Cloud Storage = versioning
    - Disks = snapshot jobs
    - SQL = failover server, db server backups
    - Spanner and Firestore = export jobs
- Scale data and read and writes:
    - Bigtable and Spanner scale horizontally by adding more nodes
    - CloudSQL, Memorystore scale vertically by making machines larger
    - Cloud Storage, BigQuery, Firestore scale automatically no limits
- Consistency:
    - Update all copies within one transaction and every gets the latest copy of the data
        - Storage, CloudSQL, Spanner, Firestore
    - Large vol. writes = eventual consistency (not immediate):
        - Bigtable, Memorystore replicas
- Bigtable and Spanner good for storing large amounts only
- CloudStorage cheap but can't run database
- Firestore less expensive but pay for read and writes
- BigQuery is cheap but has no fast access records and pay per query
- Relational DBs:
    - CloudSQL - used for webframeworks: eCommerce. Scales to 30TB MySQL, PosgresSQL servers, fixed schemas
    - Cloud Spanner - used for manufacturing, supply chains, FinTech. scales infinetely for regional or multiregional networks. fixed schema 
- NoSQL:
    - Firestore (Datastore) - mobile, web apps. user profiles, game states. managed document databse. schemaless
    - Cloud Bigtable - heavy read/write events. used for AdTech, Fintech, IoT. scales infinitely, wide-column NoSQL. Schemaless
- Object (binary):
    - Cloud Storage - stores binary object data. used for images, media, backups, videos. infinitely scalable and managed service. schemaless
- Warehouse:
    - BigQuery - enterprise data warehouse. used for analytics, dashboards. managed SQL analysis. fixed schema
- In memory:
    - caching web and media apps, user sessions, game states. Managed Redis DB. Schemaless
- Use Cloud Storage Transfer Service - to scedule backups and data transfers
- Transfer Appliance to transfer large amounts of data
    - fill up a rackable device (an appliance) then ship it to then upload to the Google network
- **NOTE:** Cloud Spanner provides low latency and consistency over the world bc of multi-regional servers
    - Store user preferences, product info, and reviews on Firestore is okay
# Google Cloud and Hybrid Network Architecture
- Google has a global fiber network around the world.
    - there are regions which are geographic locations with zones in them and data centers 
    - PoPs are places where the Google Network is connected to the internet
    - projects can have multiple virtual networks.
        - these networks are collections of regional subnets
    - IP ranges can't overlap
    - Machines in the same VPC can communicate via the internal IP address regardless of the subnet region
        - subnets can be expanded without downtime
- VMs can be attached to many virtual networks using individual interfaces 
- Shared VPC is a network that can be shared with other projects not in the same network 
    - allows for multi project networking and offers better security because policies at controled by the host project that owns the network
- Global load balancer - provides access to services deployed in multiple regions
    - distribute traffic loads to mulitple instance groups
    - one global anycast IP address is used for better DNS look up  
    - use regional load balancer for instances deployed in one region only
- Secure load balancers with SSL with public IP addresses
- **Cloud CDN** - caches static content across the world using Google's edge-caching locations
    - can be used with a HTTP global load balancer
    - the static data can come from VMs, GKE pods, Cloud Storage buckets
- HTTP(S) load balancing is a layer 7 load balancer
    - HTTP and HTTPS including HTTP/2 traffic type
    - supports load balancing for internet facing and internal as well as regional and global
- TCP load balancing provides layer 4 balancing or proxy for applications that use TCP/SSL protocols
    - can configure TCP or SSL proxy
    - Internet facing and internal load balancing and regional and global
- UDP load balancing is for applications that use UDP as a protocol
    - supports internet-facing and internal facing but for regional traffic only
- **Network Intelligence Center** - visualize network topology and test network connectivity service
    - can test source and destination endpoints in VPC networks. VPC network from and to the Internet. VPC network to and from the on-premise networks
- VPC Peering - connect two networks when both projects are in Google Cloud. Doesnt matter which org or project
    - subnet ranges can't overlap
    - firewall rules are independent and still apply for each individual virtual network
    - network admins must approve the peering
- Cloud VPN - connects on-premise network to a VPC network. 
    - Encrypted by one VPN gateway then decrypted by the other VPN gateway (there are always two)
    - good for low vol. data connections.
    - supports site-to-site VPN, static routes, dynamic routes
        - IKEv2 and v2 ciphers
    - to connect need to configure:
        - Cloud VPN gateway, on-premise VPN gateway, and two VPN tunnels
        - the gateways are regional resources that have an external IP address
            - a VPN tunnel connects the two gateways and is a virtual medium where the encrypted data is passed
        - the traffic can only travel when two tunnels are established between gatways going both directions
    - Max Transmission Unit - <1460 bytes because of the encrypted packets
    - for the **High Availability VPN** there are two gateways and two interfaces. Thus there will be either 2 or 4 tunnels.
        - must have dynamic routing
        - also supports specific site-to-site configurations
        - HA VPN to peer VPN gateway topology - has a backup VPN gateway for failover and or maintenance. essentially it connects to two VPN gateway devices
        - HA VPN to AWs peer gateway - can use a virtual private gateway between both virtual networks or a transit gateway
            - transit gateway supports **Equal Cost Multi Path ECMP (equally distributes traffic through all tunnels)**
        - HA VPN to HA VPN gateway between two Google VPC networks. connect the two interfaces between the two HA VPNs to the others
- Cloud Router enables dynamic discovery of routes between two networks that are connected to each other 
    - can be used for VPN tunnels using Border Gateway Protocol (BGP)
    - allows for routes to be updated and exchanged without changing tunnel configs. 
        - advertise/share subnets between the two networks
- Cloud Interconnect - extends on-premise networks to Google networks
    - can use a direction connection (Direct Interconnect) by connecting to a colocation facility. 10-200 gbps speeds
    - or can use a service connection (Partner Interconnect) by having a service provider give access to the Google Network. ~50 mbps speeds
    - Interconnect gives access to VPC resources using internal IP addresses
- Compute Engine good if need control over OS, there is an application that's not in a container
    - the application has a DB server that's self hosted
- Managed Instances - create VMs based off a template
    - defined the containers or boot disk of a VM
    - the Instance group manager creates the VMs
        - can configure health checks, auto healing, multizones availability, scales auto
    - use one or more instance groups as backends for a load balancer
    - backends in multiple regions around globe then use a global load balancers
        - use a Cloud CDN for static content
- Kubernetes Engine (GKE) - provides a managed enviroment/infrastructure for managing and scaling containers 
    - Consists of clusters within it there are VMs
    - Kubernetes provide access to use clusters, deploy apps, set policies and manage health
    - Pods represent a single instance of a running process in a container
        - Pods have one or more containers (Docker) that run services being deployed
    - can run multiple services to the same cluster (optimize)
- Cloud Run allows you to deploy containers to manage Kubernetes clusters
    - services on Cloud Run must be stateless
    - can automate deployment to the clusters
- App Engine designed for microservices
    - Each project can contain one application
        - application can have one or more services
        - each service can be versioned
    - App Engine is the front-end of web and mobile clients
        - the backend of the application is a bunch of services
            - Cloud Storage for images, 
            - Firestore for NoSQL data
            - Cloud SQL for structured data, Memcache for caching queries
            - There is a batch application that generates reports for management
- Cloud Functions - for event-driven microservices
    - activated by Pub/Sub, changes in the DB, webrequests
    - scalable, inexpensive