import fs from "fs";
import { appSettings } from "./config.js";
import { scrapeIndeed } from "./indeed.js";
import {
  checkDevMode,
  updateFlags,
  hasIndicator,
  isCommand,
  processArgs,
} from "./cli.js";
import { JobScraper } from "./types.js";
const { searchTerms, cli, fileSystem } = appSettings;

type Site = {
  id: number;
  name: string;
  url: string;
};

// Main
(async () => {
  const { args, flags } = processArgs();
  const searchFlags: JobScraper.SearchFlags = updateFlags(flags);

  if (checkDevMode(searchFlags)) {
    console.log(searchFlags);
    console.log("Flags:", flags);
    console.log("Args:", args);
  }

  let searchTerm = args.length ? args.join(" ") : searchTerms.default;
  console.log("Search Term:", searchTerm);

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
