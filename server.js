const express = require("express");
const cors = require("cors");
const listRouter = require("./src/routes/listmenu");
const notFound = require("./src/middlewares/notFound");
const handleError = require("./src/middlewares/handleError");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/", listRouter);

app.use("*", notFound);
app.use(handleError);

const port = process.env.PORT || 8800;
app.listen(port, console.log(`server is running on ${port}`));
