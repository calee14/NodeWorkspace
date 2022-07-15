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