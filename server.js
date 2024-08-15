import express from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";


const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get("/", (req, res) => {
//   return res.json({ message: "Server on fire.." });
// });

// * Routes
app.use(Routes);

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

