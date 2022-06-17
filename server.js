import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
/***************************/

// Init
const app = express();
const projectData = {};

// Listening port
const port = 3000;

// Here we are configuring express to use body-parser and cors as Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// disable header "x-powered-by: Express"
app.disable("x-powered-by");

// Initialize the main project folder
app.use(express.static("website"));

// Routes
app.get("/projectData", (req, res) => {
    // list
    res.json(projectData);
});

app.post("/projectData", (req, res) => {
    // push
    const { temp, date, content } = req.body;
    projectData.temp = temp;
    projectData.date = date;
    projectData.content = content;
    // send empty 200OK
    res.send();
});

// Run the server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
