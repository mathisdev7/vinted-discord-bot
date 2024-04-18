<p align="center">

 <h2 align="center">VintedMonitor</h2>
 <p align="center">Real-time tracking of new listings on Vinted tailored to your preferences.</p>
</p>

<p align="center">
    <img alt="Last Updated" src="https://img.shields.io/badge/last%20update-April%2018,%202024-blue.svg" />
    <img alt="Selenium Scrapping Support" src="https://img.shields.io/badge/Selenium%20Scrapping-enabled-brightgreen.svg" />
    <img alt="Vinted API Support" src="https://img.shields.io/badge/Vinted%20API-enabled-brightgreen.svg" />
    <img alt="Telegram Integration" src="https://img.shields.io/badge/Telegram-integrated-blue.svg" />
    <img alt="No delay" src="https://img.shields.io/badge/No%20Delay-Real%20Time-blue.svg" />
    <img alt="Discord Bot Coming Soon" src="https://img.shields.io/badge/Discord%20Bot-Coming%20Soon-blue.svg" />
    <img alt="Proxy Support" src="https://img.shields.io/badge/proxy-enabled-blue.svg" />
</p>

## Overview

VintedMonitor leverages both Selenium and direct API calls to offer real-time monitoring of new listings on Vinted. Configure it to track specific brands, sizes, categories, and price ranges. The tool supports notifications through a Telegram bot, ensuring you never miss out on a potential deal.

## Features

- **Real-Time Notifications**: Instant alerts through Telegram.
- **Flexible Monitoring Options**: Supports both Selenium for dynamic scraping and API for structured data retrieval.
- **Customizable Filters**: Monitor based on brands, sizes, price ranges, and more.
- **Proxy Support**: Compatible with proxy usage to circumvent IP blocking.

## Getting Started

### Installation

Ensure that you have the required packages installed. If not, you can install them using npm:

```bash
npm install
```

### Configuration

Modify the `.env` file to set up your environment variables, including the Telegram bot token and monitoring preferences. You can customize the default settings to match your preferences.
```bash
# General configuration for the VintedMonitor
COUNTRY_CURRENCY="€"                # Default currency code for the Vinted site (e.g., 'EUR' for Euro, 'USD' for US Dollar, 'GBP' for British Pound, etc.)
COUNTRY_CODE="co.uk"                # Default country code for the Vinted site (e.g., 'fr' for France, 'us' for United States, 'de' for Germany, etc.)
SEARCH_TEXT=""   
TYPE="Men"                          # Default type to filter listings (eg. "Men", "Women", "Kids")
CATALOG="Jacket"                    # Default category to filter listings
SIZES="XS, S, M, L"                 # Comma-separated list of sizes to monitor
BRANDS="Nike, Adidas"               # Comma-separated list of brands to monitor
PRICE_FROM=10                       # Minimum price range for monitored items (lower bound is inclusive)
PRICE_TO=50                         # Maximum price range for monitored items (upper bound is inclusive)

# Telegram Bot configuration
TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_BOT_TOKEN"  # Token for Telegram Bot API access
LIMIT_TELEGRAM_MESSAGES=true       # Boolean to enable or disable message limit for Telegram notifications
TELEGRAM_MESSAGE_LIMIT=5           # Maximum number of messages to send in a single batch

# Selenium usage configuration
USE_SELENIUM=false                  # Boolean to decide if Selenium should be used for scraping

# Proxy configuration (useful for bypassing IP blocks or geo-restrictions)
PROXY_ENABLED=false                 # Boolean to enable or disable proxy usage

PROXY_PROTOCOL="http"               # Protocol of the proxy server (e.g., http, socks)
PROXY_IP="example.com"              # IP address of the proxy server
PROXY_PORT="1234"                   # Port number of the proxy server
PROXY_USERNAME="username"           # Username for proxy authentication, if required (selenium does not support proxy authentication)
PROXY_PASSWORD="password"           # Password for proxy authentication, if required (selenium does not support proxy authentication)
```

### Running the Monitor

To run the monitor and test the main.js file, use the following command:

```bash
npm run start
```
> [!NOTE]\
> You also have a way to run the monitor in a telegram bot using the following command:

> [!WARNING]\
> The bot is just a showcase for now. It is not fully functional. Only base features are implemented. More is coming soon.

```bash
npm run telegram
```

> [!NOTE]\
> If you want to know about how to create a Telegram Bot : https://core.telegram.org/bots/tutorial
> Follow this tutorial to create your own bot and set your token in `.env` file.
> `TELEGRAM_BOT_TOKEN=...`

<img src="./img/telegram.png" alt="Telegram Bot Showcase" width="300"/>

Usage
-----

To use the `VintedMonitor`, import it into your project and configure it with desired parameters:

### Simple Setup Example

Here's a basic example of how to set up and use the `VintedMonitor`:

### Configuration Options

> [!IMPORTANT]\
> All needs to be written in French for now. More languages are coming soon with the dataset.

