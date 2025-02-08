import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const summarizeArticle = async (url) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze the article at ${url} and provide a well-formatted response with the following:

1. Extract the source name (website/publication name) from the URL
2. Write a concise summary (2-3 paragraphs)
3. List 5 key takeaways
4. Provide one valuable insight

Format the response exactly like this (maintain spacing and formatting):

Source: [Publication Name]

Summary:
[Write the summary here, broken into paragraphs for readability]

Key Takeaways:
1. [First takeaway]
2. [Second takeaway]
3. [Third takeaway]
4. [Fourth takeaway]
5. [Fifth takeaway]

Key Insight:
[Single line insight that provides unique value]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error("Failed to summarize article: " + error.message);
  }
};