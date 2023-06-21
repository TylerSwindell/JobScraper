import fs from "fs";
import { appSettings } from "./config.js";
import { scrapeIndeed } from "./indeed.js";
import { getSearchDetails } from "./cli.js";
const { fileSystem } = appSettings;

type Site = {
  id: number;
  name: string;
  url: string;
};

// Main
(async () => {
  const { searchFlags, searchTerm } = getSearchDetails();

  let jobListings = {};
  if (searchFlags.indeed)
    jobListings["indeed"] = await scrapeIndeed(searchTerm);

  if (!fs.existsSync(fileSystem.outputFolder))
    fs.mkdirSync(fileSystem.outputFolder, "0777");

  fs.writeFileSync(
    fileSystem.outputFolder + fileSystem.jobDataOutput,
    JSON.stringify(jobListings, null, 4)
  );
})();
