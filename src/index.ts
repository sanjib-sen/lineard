import express from "express";
import bodyParser from "body-parser";
import {
  LinearWebhooks,
  LINEAR_WEBHOOK_SIGNATURE_HEADER,
  LINEAR_WEBHOOK_TS_FIELD,
} from "@linear/sdk";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const webhook = new LinearWebhooks(process.env.LINEAR_WEBHOOK_SECRET as string);

app.use(express.json());

// Parse the request body
app.use(bodyParser.json());

// Use it in the webhook handler. Example with Express:
app.use(
  "/webhooks/linear-updates",
  bodyParser.json({
    verify: (req, res, buf) => {
      webhook.verify(
        buf,
        req.headers[LINEAR_WEBHOOK_SIGNATURE_HEADER] as string,
        JSON.parse(buf.toString())[LINEAR_WEBHOOK_TS_FIELD]
      );
    },
  }),
  (req, res, next) => {
    console.log("Verification Successful");
    next();
  }
);

app.post("/webhooks/linear-updates", (req, res) => {
  const payload = req.body;
  const { action, data, type, createdAt } = payload;
  console.log(data);
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`Linear webhook consumer listening on port ${port}!`)
);
