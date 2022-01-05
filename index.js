const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f4mgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Express
async function run() {
	try {
		await client.connect();
		const database = client.db("TechGadets");
		const productCollection = database.collection("products");

		// add product
		app.post("/products", async (req, res) => {
			const product = req.body;
			const result = await productCollection.insertOne(product);

			res.json(result);
			console.log(result);
		});

		// GET DATA
		app.get("/products", async (req, res) => {
			const result = await productCollection.find({}).toArray();
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);
app.get("/", (req, res) => {
	res.send("Hello Tech Gadgets");
});

app.listen(port, () => {
	console.log(`Listening at ${port}`);
});
