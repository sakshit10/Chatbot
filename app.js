const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const sessionId = uuid.v4();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/send-msg', (req, res) => {
 
  runSample(req.body.MSG)
    .then(data => {
      res.send({ Reply: data });
    })
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'rn-bot-ptcg') {
  

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename:"C:/Users/Sanket/Desktop/Chatbot/rn-bot-ptcg-385707-a88ad4f125bb.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
        text: {
            text: msg,  // Use the input message from the user
            languageCode: 'en-US',
        },
    },
};


  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log('  No intent matched.');
  }
  return result.fulfillmentText;
}

app.listen(port,()=>{
    console.log("running on port " + port);
});