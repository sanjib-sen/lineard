// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from "discord.js";
import { TextChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";

import * as dotenv from "dotenv";
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN as string);

export async function sendMessage(data: any) {
  const date = new Date(data.createdAt?.toString() || Date.now());
  const message = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      `${data.data.issue ? data.data.issue.title : data.data.title} : ${
        data.type
      } ${data.action}d${data.data.user ? " by " + data.data.user.name : ""}`
    )
    .setURL(data.url)
    .setDescription(data.data.body ? data.data.body : data.data.description)
    .setTimestamp(date);

  const channel = client.channels.cache.get(
    process.env.DISCORD_CHANNEL_ID as string
  ) as TextChannel;
  try {
    channel.send({ embeds: [message] });
  } catch (error) {
    console.warn(`Error sending message to discord: ${data}`);
  }
}
