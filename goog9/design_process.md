# Defining Services
- Building **requirements** for a project ask the questiosn:
    - who? - user, developers and stakeholders of app (who is being affected)
    - what? - main areas of functionality of app but it has to be clear. 
    - why? - reason for needing the system.
    - when? - timeline for users and developers
    - how? - how will the system work? number of users at a time? amount of data?
        - average payload size of service requests? latency requirements?
        - where users are
- **Qualatative requirements**:
- Roles represent the goal of a user. 
    - However, it can also be a microservice talking to another service
    - brainstorm roles of what users might do and then group together ones that belong to a specific action = role
    - **Persona** - a typical person who takes a role.
        - tells a story about that person and what they do
    - **User stories** - describe what the user wants the app to do and why the want to do it
        - **INVEST** criteria. evaluate user stories
            - Independent, Negotiable, Valuable, Estimatable, Small, Testable
- **Quantitative requirements** - measureable data based on constraints: time, finance, people
    - availability (accessibility), latency (time), throughput (durability, how much we can handle)
- **Key Performance Indicators (KPIs)** - measure success of product, app
    - for business: ROI, EBIT, Employee turnover, Customer churn
    - for tech: Page view, User registration, Clickthroughs, Checkouts
    - KPI's indicate if you're on track to acheive the goal
    - Need to define KPIs that mean success and signs that we're reaching the goal
    - KPIs must be **SMART**
        - Specific (more detail better), Measurable (know steps to reach objective), Achievable (attainable), Relevant (make sure it matters and is benefitial), Time-based (due dates, time available)
- **Service Level Indicators** - measurement of features of a service
    - Error rate, throughput, latency
    - must be countable/measureable and bound by time
        - Good to use percentile metrics for SLIs
- **Service Level Objectives** - agreed target of values for a measurement from an SLI
    - should improve user experience
    - shouldn't be too ambitious and out of reach.
        - _attainable_ and reasonable within costs
    - divide the SLO into parts for more performance gauge
        - 50% will be complete within 100 milliseconds
    - start with lower SLOS and something simple
    - don't deal in absolutes (100%)
    - don't have too many SLOs. only need to cover the key app attributes (features users care about)
- **Service Level Agreements** - agreement between service provider and consumer
    - service provider defines responsibilities and consequences if service not met
    - aka. a contract between the provider and the customer
        - better to be conservative with SLAs
            - there should be some saftey or threshold. lower than the SLO
- **NOTE:** - user experience isn't measureable or time bound, thus it's not a good KPI
    - user story = description of a feature written from the user's POV
# Microservice Design and Architecture
- **Microservices** = divide large program into independent services
    - this enables teams to work together better and faster
    - App Engine, Cloud Run, Kubernetes Engine, Cloud Functions help with building microservices 
    - Each service needs to have its **own** datastore for independence
    - better for scaling, logging errors, innovating, use different langauges for different services
    - Challanges: hard to define clear boundaries between services
        - more complex infrastructure between services: latency, security, different versions
        - backward compatibility as services might update
    - Microservices for an application should developed internalyl and be exposed through an API
        - The next layer should be the architectual layer where apps should be User Interfaces (web, iOS, android)
            - Last layer: Isolate services that provide data sharing by securing it with authentication
    - **Stateful services** (service connected to database) - harder to scale, upgrade, need to backup
        - avoid storign shared state in-memory on servers
            - this requries sticky sessions for the load balancer, meaning requests from one client go to the same server instance aka. **session affinity**
            - messes up elastic autoscaling
            - to fix use stateful services like Datastore or CloudSQL. then cache data for faster access speeds using Memorystore
                - allows for load balancer to scale backend and keep up with demand
    - **Stateless services** - easier to scale, update versions, and deploy
- **Twelve-Factor App** - set of practices for building web or SaaS
    - decouple components off an app so that each component can be deployed to cloud using Continuous Deployment and scale easily
    1. Codebase - use Git version control. Cloud Source Control
    2. Dependencies - use package manager, and declare dependencies in codebase (requirements file)
    3. Configuration - stored in enviroment. store secrets, connection strings, endpoints in env. variables
    4. Backing Services - DB, caches, queues, accessible via URL. 
    5. Build, Release, Run - build deployment package from source code, each package should be related to a specific release. The release is linked to the runtime enviroment config with a build. This allows history of every deployment in production (good for rollback). Run = execute application
    6. Processes - apps run in one or more processes (stateless), the instances of the app get data from a isolated db service
    7. Port binding - services should be exposed using a port number. The apps combines the webserver with the app itself so no need for a seperate Apache server.
    8. Concurrency - app run in containers and should be able to scale up and down to meet load by adding more instances
    9. Disposability - the app instances should be able to shutdown in case of failure and cause no errors or future ones. also must have fast bootup speeds
    10. Dev/prod parity - same enviroments in test/staging as production. can be achieved with Docker and Terraform (Infrastructure as Code)
    11. Logs - logs are event streams, write logs to a single source and monitor apps
    12. Admin processes - one-off processes that should be decoupled (not part of) from the application. Automated and repeatable. Not manual
- **REST** - Representational State Transfer
    - works on the HTTP protocol but others as well
        - gRPC (a streaming protocol)
    - microservices should provide a contract to its clients, microservices and applications
    - others might need older versions of the service, thus must be alble to roll back to older version
    - clients communicate with servers using HTTPS text based payloads (GET, POST, PUT, DELETE)
        - body of the request is formatted as JSON or XML
        - results returned as JSON, XML, HTML
        - services should add functionality without breaking current clients code. (thus can only add and not delete)
    - resources a identified by URIs (endpoints)
    - RESTful API must be consistent interfaces and can have additional resources (--help)
    - could use caching for a RESTful server
    - **Resource** - accessible through an URI (type of data we want)
        - server returns a **Representation**, json-formatted data which is a collection of items (performance better)or single items of that resource
        - considered as **Batch APIS** ^ 
    - Public-facing or external APIs - use JSON for passing representations between services
    - Internal services use gRPC
- 