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
    - the signals and data get sent to monitoring tools like ObservabilitSuite
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