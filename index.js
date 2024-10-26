const express=require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//mongodb connect
//const uri="mongodb://localhost:27017/";
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sojng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yixyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
  try {
    await client.connect();
    const database = client.db('booksbucket_db_user');
    const userCollection = database.collection('users');
    

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to Books Bucket Database!");
  } finally {

  }
}

run().catch(console.dir);

//import json data
//const featured = require("./data/featured.json")
//const faq = require("./data/faq.json")

//APIs
app.get('/', (req, res)=>{
    res.send("Books Bucket Server is running")
})

//app.get('/featured', (req, res)=>{
    //res.send(featured);
//})

//app.get('/faq', (req, res)=>{
//    res.send(faq);
//})

app.listen(port, ()=>{
    console.log(`Books Bucket server is running on port ${port}`);
})