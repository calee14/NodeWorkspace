# Interacting with Google Cloud
- use console to list gcp vms in project
    - `gcloud compute instances list`
- **Cloud Shell** features:
    - **temp** Compute Engine VM
    - command-line access through browser
    - 5 gb of space in vm
    - gcloud: for working with Compute Engine and many Google Cloud services
    - gsutil: for working with Cloud Storage
    - kubectl: for working with Google Kubernetes Engine and Kubernetes
    - bq: for working with BigQuery
    - Language support for Java, Go, Python, Node.js, PHP, and Ruby
    - Built-in authorization for access to resources and instances
## Lab notes
```bash
# make a bucket in cloud storage but the name has to be globally unique in GCP (the id of the project is globally unique)
gsutil mb gs://<BUCKET_NAME>

# use the google cloud storage cli to cp files in the local shell to the bucket
gsutil cp [MY_FILE] gs://[BUCKET_NAME]

# list regions in our google cloud 
gcloud compute regions list

# use the source command make enviroment variables from the config file
source infraclass/config
echo $INFRACLASS_PROJECT_ID

# if we write to our shell .profile we can auto load the env variables when the shell starts. This will be persistent
source infraclass/config
```
- **Google Cloud Marketplace** uses **Deployment manager** and templates to quickly deploy software packages
    - Can connect to the Jenkins software through secure shell bc the software was installed in the VM
