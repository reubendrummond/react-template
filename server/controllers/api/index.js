const router = require("express").Router();
const axios = require("axios");
const { NotFoundError } = require("../../utils/ErrorTypes");

router.get("/", async (req, res, next) => {
  try {
    const { query, nextToken } = req.query;
    if (!query)
      throw new NotFoundError("Query parameter required. eg ?query=cats");
    const queryString = nextToken ? `&next_token=${nextToken}` : "";
    const data = await axios.get(
      `https://api.twitter.com/2/tweets/search/recent?query=${query}&expansions=attachments.media_keys,entities.mentions.username,author_id&user.fields=name,username,profile_image_url,url&tweet.fields=attachments&media.fields=url${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    res.status(200).send(data.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
