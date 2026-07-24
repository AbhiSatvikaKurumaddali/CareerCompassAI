const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extracts plain text from an uploaded PDF resume.
 * Falls back to an empty string (rather than throwing) so the rest of the
 * app keeps working even if a file is malformed.
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(dataBuffer);
    return parsed.text || "";
  } catch (err) {
    console.error("Resume parsing error:", err.message);
    return "";
  }
}

module.exports = { extractTextFromPDF };
