const express = require('express')
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzaf0.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;



const app = express()
const port = 6001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    // perform actions on the collection object
    console.log('database connected');

    app.post('/addProduct', (req, res) => {
        const products = req.body;                   // client side theke eikhane info ashbe
        //   console.log(product);
        productsCollection.insertMany(products)                // client theke ja ashbe products e sheita add korbe mane database e add hobe. eitarjonno cors r parser dorkar
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })

    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

});




app.listen(process.env.PORT || port)