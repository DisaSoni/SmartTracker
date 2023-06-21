const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const workspaceRoutes = require('./src/routes/workspace.route');
const boardRoutes = require('./src/routes/board.route');
const listRoutes = require('./src/routes/list.route');
const labelRoutes = require('./src/routes/label.route');
const userRoutes = require('./src/routes/user.route');
const commentRoutes = require('./src/routes/comment.route');
const bugRoutes = require('./src/routes/bug.route');
const verifyAuth = require('./src/middleware/verifyAuth');
const cors = require('cors');
  
  
const app = express();
const port = process.env.PORT || 3080;

app.use(bodyParser.json());

// CORS is enabled for all origins
app.use(cors());

// Mongoose connection
mongoose.connect(
    `mongodb+srv://disasoni28:admin@smarttracker.xh4vx06.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connected successfully");
});

// Routes
app.use('/workspaces', workspaceRoutes);
app.use('/boards', boardRoutes);
app.use('/lists', listRoutes);
app.use('/labels', labelRoutes);
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);
app.use('/bugs', bugRoutes);


app.get('/', (req, res) => {
    res.json({ "message": "Started working" });
});

app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
})