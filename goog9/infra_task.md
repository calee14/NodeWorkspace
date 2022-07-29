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
# Foundational Infrastructure Tasks in Google Cloud: Challenge Lab
```bash
pip install --upgrade google-cloud-pubsub
git clone https://github.com/googleapis/python-pubsub.git
# visit the ptyhon-pubsub/samples/snippets/
python publisher.py $GOOGLE_CLOUD_PROJECT create memories-topic-242

# put the cloud function code into a file
# make the cloud function using the code in the dir
gcloud functions deploy memories-thumbnail-creator \
    --entry-point=thumbnail \
    --trigger-bucket=memories-bucket-46207 \
    --runtime nodejs14
```
## the code for the cloud function to check the subscribe to the topic
```js
/* globals exports, require */
//jshint strict: false
//jshint esversion: 6
"use strict";
const crc32 = require("fast-crc32c");
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();
const { PubSub } = require('@google-cloud/pubsub');
const imagemagick = require("imagemagick-stream");
exports.thumbnail = (event, context) => {
  const fileName = event.name;
  const bucketName = event.bucket;
  const size = "64x64"
  const bucket = gcs.bucket(bucketName);
  const topicName = "memories-topic-242";
  const pubsub = new PubSub();
  if ( fileName.search("64x64_thumbnail") == -1 ){
    // doesn't have a thumbnail, get the filename extension
    var filename_split = fileName.split('.');
    var filename_ext = filename_split[filename_split.length - 1];
    var filename_without_ext = fileName.substring(0, fileName.length - filename_ext.length );
    if (filename_ext.toLowerCase() == 'png' || filename_ext.toLowerCase() == 'jpg'){
      // only support png and jpg at this point
      console.log(`Processing Original: gs://${bucketName}/${fileName}`);
      const gcsObject = bucket.file(fileName);
      let newFilename = filename_without_ext + size + '_thumbnail.' + filename_ext;
      let gcsNewObject = bucket.file(newFilename);
      let srcStream = gcsObject.createReadStream();
      let dstStream = gcsNewObject.createWriteStream();
      let resize = imagemagick().resize(size).quality(90);
      srcStream.pipe(resize).pipe(dstStream);
      return new Promise((resolve, reject) => {
        dstStream
          .on("error", (err) => {
            console.log(`Error: ${err}`);
            reject(err);
          })
          .on("finish", () => {
            console.log(`Success: ${fileName} → ${newFilename}`);
              // set the content-type
              gcsNewObject.setMetadata(
              {
                contentType: 'image/'+ filename_ext.toLowerCase()
              }, function(err, apiResponse) {});
              pubsub
                .topic(topicName)
                .publisher()
                .publish(Buffer.from(newFilename))
                .then(messageId => {
                  console.log(`Message ${messageId} published.`);
                })
                .catch(err => {
                  console.error('ERROR:', err);
                });
          });
      });
    }
    else {
      console.log(`gs://${bucketName}/${fileName} is not an image I can handle`);
    }
  }
  else {
    console.log(`gs://${bucketName}/${fileName} already has a thumbnail`);
  }
};
```
```json
{
  "name": "thumbnails",
  "version": "1.0.0",
  "description": "Create Thumbnail of uploaded image",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@google-cloud/pubsub": "^2.0.0",
    "@google-cloud/storage": "^5.0.0",
    "fast-crc32c": "1.0.4",
    "imagemagick-stream": "4.1.1"
  },
  "devDependencies": {},
  "engines": {
    "node": ">=4.3.2"
  }
}
```