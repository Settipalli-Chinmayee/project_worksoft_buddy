
const { getQueries } = require("../../controllers/botControllers/getQueries");

async function fetchTopUserQueries(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const queries = await getQueries(limit);
    req.topUserQueries = queries; // attach to request object
    next(); // pass to the next handler
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { fetchTopUserQueries };
