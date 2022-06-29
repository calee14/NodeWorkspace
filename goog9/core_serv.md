# Idenity and Access Management
- Heirarchy - Organization, Folders (Departments), Projects, Resources
    - Rules for the Organization is inherited down, same for the other levels
- **Organiztaion Role**: 
    - **Super Admin.** - Assign Org. Roles to users
    - **Org. Admin** - Control all cloud resources
        - Creator, Viewer, Admin types
    - **Project creator** - Below Org. Admin (inherited) - controls who can access/create projects
        - There is a creator and deleter specification
    - Can work in **folders** which are considered sub organizations withing the **Cloud Organization**
        - Org. Role might have access to only one folder
- Services have their own roles (Compute Engine):
    - **Compute Engine**, **Network**, **Storage**
- Make custom roles with GCP but they will not be automatically updated when services and resources are updated
- IAM cannot make users and groups but can only apply rules to them.
    - Use Cloud Identity or Workspace to make groups and users
- **IAM Policies** - contains many **bindings** of which they are connected to a bunch of acccounts, groups, services, and domains. 
- **Role** a list of permissions defined by IAM
    - The less restrictive role overrides the more restrictive role
        - So best to follow least-privilege
- **IAM Conditions** - conditions must be met in order for members to get access to services/identities
- **Organization Policies** - config of restrictions applied to org. node, folders, projects
- **Single-Sign On (SSO)** - Sign-in through third-party or exisiting solutions
- **Service Accounts** - give identity to applications so that it can have access to resources without user credentials
    - identified by a generated email
    - **Compute Engine VMs** - have default service accounts when created
    - **Scopes** - used to determine which applications have authorization or permissions based on their service accounts
        - These scopes come in the form of access tokens given by authorization servers
    - Users can also be assigned to a **service accounts users** and gain the permissions from it
    - Service accounts can be managed by Google or by Users
        - if managed by google, the public and private keys are kept by Google and the private key will be hidden and rotated
        - if user managed, then the user takes care of the private key responsibilities
- **Best practices**:
    - "principle of least privilege", know inheritance, audit the shit out of everything
    - grant roles to groups
    - giving service account roles will give the user, group, application access to all of the service functions
        - be careful
        - key rotate service accounts
## Lab notes
```bash
# roles can be given with other users if the correct email or account or member is given.
# these roles can determine the access of that user to the instance to the Project or Service

# if given viewer permission of a Google Service like Cloud Storage will need to use the cli
# list all objects in the cloud storage
gsutil ls gs://[YOUR_BUCKET_NAME]

# can create a service account and specify which user/member has access to the permissions that belong to the service account
# a VM can also be created with a service account so that its permissions will also be limited by the service account
```
- **NOTE:** - **Roles** are an abstraction of job roles because the actual permissions aren't assigned to the user but the roles are which are then applied.
- **NOTE:** - IAM members: Google Account, Cloud Identity, Workspace, Google Group, Service Account
# Storage and Databases
- Unstructured data:
    - file system: Filestore
    - key-value: Cloud Storage
- Structured data for analytics: Cloud Bigtable or Big Query
    - if the data is document-based then Firestore
    - if relational data (SQL): Cloud SQL
        - If the data needs to scale horizontally without adding new hardware then: Cloud Spanner
- **Cloud Storage**: scalable, fast, accessible
    - **Standard Storage**: "hot data" best for data that are recently accessed. Most expensive.
        - Good for storing data near Kubernetes clusters and instances
        - Good for streaming videos, gaming
    - **Nearline Storage**: highly durable storage: backups, long media content, archiving
        - there is a minimum storage duration
    - **Coldline Storage**: low cost durable storage service for storing infrequent data.
        - lower availability.
    - **Archive Storage**: data backup, diaster recovery.
        - Data is available but has high cost for access 
    - **11 nine durability** (99.999...) meaning the data won't be lost
