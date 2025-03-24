import app from "./app.js";

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});

