import express from "express";
import cors from "cors";
import path from "path"; 
import apiRoutes from "./routes/api.routes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

//API user
app.use("/api/user", userRoutes);
//API upload
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;
