# Terraform Fundamentals
```bash
# terraform is infrastructure as code
# manages infrastructure low-level such as VMs, storage,
# networking, and high-level components like DNS and SaaS features
# versions config of infrastructure 
# can also generate a step by step plan of what it will execute
# graphs all resources and parallelizes the creation and modification of resources

# example: instance.tf
resource "google_compute_instance" "terraform" {
  project      = "<PROJECT_ID>"
  name         = "terraform"
  machine_type = "n1-standard-1"
  zone         = "us-west1-c"
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }
  network_interface {
    network = "default"
    access_config {
    }
  }
}
# init terraform and then check the plan then apply
terraform show
terraform plan
terraform apply
```
# Infrastructure as Code with Terraform
```bash
# main.tf
# the terraform blocks specifies the provider so terraform knows which API to download
terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}
# the provider block congures the project and config of where to put the resources
provider "google" {
  version = "3.5.0"
  project = "<PROJECT_ID>"
  region  = "us-central1"
  zone    = "us-central1-c"
}
resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}

# edit number two: add a VM
resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  tags         = ["web", "dev"]
  boot_disk {
    initialize_params {
      # image = "debian-cloud/debian-9" we changed the bootdisk
      image = "cos-cloud/cos-stable"
    }
  }
  provisioner "local-exec" {
    command = "echo ${google_compute_instance.vm_instance.name}:  ${google_compute_instance.vm_instance.network_interface[0].access_config[0].nat_ip} >> ip_address.txt"
  }
  network_interface {
    # use the vpc_network variable and access the name
    # network = google_compute_network.vpc_network.name
    # access_config {
    # }
    # note how we're accessing the static IP and network props 
    # using the resource ID in terraform and getting the attributes of the var
    network = google_compute_network.vpc_network.self_link
    access_config {
      nat_ip = google_compute_address.vm_static_ip.address
    }
  }
}
# edit number three: add a static IP
resource "google_compute_address" "vm_static_ip" {
  name = "terraform-static-ip"
}

# New resource for the storage bucket our application will use.
resource "google_storage_bucket" "example_bucket" {
  name     = "qwiklabs-gcp-01-f1235d3b25c8"
  location = "US"
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}
# Create a new instance that uses the bucket
resource "google_compute_instance" "another_instance" {
  # Tells Terraform that this VM instance must be created only after the
  # storage bucket has been created.
  depends_on = [google_storage_bucket.example_bucket]
  name         = "terraform-instance-2"
  machine_type = "f1-micro"
  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }
  network_interface {
    network = google_compute_network.vpc_network.self_link
    access_config {
    }
  }
}

# commands to initiate the creation of the resources
terraform init
terraform apply
terraform show

# can edit a terraform file and add new resources or modify old ones
# some resources where changes to be made can't be modified then it 
# examples include changing boot disk
# will have to delete the old one and make a new one

# terraform can destroy the entire infrastructure
terraform destroy

# using the google_compute_address.vm_static_ip.address makes GKE imply that the resources
# depends on them thus it will make the static IP resource first <- called implicit dependencies
# can have explicit dependencies by writing a keyword 'depends_on' in terraform

# terraform has provisioners to upload files, run scripts, install or start software like config tools
# there is a provisioner added to the vm_instance
# running apply won't work because provisioners only run when a resource is created
# thus run the command to recreate the instance
terraform taint google_compute_instance.vm_instance
# then run the apply command to make the change
terraform apply
# there are also provisioners that run when a resource is being destroyed
```
# Interact with Terraform Modules
```bash
# large config files things can get lost
# harder to understand, duplicate objects
# hard to share an entire file with teams
# use modules to organize the configuration of the infrastructure
# encapsulate configuration into components (less same name error, change one won't break the other)
# reuse config files that do something

# A terraform module is a set of config files in a single directory
# the root directory is called the root module
# calling module: config files in the root call on child module (config files from a child dir)
# local and remote module: modules are either in the local filesystem or from a remote source 
# terraform modules are like libraries or packages

# download the terraform module to create a network
git clone https://github.com/terraform-google-modules/terraform-google-network
cd terraform-google-network
git checkout tags/v3.3.0 -b v3.3.0

# the "terraform-google-modules/network/google" module has required inputs
# network_name = network name
# project_id = id of the project where the project is being made
# subnets = the subnets of the network

# main.tf
provider "google" {
  version = "~> 3.45.0"
}
provider "null" {
  version = "~> 2.1"
}
module "test-vpc-module" {
  source       = "terraform-google-modules/network/google"
  version      = "~> 3.2.0"
  project_id   = var.project_id
  network_name = "my-custom-mode-network"
  mtu          = 1460
  subnets = [
    {
      subnet_name   = "subnet-01"
      subnet_ip     = "10.10.10.0/24"
      subnet_region = "us-west1"
    },
    {
      subnet_name           = "subnet-02"
      subnet_ip             = "10.10.20.0/24"
      subnet_region         = "us-west1"
      subnet_private_access = "true"
      subnet_flow_logs      = "true"
    },
    {
      subnet_name               = "subnet-03"
      subnet_ip                 = "10.10.30.0/24"
      subnet_region             = "us-west1"
      subnet_flow_logs          = "true"
      subnet_flow_logs_interval = "INTERVAL_10_MIN"
      subnet_flow_logs_sampling = 0.7
      subnet_flow_logs_metadata = "INCLUDE_ALL_METADATA"
    }
  ]
}

# variables.tf
variable "project_id" {
  description = "The project ID to host the network in"
  default     = "FILL IN YOUR PROJECT ID HERE"
}
variable "network_name" {
  description = "The name of the VPC network being created"
  default     = "example-vpc"
}

# outputs.tf
# modules often have output values. define them here
# after the resources have been created can make an output of the details of the resources
output "network_name" {
  value       = module.test-vpc-module.network_name
  description = "The name of the VPC being created"
}
output "network_self_link" {
  value       = module.test-vpc-module.network_self_link
  description = "The URI of the VPC being created"
}
output "project_id" {
  value       = module.test-vpc-module.project_id
  description = "VPC project id"
}
output "subnets_names" {
  value       = module.test-vpc-module.subnets_names
  description = "The names of the subnets being created"
}
output "subnets_ips" {
  value       = module.test-vpc-module.subnets_ips
  description = "The IP and cidrs of the subnets being created"
}
output "subnets_regions" {
  value       = module.test-vpc-module.subnets_regions
  description = "The region where subnets will be created"
}
output "subnets_private_access" {
  value       = module.test-vpc-module.subnets_private_access
  description = "Whether the subnets will have access to Google API's without a public IP"
}
output "subnets_flow_logs" {
  value       = module.test-vpc-module.subnets_flow_logs
  description = "Whether the subnets will have VPC flow logs enabled"
}
output "subnets_secondary_ranges" {
  value       = module.test-vpc-module.subnets_secondary_ranges
  description = "The secondary ranges associated with these subnets"
}
output "route_names" {
  value       = module.test-vpc-module.route_names
  description = "The routes associated with this VPC"
}

# NOTE: terraform treats every configuration file as a module
# the dir where terraform commands is considered the root module
# main.tf = a file that contains the main set of configs for module. 
# variables.tf = a file that contains the arguments that get passed into modules
# outputs.tf = modules are outputs that are made to the config file using the module

# make own module
cd ~
touch main.tf
mkdir -p modules/gcs-static-website-bucket
cd modules/gcs-static-website-bucket
touch website.tf variables.tf outputs.tf

# /modules/gcs-static-website-bucket/website.tf
# make a bucket
resource "google_storage_bucket" "bucket" {
  name               = var.name
  project            = var.project_id
  location           = var.location
  storage_class      = var.storage_class
  labels             = var.labels
  force_destroy      = var.force_destroy
  uniform_bucket_level_access = true
  versioning {
    enabled = var.versioning
  }
  dynamic "retention_policy" {
    for_each = var.retention_policy == null ? [] : [var.retention_policy]
    content {
      is_locked        = var.retention_policy.is_locked
      retention_period = var.retention_policy.retention_period
    }
  }
  dynamic "encryption" {
    for_each = var.encryption == null ? [] : [var.encryption]
    content {
      default_kms_key_name = var.encryption.default_kms_key_name
    }
  }
  dynamic "lifecycle_rule" {
    for_each = var.lifecycle_rules
    content {
      action {
        type          = lifecycle_rule.value.action.type
        storage_class = lookup(lifecycle_rule.value.action, "storage_class", null)
      }
      condition {
        age                   = lookup(lifecycle_rule.value.condition, "age", null)
        created_before        = lookup(lifecycle_rule.value.condition, "created_before", null)
        with_state            = lookup(lifecycle_rule.value.condition, "with_state", null)
        matches_storage_class = lookup(lifecycle_rule.value.condition, "matches_storage_class", null)
        num_newer_versions    = lookup(lifecycle_rule.value.condition, "num_newer_versions", null)
      }
    }
  }
}
# /modules/gcs-static-website-bucket/variables.tf
variable "name" {
  description = "The name of the bucket."
  type        = string
}
variable "project_id" {
  description = "The ID of the project to create the bucket in."
  type        = string
}
variable "location" {
  description = "The location of the bucket."
  type        = string
}
variable "storage_class" {
  description = "The Storage Class of the new bucket."
  type        = string
  default     = null
}
variable "labels" {
  description = "A set of key/value label pairs to assign to the bucket."
  type        = map(string)
  default     = null
}
variable "bucket_policy_only" {
  description = "Enables Bucket Policy Only access to a bucket."
  type        = bool
  default     = true
}
variable "versioning" {
  description = "While set to true, versioning is fully enabled for this bucket."
  type        = bool
  default     = true
}
variable "force_destroy" {
  description = "When deleting a bucket, this boolean option will delete all contained objects. If false, Terraform will fail to delete buckets which contain objects."
  type        = bool
  default     = true
}
variable "iam_members" {
  description = "The list of IAM members to grant permissions on the bucket."
  type = list(object({
    role   = string
    member = string
  }))
  default = []
}
variable "retention_policy" {
  description = "Configuration of the bucket's data retention policy for how long objects in the bucket should be retained."
  type = object({
    is_locked        = bool
    retention_period = number
  })
  default = null
}
variable "encryption" {
  description = "A Cloud KMS key that will be used to encrypt objects inserted into this bucket"
  type = object({
    default_kms_key_name = string
  })
  default = null
}
variable "lifecycle_rules" {
  description = "The bucket's Lifecycle Rules configuration."
  type = list(object({
    # Object with keys:
    # - type - The type of the action of this Lifecycle Rule. Supported values: Delete and SetStorageClass.
    # - storage_class - (Required if action type is SetStorageClass) The target Storage Class of objects affected by this Lifecycle Rule.
    action = any
    # Object with keys:
    # - age - (Optional) Minimum age of an object in days to satisfy this condition.
    # - created_before - (Optional) Creation date of an object in RFC 3339 (e.g. 2017-06-13) to satisfy this condition.
    # - with_state - (Optional) Match to live and/or archived objects. Supported values include: "LIVE", "ARCHIVED", "ANY".
    # - matches_storage_class - (Optional) Storage Class of objects to satisfy this condition. Supported values include: MULTI_REGIONAL, REGIONAL, NEARLINE, COLDLINE, STANDARD, DURABLE_REDUCED_AVAILABILITY.
    # - num_newer_versions - (Optional) Relevant only for versioned objects. The number of newer versions of an object to satisfy this condition.
    condition = any
  }))
  default = []
}

# /modules/gcs-static-website-bucket/outputs.tf
output "bucket" {
  description = "The created storage bucket"
  value       = google_storage_bucket.bucket
}

# main.tf
module "gcs-static-website-bucket" {
  source = "./modules/gcs-static-website-bucket"
  name       = var.name
  project_id = var.project_id
  location   = "us-east1"
  lifecycle_rules = [{
    action = {
      type = "Delete"
    }
    condition = {
      age        = 365
      with_state = "ANY"
    }
  }]
}

# outputs.tf
output "bucket-name" {
  description = "Bucket names."
  value       = "module.gcs-static-website-bucket.bucket"
}

# variables.tf
variable "project_id" {
  description = "The ID of the project in which to provision resources."
  type        = string
  default     = "FILL IN YOUR PROJECT ID HERE"
}
variable "name" {
  description = "Name of the buckets to create."
  type        = string
  default     = "FILL IN YOUR (UNIQUE) BUCKET NAME HERE"
}

# all that to make a bucket
```
# Managing Terraform State
```bash
# Terraform state stores information of resources into objects in a file
# the files is called terraform.tfstate which can be stored locally or remotely for team
# terraform will update the state file to match real infrastructure
# this is good if resources need to be updated, or deleted in the future

# terraform state is good for mapping terraform objects to the real instances
# can have ambigurity without state and one block can represent multiple instances

# the metadata that states provide, which include dependencies help terraform delete resources
# containing the dependencies helps terraform delete the resources in the correct order
# ex: VMs need to be deleted before the networks. networks are dependencies of VMs

# terraform can also cache the attribute values of ALL resources in the state
# this improves performance since terraform won't have to make requests to the API for all resources
# good for large infrastructure

# remote states can be synced across teams so that everyone has the same state
# can also lock the state so no corruption of state file

# each terraform conifguration has a backend where operations are run and data is stored into states
# the state data of the backend is placed in a workspace
# there can be many workspace thus the first workspace is the default one
# terraform backends are good for working with teams because its in the cloud
# backends also keep data of state in memory (no write to disks)
# backends support remote calls to operations

# configure the main.tf file to have the backend be local and store states in local dir
terraform {
#   backend "local" {
#     path = "terraform/state/terraform.tfstate"
#   }
    # replace the backend with one in the cloud 
    backend "gcs" {
        bucket  = "# REPLACE WITH YOUR BUCKET NAME"
        prefix  = "terraform/state"
    }
}
# to create the backend run the 'init' command. 
# the terraform code will make a resource (bucket) 
provider "google" {
  project     = "# REPLACE WITH YOUR PROJECT ID"
  region      = "us-central-1"
}
resource "google_storage_bucket" "test-bucket-for-state" {
  name        = "# REPLACE WITH YOUR PROJECT ID"
  location    = "US"
  uniform_bucket_level_access = true
  force_destroy = true # this will delete the bucket no matter what is in the bucket
}
# after making changes to the terraform backend must run the command to have effect
terraform init -migrate-state
# this will create an object in cloud storage with the state 
# refresh the state file. this won't change the infrastructrue code but might result in changes
# the next time the 'apply' command is run again
terraform refresh
# this might result in changes to the attributes of the resources in the state

# can run terraform inside a docker container
docker run --name hashicorp-learn --detach --publish 8080:80 nginx:latest
docker ps
# the provider in the main.tf file is docker
git clone https://github.com/hashicorp/learn-terraform-import.git
terraform init
# use the import command to attach the docker container to the docker_container.web resource created
terraform import docker_container.web $(docker inspect -f {{.ID}} hashicorp-learn)
```
# Automating Infrastructure on Google Cloud with Terraform: Challenge Lab
```bash
# variables
variable "region" {
  default = ""
}

variable "project_id" {
  default = ""
}

variable "zone" {
  default = ""
}
# main.tf
terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}
# the provider block congures the project and config of where to put the resources
provider "google" {
  version = "3.5.0"
  project = ""
  region  = ""
  zone    = ""
}
module "instances" {
  source = "./modules/instances"
}
# instances.tf
resource "google_compute_instance" "tf-instances-1" {
  name = "tf-instances-1"
  project      = ""
  machine_type = "n1-standard-1"
  zone         = var.zone
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }
  network_interface {
    network = "default"
    access_config {
    }
  }
  metadata_startup_script=
  allow_stopping_for_update = true
}
resource "google_compute_instance" "tf-instances-2" {
  name = "tf-instances-2"
  project      = ""
  machine_type = "n1-standard-1"
  zone         = var.zone
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }
  network_interface {
    network = "default"
    access_config {
    }
  }
  metadata_startup_script=
  allow_stopping_for_update = true
}
terraform import module.instances.google_compute_instance.tf-instance-1 <id>
terraform import module.instances.google_compute_instance.tf-instance-2 <id>

# for creating the firewall in terraform
resource "google_compute_firewall" "tf_firewall" {
  name    = "tf-firewall"
  network = google_compute_network.default.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  soure_ranges = ["0.0.0.0/0"]
}

resource "google_compute_network" "default" {
  name = "test-network"
}
```