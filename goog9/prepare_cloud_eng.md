# Setting Up A Cloud Solution Enviroment
- can use custom roles to give less privilege to suers
    - projects and its resources can be linked to one billing account
        - billing accounts can have more than one project
    - assign roles or custome roles to users bc the roles contain many permissions
        - add people who work in teams to a group that has the roles
- Editor is a basic permission that allows you to change access permissions to resources
    - run commands in shell
# Planning and Configuring a Cloud Solution
- Regional network, Global TCP Proxies are layer 4 load balancers
    - Global HTTP(S) is a layer 7 of the TCP stack
- Kubernetes is a container managment software that manages, containers, reliability, and autoscaling
    - no need to manage a control plane
- Bigtable is a petabyte scale NoSQl db for storing time-based data
- data that needs to be analyzed should be stored close to where it will be accessed
    - it should be regional and close to the analytical operations
# Deploying and Implementing a Cloud Solution
- do not use a dataflow pipeline to transfer data to big query the cheapest
    - dataflow pipelines will charge for the data passing through to bigquery
    - cannot use the command `bq load` and write a script to be scheduled with cron bc that's too many steps
    - best way to do it is to use the data transfer service to schedule transfers between the bucket and BigQuery
- Cloud SQL db instances can have different availabilities
    - `gcloud sql instances create --availability-type` affects the availability of the instance
- in a managed instance when trying to update the VMS choose PROACTIVE
    - this uses less resources bc the surge is set to 1
    - this is a rolling udpate where one is replaced 1 at a time
        - this is better when compared to a surge of 5 where rolling updates add 5 then remove 5
- when an object is being added or changed in a Cloud Storage bucket the event `--trigger-event goog.object.finalize` is called
- the Cloud Run app allows one to not manage infrastructure and pay per request
    - it also is simple to deploy a **containerized** app
- when transfering a SQL db to the cloud use a VM to install the MySQL db and restore the data to the new instance
    - can retrieve the data remotely
# Ensuring Successful Operation of a Cloud Solution
- the Ingress GKE object implements an HTTP(S) Load Balancer
# Configuring Access and Security
- machine-to-machine communication is handled by a service account
- Use temporary credentials for authenticated an application with service APIs
    - **especially when both are internal to the cloud env**