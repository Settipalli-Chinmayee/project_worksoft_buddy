const queryDetails = require("../../models/botModels/queryModel");

async function getuserQueries(req, res) {
  try {
    const limit = 10;
    const queries = await getQueries(limit);
    res.json(queries);
  } catch (error) {
    console.error("API error:", error);
    console.log(
      "Error in getuserQueries controller,",
      error.name,
      ":",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
}

async function getQueries(limit = 4) {
  try {
    const botQueries = await queryDetails
      .aggregate([
        {
          $group: {
            _id: "$userQuery",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
      ])
      .exec();

    console.log("Most asked queries:");
    botQueries.forEach((q, i) =>
      console.log(`${i + 1}. "${q._id}" — asked ${q.count} times`)
    );

    return botQueries;
  } catch (error) {
    console.error(
      "Error in getQueries controller:",
      error.name,
      ":",
      error.message
    );
    throw error; // Let the caller handle the response
  }
}

async function recentQueries(req, res) {
  let userId = req.params.id;
  // console.log("get recent 5 questions for",userId);
  try {
    const fiveQueries = await queryDetails
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    const uniqueMap = new Map();
    for (let doc of fiveQueries) {
      if (!uniqueMap.has(doc.userQuery)) {
        uniqueMap.set(doc.userQuery, doc);
      }
      if (uniqueMap.size >= 5) break;
    }
    // console.log("uniqueMap",uniqueMap)

    const uniqueFive = Array.from(uniqueMap.values());

    // console.log("Found recent questions:", fiveQueries);
    // console.log("five questions!",uniqueFive);
    res.status(200).json({ recentQueries: uniqueFive });
  } catch (error) {
    console.error("Error in recentQueries:", error);
    res.status(500).json({ error: "Failed to fetch recent queries" });
  }
}

async function searchText(req, res) {
  let userId = req.params.id;
  let userText = req.params.val;
  // console.log(userText);
  try {
    const relatedQuery = await queryDetails
      .find({
        userId: userId,
        userQuery: { $regex: userText, $options: "i" },
      })
      // .limit(5);
    const uniqueSearch = new Map();
    for (let doc of relatedQuery) {
      if (!uniqueSearch.has(doc.userQuery)) {
        uniqueSearch.set(doc.userQuery, doc);
      }
      if (uniqueSearch.size >= 5) break;
    }

    const searchedQueries = Array.from(uniqueSearch.values());
    // console.log("related queries", searchedQueries);
    res.status(200).json(searchedQueries);
  } catch (error) {
    console.error("Error in recentQueries:", error);
    res.status(500).json({ error: "Failed to fetch related queries" });
  }
}

module.exports = { getuserQueries, recentQueries, searchText };
