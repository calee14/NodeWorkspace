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
    - Default Mode:
        - there is a **subnet for each region**
        - regional IP allocation and fixed IP ranges `/20` for a subnet.
    - Custom Mode: (can come from auto but not the other way around)
        - no default subnets
        - custom regional IP ranges
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