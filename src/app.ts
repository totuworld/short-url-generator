import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import FirebaseAdmin from "./models/firebase_admin";

dotenv.config();
FirebaseAdmin.init();

const app = express();

const PORT = process.env.PORT ?? 1234;

app.get("/welcome", (_: Request, res: Response) => {
  res.send("welcome!");
});

app.listen(PORT, () => {
  console.info(`
  ################################################
  🛡️  Server listening on port: ${PORT}🛡️
  ################################################
`);
});
