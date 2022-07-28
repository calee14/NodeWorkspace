# Introduction to Monitoring in Google Cloud
### Operations monitoring
- Flow of monitoring
    - Capture signals = metrics, logs, traces
    - Visualize and Analyze = logs explorer, dashboards
    - Manage Incidents = alerts, error report, SLOs
    - Troubleshoot the issue
- Monitoring Resources
    - BigQuery, CloudRun, Applications, Compute send signals with data
        - these services have automatic logging
    - the signals and data get sent to monitoring tools like Observability Suite
- Logging is about collecting, analyzing, exporting, retaining the logs
    - **Cloud audit logs** track admin activity and who or what (users or system) uses GCP resources
    - **Agent Logs** track sys software and third party apps
    - **Network Logs** track firewalls, network flow and security, load balancers
- Error reporting = tracks the errors and who it affects and how severe
- Service Monitoring = understand and troubleshoot intra-servce dependencies, know when SLOs levels are not met
### Application performance management
- Debugger - debug apps in real-time during production
    - can collaborate debug sessions
    - debug snapshots (app state at a certain time)
    - integrated with IDEs, Git
- Trace - tracks latency data for apps in near real-time
    - used to find performance degradations
    - detects issues automatically
- Profiler - profiles CPU and the heap. 
    - improves performance by seeing what processes consume most or too many resources
- **NOTE** Logging service is important for analyzing data, too. Not just collecting
# Avoiding Customer Pain
- **Site Reliability Engineering SRE**:
    - monitoring disply real-time data from a system
    - great products need to be deployed into great enviroments
    - plan resources ahead of time
    - need to test new versions and updates with continuous integration and dev.
    - analyze root cause or problems and then have
        - need to be transparent of when things go wrong
    - all these actions rely on monitoring. improve experience of clients and customer pain
- Why monitor?
    - continually improve product.
        - good for business analysts for bettering product, security
    - create dashboards to view logs and data
        - combined with alerts
    - alert when things go wrong
        - notify a human when system needs attention
    - be able to debug where the errors occur
        - **triggers** are system failures that send a signal and an alert
        - there is a response where the failure is analyzed and there is an **initial response** to the issue (notify customer)
        - then after the issue is resolved there is a **postmortem**. contain future documentation that analyze the issue and ways to prevent it
- When setting expectations for monitoring use KISS (Keep it simple, dumbass)
    - focus on a system one at a time and from multiple perspectives
    - "use single pane of glass" rule. view several dashboards of projects. not all of the projects available but group them reasonably
    - monitoring systems should address (what vs. why)
        - what? = symptom or error indicator (what is broken)
        - why? = cause or reason for what is causing the error
- White vs. black box:
    - black box = testing public behaviors such as that of a consumer
    - white box = monitoring based on internal logs and systems
- There are business metrics and technical metrics
    - how to define a metric?? use SMART [Specifc, Measurable, Achievable, Relevant, Time bound (should be a rate)]
    - can start with a metric using the **Four Golden Signals**
        - **Latency**: how long for a system to return a result. Ex:
            - num. req. wating for a thread
            - time until first resp.
        - **Traffic**: how many requests hitting your system. Ex:
            - num. HTTP req. placed per sec.
            - num. active connections
        - **Saturation**: how full a service is on capacity of resources
            - % CPU usage, etc.
        - **Errors**: system failures are measured. might indicate an SLO violation and need to make a customer response
            - Wrong answers/content
            - num. 400/500 HTTP codes
- **Service Level Indicator** = quantifiable measure of service's reliability. Good events = Valid events
- **Service Level Objective** = target of reliability. needed by services
    - availability = measure service to run when needed
    - reliability = measure services ability to perform its intended function
        - hard for developers to work with operators (devops) to improve reliability
    - find the optimal level of availability/reliability and level of happiness such that the happiness is barely met
        - "barely met" bc no need to expend more resources for better performance. 
    - should include some room for error
    - should have shorter time windows (around 28 days) for evaluating performance
    - error budgets are usually burned by feature releases, system changes, or failure in hardware, networks
        - can also define downtime in the SLA
- **Service Level Agreement** = minimal level of service before breaking the agreement and then paying them for building a shitty product
    - SLO target should be higher than the SLAs or else you pay customers
