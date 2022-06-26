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
- **Common Networking Designs:**
    - If need to **increase availability in a region** then put two VMs in DIFFERENT zones but SAME subnet
        - This allows for more availability and less additional security complexity
        - Also helps with isolation of infrastructure incase of software failure
    - **Globalization** with multiple regions
        - putting instances in different regions further improves isolation and helps with **robust** systems when there is failure.
        - Use the **Global HTTP(s) Load Balancer** to route traffic to the region that is closest to the user
    - Only assign Internal IP addresses to VM instances
    - **Cloud NAT (Network Address Translation)** - provision app instances without public IP addresses while also allowing the instances access the internet
        - There is an **Outbound** NAT that allows it to access an update server.
        - The Cloud NAT blocks any inbound hosts that want to have access to the server. 
    - Enable **Private Google Access** to allow VMs with internal IPs to access external IPs of Google services and APIs.
        - instances with internal IPs only can't access resources outside the VPC network
        - Private Google Access doesn't affect VMs with external IPs
## Lab notes
```bash
# ssh into a vm instance 
gcloud compute ssh vm-internal --zone us-central1-c --tunnel-through-iap

# copying fies from a cloud storage to another (in cloud shell bc it has an external ip)
gsutil cp gs://cloud-training/gcpnet/private/access.svg gs://$MY_BUCKET

# if you're in the vm instance and have Private Google Access enabled then can copy stuff over
gsutil cp gs://<your_bucket_name>/*.svg .

# hosts outside of the private intance with an internal IP address only can only respond to the connection request and not initiate a connection with the host
```
- **NOTE:** - Using tags with Firewall rules will help make it easy to assign rules to VM instances despite a different IP address that the instance might have.
# Virtual Machines
- **VM** consists of virtual CPU, mem, and storage, networking
    - **Compute** - network scales 2gb per vCPU
        - a vCPU (virtual CPU) is equal to one **hyper-thread** (dividing CPU cores into virtual cores or threads)
    - **Storage** - Standard, SSD, Local SSD (data disappears when instances dies)
    - **Network** - default, auto, custom networks
        - inbound/outbound firewall rules with tags
        - global and regional loadbalancing.
    - access to the VM through SSH or RDP make sure to configure firewall rules to allow **tcp:22 and tcp:3389 respectively.**
    - can change the state of the VM through `gcloud`
    - Availability policies: automatic restart, on host maintenance, live migrations
- **Patch Management** - apply OS patches/updates across a set of VMs
    - can approve patches, schedule them
## Lab notes
```bash
# run diagnostics on the VM
# show how much memory is used
free

# see type of ram installed on computer
sudo dmidecode -t 17

# show num of processors
nproc

# list cpu details
lscpu
```
- Machine Families:
    - **E2** - day to day computing at low cost - good for web and app serving, small-med dbs, virtual desktops, microservices, development envs
    - **N2, N2D, N1** - balanced price/performance for VMs. Web, apps, med-large dbs, media/streaming
    - **Tau T2D** - scale out optimzed - large scale java apps, media transcoding, containerized microservices, 
    - **C2** - Ultra high performance - high-perf web serving, media transcoding, ad serving, gaming (AAA game servers)
    - **C2D** - Ultra-ultra high performance - high perf dbs, high-perf computing, electronic design
    - **M1** - ultra high memory workloads - in-mem dbs, SQL servers, workloads that require lots of mem.
    - **M2** - ultra high memory workloads - large in-mem dbs, in-mem analytics for business, ai, big data
    - **A2** - high performance computing - good for GPU workloads, best for AI, ML training, massive parallel computing
- Pricing for machines and compute:
    - long-term commitments
        - there are discounts regular compute machines ~57%
        - there is a 70% discount for memory optimized machines
    - There is a recommendation Engine for underutilized resources
    - There is sustained discounts for keeping an instance up for a periods (month)
- **Preemptible** - a compute instance that can be shut down at any time.
    - lower price for interruptible service (up to 91%)
    - lifetime of 24 hours
    - No live migrate; no auto restart
    - **Spot VMs** - latest version of preemptible VMs
        - no maximum runtime; but it might shut down
- **Sole-tenant nodes** - rent out the whole server computer in the datacenter so all VMs can run on the same host
- **Shielded VMs** - Secure boot, virtual trusted platform module (vTPM), integrity monitoring. Confident that no malware came from boot or kernel-level
- **Confidential VM** - encrypts data while its being processed.
    - easy to use without making changes to the code
    - works on the N2D Compute Engine VM
    - Supports parallel and compute heavy workloads so the encryption doesnt hinder performance
- **Disk Image** - boot loader, OS, file sys structure, software (preinstalled), customizations
    - **Machine Images** are backups or instance cloning and replication
- **Boot Disk** - VM comes with a single root persistent disk
    - Images get load onto the disk during first boot
    - Durable can survive if VM terminates but make sure configurations are set rights
