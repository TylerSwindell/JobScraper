import fs from "fs";
import puppeteer from "puppeteer";

const screenshotsFolderPath = "./screenshots";

type JobPosting = {
  title: string;
  company: string;
  salary: string;
  new: boolean;
  employmentStatus: string;
};

// Main
(async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: "new",
  });
  const page: puppeteer.Page = await browser.newPage();

  const httpRes: puppeteer.HTTPResponse = await page.goto(
    "https://www.indeed.com/"
  );

  // Set screen size
  await page.setViewport({ width: 1080, height: 2400 });

  // Type into search box
  await page.type("#text-input-what", "front end web developer");
  await page.keyboard.press("Enter");

  // Wait and click on first result
  const list = await scrapeJobCardContainerElements(page);
  await list.forEach((i) => console.log(i, "\n"));

  await gotoNextPage(page);
  await closeBrowser(page, browser);
})();

async function scrapeJobCardContainerElements(page) {
  const jobCardContainer = "#mosaic-provider-jobcards > ul";
  const jobCardContainerSelector = await page.waitForSelector(jobCardContainer);

  return await jobCardContainerSelector?.evaluate((el) => {
    let s = [];
    const childCount = el.childElementCount;
    for (let i = 0; i < childCount; i++) {
      s.push(el.children[i]?.children[0]?.innerText);
    }
    return s;
  });
}

async function gotoNextPage(page: puppeteer.Page) {
  const nextPageSelector = '[aria-label="Next Page"]';
  const nextPage = await page.$(nextPageSelector);

  if (nextPage) {
    console.log("next found");
    await nextPage.click().then(() => {
      console.log("next clicked");
    });
  }
}

async function closeBrowser(page: puppeteer.Page, browser: puppeteer.Browser) {
  setTimeout(async () => {
    await screenshot(page, "browser_on_close.png");
    await browser.close();
    console.log("Script Complete.");
  }, 5000);
}

async function screenshot(page: puppeteer.Page, name: string) {
  if (!fs.existsSync(screenshotsFolderPath))
    fs.mkdirSync(screenshotsFolderPath, "0777");
  await page.screenshot({ path: `${screenshotsFolderPath}/${name}` });
}
