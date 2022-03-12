import express, { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import FirebaseAdmin from "./models/firebase_admin";
import ShortUrlModel from "./models/short-url/model";
import handleError from "./utils/handle_error";
import { BadRequestError } from "./utils/error_class/bad_request";

dotenv.config();
FirebaseAdmin.init();

const app = express();

const PORT = process.env.PORT ?? 1234;

app.get("/welcome", (_: Request, res: Response) => {
  res.send("welcome!");
});

function doAsync(fn: any) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (err) {
      handleError(err, req, res, next);
    }
  };
}

app.post(
  "/short_url.create",
  express.json(), // body parser
  doAsync(async (req: Request, res: Response) => {
    const { url } = req.body;
    if (url === undefined) {
      throw new BadRequestError("url이 전달되지 않았습니다.");
    }
    const id = await ShortUrlModel.create(url);
    res.status(201).json({ id });
  })
);

app.get(
  "/:id",
  doAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === undefined) {
      throw new BadRequestError("id가 전달되지 않았습니다.");
    }
    const { "user-agent": userAgent } = req.headers;
    if (userAgent !== undefined) {
      const isBot =
        userAgent.match(/facebookexternalhit|twitterbot|slackbot/g) !== null;
      if (isBot) {
        const data = await ShortUrlModel.read(id);
        // TODO: 나중에 여기서 meta 정보를 조작하는 부분을 넣으면 되겠다.
        return res.status(301).setHeader("location", data.url).end();
      }
    }
    const data = await ShortUrlModel.readAndAddCount(id);
    res.status(301).setHeader("location", data.url).end();
  })
);

app.listen(PORT, () => {
  console.info(`
  ################################################
  🛡️  Server listening on port: ${PORT}🛡️
  ################################################
`);
});