- **Cloud Storage**: 
    - data goes into buckets.
    - access data by using gsutil command
    - there is a default class for objects uploaded to the bucket
    - Regional buckets can't be changed to multi-region
        - However, objects can be moved from bucket to bucket
    - Use IAM to determine who can see buckets and what's in them and access and make changes
        - **ACL (Access Control List)** - determines who has access to the bucket and can edit it and the permissions
            - **Scope** define who has roles and which ones
            - **Permissions** which actions the users can make 
        - **Signed URLs** - limited time tokens 
            - gives access to a cloud storage resource
            - a service account gives access to whoever holds the URL
    - Cloud Storage features:
        - customer-supplied keys, archiving, object verisioning
        - objects in Storage are **immutable (can't be changed)**.
            - can be archived with versioning and switch between archives
        - **Object Lifecycle Management policies**:
            - apply rules on objects that meet condition, rule
                - delete object created before a date, downgrade storage class, keep 3 most recent versions
            - changees with policies are run asyncronously so it may take time
        - **Object Change Notification** - notify apps that are watching buckets in Storage. Notifcation channels are supported by a web hook 
            - Uses **pub/sub** notifications for cloud storage
        - Data imports:
            - **transfer appliance:** get a rack backup dat and ship the rack to Google Cloud where they upload
            - **Storage Transfer Service:** import _online_ data
            - **Offline Media Import:** Third-party service get the data from a storage device and then they upload it
- Cloud Storage has high global consistency. Once upload then we can read and write from it
- Storage class:
    - Read < 1 per year: archive storage
    - Read < 1 per 90 days: Coldline
    - Read < 1 per 30 days: Nearline
    - Else Standard Storage
- **Filestore** - simple storage system on a compute engine instance
    - Good for application migration since many applications use file systems.
    - Media rendering
    - Data analytics
    - Genomics processing since genes have lots of data
## Lab notes
```bash
# to write a file into a Cloud Storage bucket use the command
gsutil cp setup.html gs://$BUCKET_NAME_1/

# to get the access control list of the bucket
gsutil acl set private gs://$BUCKET_NAME_1/setup.html
gsutil acl get gs://$BUCKET_NAME_1/setup.html  > acl2.txt
cat acl2.txt

# change the access control list to be private and accessible to no one except the owner
gsutil acl set private gs://$BUCKET_NAME_1/setup.html
gsutil acl get gs://$BUCKET_NAME_1/setup.html  > acl2.txt
cat acl2.txt

# make project publicly readable
gsutil acl ch -u AllUsers:R gs://$BUCKET_NAME_1/setup.html
gsutil acl get gs://$BUCKET_NAME_1/setup.html  > acl3.txt
cat acl3.txt

# the acl text files will display the permissions that users have

# run the python script to get an AES-256 base-64 encryption key.
# this program will produce a key for encryption and decryption
python3 -c 'import base64; import os; print(base64.encodebytes(os.urandom(32)))'

# the encryption config and controls are located in the .boto file
# if the .boto file is empty then run the command below to intstantiate the boto file
gsutil config -n
# the encryption keys handle how to encrypt the data and decrypt it when reading and writing data to the Cloud Storage
# edit the .boto file and uncomment the encryption_key line and add the key
encryption_key=<the key>

# thus subsequent uploads to the Cloud Storage bucket will be encrypted by a customer-supplied key
gsutil cp setup2.html gs://$BUCKET_NAME_1/
gsutil cp setup3.html gs://$BUCKET_NAME_1/

"""
to rotate the encryption keys simply change the encryption_key but we need to store the old key in the decryption_key env. variable for old data that had been encrypted with the old key. these changes take place in the .boto file
"""
encryption_key=<new key>
decryption_key1=<old key>

# using the rewrite option we can encrypt the data with the new key
# by decrypting it with the old key
# NOTE: without the (old) decryption key we would not be able to read the old data encrypted by the old key.
# NOTE: delete old decryption/encryption keys when done with them
gsutil rewrite -k gs://$BUCKET_NAME_1/setup2.html

# get the lifecycle for the lifecycle policy of the bucket
gsutil lifecycle get gs://$BUCKET_NAME_1

# make a config file
nano life.json
# contents of the file are to delete the files after 31 days
{
  "rule":
  [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 31}
    }
  ]
}

# set the lifecycle of the bucket
gsutil lifecycle set life.json gs://$BUCKET_NAME_1

# get the bucket's versioning rules
gsutil versioning get gs://$BUCKET_NAME_1

# turn on versioning for the bucket
gsutil versioning set on gs://$BUCKET_NAME_1

# list the details of a file
ls -al setup.html

# update the file and then upload it which would make a new version of the object in the bucket
# the -v stands for the versioning option which will replace the old object with the specific key but will be archived
gsutil cp -v setup.html gs://$BUCKET_NAME_1

# list all versions of a file in the bucket
gsutil ls -a gs://$BUCKET_NAME_1/setup.html

# can copy the key/id of the old version and download it.
# oldest versions are listed first
gsutil cp $VERSION_NAME recovered.txt

# make a few directories for synchronizing
mkdir firstlevel
mkdir ./firstlevel/secondlevel
cp setup.html firstlevel
cp setup.html firstlevel/secondlevel

# tell to take the directory of the bucket and match it with
# the local directory
gsutil rsync -r ./firstlevel gs://$BUCKET_NAME_1/firstlevel

# create a service account that gives service access to a member and then download the credentials for that service account
# the file would be in json and whoever holds it will gain the permissions of the service account
# open a shell VM and upload the json file.
gcloud auth activate-service-account --key-file credentials.json

# the shell will activate the service account from the json file and gain the permissions to the services of the service account
```
- **Cloud SQL** - fully managed relational db by Google
    - supports App Engine, auto patches, third-party SQL software
    - High performance, scalable, supports MySQL, PostgresSQL, MicroSQL
    - Has HA Configuration which is a failover db. Failsafe for db servers in different zones
        - the query will be replicated to the other zone before transaction is completed
    - There are backups.
    - private IPs are better if the db server is located in the same region as the VMs making transactions
    - Use **Cloud SQL Proxy** that handles auth, encryption, and key rotation to send queries to the db server over the public internet
    - If want to control the traffic then use **SSL (secure sockets layer) certificates**