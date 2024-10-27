const https = require("https");
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const rfs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: ["https://metinasana.lv", "https://www.metinasana.lv"],
  })
);
app.use(express.json());

const emailSchema = Joi.object({
  courseType: Joi.string().allow("").optional(),
  company: Joi.string().min(0).max(50).allow("").optional(),
  name: Joi.string().min(3).max(50).required(),
  phone: Joi.string()
    .allow("")
    .pattern(/^\d{8,}$/)
    .optional(),
  email: Joi.string().email().required(),
  comments: Joi.string().optional(),
});

// Rate limiter for API requests
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", apiLimiter);

const readJsonFile = async (filePath) => {
  console.log(`Attempting to read JSON file: ${filePath}`);
  try {
    const data = await fs.readFile(filePath, "utf8");
    console.log(`Successfully read JSON file: ${filePath}`);
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      // File not found
      console.error(`File not found: ${filePath}`);
      throw new Error("Requested data not found");
    } else {
      console.error(`Error reading or parsing ${filePath}:`, err);
      throw new Error("Internal server error");
    }
  }
};

const writeJsonFile = async (filePath, data) => {
  console.log(`Attempting to write JSON file: ${filePath}`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote JSON file: ${filePath}`);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw new Error("Internal server error");
  }
};

// Endpoint to serve various data
app.get("/api/:lang/:dataType", async (req, res) => {
  const { lang, dataType } = req.params;
  console.log("Data type received:", dataType);
  console.log(`GET request for ${dataType} in ${lang} language`);

  const validDataTypes = [
    "courses",
    "faq",
    "about",
    "sertification",
    "learner",
  ];

  // Validate data type
  if (!validDataTypes.includes(dataType)) {
    return res.status(400).json({ error: "Invalid data type requested" });
  }

  const filePath = path.join(__dirname, "data", lang, `${dataType}.json`);

  try {
    const jsonData = await readJsonFile(filePath);
    res.json(jsonData);
  } catch (err) {
    if (err.message === "Requested data not found") {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Endpoint to handle form data and send email
app.post("/api/send-email", async (req, res) => {
  console.log("Received request to send email");

  // Validate request body
  const { error, value } = emailSchema.validate(req.body);
  if (error) {
    console.error("Validation error:", error.details);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { courseType, company, name, phone, email, comments } = value;

  // Sanitize input data
  const sanitizedCourseType = sanitizeHtml(courseType);
  const sanitizedCompany = sanitizeHtml(company);
  const sanitizedName = sanitizeHtml(name);
  const sanitizedPhone = sanitizeHtml(phone);
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedComments = sanitizeHtml(comments || "");

  // Save sanitized data to JSON file
  const filePath = path.join(__dirname, "data", "inquiries.json");
  try {
    const existingData = await readJsonFile(filePath);
    const newData = [
      ...existingData,
      {
        courseType: sanitizedCourseType,
        company: sanitizedCompany,
        name: sanitizedName,
        phone: sanitizedPhone,
        email: sanitizedEmail,
        comments: sanitizedComments,
      },
    ];
    await writeJsonFile(filePath, newData);
    console.log("Sanitized data saved to file:", newData);
  } catch (err) {
    console.error("Error saving sanitized data:", err);
    return res.status(500).json({ error: "Failed to save data" });
  }

  // Create a transporter object
  let transporter;
  try {
    console.log("Creating transporter...");
    transporter = nodemailer.createTransport({
      host: "*****.lv",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Transporter created successfully.");
  } catch (err) {
    console.error("Error creating transporter:", err);
    return res
      .status(500)
      .json({ error: "Failed to create email transporter" });
  }

  // Set up email data
  const mailOptions = {
    from: sanitizedEmail, // Sender address
    to: "info@******.lv", // Your email address
    subject: `Jauns pieteikums: ${sanitizedCourseType}`,
    text: `
      Kursu veids: ${sanitizedCourseType}
      Uzņēmums: ${sanitizedCompany}
      Vārds: ${sanitizedName}
      Tālrunis: ${sanitizedPhone}
      E-pasts: ${sanitizedEmail}
      Komentāri: ${sanitizedComments}
    `,
  };

  // Send mail with defined transport object
  try {
    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    if (err.responseCode === 535) {
      res.status(500).json({ error: "Email authentication failed" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  }
});

// Set security headers
app.use((req, res, next) => {
  console.log("Setting security headers");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

// Path to your SSL certificate and key
const options = {
  key: rfs.readFileSync(""),
  cert: rfs.readFileSync(""),
};

// Start the server
const PORT = process.env.PORT || 5000;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running`);
});
