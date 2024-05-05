import { db } from '../../../../database/db.js';
import Logger from '../../../../utils/logger.js';
import { UrlTransformer } from '../../../../utils/url_transformer.js';
import { client, startMonitoringForChannel, stopMonitoringForChannel } from '../bot_handler.js';

// Handles the /start command
export async function handleStartCommand(message) {
    message.channel.send('Please use the command like this: /start <URL>');
}

// Handles messages that are HTTP URLs
export async function handleHttpMessage(message) {
    try {
        const text = message.content;
        const url = text.split(' ')[1];

        const isValidUrl = UrlTransformer.isUrlValid(url);
        if (!isValidUrl) {
            handleStartCommand(message);
            return;
        }

        const database = await db;

        try {
            startMonitoringForChannel(message.channel.id, url);
        } catch (error) {
            Logger.error(`Error starting monitoring: ${error.message}`);
            message.channel.send('Error starting monitoring. Please try again later.');
            return;
        }

        await database.run(`INSERT INTO channel_urls (channel_id, url) VALUES (?, ?) ON CONFLICT(channel_id) DO UPDATE SET url = excluded.url`, [message.channel.id, url]);

    } catch (error) {
        Logger.error(`Monitoring error: ${error.message}`);
    }
}

// Handles the /stop command
export async function handleStopCommand(message) {
    const channel = client.channels.cache.get(message.channel.id);

    try {
        stopMonitoringForChannel(message.channel.id);
    }
    catch (error) {
        Logger.error(`Error stopping monitoring: ${error.message}`);
        channel.send('Error stopping monitoring. Please try again later.');
        return;
    }

    channel.send('Monitoring stopped and deleted from the database. 🛒');
}

// Handles unknown commands or text
export async function handleUnknownCommand(message) {
    const channel = client.channels.cache.get(message.channel.id);

    channel.send("I didn't understand that. Please send a valid URL or use /start, /stop to manage monitoring.");
}