- **Customers** = subset of users who pay for service
- How to choose a good SLI?
    - the metric should measure the performance that the consumer is getting
        - Response time, data processing, Storage
    - metrics should also also be visible and with less noise
        - this helps with defining good and bad events
    - want a SLI that correlates with happiness
        - SLI = good events / valid events (it's a ratio)
            - valid events should not include the error events bc it will ruin budgeting
    - should have aroudn 3-5 SLIs for each user journey
    - what are the users expectations?
    - how does a user interact with the service?
- SLO also represent the line where users are happy or not
    - too reliable SLOs means it risks breaking agreements
    - not too reliable SLOs means that it costs more to keep customers
- set SLOs and reliability targets early and base it off previous data as possible
- Each user journey:
    - define an SLI and then refine them
        - Response time, data processing, Storage
        - (refine) be clear what is being measured and how we define a sucessful event
    - base them off previous performance and business data
        - choose cut off point from historical data
- SLI must capture multiple journeys, consider edge cases, analyzed for cost benefit
- **NOTE:** - The error budgets are calculated as 100% minus the SLOs (error budget is very small)
    - The error budget is not close to 100%
    - New features can be developed as long as its within the error budget
    - There should be alerts if a service is consuming a large amount of the error budget
    - Four golden signals = latency, traffic, saturation, errrors
# Alerting Policies
- Alerting = generating when things need to change due to danger or issues
    - SLO = achievable target, SLI = what is measured
    - alerts are timebased and summarized in a period
    - **Detection time** - how long for system to notice issue and then fire the alert
    - **Reset time** - how long until another alert can be fired after the issue is fixed
    - **Precision** - relevant alerts / total alerts
    - **Recall** - Relevent alerts / relevant alerts + the alerts missed
- Window Length - smaller windows allow for faster alert detection
    - the window is the time period where errors get accounted
        - if the errors pass the error budget then the SLO is broken
    - longer windows allow for more precision. 
- **Duration** = something added for better precision
    - errors spotted are treated as an anomally until a duration
        - downside is that errors that occur within the duration get ignored (cost more then)
- Use multiple confiditons for better Precision and Recall
- prioritize alerts based on Customer Impact
- **Alert Policies** - conditions are super important for an alert
    - what are aligners?
        - help define window/time period to compare metrics
    - can use multiple conditions
    - notifcation channels determine how the alert is sent (email, sms, slack)
- Can add alerts to uptime checks and log-based metrics
    - also attach alerts to a group of GCP resources
        - can add resources to groups based on criterion    
        - will search all resources and add based on criteria
- Make alerts using the Console, Shell, or API (yaml file, too)
## Lab notes
```bash
# download a flask application in the GCP console using git
# the flask app renders an index page and listens on localhost at port 8080
# run the application 

# make a app.yaml file to configure the runtime env for the flask app
# it thinks the local dir of the project is a python app and it app starts at main.py
# app.yaml
gcloud app create --region=us-central

# create the app engine app in the cli
gcloud app create --region=us-central
# deploy the app to app engine
gcloud app deploy --version=one --quiet
# can view the logs from the app engine window

# set the metric graph to aggregator mean and aligner 99th percentile
# go the alerts page and make a policy that checks if the mean res latency is over 8s then make an alert
# update the python app to sleep for 10 sec before returning res.
# redeploy the app
gcloud app deploy --version=two --quiet

# generate some fake requests by looping over again
while true; do curl -s https://$DEVSHELL_PROJECT_ID.appspot.com/ | grep -e "<title>" -e "error";sleep .$[( $RANDOM % 10 )]s;done

# make a file to store the config of the alert policy
# app-engine-error-percent-policy.json
# the policy tracks the amount of HTTP error requests and when the amount exceeds one percent there will be an update

# change the python app to throw errors
# then simulate a bunch of requests in the shell
while true; do curl -s https://$DEVSHELL_PROJECT_ID.appspot.com/ | grep -e "<title>" -e "error";sleep .$[( $RANDOM % 10 )]s;done
```
- Service monitoring helps with maintaining SLOs
    - tracks error budgets too
- Error Budget Details:
    - 1 error every 1000 requests, thus reliability is 99.9%
    - can set SLA to be 5 errors every 1000 requests thus error budget is 5 errors
- window-based vs request-based SLOs
    - window-based hides burst related errors (not fun for customer)
- can make alerts when SLO is burning faster than expected
## Lab notes
```bash
# download the nodejs app and deploy it
# the nodejs index.js file has all of the logging modules installed and configured
# the app.yaml file has the nodejs env.
# the package.json has the startup scripts for the app

# make a req. to the url that generates errors in the app
while true; do curl -s https://$DEVSHELL_PROJECT_ID.appspot.com/random-error -w '\n' ;sleep .1s;done

# view the Monitoring service in app engine and Cloud Monitoring
# create a SLO in Monitoring
# make it an availability metric that is rolling and the period is 7 days
# the goal should be 99.5%

# make an alert for the SLO if the passes a 1.5 threshold meaning there is a movement of 1.5 percentage points
```
- **NOTE:** alerting policies: precision = proportion of events detected (doesn't have to be accurate) that were signifcant
    - signficant means that we wanted that alert. whereas the all events detected could include events we didn't want to be alerted
    - another way to evaluate the alert policy is to use recall = proportion of alerts detected that were signficant to the amount of alerts that were significant plus the alerts that didn't fire (called missed alerts)
# Monitoring Cricial Systems
- Monitor workspace so you have a single-pane of glass
    - view multiple project status and metrics and data
    - can view AWS projects as well
    - each project can have only one workspace for monitoring
    - smaller workspaces so people has less access to too many projects
- some services need service account to write metrics to the Monitoring workspace
- Google auto adds charts and dashboards for your resources in the Project
    - GKE, Compute Engine, App Engine
    - there are metric types, metric data type and other descriptors used by dashboards and collected by Google Monitoring
- can filter data on charts (remove noise and focus on data with specific criteria)
    - group data and then combine them in charts
    - can choose the design of a chart that give off some information of data
- **Aligners** = break data points into time buckets (alignment period)
- Dashboards are configurable
    - can view many charts and export the dashboards
- **Uptime checks** = finds issues at protocols, hosts, and ports
    - understands if a response is a failure or success
- Error budget = allow for some errors to occur
    - this means that errors are a currency and can experiement with code
- **NOTE:** - Uptime check is good to monitor applications then get notified if they are down
    - Health checks are good to monitor VMs from Compute Engine
    - Monitoring dashboards require the Monitoring Viewer role
- Services should install a **monitoring agent** to send metric data to **Cloud Monitoring**
    - some services like App Engine, GKE, Cloud Run have monitoring auto configured
    - make sure the monitoring agent has the correctl access scope (access control list)
    - must create a service account and download the crentials to give the monitoring agent access to writing data
- Should also install a **OS logging agent** to stream logs from system software (VMs)
    - should only install it on Compute Engine VMs bc other services have it preconfigured
    - should also create a service account and give the credentials to the logging agent
- Can bake the installation of monitoring and logging agents into startup scripts of VMs
    - use Packer to build images automatically. thus can include installing monitorign agents
- GKE has an external tool **Prometheus** that monitors clusters
- Cloud Run also has auto features to log and monitor software running in containers
- Custom metrics = defined by user using Cloud Monitoring API or OpenCensus Tracing library
- OpenCensus = helps capture and export traces and metrics
    - supports popular languages
- Metrics structure:
    - measure = represent the metric being recorded
        - has props: name, desc, unit
    - measurement = a data point of a recorded measure
- **View** represents the combining (**Aggregation**) of measurements
## Lab notes
```bash
# can use one project to hold the Monitoring Workspace to monitor the other projects
# launch nginx deployments in each worker project (2 of them one for monitoring)

# set up the monitoring project to monitor the others in the Settings of the Monitor page
# the dashboards will be auto populated with the resources in the projects you're monitoring
# can also monitor groups based on criteria like tags
# can also make subgroups within a group

# make an uptime check that applies to a group 
# the uptime checks will also be logged and explored in the Logging explorer
```
- **NOTE:** make sure to install logging agents in VMs if the application writes logs but it isn't in Cloud Logging
    - Add labels to GCP resources so that managment can analyze logs of specific groups
    - each project can be in only one workspace???
# Configure Cloud Services for Observability
## Lab notes
```bash
# create compute engine VM and install nginx in it
# create a GKE cluster

# visit the ssh of the webserver and install the logging agents
sudo service google-fluentd status
sudo service stackdriver-agent status
# define scopes before checking the status of the service
curl --silent --connect-timeout 1 -f -H "Metadata-Flavor: Google" \
http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/scopes
# download the script to install the monitoring agent
curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
sudo bash add-monitoring-agent-repo.sh --also-install
# start the monitoring agent
sudo service stackdriver-agent start

# install the loggin agent onto the VM
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
sudo bash add-logging-agent-repo.sh --also-install
# run the service status commands again
# also restart the nginx server
sudo service google-fluentd status

# enable the nginx monitoring plugin
(cd /opt/stackdriver/collectd/etc/collectd.d/ && sudo curl -O https://raw.githubusercontent.com/Stackdriver/stackdriver-agent-service-configs/master/etc/collectd.d/nginx.conf)
# restart the monitoring agent
sudo service stackdriver-agent restart

# switch to GKE cluster
# enable google apis for project
gcloud services enable cloudbuild.googleapis.com
# download the repo to put onto GKE
git clone https://github.com/haggman/HelloLoggingNodeJS.git
# build the container for the application and store it in container registry at the location below
gcloud builds submit --tag gcr.io/$DEVSHELL_PROJECT_ID/hello-logging-js .
# there is a kubernetes yaml file to create three replicated pods and then expose it through a load balancer

# connect to the GKE cluster through the command line
gcloud container clusters get-credentials gke-cluster --zone us-central1-c --project qwiklabs-gcp-00-35fb29e9d407
# apply the declarative manifest file to GKE to create the service
# run the kubectl services command to get the IP of the load balancer
kubectl get services
# the url will be located at the external IP address and PORT
# visit the Monitoring Service to view status and monitoring of GKE cluster
# 
```
# Adavanced Logging and Analysis
- **labeling** helps identify resources
    - apply labels programmatically
    - simple labels are best. less labels the better
- Log Viewer = displays logs from projects and resources.
    - can filter and query specific logs in resources
    - there is an advanced query in Log Viewer
        - using comparison operators and grouping and boolean expressions
- can create custom labels that combine many labels into one
- Log architecture:
    - can store logs using **Log Router**
        - the router sends it to the correct storage service
        - can exclude logs in the Cloud Logger
        - Cloud Logger has default logs that will be accepted no matter what
    - Cloud Log Export - exports logs to BigQuery or backup
    - Dataflow can accept logs to process them
    - Can create a secure logging project giving access to specific logs to a user
    - **Aggregation sinks**: export logs from multiple projects, folders
        - The View will display the aggregated data
    - BigQuery can accept incoming logs and query them using SQL and make tables
- Error reporting:
    - finds code crashes in cloud services
    - centralizes error management and can view them in a dashboard
    - needs an **Error Reporting Writer IAM role**
    - there is an error reporting library for many supported languages
        - services like Cloud Run will automatically detect exception handlers in apps and report it
    - Errors can be filtered in the view portal
        - errors can also be clicked on for more details
## Lab notes
```bash
# create a node.js app that can generate errors randomly for testing purposes
```
- **NOTE:** use cloud storage single-region bucket with the archival class when the log data needs to be stored for a long period of time (ex: 5 years)
    - if managers need to see a daily report of the resource utilization logs then export sink it to BigQuery where the managers can run queries to simplify and understand the data
    - if one wants to monitor an application in real time use Pub/Sub for messaging and streaming data to be analyzed
# Monitoring Network Security and Audit Logs
- VPC Flow Logs sample one out of every 10 packets
    - logs also work for subnets (optional)
    - details of log include details of a packet, IP destination, port, source IP address
    - can export log data to BigQuery and Data Studio
- **VPC Firewall rules** = policies that allow or deny connections based on connection conifg
    - these can be logged to track connetions req., traffic, if rule is causing apps to break
    - generate a lot of data so expensive
    - can export these logs to BigQuery
    - firewall rules provide **micro-segmentation/VM-centric**
        - provides protection from an unsecure outside network to an on-premise network
        - these firewall rules sit inbetween the VM and the router for extra security
        - test if firewall rules causing no traffic: add a low priority rule that would certainly allow traffic to and from VM
            - If it works then you know its the rule
- **Cloud NAT** = allows VM without a public IP address to send packets to the internet
    - its fully managed by GCP.
    - it is also more secure, available, scalable, performance prone
    - has a logging feature for TCP and UDP traffic only
    - can filter logs in the explorer as well
- **Packet Mirroring**= clones VPC instance traffic and forwards it for examination
    - captures all ingress and egress traffic
    - consumes more bandwidth despite this process happening in the VM
    - used for security analysis
- **Network Intelligence Center** = monitor and visibility into network in a centralized portal
    - topology = view VPC topology
        - displays the topology as a graph
    - connectivity tests = evaluate conenctivity to and from VPC resources
        - diagnose connectivity issues to prevent outages
    - performance dashboard = VPC packet loss and latency metrics
        - aggregates data across zones
    - firewall insights = visibility into firewall usage and config issues
        - help set configs for firewall rules to optimize
- Cloud Audit Logs = info about "who did what, where and when"
    - tracks admin activity, data access, system event (records non-human actions that change config)
    - **Access Transparency Logs** = view who logs and other audit logs
- Data access logs - track admin read, data read, data write (records operations that write data to storage bucket)
    - can programatically allow audit access by creating IAM polcies
        - then assign those policies to the auditLogConfig
- Audit Log Entries/Payload = has a proto payload field
    - that field contains an audit log object that stores the audit logging data
    - describes what access type was used and what service used it
- Infrastucture as Code = good for automating storing audit logs
    - Use terrafrorm: OSS
    - Should plan and test the audit log system
        - org level hierarchy can be useful for control data access
    - be sure to filter exports
- Senario: operation monitoring
    - CTO: has the org. admin role to assign permission to a security team and service account
    - Security team has logging viewer role for admin activity and data access activity
    - all permissions should be assigned at the org level
- Senario: dev team monitor audit logs
    - security team has same logging viewer role due to the org level permissions given to the security team
    - dev team has logging viewer role at folder level
        - this viewer role will allow admin activity and data access logs
## Lab notes
```bash
```
## Lab notes
```bash
```
- **NOTE:** data access logs are turned off by default because they have VPC access issues
    - thus need to configure service accounts and permissions to allow them to write
# Managing Incidents
- **Incident** = alert that indicates something bad is happening
    - something bad = SLO is going to be violated
    - incident is declared at the start of the incident response
        - notify the correct person (know priorities)
- Resolve the incident by fixing it.
    - needs to be organized, thus follow rules and protocols
    - document fix and issue
- Incident lifecycle
    - alert, issue detectted
    - triage (examine the severity)
    - declare an incident
    - working to mitigate the issue or remove it
        - after fixing the issue then need to analyze the issue and root cause
    - resolved the incident and must document the issue about the situation and how to fix
- User trust = build on incident response
    - want reliable and available service with fast incident response
- develop apps based on structured incident response
    - know who is doing what and have fast response
        - have a clear chain of command
        - know clear roles
        - find incidents early and often
        - document fixes
- Incident Management role:
    - commander (IC)
        - communications lead (CLI)
            - communicates with Users and stakeholder
        - operational lead (OL)
            - allocates resources for the action plan
            - works with responders primary and secondary
    - communication channels: slack, pagerduty, other message networks
- establish clear criteria to declare an incient
    - communicate through a channel
    - train and conduct practice
- Declaring an incident:
    - first define clear guidelines to declare
    - assess an event based on the impact of the incident
        - declare the impact and send it to communication
- Stop bleeding:
    - check the symptoms in the playbook
    - have there been changes recently?
    - is connectivity is down?
    - replacement system?
    - need to logically troubleshoot the issue by segmenting the space
        - manually step through the system
        - add more monitoring to gain more insight and data
    - there can be multiple factors thus move on to the next possible issue
    - notify users and stakeholds that the incident has been mitigated
    - find the root cause. need specifics
        - **archive** = store olds files into a storage location to clear up space
- Postmortem Report:
    - blameless report that contains the root cause, action items, and descriptions about the incident
        - essentially a letter to future self and team
        - there are templates for writing incident reports
    - should practice writing this stuff
# Investigating Application Performance Issues
- Run **Debugger** for code written in Java, Python, Go, Node.js and other languages
    - the debugged code can run on GCP resources
    - debugger must be enabled in the application
    - GCP resources will need to have the **Cloud Debugger Agent Role** in a service account for the Debugger API to work
- Debugger needs access to the source code
    - the debugger can also make snapshots by setting breakpoints
        - the snapshots will capture variables and other data
        - can add logs at breakpoints
- **Cloud Trace** tracks latency of apps
    - trace = a collection of spans
        - spans capture the latency and timeline of functions of an app
    - there is a trace list window to view summary of the latency of requests
    - there are automatic reports generated of latency
    - enable Trace by enabling the API for language
        - the data needs to be offloaded to GCP
            - thus there needs to be service accounts for the VM that give write access to write trace data
- Cloud Profiler = understand performance of applications
    - profiling in production systems is important
        - gathers CPU and memory usage to identify parts of application that consume a lot of resources
    - **Flame Graphs** - organizes processes and child process and how they make up the total resources used
## Lab notes
```bash
```
# Optimizing Costs of Monitoring
- logs cost a lot of money
- there are free tiers and free allotments 
- Know costs and spending (good if have previous info already)
    - know what you're buying
    - set alerts when spending reaches percentage of budget
- Can exclude 90% of Load Balancer logs and VPC Flow logs
    - a small amount of traffic from these services are good enough
    - exclude 200 HTTP status code 
- Spans are charged by count thus watch out for loops
- some logging agents from third-party software are too much
    - can omit the agent installation