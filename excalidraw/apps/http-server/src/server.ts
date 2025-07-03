import express from "express"
import userRoutes from "./route/userRoutes"

const port = 3000;
const app = express();
app.use(express.json())
app.use(userRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})