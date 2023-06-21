import fs from "fs";
import { appSettings } from "./config.js";
import { scrapeIndeed } from "./indeed.js";
import { processArgs } from "./cli.js";
import SearchSession from "./SearchSession.js";
const { fileSystem } = appSettings;

// Main
(async () => {
  const mySearchSession = SearchSession.Instance;
  mySearchSession.updateSession(processArgs());
  console.log(mySearchSession);

  let jobListings = {};
  if (mySearchSession.isActiveFlag("indeed"))
    jobListings["indeed"] = await scrapeIndeed(mySearchSession);

  if (!fs.existsSync(fileSystem.outputFolder))
    fs.mkdirSync(fileSystem.outputFolder, "0777");

  fs.writeFileSync(
    fileSystem.outputFolder + fileSystem.jobDataOutput,
    JSON.stringify(jobListings, null, 4)
  );
})();
