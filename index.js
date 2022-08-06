const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json())

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8hb3o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run ()
{
    try
    {
        await client.connect(); 
        const userCollection = client.db('ebazzar').collection('users');
        const productsCollection = client.db('ebazzar').collection('products');
        //const ordersCollection = client.db('ebazzar').collection('orders');
        /* app.put('/users' , async(req,res) =>
        {
            const userDetailes = req.body;
            const filter = { email: userDetailes.email };
            const options = { upsert: true }
            const updateDoc = {
                $set: userDetailes
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)

            res.send(result)
        }) */

        app.get('/products', async(req , res)=>
        {
            const query = {};
            const cursor = productsCollection.find(query);
            let items;
            items = await cursor.toArray();
            console.log(items);
            res.send(items)
        })

        app.get('/users', async(req , res)=>
        {
            const query = {};
            const cursor = userCollection.find(query);
            let items;
            items = await cursor.toArray();
            console.log(items);
            res.send(items)
        })

        app.get('/search/:product' , async(req , res)=>
        {
            const searchProduct = req.params.product;
            const cursor = productsCollection.find({"category" : searchProduct})
            let items;
            items = await cursor.toArray()
            console.log(items);
            res.send(items)
        })


        app.get('/user/:email' , async(req,res) =>
        {
            const email = req.params.email;
            const cursor = userCollection.find({"email" : email})
            let items;
            items = await cursor.toArray()
            console.log(items);
            res.send(items)
        })

 /*        app.post('/orders' , async(req,res)=>
        {
            const doc = req.body
            
            const result = await ordersCollection.insertOne(doc)
            res.send(result)
        })

        app.get('orderItems' , async(req,res)=>
        {

        })

        app.put('/payment' , async(req,res)=>
        {

        })*/

        app.put('/makeAdmin/:id', async(req,res)=>
        {
            const id = req.params.id;
            

            const update = req.body;
            const filter = { "_id": ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: update
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        app.post("/newProduct" , async(req , res)=>
        {
            const newProduct = req.body
  
            const result = await productsCollection.insertOne(newProduct)
            res.send(result)

        })
 

    }

    finally
    {

    }
}

run().catch(console.dir)

app.get('/' ,(req,res) =>
{
    res.send('E-bazer Running')
})

app.listen(port , ()=>
{
    console.log("E-Bazar-server running in port " , port);
})