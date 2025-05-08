const express = require("express");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const cors = require("cors");
const bodyParser = require("body-parser");
// ✅ Add this at the top with your existing imports

const DATA_FILE = path.join(__dirname, "data", "data.xlsx");
const NOTIF_FILE = path.join(__dirname, "data", "payload.json");
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🚀 Serve notifications.json
app.get("/api/notifications", (req, res) => {
  const data = fs.readFileSync(NOTIF_FILE, "utf-8");
  res.json(JSON.parse(data));
});

// 🟢 Save approved consent into Data.xlsx
app.post("/api/approve", (req, res) => {
  const entry = req.body;

  // Load workbook or create new
  let workbook;
  if (fs.existsSync(DATA_FILE)) {
    workbook = XLSX.readFile(DATA_FILE);
  } else {
    workbook = XLSX.utils.book_new();
  }

  const sheetName = "Sheet1";
  let sheet = workbook.Sheets[sheetName];

  let data = sheet ? XLSX.utils.sheet_to_json(sheet) : [];
  data.push(entry);

  const newSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);
  XLSX.writeFile(workbook, DATA_FILE);

  res.json({ message: "✅ Consent saved to Excel" });
});

// 🗑 Optional: Remove from notifications.json after approval
app.post("/api/remove-notification", (req, res) => {
  const { appName, dataset } = req.body;
  const list = JSON.parse(fs.readFileSync(NOTIF_FILE, "utf-8"));
  const updated = list.filter(
    (r) => !(r.appName === appName && r.dataset === dataset)
  );
  fs.writeFileSync(NOTIF_FILE, JSON.stringify(updated, null, 2));
  res.json({ message: "✅ Notification removed" });
});

// ✅ Add this new GET route
app.get("/api/data", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) return res.json([]);

    const workbook = XLSX.readFile(DATA_FILE);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    res.json(data);
  } catch (err) {
    console.error("Error reading Excel:", err);
    res.status(500).json({ error: "Failed to read Excel file" });
  }
});

app.listen(5000, () =>
  console.log("🔁 Backend running at http://localhost:5000")
);