- **Cloud Persistent Disk** - Attached to a VM through the network. You can attach to a VM and boot from it
    - Share disks with other instances and even make them read-only
    - **Zonal persistent disks** are good and safe for storage
    - **Regional persistent disks** - have active disk replication across zones which are good for high performance dbs
        - **standard persistent disks** - backed by hard disk drive
        - **balanced persistent disks** - backed by solid state drives
        - **ssd persistent disks** - backed by ssds.
        - **extreme persistent disk** - high perf. disks for dbs that are backed by ssd
    - By default Google Cloud encrypts all data that rests in disks
        - Use **Google Key Management Service** to create and manage custom key encryption keys.
    - **Local SSD** - physically attached to the VM.
        - Lower latency, total 3TB, can survive a reset but not a stop or terminate
            - connected to the specific hardware of the VM but it might change after terminate
    - **RAM disk** - fastest performance available except **memory**. have a persistent disk to backup the ram data. Data will disappear with restart or stop
    - If having a lot of Persistent SSDs then make sure network throughput is enough to handle the ingress and egress throughput on top of the drive's throughput
    - Summary: partitioning, repartition disk, reformat for allocating more storage for OS, have backups, encryption all handled by **Cloud Persistent Disks**
- **Compute Engine Actions**
    - Every VM stores metadata on a metadata server
        - **Metadata server** is good for startup and shutdown scripts
    - Move instance to a new zone
        - `gcloud compute isntances move`
        - To move the vm must shutdown the vm and update references that were pointing to the old IP of the address
    - Move instance sto a new region
        - must make a snapshot of all of persistent disks on the VM
        - make new persistent disks at the destination and restore the snapshots
        - give the VM a new IP
        - Update refernces again
    - **Snapshot**: Backup crticial data
        - stored in cloud storage; used to migrate data between zones and regions
        - also use a snapshot to transform data from a hdd to a ssd
    - **Persitent disk snapshots**
        - only available for hdd and ssd, **not local ssd.**
        - creates incremental/periodic backups to Cloud Storage
            - Automatically compressed. 
        - snapshots can be restored to a new persistent disks
    - **Resize Persistent Disks** - can grow disk size but never shrink them.
# Lab notes
```bash
# make a new dir for storing minecraft
sudo mkdir -p /home/minecraft

# formatting a disk to create a file system
sudo mkfs.ext4 -F -E lazy_itable_init=0,\
lazy_journal_init=0,discard \
/dev/disk/by-id/google-minecraft-disk

# mount the additional persistent disk to a directory
sudo mount -o discard,defaults /dev/disk/by-id/google-minecraft-disk /home/minecraft

# minecraft requires the Java Runtime Enviroment (JRE) which is a Java virtual machine plus some libraries.
# download JRE headless which doesn't have the graphical interface
sudo apt-get install -y default-jre-headless

# locate to the minecraft directory
cd /home/minecraft

# install the wget command
sudo apt-get install wget

# download the minecraft server application
sudo wget https://launcher.mojang.com/v1/objects/d0d0fe2b1dc6ab4c65554cb734270872b72dadd6/server.jar

# accept the terms for running the minecraft server in the eula.txt file
sudo nano eula.txt

"""install screen to allow us to make a virtual terminal that can be 'detached' and run in the background or 'reattached' to a foreground process. 
detaching a virtual terminal will continue to run in the VM whether or not we're connected to the shell
"""

# use screen to start the miencraft server in the virtual terminal
sudo screen -S mcs java -Xmx1024M -Xms1024M -jar server.jar nogui

# type CTRL+A and CTRL+D to exit out of the virtual terminal
# run this command to reenter the virtual terminal
sudo screen -r mcs

# minecraft usually runs on the tcp port 25565
# need to write firewall rules to allow 0.0.0.0/0 any ingress IPs connection requests to reach the server
# use tags so the firewall rule is applied to the VM instance network config

# make a cloud storage bucket to store backups
export BUCKET=<bucket name>
gsutil mb gs://$BUCKET-minecraft-backup

# check out the minecraft directory
cd /home/minecraft
sudo nano /home/minecraft/backup.sh

# make a bash script to backup the minecraft server
#!/bin/bash
screen -r mcs -X stuff '/save-all\n/save-off\n'
/usr/bin/gsutil cp -R ${BASH_SOURCE%/*}/world gs://${BUCKET}-minecraft-backup/$(date "+%Y%m%d-%H%M%S")-world
screen -r mcs -X stuff '/save-on\n'

# make the shell script executable
sudo chmod 755 /home/minecraft/backup.sh

# this runs the shell script to backup
. /home/minecraft/backup.sh

# make a cron job to backup the server every period
sudo crontab -e
# type at the bottom of the file 
0 */4 * * * /home/minecraft/backup.sh

# stop the minecraft server in the background
sudo screen -r -X stuff '/stop\n'
```