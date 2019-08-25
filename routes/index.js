const Router = require("koa-router");
const validateURL = require("valid-url");
const Url = require("../models/Url");

const router = new Router();

// GET
router.get("/", async ctx => {
  const urls = await Url.find();
  await ctx.render("index", {
    urls,
    shortUrl: ctx.origin
  });
});

// POST
router.post("/", async ctx => {
  // Check if URL is valid, if not then return a flash error
  const urls = await Url.find();

  if (typeof validateURL.isUri(ctx.request.body.url) === "undefined") {
    await ctx.render("index", {
      error: "Please enter a valid URL",
      urls,
      shortUrl: ctx.origin
    });
    return;
  }

  // Check if URL already exists, if true then return a flash error
  try {
    shortenedUrl = await Url.exists({ url: ctx.request.body.url });
    if (shortenedUrl) {
      await ctx.render("index", {
        error: "That URL was already shortened",
        urls,
        shortUrl: ctx.origin
      });
      return;
    }
  } catch (err) {
    console.log(err);
    await ctx.render("index", {
      error: "Something went wrong, plese try again.",
      urls,
      shortUrl: ctx.origin
    });
  }

  // Enter URL into database
  try {
    const newUrl = new Url({
      url: ctx.request.body.url
    });

    await newUrl.save();
    await ctx.redirect("/");
  } catch (err) {
    console.log(err);
    await ctx.render("index", {
      error: "Something went wrong, plese try again.",
      urls,
      shortUrl: ctx.origin
    });
  }
});

// Check for shortened Url and redirect if valid, if not then return a flash error
router.get("/:id", async ctx => {
  const id = ctx.params.id;
  const urls = await Url.find();

  try {
    const shortenedUrl = await Url.findById(id);
    if (shortenedUrl === null) {
      await ctx.render("index", {
        error: "That shortened URL doesn't exist",
        urls,
        shortUrl: ctx.origin
      });
      return;
    } else {
      ctx.redirect(shortenedUrl.url);
      await shortenedUrl.updateOne({ $inc: { visits: 1 } });
    }
  } catch (err) {
    console.log(err);
    ctx.render("index", {
      error: "Something went wrong, plese try again.",
      urls,
      shortUrl: ctx.origin
    });
  }
});

router.get("/:*/:*", async ctx => {
  console.log(ctx.params);
});

module.exports = router;
