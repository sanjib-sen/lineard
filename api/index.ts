import express from "express";
import bodyParser from "body-parser";
import {
  LinearWebhooks,
  LINEAR_WEBHOOK_SIGNATURE_HEADER,
  LINEAR_WEBHOOK_TS_FIELD,
} from "@linear/sdk";
import * as dotenv from "dotenv";
import { sendMessage } from "./discord";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const webhook = new LinearWebhooks(process.env.LINEAR_WEBHOOK_SECRET as string);

app.use(
  "/webhooks/linear",
  bodyParser.json({
    verify: (req, res, buf) => {
      webhook.verify(
        buf,
        req.headers[LINEAR_WEBHOOK_SIGNATURE_HEADER] as string,
        JSON.parse(buf.toString())[LINEAR_WEBHOOK_TS_FIELD]
      );
    },
  })
);

app.post("/webhooks/linear", (req, res) => {
  console.log("Webhook Received");
  sendMessage(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Linear webhook consumer listening on port ${port}!`);
});
