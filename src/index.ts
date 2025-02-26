import express, { Request, Response } from "express";
import { connectDB } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Sample API route to fetch data
app.get("/users", async (req: Request, res: Response) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
