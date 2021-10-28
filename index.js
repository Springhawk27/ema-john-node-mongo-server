// touch .gitignore && echo "node_modules/" >> .gitignore && git rm -r --cached node_modules ; git status

// npm init -y
// create index.js
// npm install express cors mongodb dotenv
// nodemon already install globally
// add these 2 lines in package.json
// "start": "node index.js",
// "start-dev": "nodemon index.js",

// step 10
// create .env file 


// step 1
const express = require('express');
// step 6
const { MongoClient } = require('mongodb');
//step 11
require('dotenv').config()


// step 8
const cors = require('cors');

// step 2
const app = express();
// step 3
const port = process.env.PORT || 5000;

// step 9
app.use(cors());
app.use(express.json());

// step 7
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42wwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

// database 
async function run() {
    try {
        await client.connect();
        // console.log('database connected sucessfully');
        // database creation
        const database = client.db('online_shop');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');

        // GET products API (all)
        app.get('/products', async (req, res) => {
            // console.log(req.query);

            const cursor = productCollection.find({});

            const page = req.query.page;
            const size = parseInt(req.query.size);

            let products;
            const count = await cursor.count();

            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                products = await cursor.toArray();

            }

            // const products = await cursor.toArray();
            // const products = await cursor.limit(10).toArray();
            // const count = await cursor.count();
            res.send({
                count,
                products
            });
        });

        // use POST to get data by keys
        app.post('/products/bykeys', async (req, res) => {
            // console.log(req.body);
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await productCollection.find(query).toArray();
            // res.send('hitting post');
            res.send(products);
        });

        // add orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;

            // console.log('order', order);
            const result = await orderCollection.insertOne(order);
            // res.send('order processed');
            res.json(result);
        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


//step 4
app.get('/', (req, res) => {
    res.send("ema john server is running")
});
// step 5
app.listen(port, () => {
    console.log('server running at port', port)
})
