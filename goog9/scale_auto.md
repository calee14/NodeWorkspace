# Interconnecting Networks
- **Cloud VPN** - connects on-premise network to your GCP VPC Network
    - traffic between networks are encrypted by one gateway and decrypted by the receiving gateway. (safe over public the internet)
    - good for low-vol. data connections
    - 99.9% service availability, dynamic routes, IKEv1 and v2 ciphers
        - dynamic routes are configured by Cloud Router
    - on-premise VPN gateway can be a physical device in data center or an instance from another cloud provider
        - the other gateway is the Cloud VPN gateway
            - "alawys two there are"
        - the VPN gateway has an external IP address
    - must make two VPN tunnels to connect the two VPN gateways
        - each tunnel defines the direction of its respective gateway.
        - **Max Transmission Unit (MTU)** - for the VPN is 1460 bytes bc of encryption of packets
    - Cloud VPN supports static and dynamic routes (IP addresses) but need to configure **Cloud Router**
        - Router uses **Border Gateway Protocol (BGP)** - allows routes to be updated and exchanged without changing tunnet information
        - BGPs must have their own IP addresses in the range 169.254.0.0/16 but they are not part of any networks and used for BGPs only.
            - BGP connects between the two gateways to exchange new subnets or routes which will allow the instances in the subnets to communicate 
## Lab notes
```bash
# need to reserve IP addresses for the VPN gateway
gcloud compute addresses create vpn-1-static-ip --project=qwiklabs-gcp-04-c262c3eb995e --region=us-central1
gcloud compute addresses create vpn-1-static-ip --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1

# sample of making a tunnel from one gateway IP to the next one
gcloud compute target-vpn-gateways create vpn-2 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --network=vpn-network-2 && gcloud compute forwarding-rules create vpn-2-rule-esp --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=ESP --target-vpn-gateway=vpn-2 && gcloud compute forwarding-rules create vpn-2-rule-udp500 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=UDP --ports=500 --target-vpn-gateway=vpn-2 && gcloud compute forwarding-rules create vpn-2-rule-udp4500 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=UDP --ports=4500 --target-vpn-gateway=vpn-2 && gcloud compute vpn-tunnels create tunnel2to1 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --peer-address=35.202.226.9 --shared-secret=gcprocks --ike-version=2 --local-traffic-selector=0.0.0.0/0 --remote-traffic-selector=0.0.0.0/0 --target-vpn-gateway=vpn-2 && gcloud compute routes create tunnel2to1-route-1 --project=qwiklabs-gcp-04-c262c3eb995e --network=vpn-network-2 --priority=1000 --destination-range=10.5.4.0/24 --next-hop-vpn-tunnel=tunnel2to1 --next-hop-vpn-tunnel-region=europe-west1

# created two different VM instances in two different VPC networks and in their own subnet within the respective VPC networks
# firewall rules have been configured to allow ssh and icmp connections
# without the VPN can only ping the other VM instance through the www internet
# pinging requires two tunnels to be established. one going to the target and one from the target coming back
# good to use tunnels to make connections between networks and instances bc relying on one single tunnel (external IP addresses) might be a source for failure

# we need to reserve static IP addresses on each network for the VPN gateways
# need to specify the subnet/region they are in
# then we create the VPN gateway for a VPC network. make sure to give the IP address of reserved static IP for the gateway
# also make a tunnel from the current VPN gateway to the other, so must give the other networks VPN gateway reserved IP
# must create a key for encryption. specify the IP ranges between the gateway. also specify that the gateway will be route-based
# NOTE: the IP ranges is specified by the /24 but the main IP address is given by the 'internal IP/subnet IP addresses' of the other VM instance in the 'other network'
```
- **Cloud Interconnect and Peering** - many different services available to connect current infrastructure to Google's network
    - Dedicated connections are a direct connection to Google's network
        - Layer 2 (uses VLAN): pipes directly into GCP env. giving access to internal IP addresses.
        - Layer 3: gives access to G Suite services, Youtube, Google Cloud APIs with public IP addresses
            - good to use Cloud VPN