## Lab notes
```bash
# stop running processes in a deployment cluster
sudo /opt/bitnami/ctlscript.sh stop

# restart those processes in a deploymenbt cluster
sudo /opt/bitnami/ctlscript.sh restart
```
# Virtual Networks
- Google has a lot of **regions (Goog's datacenters)** and **Edge Points of Prescence (PoPs)**
    - The fiber lines that connect these regions and PoPs are the **network**
- **Virtual Private Cloud** - encapsulates projects and the networking services of the machine at Goog's data cetner
- VPC Objects:
- **Projects** - associate objects and services with billing. 
    - Contains entire networks (default up to 5)
- **Networks** - no IP address ranges
    - It's global and spans all regions in the world simultaneously
    - segregate resources through **subnetworks**
    - Every **project** has a main, default network.
    - **Default Mode:**
        - there is a **subnet for each region**
        - regional IP allocation and fixed IP ranges `/20` for a subnet.
    - **Custom Mode:** (can come from auto but not the other way around)
        - no default subnets
        - custom regional IP ranges
        - recommended for Production to be in custom because IP ranges may overlap if they are automatically created.
    - VMs on the same network can communicate through the **interal IPs** despite being in **diff regions**
        - Conversely, VMs on diff networks must use **external IPs** despite being in **same regions**
            - However, the traffic doesn't reach the public internet and goes through the **Google Router**
            - Since VPCs are global even if we have two VMs in two **diff regions (subnets)** we can still connect them through google's private network (**Google Router**)
    - VMs can be on the same subnet but different zones
        - Subnetworks can extend **across zones in a region**
        - **Subnets** = IP address range that can be used for compute instances in a region
            - the first two IP addresses in a subnet are for the IP addi of the subnet itself and the gateway of the subnet
                - There are four IP address reserved. the first and last two
            - A **single firewall rule** can be applied to all VMs in a subnet despite being in diff zones.
        - Can expand subnets but not overlap with other subnets. Can only expand*, no shrinking
            - In **auto mode** subnets can be expanded from **`/20` to `/16` (these specify the amount of available IP addresses for machines in the subnet)**
    - See notebook for how these networks and subnets are set up
- **IP addresses** - each virtual machine can have two **IP addresses**
    - **Internal IPs** - VMs name registered with network DNS make an internal IP
    - **External IP** - its _optional_. but its assigned from a pool (**Ephremeral** = ip address that dies when the instance it's linked to dies; can't be reused)
        - the external IP isn't known by the VM
            - the external IP address is mapped to the VM by the VPC
    - mapping IP addresses: internal IP based off instance VM name. 
        - deleting and restarting the instance might change the internal IP address
        - However, the DNS will point to the specific instance not IP
    - The **DNS resolver** will have a look up table that matches external lookup addresses with the internal addresses of the interal instances
    - **Cloud DNS** - scalable domain name system that translates domain names into ip addresses.
    - **Alias IP Range** - assign a range of internal IP addresses as an alias to a VMs network interface
        - good if you have multiple services on a VM and you want to assign a diff IP address to each service. 
            - Good if you have multiple containers or applications (flask, node.js) running on the same VM
- **Routes** - networks have routes that lets instances in the network to send traffic directly to each other. 
    - There is also a **default route** that directs packets to destinations outside the network
    - However, the **firewall** rules must allow these packets
    - Routes match packets by destination IP addresses, but the traffic must match the firewall rule
        - A route is created when a network and/or subnet is created. this allows VMs in the same network to communicate
- **Firewall** protect VM instances from unapproved connections
    - connections are allowed or denied at the compute instance level. 
    - **Firewall rules are stateful** so once the first connection is approved any subsequent traffic from that connection is allowed. 
    - **ingress (incoming connections)** vs. **egress (exiting connections)**
        - no Firewall rules?? default is deny all ingress and allow all egress
    - Parameters of a Firewall rule:
        - `direciton`, `source or destination`, `protocol` and `port`, `action`, `priority`, `rule assignment`
    - **Egress Firewall rules** - allow rules: allow connections that match ports and addresses. deny rules: block matching non-permitted ports and addresses.
        - protect against connecting to undesired connections externally
    - **Ingress Firewall rules** - allow rules: allow connections with permitted addresses and ports. deny rules: block connections with contections with undesired ports and addresses. 
        - protect against connecting to undesired connections externally
# Lab notes
```bash
"""
Every VM in a VPC needs a network that's why there is a default one which is on 'auto' mode. These nets and 'subnets' are virtualized in Google's datacenters and connected through the Global Wide Area Network (WAN)
There is one Route for each network and one for each subnet. These Routes tell VMs and the VPC network how to send packets/traffic to a destrination, an address inside or outside Google Cloud.
Common Firewall rules that sit between instances in a network are the Ingress rules. These rules are allow icmp, rdp, ssh and internal. ICMP (Internet Control Message Protocol = used for network diagnostics e.g. 'ping'). RDP (Remote Desktop Protocol = for controlling computers remotely). SSH (Seccure Shell = allows two computers to communicate for remote login and commandline execution). The Internal rule is for the regional internal communication e.g.: TCP, UDP, and ICM.
"""
# shell command to make a new custom mode network for a project
gcloud compute networks create managementnet --project=qwiklabs-gcp-00-0dc303e69700 --subnet-mode=custom --mtu=1460 --bgp-routing-mode=regional 

# shell command to create a subnet with IP range and a region
gcloud compute networks subnets create managementsubnet-us --project=qwiklabs-gcp-00-0dc303e69700 --range=10.130.0.0/20 --stack-type=IPV4_ONLY --network=managementnet --region=us-central1

# command to make a firewall rule for a network ingress connections
gcloud compute --project=qwiklabs-gcp-00-0dc303e69700 firewall-rules create managementnet-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=managementnet --action=ALLOW --rules=tcp:22,tcp:3389,icmp --source-ranges=0.0.0.0/0

# equivalent commandline for making a vm connecting to network and subnet
gcloud compute instances create managementnet-us-vm --project=qwiklabs-gcp-00-0dc303e69700 --zone=us-central1-c --machine-type=f1-micro --network-interface=network-tier=PREMIUM,subnet=managementsubnet-us --metadata=enable-oslogin=true --maintenance-policy=MIGRATE --provisioning-model=STANDARD --service-account=1069817479610-compute@developer.gserviceaccount.com --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append --create-disk=auto-delete=yes,boot=yes,device-name=managementnet-us-vm,image=projects/debian-cloud/global/images/debian-10-buster-v20220621,mode=rw,size=10,type=projects/qwiklabs-gcp-00-0dc303e69700/zones/us-central1-c/diskTypes/pd-balanced --no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring --reservation-affinity=any

# create a custom network in VPC
gcloud compute networks create privatenet --subnet-mode=custom

# make a subnet in a region for a network
gcloud compute networks subnets create privatesubnet-us --network=privatenet --region=us-central1 --range=172.16.0.0/24

# make a subnet in a diff region for a network
gcloud compute networks subnets create privatesubnet-eu --network=privatenet --region=europe-west1 --range=172.20.0.0/20

# display all networks in proj
gcloud compute networks list

# show all subnets
gcloud compute networks subnets list --sort-by=NETWORK

"""
create a firewall rule that's ingress for a network. the 0.0.0.0/0 is the default internet
gateway or traffic from anyway in the network (the internet)
"""
gcloud compute firewall-rules create privatenet-allow-icmp-ssh-rdp --direction=INGRESS --priority=1000 --network=privatenet --action=ALLOW --rules=icmp,tcp:22,tcp:3389 --source-ranges=0.0.0.0/0

# create a vm instance that will go to a region within the specificied subnet
gcloud compute instances create privatenet-us-vm --zone=us-central1-c --machine-type=f1-micro --subnet=privatesubnet-us --image-family=debian-10 --image-project=debian-cloud --boot-disk-size=10GB --boot-disk-type=pd-standard --boot-disk-device-name=privatenet-us-vm

# list all vm instances in a project
gcloud compute instances list --sort-by=ZONE

"""
VM instances in the same network can ping and communicate with each other using internal addresses and network protocols
VM instances that are outside of each others network need to use the external IP address
However, VM instances in the same project but different network can communicate with each other through VPC Peering or VPNs.
NOTE: VPCs are private virtual networks
"""
ping -c 3 <Enter mynet-eu-vms external IP here>
```