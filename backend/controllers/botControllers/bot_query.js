const OpenAI = require("openai");
const { Pinecone, Index } = require("@pinecone-database/pinecone");
const fs = require("node:fs");
const queryDetails = require("../../models/botModels/queryModel");

const path = "userLogs.log";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  model: "gpt-4o-mini",
  temperature: 0.5,
});

let conversationHistory = [];
let userName = ""; // For remembering user's name
console.log(userName);

// Function to send the current conversation to OpenAI API and get a response
async function getAIResponse(userMessage) {
  conversationHistory.push({ role: "user", content: userMessage });

  // Send conversation history to OpenAI API to simulate context
  const response = await openai.chat.completions.create({
    model: "gpt-4", // or gpt-4 if you're using GPT-4
    messages: conversationHistory,
  });

  const aiMessage = response.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: aiMessage });
  return aiMessage;
}

async function getEmbedding(inputText) {
  if (!inputText) {
    throw new Error("Input text is required for generating embeddings.");
  }

  try {
    // Generate the embedding for your input text
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: inputText,
      encoding_format: "float",
    });
    console.log("embeddings", embeddings);
    //   console.log("embeddings",embeddings.data[0].embedding)
    //   return embeddings.data
    // console.log(embeddings.data[0].embedding)
    return embeddings.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
  }
}

const pinecone = new Pinecone({
  apiKey: process.env["PINECONE_API_KEY"],
  // environment:'us-east-1'
});

const indexName = process.env.PINECONE_INDEX_NAME;
const index = pinecone.Index(indexName);

async function getData(inputText) {
  if (!inputText) {
    throw new Error("Input text is required for generating embeddings.");
  }
  try {
    // console.log('Get data', inputText)
    const queryVector = await getEmbedding(inputText);
    const response = await index.query({
      topK: 5, // top results
      includeMetadata: true,
      vector: queryVector,
    });
    // console.log("response=", response.matches);
    const matches = response.matches;
    const data = matches.map((match) => match.metadata.text);
    if (!response?.matches?.length) {
      return "I couldn't find any relevant documents to help with that. ";
    }

    // console.log(data)
    const relevantData = await getLLMResponse(data, inputText);

    return relevantData;
    // return response.matches
  } catch (error) {
    console.error("Error querying Pinecone:", error);
  }
}

async function getLLMResponse(documents, query) {
  conversationHistory.push({ role: "user", content: query });
  console.log(query);
  try {
    // Format the documents and query into a prompt for GPT
    const formattedDocuments = documents.join("\n"); // Combine multiple documents if needed
    const prompt = `Based on the following documents, provide a summary or answer to the query:\n\nDocuments:\n${formattedDocuments}\n\nQuery: ${query}`;
    const messages = [
      {
        role: "system",
        content:
          "Respond to user questions in a warm and friendly tone, using emojis to keep the conversation engaging and empathetic. Avoid repeating greetings or introductions with every response. If the user greets you, reply politely but do not summarize documents in response to the greeting. When a user provides a value for calculation, compute the annexure using ESI and Gross Salary rules, present the results in a table format, and include the disclaimer:“The annexure calculations provided are estimated values and may not reflect exact figures. Please use them as a reference only.”",
      },
      ...conversationHistory,
      { role: "user", content: prompt },
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fallback functions
      messages: messages,

      // max_tokens: 100,
    });
    console.log("response", response);
    // Return the LLM-generated response
    // return response.choices[0].message.content.trim();
    const aiMessage = response.choices[0].message.content.trim();

    // 4. Save assistant response to history
    conversationHistory.push({ role: "assistant", content: aiMessage });

    return aiMessage;
  } catch (error) {
    console.error("Error processing with LLM:", error);
    throw error;
  }
}