- **Dedicated _Interconnect_** provides direct physical connections to Google Cloud
    - enables you to transfer a lot of data between instances without spending more on bandwidth over the public internet
    - to use dedicated interconnect must establish 
    - **cross-connect** between router (from on premise) and google network. 
        - this cross-connections must happen in a subnet/zone that is shared between the networks
    - for the routes to be exchanged through the interconnect it uses **BGP** (have to install and start a sesssion) to auto. update routes between networks
    - To have a dedicated interconnect connection the on-premis network must meet Google's networks at a **Colocation facility**
- If your on-premise network doesn't meet at network then use **Partner Interconnect**
    - some service-providers have physcial connections to Google's network
    - pay the service provider to give that access
- **Comparing the Interconnect options:**
    - IPsec VPN tunnel can work with an on-premise machine. 1.5-3 gbps
    - Dedicated Interconnect requires connection to a colocation facility. 10 gbps
    - Partner interconnect requires to get access to network over service provider. 50 mbps - 10 gbps
- **Direct Peering** - when company needs access to Google Cloud properties
    - allows companies to reach Google Workspace services through a public IP address
    - Must access them through an **Edge Point of Prescence (where google networks connect with the rest of the internet)**
- **Carrier Peering** - same as direct peering but go through a service provider to access Googe's networks and services
    - main differences between direct and carrier is throughput, network capacity
- **Shared (good for centralized projects)** allows an organization to connect resources from multi projects to a 'common' VPC network
    - that way these projects can use internal IP addresses to securely communicate
    - there's a **host project** that allows for connection/communication with clients externally, outside the netowrk
        - then the other projects are service projects that are connected to the host project on a shared *VPC network*. Thus the projects communicate with the host project internally so there is no way to get to the service projects
- **VPC peering (better for decentralized projects)** - allows private RFC 1918 connections between two VPC networks
    - doesn't matter if the services are in the same project or organization
    - establish peering connctions to allow two organizations to communicate privately with each other's projects compute engines using internal IP addresses
        - it also exchanges routes to connect to the specific subnets and then the compute instances
    - however, each VPC network is dependent on the network's admin and the firewall rules they set up and their routing tables
        - might use VPNs or external IP address, however less security, more cost, and more network latency.
# Load Balancing and Autoscaling
- **Managed instance groups** - collection of identical VM instances that act as a single entity
    - specify a new template to update all instances with an update
    - easily scalable (automatically) for instances in the group
    - _Regional managed instance groups_ is recommended over zonal ones because you can manage an group over multiple zones rather than just one
        - Good for zonal failure. can if there is an unpredicted shutdown the app can still serve from another zone using load balacing services
    - must make an compute engine instance template then the group manager populates the template to the group
    - use instance groups for stateless server or batch workloads such as website frontend or image processing.
    - can also user for stateful apps such as dataabses
- Managed instance groups have autoscale based on increase or decrease in workloads and health check capabilities
    -  will add or remove instances to fit workload target specified in template
        - good for reducing costs
        - based on CPU usage, load-balancing, Pub/Sub queues, monitoring metrics
    - **Health Check** - feature with managed instance groups, which checks status of instances.
        - Response times, success/failure ratio
- **HTTPS Load Balancing** - app layer that handles message content, which allows routing decisions based on the message's URL
    - gives **global load balancing** for HTTPS requests whose destination is for project's VM instances
    - Thus, apps are available at a _single_ Anycast IP address, which simplies DNS
    - HTTPS load balancing balances traffic to different types of requests to multiple backends instances from multiple regions
        - HTTP req. are load balanced on port 80 or 8080.
        - HTTPS req. are load balanced on port 443
        - supports IPv4 and IPv6, is scalable, _no prewarming is needed_
        - has content-based and cross regional load balancing
    - specify URL maps that route some URls to one set of instances and another to a different set
    - requests are set to the closest instance group
