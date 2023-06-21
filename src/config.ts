export const appSettings = {
  cli: {
    indicator: "--",
    // TODO: REFACTOR THIS
    commands: ["dev-mode", "indeed", "monster", "linkedin"],
  },
  searchTerms: {
    default: "front end web developer",
  },
  sites: {
    indeed: {
      url: "https://www.indeed.com/",
    },
  },
  fileSystem: {
    outputFolder: "./output/",
    jobDataOutput: `JobData-${Date.now()}-${
      new Date().getMonth() + 1
    }_${new Date().getDate()}.json`,
    screenshotsFolderPath: "./screenshots/",
  },
};
