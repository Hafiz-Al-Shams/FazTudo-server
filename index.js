const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




// middleware
// app.use(
//     cors({
//         origin: [
//             "http://localhost:5173",
//             "https://faztudo-8a1ba.web.app",
//             "https://faztudo-8a1ba.firebaseapp.com",
//             "https://faztudo-6c7cd4.netlify.app",
//         ],
//         // credentials: true,
//     })
// );
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkfjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");



        const userCollection = client.db("fazTudoDB").collection("users");
        const taskCollection = client.db("fazTudoDB").collection("tasks");





        // users APIs
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });



        app.post('/users', async (req, res) => {
            // console.log('click successful');
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });




        // task related APIs
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        });


        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query);
            res.send(result);
        });


        app.post('/tasks', async (req, res) => {
            // console.log('click successful');
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });


        // new code1
        app.patch('/tasks/:id', async (req, res) => {
            const taskId = req.params.id;
            const { category } = req.body;

            const filter = { _id: new ObjectId(taskId) };
            const updateDoc = {
                $set: { category: category },
            };

            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        });


        app.patch('/update-task/:id', async (req, res) => {
            const newTask = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    title: newTask.title,
                    description: newTask.description,
                    category: newTask.category,
                }
            }

            const result = await taskCollection.updateOne(filter, updatedDoc)
            res.send(result);
        });


        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });































    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('TudoSpeedo server is working!')
});


app.listen(port, () => {
    console.log(`TudoSpeedo server is doing work on PORT: ${port}`)
});