async function fetchIndex() {
  try {
    const indexes = await pinecone.listIndexes();
    //   console.log("Available indexes:", indexes);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchIndex();

const botQuery = async (req, res) => {
  const queryText = req.body.question;
  // console.log(req.body.question);
  const { question, userId, userName } = req.body;
  const user_id = req.body.userId;
  // console.log(req.body.userId);

  if (!userId && !userName) {
    return res.status(400).json({ error: "User ID or User Name is required" });
  }
  try {
    const { question, userId, userName } = req.body;
    const saveQuery = await queryDetails.create({
      userQuery: question,
      userId,
    });
    console.log(saveQuery, "saved query");
  } catch (error) {
    console.error(
      "Error in bot_query controller",
      error.name,
      ":",
      error.message
    );
  }

  // Simple context matching for user name-related questions
  const lowerCaseQuestion = question.toLowerCase();
  // if (!userId && !userName) {
  //   return res.status(400).json({ error: "User ID or User Name is required" });
  // }

  // Handle greeting with user's name if it exists
  const greetingKeywords = [
    "hello",
    "hi",
    "hey",
    "good morning",
    "good evening",
  ];
  // const isGreeting = greetingKeywords.some((keyword) =>
  //   question.toLowerCase().includes(keyword)
  // );
  // const lowerCaseQuestion = question.toLowerCase();
  const isGreeting = greetingKeywords.some((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(lowerCaseQuestion)
  );

  // If the user greets the bot
  // if (isGreeting && userName) {
  //   const greetingMessage = `Hello, ${userName}! How can I assist you today?`;
  //   conversationHistory.push({ role: "assistant", content: greetingMessage });
  //   return res.json({ answer: greetingMessage });
  // }
  let greetingMessage = "";
  if (isGreeting && userName) {
    // If the message is just a greeting (e.g. "hi", "hello"), respond and return
    const onlyGreeting = greetingKeywords.some(
      (keyword) => lowerCaseQuestion.trim() === keyword
    );

    if (onlyGreeting) {
      const greetingMessage = `Hello, ${userName}! 😊 How can I assist you today?`;
      conversationHistory.push({ role: "assistant", content: greetingMessage });
      return res.json({ answer: greetingMessage });
    }

    // If it's greeting + a query, continue processing after greeting
    greetingMessage = `Hello, ${userName}! 😊`;

    console.log("Greet Text",greetingMessage)
    conversationHistory.push({ role: "assistant", content: greetingMessage });
    // No `return` — continue processing the query below
  }

  // If the question is asking about the user's name
  const nameKeywords = [
    "my name",
    "who am i",
    "tell me my name",
    "what is my name",
  ];
  const asksAboutName = nameKeywords.some((keyword) =>
    lowerCaseQuestion.includes(keyword)
  );

  if (asksAboutName) {
    if (userName) {
      // Respond with the userName if available
      return res.json({ answer: `Your name is ${userName}` });
    } else {
      return res.status(404).json({ error: "User name not found in session" });
    }
  }
  try {
    // Get the relevant data from Pinecone
    const matchingData = await getData(queryText);
    console.log("Store this query in DB", queryText);

    console.log("Matching Policies:", matchingData);
    // console.log(typeof matchingData);
    const checkResponse = [
      "i can't provide",
      "I'm unable to provide",
      "i can't",
      "i couldn't find",
      "not covered",
      "not sure",
      "don't specifically cover",
      "unable to find",
      "I don’t have"
    ];

    const fallbackCheck = checkResponse.some((phrase) =>
      String(matchingData).toLowerCase().includes(phrase.toLowerCase())
    );

    console.log(fallbackCheck, "fallback");

    let logEntry = `\n${new Date().toISOString()} - ${user_id} - Query: ${queryText}\nMatching Data:\n${matchingData}\n`;

    // Append the log entry to the file
    fs.appendFile(path, logEntry, (err) => {
      if (err) {
        console.error("Error appending to log file:", err);
      } else {
        console.log("Successfully appended query response to log.");
      }
    });
    // // const matchingData = await getData(queryText);
    // const fullResponse = `${greetingMessage}${matchingData}`;
    // res.json({ answer: fullResponse });

    let finalAnswer = matchingData;

    if (fallbackCheck) {
      console.log("Fallback function. Query solution from OpenAI.");
      const aiFallbackResponse = await getAIResponse(queryText);
      finalAnswer = `${greetingMessage}${aiFallbackResponse}`;
    } else {
      finalAnswer = `${greetingMessage}${matchingData}`;
    }

    res.json({ answer: finalAnswer });

    // res.json({ answer: matchingData });

    // const aiMessage = res.json({ answer: matchingData });
    // conversationHistory.push({ role: 'assistant', content: aiMessage });
    // res.json({ answer: aiMessage });
  } catch (error) {
    console.error("Error during execution:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = botQuery;
