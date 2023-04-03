const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000


// middlewhare
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xshjalb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const taskCollection = client.db("todoDashboard").collection("task");

        // Get All Task:-
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray()
            res.send(result)
        })

        // Get A Single Task Data:-
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(filter)
            res.send(result)
        })

        // Post Task:-
        app.post('/addTask', async (req, res) => {
            const data = req.body;
            const tags = {
                tags: "task",
            };
            const newData = {
                ...data,
                ...tags
            };
            const result = await taskCollection.insertOne(newData);
            res.send(result);
        });

        // Delete Task:-
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result);
        })

        // update single Task:-
        app.put('/editTask/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            const upsert = { upsert: true }
            const updateDoc = {
                $set: data
            }
            const result = await taskCollection.updateOne(query, updateDoc, upsert)
            res.send(result);
        })

    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello From Hellwet!')
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})