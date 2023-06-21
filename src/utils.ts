import fs from "fs";
import puppeteer from "puppeteer";
import { appSettings } from "./config.js";
const { fileSystem } = appSettings;

export async function closeBrowser(
  page: puppeteer.Page,
  browser: puppeteer.Browser
) {
  setTimeout(async () => {
    await screenshot(page, "browser_on_close.png");
    await browser.close();
    console.log("Script Complete.");
  }, 1000);
}

export async function screenshot(page: puppeteer.Page, name: string) {
  if (!fs.existsSync(fileSystem.screenshotsFolderPath))
    fs.mkdirSync(fileSystem.screenshotsFolderPath, "0777");
  await page.screenshot({
    path: `${fileSystem.screenshotsFolderPath}/${name}`,
  });
}
