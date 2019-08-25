const Koa = require("koa");
const path = require("path");
const render = require("koa-ejs");
const send = require("koa-send");
const bodyparser = require("koa-bodyparser");
const mongoose = require("mongoose");
require("dotenv/config");

const app = new Koa();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => {
  console.log("MongoDB connected");
});

// Middleware
render(app, {
  root: path.join(__dirname, "views"),
  cache: false
});

app.use(bodyparser());

// Routes
app
  .use(require("./routes/index").routes())
  .use(require("./routes/index").allowedMethods());

// Serve static files
app.use(async ctx => {
  await send(ctx, ctx.path, { root: __dirname + "/static" });
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