*   `search_text`: Text to search for in the Vinted website.
*   `order`: Sort order of the items.
*   `type`: Type of items to monitor. eg : "Hommes", "Femmes", "Enfants", "Bébés", "Autres".
*   `catalog`: Specific catalog to monitor. eg : "Vestes et manteaux", "Chaussures", "Sacs et sacs à dos", "Accessoires", "Bijoux et montres", "Vêtements de sport", "Beauté", "Maison", "Électronique", "Livres et papeterie", "Jeux et jouets", "Autres".
All the catalog options can be found in the `data/groups.json` file.
*   `brands`: Array of brands to filter items.
All the brands options can be found in the `data/brands.json` file.
*   `sizes`: Sizes to filter the items.
All the sizes options can be found in the `data/sizes.json` file.
*   `priceFrom`: Minimum price of items to monitor.
*   `priceTo`: Maximum price of items to monitor.

It uses `fuse.js` to search for the closest match to the provided values. So, if you provide a brand that is not in the list, it will still try to find the closest match. So no need to write the exact brand name or size or catalog name.


```javascript
import { VintedMonitor } from './src/monitors/vinted_monitor.js';
import { ProxyHandler } from './src/utils/proxys.js';
import { config } from 'dotenv';

// Dont touch this don't even think about it just let it be
// Load environment variables
config();
config({ path: `.env.local`, override: true });

// Get environment variables
const env = process.env;

/**
 * This script initializes a VintedMonitor to track new listings on Vinted.
 * It supports both Selenium-based scraping and Vinted's API usage.
 */

async function main() {
    // Initialize VintedMonitor with the specific Vinted domain you want to track.
    const vintedMonitor = new VintedMonitor('https://www.vinted.fr');

    // Optionally, enable Selenium scraping; set to false to use Vinted's API.
    // Vinted API is faster and more reliable, but Selenium scraping is more robust.
    // In default configuration, the monitor uses Vinted's API to avoid Selenium setup.
    vintedMonitor.useSelenium(true);

    // Configure a proxy if running from a location with IP restrictions.
    // WARNING: Use reliable proxies to avoid security risks and ensure data integrity.
    if (env.PROXY_ENABLED === 'true') {
        console.log("Using proxy configuration.");
        vintedMonitor.useProxy(new ProxyHandler(env.PROXY_PROTOCOL, env.PROXY_IP, env.PROXY_PORT, env.PROXY_USERNAME, env.PROXY_PASSWORD));
    }

    // Set up monitoring configuration.
    await vintedMonitor.configure({
        search_text: 'veste',
        order: 'newest_first',  // Ensures that the monitor fetches the newest items available.
        brands: ['Nike', 'Adidas'],  // Specify brands to monitor.
        // Specify the type of item to monitor, "Hommes", "Femmes", "Enfants", "Bébés", "Autres".
        // WARNING : Those are strict values, make sure to use one of the above.
        type: "Hommes", 
        catalog: "Vestes et manteaux",  // Specify the catalog name; the system will find the closest match.
        sizes: ['XS', 'S', 'M', 'L'],  // Specify sizes to monitor.
        priceFrom: 10,  // Set minimum price filter.
        priceTo: 100  // Set maximum price filter.
    });

    // Start monitoring. The provided callback handles new item alerts.
    vintedMonitor.startMonitoring(newItems => {
        console.log(`Found ${newItems.length} new items:`);
        /*
            You can customize the output based on your needs.

            You can use:
            - item.brand
            - item.price
            - item.size
            - item.url
            - item.imageUrl
            - item.owner
            - item.ownerId
            - item.desc
        */

        // Example using everything available.
        newItems.forEach(item => {
            const message = `New item found:\nBrand: ${item.brand}\nPrice: ${item.price}\nSize: ${item.size}\nURL: ${item.url}\nImage: ${item.imageUrl}\nOwner: ${item.owner}\nOwner ID: ${item.ownerId}\nDescription: ${item.desc}`;
            const separator = '-'.repeat(30);
            console.log(message);
            console.log(separator);
        });

        /*
            If you need more information about the item, you can use the getMoreInfo method.
            This require Selenium to be enabled for now. I will adapt it for API usage soon.

            It will give you the following information:
            - item.desc
            - item.rating
            - item.votes

            newItems[0].getMoreInfo(vintedMonitor.driver).then(info => {
                console.log(info);
            });
        */

     }, 5000);  // Monitoring interval set to every 5 seconds.

    // Optionally, stop monitoring after a specified time.
    setTimeout(() => {
        vintedMonitor.stopMonitoring();
        console.log("Monitoring has been stopped.");
    }, 3600000); // Stops after 1 hour.
}

main();
```

## Left to do

- [ ] Add more feature + more configuration to the telegram bot.
- [ ] Simple database to store the users preferences.
- [x] Add a language option for the dataset. Currently, it only supports French dataset.
- [ ] Add more features to the monitor.
- [ ] Export the telegram bot to a discord bot.

## Data

The overall vinted database has been roughly collected from the Vinted website and stored in JSON files in the `data` directory. 

Last updated: `18th April 2024`

### Stopping the Monitor

To stop the monitor after a certain period or based on specific conditions, use the `stopMonitoring` method.

## Contributions

Contributions are welcome. Please submit a pull request or issue on our GitHub repository.

## Troubleshooting

If you encounter any issues, please check the following:
*   Ensure that you have the required packages installed.
*   If it is selenium related: https://stackoverflow.com/questions/26191142/selenium-nodejs-chromedriver-path
*   If it is related to the Vinted website structure, please wait for an update or submit an issue.