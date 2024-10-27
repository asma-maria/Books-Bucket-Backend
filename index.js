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
    const productCollection = database.collection('products');
    const categoryCollection = database.collection('categories');
    const orderCollection = database.collection('orders');
    const wishlistCollection = database.collection('wishlist');

    //api requests

    //users
    app.get("/users", async (req, res)=>{
        const query = userCollection.find();
        const result = await query.toArray();
        res.send(result);
    })

    app.get("/user/:id", async (req, res)=>{
        const id = req.params.id;
        const query = {uid: id}
        const result = await userCollection.findOne(query);;
        res.send(result);
    })

    app.post("/user/:id", async (req, res)=>{
        const id = req.params.id;
        const query = {uid: id}
        const user = { $set: req.body };
        const options = { upsert: true }; 
        const result = await userCollection.updateOne(query, user, options)
        res.send(result)
    })

    //categories
    app.get("/categories", async (req, res)=>{
        const query = categoryCollection.find();
        const result = await query.toArray();
        res.send(result);
    })

    app.post("/category", async (req, res)=>{
        const category = req.body;
        const result = await categoryCollection.insertOne(category)
        res.send(result)
    })

    //products
    app.get("/products/:category?", async (req, res)=>{
        const category = req.params.category;
        let query = {
            available: true
        }

        if(category) {
            query = {
                ...query,
                category: category
            }
        }

        const result = await productCollection.find(query).toArray();
        res.send(result);
    })

    app.post("/product", async (req, res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    app.put("/product/:id", async (req, res)=>{
        const id = new ObjectId(req.params.id)
        const product = { $set: req.body }
        const query = {_id: id}
        const result = await productCollection.updateOne(query, product)
        console.log(result)
        res.send(result)
    })

    app.get('/product/:id', async (req, res)=>{
        const id = new ObjectId(req.params.id);
        const query = {_id: id}
        const book = await productCollection.findOne(query);
        res.send(book);
    })

    //order
    app.get("/myOrders/:userId", async (req, res)=>{
        const userId = req.params.userId;
        const query = {user_uid: userId}
        const result = await orderCollection.find(query).toArray();
        res.send(result);
    })

    app.post("/order", async (req, res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order)
        res.send(result)
    })

    //wishlist
    app.post("/wishlist", async (req, res)=>{
        const wishlist = req.body;
        const result = await wishlistCollection.insertOne(wishlist)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to Books Bucket Database!");
  } finally {

  }
}

run().catch(console.dir);

//import json data
const featured = require("./data/featured.json")
const faq = require("./data/faq.json")

//APIs
app.get('/', (req, res)=>{
    res.send("Books Bucket Server is running")
})

app.get('/featured', (req, res)=>{
    res.send(featured);
})

app.get('/faq', (req, res)=>{
    res.send(faq);
})

app.listen(port, ()=>{
    console.log(`Books Bucket server is running on port ${port}`);
})