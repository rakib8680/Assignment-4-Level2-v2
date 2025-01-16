import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

// middlewares / parsers
app.use(express.json());
app.use(cors());

// application route
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world ");
});


// error handlers
app.use(globalErrorHandler);
app.use(notFound);



export default app;
