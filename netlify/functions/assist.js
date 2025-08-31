const fetch = require("node-fetch");

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

async function queryHF(prompt) {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: prompt }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  return JSON.stringify(data);
}

async function summarize(rfp) {
  return queryHF(`Summarize this RFP:
${rfp}`);
}
async function qa(rfp, question) {
  return queryHF(`RFP:
${rfp}

Question: ${question}
Answer:`);
}
async function recommend(rfp) {
  return queryHF(`Based on this RFP, generate an initial solution outline:
${rfp}`);
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { action, payload } = JSON.parse(event.body || "{}");
    let text;
    if (action === "summarize") text = await summarize(payload.rfp);
    else if (action === "qa") text = await qa(payload.rfp, payload.question);
    else if (action === "recommend") text = await recommend(payload.rfp);
    else throw new Error("Unknown action");
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
