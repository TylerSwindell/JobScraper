import fs from "fs";
import puppeteer, { TimeoutError } from "puppeteer";

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

  let searchTerm = "";
  switch (process.argv.length) {
    case 0:
    case 1:
    case 2:
      searchTerm = "front end web developer";
      break;
    case 3:
      searchTerm = process.argv[2];
      break;
    default:
      const args = process.argv.slice(2);
      searchTerm = args.join(" ");
      break;
  }

  // Type into search box
  await page.type("#text-input-what", searchTerm);
  await page.keyboard.press("Enter");

  do {
    const jobData = await scrapeJobCardContainerElements(page);
    console.log(jobData);
  } while (await gotoNextPage(page));
  await closeBrowser(page, browser);
})();

async function scrapeJobCardContainerElements(page) {
  const jobCardContainerSelector = "#mosaic-provider-jobcards ul";
  await page.waitForSelector(jobCardContainerSelector);
  const jobData = await page.evaluate(() => {
    const jobs = Array.from(
      document.querySelectorAll("div#mosaic-provider-jobcards ul li")
    ).map((j) => {
      const title = j.querySelector("h2 a span")?.getAttribute("title");
      if (!title) return {};

      const jobLink: HTMLAnchorElement = <HTMLAnchorElement>(
        j.querySelector("h2 a")
      );

      let desc = j
        .querySelector("tr.underShelfFooter")
        .textContent.slice(3)
        .split("\n");
      desc = desc.slice(0, desc.length - 1);
      return {
        id:
          "indeed:" +
          j.querySelector("button.kebabMenu-button")?.id.split("-")[1],
        title,
        salary:
          j.querySelector("div.salary-snippet-container")?.textContent ||
          "Unlisted",
        companyName: j.querySelector("span.companyName")?.textContent,
        companyLocation: j.querySelector("div.companyLocation")?.textContent,
        desc,
        href: jobLink?.href,
      };
    });

    return jobs.filter((job) => JSON.stringify(job) !== "{}");
  });

  return jobData;
}

async function gotoNextPage(page: puppeteer.Page) {
  const nextPageSelector = '[aria-label="Next Page"]';
  let res = 0;
  try {
    await page.waitForSelector(nextPageSelector, { timeout: 1000 });
    const nextPage = await page.$(nextPageSelector);

    if (nextPage) {
      console.log("next found");
      await nextPage.click().then(() => {
        console.log("next clicked");
        res = 1;
      });
    }
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error("Next button not detected");
    }
  }

  return res;
}

async function closeBrowser(page: puppeteer.Page, browser: puppeteer.Browser) {
  setTimeout(async () => {
    await screenshot(page, "browser_on_close.png");
    await browser.close();
    console.log("Script Complete.");
  }, 1000);
}

async function screenshot(page: puppeteer.Page, name: string) {
  if (!fs.existsSync(screenshotsFolderPath))
    fs.mkdirSync(screenshotsFolderPath, "0777");
  await page.screenshot({ path: `${screenshotsFolderPath}/${name}` });
}
