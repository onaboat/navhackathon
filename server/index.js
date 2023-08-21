const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dataProposal = require('./dataProposal');  // Update with the correct path

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const uri = "mongodb+srv://onaboatatsea99:dpB0jn9w5EvW3BPz@snaps-dao.ziyi6yg.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let previousData = [];

async function run() {
  try {
    const result = await dataProposal(previousData);  // Fetch the data
    const { data, hasDataChanged } = result;

    console.log(JSON.stringify(data));
    console.log(hasDataChanged);

    // Connect the client to the server if not already connected
    try {
      await client.connect();
      console.log("Connected to MongoDB!");
    } catch (err) {
      // If we're already connected, ignore the error
      if (err.message !== 'MongoClient must be connected before calling MongoClient.prototype.db') {
        throw err;  // Rethrow if it's a different error
      }
    }

    // database save
    const db = client.db('Snaps-DAO');
    const collection = db.collection('ProposalData');

    // Only save the data to the ProposalData collection if it has changed
    if (hasDataChanged) {
      await collection.insertMany(data);
    }

    // Save the hasDataChanged flag to a separate collection
    const flagsCollection = db.collection('Flags');
    await flagsCollection.updateOne(
      { flag: 'dataChanged' },
      { $set: { value: hasDataChanged } },
      { upsert: true }
    );

    console.log("Data saved");

    // Update the previousData with the new data
    previousData = data;

  } catch(err) {
    console.dir(err);
  }
}


// timer 

(async function() {
  try {
    // Running the function once at the start
    await run();
    console.log("RUNNING ---- RUNNING ---- RUNNING");

    // Then setting the interval to run it every minute
    setInterval(run, 180000); // 60000 milliseconds = 1 minute
  } catch(err) {
    console.dir(err);
  }
})();


app.get('/data-changed', async (req, res) => {
  // Connect the client to the server
  await client.connect();
  const db = client.db('Snaps-DAO');
  const flagsCollection = db.collection('Flags');
  
  // Fetch the hasDataChanged flag from the database
  const dataChangedFlag = await flagsCollection.findOne({ flag: 'dataChanged' });
  
  // Respond with the value of the hasDataChanged flag
  res.send(dataChangedFlag.value);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
