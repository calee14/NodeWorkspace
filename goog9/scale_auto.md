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
    - like a HTTP load balancer, HTTPS load balancershave a URL map to direct traffic to back-end services or buckets
- **Network Endpoint Group (NEG)** - configuration object that specifies a group of back-end services (aka. endpoints)
    - usually config is deployed in containers
        - used for distributing traffic to applications running on back-end instances
        - works for load balancers and Traffic Director
    - Zonal and Internet NEGs define how endpoints should be reached, if possible and where they are located
        - these 'endpoints' are VM instances or service running on VMs
            - an 'endpoint' must have an IP address or IP address/Port combination