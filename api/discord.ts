import * as dotenv from "dotenv";
dotenv.config();

export async function sendMessage(data: any) {
  const timeStamp = new Date(data.createdAt?.toString() || Date.now());
  const title = `${
    data.data.issue ? data.data.issue.title : data.data.title
  } : ${data.type} ${data.action}d${
    data.data.user ? " by " + data.data.user.name : ""
  }`;
  const description = data.data.body ? data.data.body : data.data.description;
  const url = data.url;
  const color = 0x0099ff;
  const embedded = {
    color: color,
    type: "rich",
    title: title,
    url: url,
    description: description,
    timestamp: timeStamp,
  };
  const jsonBody = { embeds: [embedded] };
  const res = await fetch(process.env.DISCORD_WEBHOOK_URL as string, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonBody),
  });
  if (res.ok) {
    console.log("Message Sent to Discord Successful!");
  } else {
    console.warn(
      `Problem with sending messages to discord. Problem:${await res.text()}`
    );
  }
}
