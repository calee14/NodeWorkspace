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