import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/generate", (req, res) => {
  const url = req.body.url;
  if (!url) return res.send("No URL provided!");

  const qrSvg = qr.imageSync(url, { type: "png" });
  const base64 = Buffer.from(qrSvg).toString("base64");

  // Respond with image embedded back into HTML
 res.send(`
  <html>
    <head>
      <link rel="stylesheet" href="/style.css" />
      <title>QR Code Generator</title>
    </head>
    <body>
      <div class="container">
        <h1>Your QR Code</h1>
        <img src="data:image/png;base64,${base64}" alt="QR Code" />

        <div class="button-row">
          <button onclick="window.location.href='data:image/png;base64,${base64}'" download="qr-code.png">
            Download QR Code
          </button>
          <button onclick="window.location.href='/'">
            Generate Another
          </button>
        </div>
      </div>
    </body>
  </html>
`);

});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
