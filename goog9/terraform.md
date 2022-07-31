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