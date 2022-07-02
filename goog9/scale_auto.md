# Interconnecting Networks
- **Cloud VPN** - connects on-premise network to your GCP VPC Network
    - traffic between networks are encrypted by one gateway and decrypted by the receiving gateway. (safe over public the internet)
    - good for low-vol. data connections
    - 99.9% service availability, dynamic routes, IKEv1 and v2 ciphers
        - dynamic routes are configured by Cloud Router
    - on-premise VPN gateway can be a physical device in data center or an instance from another cloud provider
        - the other gateway is the Cloud VPN gateway
            - "alawys two there are"
        - the VPN gateway has an external IP address
    - must make two VPN tunnels to connect the two VPN gateways
        - each tunnel defines the direction of its respective gateway.
        - **Max Transmission Unit (MTU)** - for the VPN is 1460 bytes bc of encryption of packets
    - Cloud VPN supports static and dynamic routes (IP addresses) but need to configure **Cloud Router**
        - Router uses **Border Gateway Protocol (BGP)** - allows routes to be updated and exchanged without changing tunnet information
        - BGPs must have their own IP addresses in the range 169.254.0.0/16 but they are not part of any networks and used for BGPs only.
            - BGP connects between the two gateways to exchange new subnets or routes which will allow the instances in the subnets to communicate 
## Lab notes
```bash
# need to reserve IP addresses for the VPN gateway
gcloud compute addresses create vpn-1-static-ip --project=qwiklabs-gcp-04-c262c3eb995e --region=us-central1
gcloud compute addresses create vpn-1-static-ip --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1

# sample of making a tunnel from one gateway IP to the next one
gcloud compute target-vpn-gateways create vpn-2 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --network=vpn-network-2 && gcloud compute forwarding-rules create vpn-2-rule-esp --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=ESP --target-vpn-gateway=vpn-2 && gcloud compute forwarding-rules create vpn-2-rule-udp500 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=UDP --ports=500 --target-vpn-gateway=vpn-2 && gcloud compute forwarding-rules create vpn-2-rule-udp4500 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --address=34.79.254.56 --ip-protocol=UDP --ports=4500 --target-vpn-gateway=vpn-2 && gcloud compute vpn-tunnels create tunnel2to1 --project=qwiklabs-gcp-04-c262c3eb995e --region=europe-west1 --peer-address=35.202.226.9 --shared-secret=gcprocks --ike-version=2 --local-traffic-selector=0.0.0.0/0 --remote-traffic-selector=0.0.0.0/0 --target-vpn-gateway=vpn-2 && gcloud compute routes create tunnel2to1-route-1 --project=qwiklabs-gcp-04-c262c3eb995e --network=vpn-network-2 --priority=1000 --destination-range=10.5.4.0/24 --next-hop-vpn-tunnel=tunnel2to1 --next-hop-vpn-tunnel-region=europe-west1

# created two different VM instances in two different VPC networks and in their own subnet within the respective VPC networks
# firewall rules have been configured to allow ssh and icpm connections
# without the VPN can only ping the other VM instance through the www internet
# pinging requires two tunnels to be established. one going to the target and one from the target coming back
# good to use tunnels to make connections between networks and instances bc relying on one single tunnel (external IP addresses) might be a source for failure

# we need to reserve static IP addresses on each network for the VPN gateways
# need to specify the subnet/region they are in
# then we create the VPN gateway for a VPC network. make sure to give the IP address of reserved static IP for the gateway
# also make a tunnel from the current VPN gateway to the other, so must give the other networks VPN gateway reserved IP
# must create a key for encryption. specify the IP ranges between the gateway
```