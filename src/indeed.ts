import { JobScraper } from "./types.js";
import puppeteer, { TimeoutError } from "puppeteer";
import { appSettings } from "./config.js";
import { closeBrowser, screenshot } from "./utils.js";
const { sites } = appSettings;
import SearchSession from "./SearchSession.js";

/** Main Entry Point
 * Scrapes job listings from Indeed using Puppeteer.
 * @param searchTerm - The search term to look for job listings.
 * @returns An array of job listings scraped from Indeed.
 **/
export const scrapeIndeed = async (mySearchSession: SearchSession) => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: "new",
  });
  const page: puppeteer.Page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1080, height: 2400 });

  const httpRes: puppeteer.HTTPResponse = await page.goto(sites.indeed.url);

  // Type into search box
  await page.type("#text-input-what", mySearchSession.getSearchTerm());
  await page.keyboard.press("Enter");

  let jobListings = [];
  do {
    jobListings.push(await scrapeJobCardContainerElements(page));
  } while (await gotoNextPage(page, mySearchSession));

  let completeJobScrape = [];
  jobListings.forEach((jobList) =>
    jobList.forEach((jobObj) => completeJobScrape.push(jobObj))
  );

  await closeBrowser(page, browser);

  return {
    jobCount: completeJobScrape.length,
    date: new Date(),
    jobList: completeJobScrape,
  };
};

/* Helper Functions */

/**
 * Scrapes job card container elements from a web page using Puppeteer.
 * @param page - The Puppeteer page object.
 * @returns An object containing one page of scraped job data.
 * TODO
 **/
export async function scrapeJobCardContainerElements(
  page: puppeteer.Page
): Promise<{}[]> {
  screenshot(page, "ss1.png");
  const jobCardContainerSelector = "#mosaic-provider-jobcards ul";
  const noResultContainerSelector = ".jobsearch-NoResult-messageContainer";

  let searchStatus: JobScraper.SEARCH_STATUS = 2;
  try {
    await page.waitForSelector(jobCardContainerSelector, { timeout: 2000 });
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error(err.name, "No job list was found on page");
      searchStatus = 1;
    }
    try {
      await page.waitForSelector(noResultContainerSelector, { timeout: 10 });
      console.log("No search results for ");
      searchStatus = 0;
    } catch (err) {
      console.log();
      searchStatus = 1;
    }
  }

  let filteredJobData: Array<JobScraper.JobData> = await page.evaluate(
    indeedJobEval
  );
  return filteredJobData;
}

function indeedJobEval(): Array<JobScraper.JobData> {
  const scrapeJobInfo = (j: Element): JobScraper.JobData | {} => {
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
    return <JobScraper.JobData>{
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
  };

  const jobs: Array<JobScraper.JobData | {}> = Array.from(
    document.querySelectorAll("div#mosaic-provider-jobcards ul li")
  )
    // Iterate through each <li> and map the appropriate data to a JobData object.
    .map((j) => scrapeJobInfo(j))
    // Remove empty objects
    .filter(
      (job: JobScraper.JobData | {}): boolean => JSON.stringify(job) !== "{}"
    );

  return <Array<JobScraper.JobData>>jobs;
}

/**
 * Navigates to the next page using Puppeteer.
 * @param page - The Puppeteer page object.
 * @returns A number indicating the result of the navigation:
 * - 0 if the next button was not found or timed out.
 * - 1 if the next button was found and clicked successfully.
 **/
export async function gotoNextPage(
  page: puppeteer.Page,
  mySearchSession: SearchSession
): Promise<number> {
  const nextPageSelector = '[aria-label="Next Page"]';
  let res = 0;
  try {
    await page.waitForSelector(nextPageSelector, { timeout: 1000 });
    const nextPage = await page.$(nextPageSelector);

    if (nextPage) {
      if (mySearchSession.checkDevMode()) console.log("next found");
      await nextPage.click().then(() => {
        if (mySearchSession.checkDevMode()) console.log("next clicked");
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
