# Cloud Storage: Qwik Start - Cloud Console
```bash
# can make folders and subfolders in buckets
# can upload files and then change permissions
# the permissions can be controlled by principals of the bucket
```
# Cloud IAM: Qwik Start
```bash
# within the Projects IAM one can see the users and their permissions
# change IAM permissions and roles for users to affect access to GCP resources
# these changes should affect shell access and Google Console access as well
```
# Cloud Monitoring: Qwik Start
```bash
# make a VM and run apache on it yadiyadiyaaa
# install the Op agents for collecting logs and metrics and sending it to Cloud Logging and Cloud Monitoring 
curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
# check status of agent
sudo systemctl status google-cloud-ops-agent"*"

# can create uptime checks in the Monitoring section
# can also make alerts for the metrics that one is monitoring
# make dashboards to monitor metrics
# view logs at the Logger Explorer
```
# Cloud Functions: Qwik Start - Commandline
```bash
# cloud functions are event based and can be triggered by Pub/Sub
# they are also serverless and the infrastructure is automatically handled

# function code
/**
* Background Cloud Function to be triggered by Pub/Sub.
* This function is exported by index.js, and executed when
* the trigger topic receives a message.
*
* @param {object} data The event payload.
* @param {object} context The event metadata.
*/
exports.helloWorld = (data, context) => {
const pubSubMessage = data;
const name = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString() : "Hello World";
console.log(`My Cloud Function: ${name}`);
};
# deploy a function. code is stored in a local dir
# trigger can be one of three: topic, bucket, http
gcloud functions deploy helloWorld \
  --stage-bucket [BUCKET_NAME] \
  --trigger-topic hello_world \
  --runtime nodejs8
# check status of functions
gcloud functions describe helloWorld
# tests the function by calling an event
DATA=$(printf 'Hello World!'|base64) && gcloud functions call helloWorld --data '{"data":"'$DATA'"}'
# view the logs of the function
gcloud functions logs read helloWorld
```
# Cloud Pub/Sub: Qwik Start - Python
```bash
# Pub/Sub reliably sends messages to app
# apps subscribe to these channels and receive the messages posted

# create a python virtual enviroment
# install the pubsub libraries
pip install --upgrade google-cloud-pubsub

# topic is the channel or board where apps connect with one another
# publishing is when someone pushes messages to the Cloud Pub/Sub topic
# Subscribers will need to subscribe to that topic to pull messages form it

# install the python API to install the scripts for running pubsub
git clone https://github.com/googleapis/python-pubsub.git
# use the python script to make a topic 
python publisher.py $GOOGLE_CLOUD_PROJECT create MyTopic
# use the python script to make a subscription
python subscriber.py $GOOGLE_CLOUD_PROJECT create MyTopic MySub
# publish messages
gcloud pubsub topics publish MyTopic --message "Hello"
# pull messages from the topic using the subscription
python subscriber.py $GOOGLE_CLOUD_PROJECT receive MySub

# topics are strings that allow apps to connect with one another
```