- Steps of a HTTPS load balancer:
    - incoming requests from the internet get redirected by the global forwarding rule to a HTTP proxy
    - the target HTTP proxy checks each reqest against a URL map to determine the backend service for the request
    - For example: www.ex.com/audio and www.ex.com/video can point to two different **back-end services** which do different things
        - healthy back-end services can receive new requests while non-healthy can't
        - *back-end services* direct requests to the appropriate backend based on bandwidth of a zone and instance
            - these back-end services might contain more **backends (in this case, instance groups** along with a health check and time-out setting
    - Round Robin algorithm to distribute requests among available instances
        - However, use Session Affinity to send rqeuests from the same client to the same VM instance that handled prev. req.
    - Backends in a Backend service have **balancing modes** to tell the load-balancer when its "full"
        - load-balancing mode can be based off CPU utilization
    - If requests for a back-end service in a region is full then it will go to the nearest available serving region
- Indepth example of how HTTP Load Balancer works:
    - requests incoming can be from US or from Europe.
    - The *global fowarding rule* directs requests to a target HTTP proxy
    - the HTTP proxy checks a *URL map* to direct the request to the correct *backend service*
        - a *backend servce* can have several *backend instances* in different regions i.e. us-central, eur-west
            - each *backend instance* is actually an instance group
        - the *load-balancer* konws the IP of the user request and can pinpoint the origin. it also knows the capacity and usage of the instance groups
            - so it can foward the request to the closest instance group
- **Cross-region load balancing** = requests are directed to instance groups and regions that are closest to the origin.
- **Content-paste load balancing** = two seperate backend services that are split by the load balancer depending on the URL header. For example: /video the traffic is sent to the backend video service and for everything else is sent to the web server
    - This can all be achieved with a **single global IP address**. Same for cross-region load balancing
- **HTTPS load balancer** - same structure as HTTP load balancer but differs in some ways
    - it has a HTTPS proxy instead of HTTP proxy
        - this HTTPS proxy requires at least one signed SSL certificate installed on the target HTTPS proxy for the load balancer
        - Client SSL sessions terminate at the load balancer
        - HTTPS load balancers support the quick transport layer protocol
    - **QUIC** is a transport layer that allows for faster client connection initiation, removes head-of-line blocking in multiplex streams, and supports conenction migration when a client's IP address changes
    - SSL certificates are only used with load balancing proxies such as HTTPS or SSL proxies.
    - like a HTTP load balancer, HTTPS load balancers have a URL map to direct traffic to back-end services or buckets
- **Network Endpoint Group (NEG)** - configuration object that specifies a group of back-end services (aka. endpoints)
    - usually config is deployed in containers
        - used for distributing traffic to applications running on back-end instances
        - works for load balancers and Traffic Director
    - Zonal and Internet NEGs define how endpoints should be reached, if possible and where they are located
        - these 'endpoints' are VM instances or service running on VMs
            - an 'endpoint' must have an IP address or IP address/Port combination
## Lab notes
```bash
# load-balancing is implemented at the 'edge' of Google's network. The edge consists of points of presence (PoP). 
# Traffic directed to an HTTPS load balancer is sent to a PoP closest to the user then load balanced to a backend service in the Google network

# create a firewall rule that allows ingress connections from the load balancer to make health checks. tags usually placed on VMs and other instances
# health check probes will come from the IP ranges 130.211.0.0/22 and 35.191.0.0/16.
# NOTE: tcp port 80 is for HTTP
gcloud compute --project=qwiklabs-gcp-02-57a1059d7e1a firewall-rules create fw-allow-health-checks --direction=INGRESS --priority=1000 --network=default --action=ALLOW --rules=tcp:80 --source-ranges=130.211.0.0/22,35.191.0.0/16 --target-tags=allow-health-checks

# the VM backend instances will not be connected to the open internet so no external IP address
# To connect to the open internet and Google services, use Cloud NAT, a gateway/instance of Cloud Router
# this allows a VM to make outbound traffic and receive external/inbound traffic from the load balancer

# need to make an image of a VM by copying the contents of the boot disk (contains a VM's OS and storage data)
# the VM needs to have a tag to apply the firewall rule so that it will allow ingress connections from the Cloud Router/NAT

# make a VM with no external IP address and allows for health checks and keeps boot disk when deleted
gcloud compute instances create webserver --project=qwiklabs-gcp-02-57a1059d7e1a --zone=us-central1-a --machine-type=e2-medium --network-interface=subnet=default,no-address --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=802151231183-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=allow-health-checks --create-disk=boot=yes,device-name=webserver,image=projects/debian-cloud/global/images/debian-10-buster-v20220621,mode=rw,size=10,type=projects/qwiklabs-gcp-02-57a1059d7e1a/zones/us-central1-a/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any

# the VM will run Apache2 the webserver software for HTTP
sudo apt-get update
sudo apt-get install -y apache2
# start the apache2 server
sudo service apache2 start
# start the apache2 server whenever the VM boots
sudo update-rc.d apache2 enable

# be sure to save the VMs boot disk
# create a compute engine image from the boot disk that we installed Apache on
gcloud compute images create mywebserver --project=qwiklabs-gcp-02-57a1059d7e1a --source-disk=webserver --source-disk-zone=us-central1-a --storage-location=us

# create an instance template from the boot disk we created earlier
gcloud compute instance-templates create mywebserver-template --project=qwiklabs-gcp-02-57a1059d7e1a --machine-type=f1-micro --network-interface=network=default,no-address --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=802151231183-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --tags=allow-health-checks --create-disk=auto-delete=yes,boot=yes,device-name=mywebserver-template,image=projects/qwiklabs-gcp-02-57a1059d7e1a/global/images/mywebserver,mode=rw,size=10,type=pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any

# make an instance group based off a instance template we created earlier
# have the group auto scale and configure the metrics and health checks
# create two groups in different regions
gcloud beta compute health-checks create tcp http-health-check --project=qwiklabs-gcp-02-57a1059d7e1a --port=80 --proxy-header=NONE --no-enable-logging --check-interval=5 --timeout=5 --unhealthy-threshold=2 --healthy-threshold=2

gcloud beta compute instance-groups managed create us-central1-mig --project=qwiklabs-gcp-02-57a1059d7e1a --base-instance-name=us-central1-mig --size=1 --template=mywebserver-template --zones=us-central1-c,us-central1-f,us-central1-b --target-distribution-shape=EVEN --health-check=http-health-check --initial-delay=60

gcloud beta compute instance-groups managed set-autoscaling us-central1-mig --project=qwiklabs-gcp-02-57a1059d7e1a --region=us-central1 --cool-down-period=60 --max-num-replicas=2 --min-num-replicas=1 --mode=on --target-load-balancing-utilization=0.8

# create a load balancer and configure it to direct internet to VMs or serverless service
# make it a global HTTP loadbalancer
# specify the backend services for the load balancer

# configure the front end to define path rules to determine where the traffic will be directed
# some traffic can go to one backend server based on the URL paths
# NOTE: IPv6 requests are terminated at the global load balancing layer then proxied over IPv4 to backends
# IPv6 addresses are in hexadecimal format

# check if the load balancer is working
LB_IP=[LB_IP_v4]
while [ -z "$RESULT" ] ; 
do 
  echo "Waiting for Load Balancer";
  sleep 5;
  RESULT=$(curl -m1 -s $LB_IP | grep Apache);
done
# stress test the link from an adobe server
ab -n 500000 -c 1000 http://$LB_IP/
```
- **SSL proxy load balancing** - global load balancing service for encrypted non-HTTP traffic
    - terminates user SSL connections at the load balancing layer (proxy), then balances (creates a new) connections to the instance groups using SSL or TCP protocols. (SSL is recommended)
    - has intelligent routing, certificate management, security patching and SSL policies
        - intelligent routing = route requests to backends where there is capacity
        - GCP auto apply patches for SSL or TCP stack updates
- **TCP Proxy load balancing** - global load balancing service for unencrypted, non-HTTP traffic
    - like SSL, the TCP connection terminates at the load balancing layer (proxy) then directs the traffic to the VMs using SSL or TCP.
        - SSL recommended when traffic is being sent from proxy to instance groups (VMs)
        - a lot of the same features and security of the SSL proxy
- **Network Load Balancing** - regional, non-proxied load balancing service
    - all traffic is passed through the load balancer instead of being proxied
    - can only be balanced with VM instances in the same region
        - not a global load balancer
    - uses forwarding rules to balance traffic based on teh IP protocol data, such as address, port, and protocol type
        - protocol types such as UDP, TCP, SSL traffic
        - good for traffic that run on ports not supported by TCP and SSL proxy load balancers
    - backend service-based architecture:
        - supports non-legacy health checks, TCP, SSL, HTTP, HTTPS and HTTP/2 autoscaling with instance groups, connection draining and failover policy.
    - **target pool-based architechture**:
        - a group of instances that receive traffic from forwarding rules.
        - when traffic is sent to a target pool, the load balancer chooses an instance from the target pool based on an applied hash on the source IP address, port, and destination IP address and port
        - all instances in a pool must be in the same region, which is the same for the network load balancer
- **Internal TCP/UDP load balancing** - regional private load balancing for TCP and UDP-based traffic
    - run and scale services behind a private load balancing IP address. load balancer only accessible through instances with internal IP addresses or VMs in the same region
    - thus the internal TCP/UDP load balancer is a front end to the private backend services
        - another benefit is that load balanced traffic stays inside the VPC network and region and there is lower latency
    - Internal load balancing is software-defined and doesn't need an IP address to host the load balancing instance
        - instead of terminating the request at the external load balancer, the internal load balancer directly delivers the traffic from the client to the backend service
            - uses the Andromeda software to accomplish this
    - The internal load balancer is proxy-based and regional. It enables one to run and scale services behind an internal load balancing IP address
        - the backend services can use HTTP, HTTPS, HTTP/2 protocols
    - After the internal load balancer has been configured, it uses **Envoy proxies** to direct traffic  
    - Internal load balancing is good for the **3-tier model**
        - none of the database or applicaion models will be exposed externally
        - There is a public HTTPS Load Balancer
            - traffic gets routed to the backend services located in multiple regions, which is a manged instance group
                - the backend services access an internal load balancer which contain the application or internal tier of services
## Lab notes
```bash
# Internal Load Balancer is located within a region
# lets users hide and scale services behind a private load balancer that is only accessible to internal VMs

# allow internal traffic connectivity from sources in the 10.10.0.0/16. thus internal instances can accept connections from other instances in that subnet range
gcloud compute --project=qwiklabs-gcp-03-be9430baa81f firewall-rules create fw-allow-lb-access --direction=INGRESS --priority=1000 --network=my-internal-app --action=ALLOW --rules=all --source-ranges=10.10.0.0/16 --target-tags=backend-service

# make a firewall rule that allow instances that the rule applies to, to accept connections from IPs 130.211.0.0/22,35.191.0.0/16. 
# This is the address where the health checkers will probe for the status and health of instance groups
gcloud compute --project=qwiklabs-gcp-03-be9430baa81f firewall-rules create fw-allow-health-checks --direction=INGRESS --priority=1000 --network=my-internal-app --action=ALLOW --rules=tcp:80 --source-ranges=130.211.0.0/22,35.191.0.0/16 --target-tags=backend-service

# neet to make a Clout NAT router to hide backend services behind. 
# this allows the backend servies to receive and make connections with the internet

# instance template for a specific subnet and region
# we will use the templates to make instance groups
# add the backend-service tag to the template so the firewall rules apply (allow traffic from instances in the subnet)
# the health check is also applied here;
gcloud compute instance-templates create instance-template-1 --project=qwiklabs-gcp-03-be9430baa81f --machine-type=f1-micro --network-interface=subnet=subnet-a,no-address --metadata=startup-script-url=gs://cloud-training/gcpnet/ilb/startup.sh,enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=758812653406-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --region=us-central1 --tags=backend-service --create-disk=auto-delete=yes,boot=yes,device-name=instance-template-1,image=projects/debian-cloud/global/images/debian-11-bullseye-v20220621,mode=rw,size=10,type=pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any

# make an instance group from templates
# auto scale is enabled here. need to define the scaling policy based on the workload
# need to make an instance group for each subnet which is specified in the two templates we made
gcloud compute instance-groups managed create instance-group-2 --project=qwiklabs-gcp-03-be9430baa81f --base-instance-name=instance-group-2 --size=1 --template=instance-template-2 --zone=us-central1-b

gcloud beta compute instance-groups managed set-autoscaling instance-group-2 --project=qwiklabs-gcp-03-be9430baa81f --zone=us-central1-b --cool-down-period=45 --max-num-replicas=5 --min-num-replicas=1 --mode=on --target-cpu-utilization=0.8

# we have another utility vm that would ping the load balancer which would direct the traffic to the backend service (instance groups)

# Server Location and Server Hostname will give information about the location of the backend we're using

# An internal load balancer directs traffic only between VMs.
# We configure it to balance the traffic bewteen the two instance groups in different zones but same region
# add the instance groups as backends and configure health checks
# make a frontend IP address for the load balancer in the subnet we want to
# if we ping the load balancer's internal IP then it will balance the requests
```
- Choosing the right load balancer:
    - GCP load balancers support IPV6 clients, specifically HTTPS, SSL, TCP proxy load balancers
        - this means that the balancers can accept IPv6 requests and proxy them over to IPv4
    - load balancer acts as a **reverse proxy** - termiantes the IPv6 client connection at proxy then makes a new request through an IPv4 connection to the backend services
        - once the backend makes the IPv4 response, the load balancer makes a IPv6 connection back to the original client
    - If the load balancer must be external then consider:
        - HTTP or HTTPS traffic (HTTPS should be used as a **layer 7** load balancer = smart load balancer with more encryption and makes two connections from client to server)
        - TCP and UDP proxy networks for other traffic
    - If regional then consider:
        - Network TCP/UDP
        - Internal TCP/UDP
        - Internal HTTP(S)
- **NOTE:** - CPU utilization, Load Balancing Capacity Monitoring Metrics, Queue-based workloads can be policies for managed instance groups
# Infrastructure Automation
- Google Cloud Console if the service is new and prefer the UI.
- Google Cloud Shell if user knows the specific service well and need to make resources quickly from the command line.
- **Terraform** = infrastructure as code
    - allows for quickly provisioning and removing infrastructure
    - on-demand provisioning of deployment is powerful
        - can be used into Continuous Integration pipeline
        - Deployment complexity is managed in code.
    - modularized using templates = abstraction of resources into resusable components
    - supports IaC tools like Chef, Puppet, Ansible, Packer
    - Use configuration files to declare sources needed such as VMs, containers, Storage and Networking
        - **HashiCorp Configuration Language (HCL)** = concise description of blocks, arguments and expressions
    - Specify a set of resources that would compose the application or service
        - allows one to focus more on the code
        - Terraform uses APIs of GCP to deploy resources
    - Terraform language includes blocks that represent objects that can have labels
        - inside objects are arguments that assign values to properties of the object i.e. name, expressions
    - Example code with terraform. Make a auto network with a firewall rule
        - the .tf file is like a blue print for the desired state of infrastructure
    ```terraform
    main.tf
    provider "google" {
    }
    # [START vpc_auto_create]
    resource "google_compute_network" "vpc_network" {
        project = <actual project>
        name = "auto-mode-net"
        auto_create_subnetworks = true
        mtu = 1460
    }
    # [START vpc_firewall_create]
    resource "google_compute_firewall" "rules" {
        project = <actual project>
        name = "my-firewall-rule"
        network = "vpc_network"
            allow {
                protocol = "tcp"
                ports = ["80", "8080"]
            }
    }
    ```
    - the main.tf file specifies what resources we want to create
        - use the `terraform init` command to make sure Google provider plug-ins are installed
        - `terraform plan` = command to refresh resources unless it is disabled
        - `terraform apply` creates the infrastructure defined in the file
## Lab notes
```t
'''
/provider.tf
'''
# specify the provider of our infrastructure
provider "google" {}

# running terraform init will install the plugins for our Google provider
'''
/mynetwork.tf
'''
# Create the mynetwork network
resource "google_compute_network" "mynetwork" {
name = "mynetwork"
#RESOURCE properties go here
auto_create_subnetworks = true
}

# Add a firewall rule to allow HTTP, SSH, RDP and ICMP traffic on mynetwork
# give resource variable name 'mynetwork' when intialize
resource "google_compute_firewall" "mynetwork" {
name = "mynetwork-allow-http-ssh-rdp-icmp"
#RESOURCE properties go here
network = google_compute_network.mynetwork.self_link
allow {
    protocol = "tcp"
    ports    = ["22", "80", "3389"]
    }
allow {
    protocol = "icmp"
    }
source_ranges = ["0.0.0.0/0"]
}

# Create the mynet-us-vm instance
# link it to the network we previously created
# this also generates an order in which the resources need to be created
module "mynet-us-vm" {
  source           = "./instance"
  instance_name    = "mynet-us-vm"
  instance_zone    = "us-central1-a"
  instance_network = google_compute_network.mynetwork.self_link
}
# Create the mynet-eu-vm" instance
module "mynet-eu-vm" {
  source           = "./instance"
  instance_name    = "mynet-eu-vm"
  instance_zone    = "europe-west1-d"
  instance_network = google_compute_network.mynetwork.self_link
}

'''
instance/main.tf
'''
# modularize the VM instance by having variables that come from input
# whoever calls the module will have to provide the values for variables
variable "instance_name" {}
variable "instance_zone" {}
variable "instance_type" {
     # default value means that it is not required when instantiating module
    default = "n1-standard-1"
}
variable "instance_network" {}

resource "google_compute_instance" "vm_instance" {
    name = "${var.instance_name}"
    #RESOURCE properties go here
    zone         = "${var.instance_zone}"
    machine_type = "${var.instance_type}"
    boot_disk {
        initialize_params {
        image = "debian-cloud/debian-9"
        }
    }
    network_interface {
        network = "${var.instance_network}"
        # an empty access_config means that the instance will get an
        # ephemeral external IP address. For internal IP addresses remove
        # access_config from the object
        access_config {
            # Allocate a one-to-one NAT IP to the instance
        }
    }
}

# run terraform fmt to reformat the files
# terraform init again to install the plugins for the new files
# terraform plan and then terraform apply to execute
```
- **Google Cloud Marketplace** = quickly deploy software packages that run on GC
    - pre-created configurations based on Terraform
        - can easily deploy them for project and scale them
    - automatically fixed with updates
# Managed Services
- Google or third-parties offer services
- **Big Query** - serverless, scalable, and cost effective data warehouse
    - quickly dive into data analytics without admin and settign up resources
    - scales up to petabytes of data in the warehouse
        - fast queries as well
    - run queries in Cloud Console or with APIs
- **Cloud Dataflow** - transforms and enriches data from a stream or batches
    - infrastructure is handled in the service
    - the data pipeline can handle millions of queries per second
    - can use SQL, JAVA, Python through APIs for pipeline development
    - Connects with Stackdriver for monitoring of pipelines and the quality of the data going through pipeline
    - Streamed data can come from Cloud Datastore or Cloud Pub/Sub
    - After transforming the data one can analyze it in BigQuery, AI Platform, or Cloud Bigtable
- **Dataprep** - service for visually exploring, cleaning and preparing structured and unstructured data for analysis and ML
    - it's serverless and works at any scale (no need to provision instances)
    - No need to write code for data transformation
    - the service is partnered with Trifacta for their data-prep solution
- **Dataproc** - service to run Apache Spark or Apache Hadoop clusters
    - built-in integration with BigQuery, Cloud Storage, Bigtable, Stackdriver
    - Quick start up times so quickly work with data
    - Dataflow automatically provisions clusters
        - Dataproc manually have to set up clusters but bootup time is fast
    - Integrates with Spark or Hadoop to run jobs for data processing in parallel with worker nodes 