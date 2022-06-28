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