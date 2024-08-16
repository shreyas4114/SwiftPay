const express = require("express");
const mainRounter = require("./routes/index");
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

app.use(cors());
// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use("/api/v1", mainRounter);
// all the routes starts from /api/v1

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});