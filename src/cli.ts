import SearchSession from "./SearchSession.js";
import { appSettings } from "./config.js";
import { JobScraper } from "./types.js";
const { searchTerms, cli } = appSettings;

/**
 * Processes command line arguments and separates them into regular arguments and flags.
 * @returns An object with the processed arguments and flags.
 */
export const processArgs = (): JobScraper.CLIInput => {
  const argArr = process.argv.slice(2);
  const args = argArr.filter((a) => !hasIndicator(a) && a !== cli.indicator);
  const flags = argArr.filter((a) => hasIndicator(a) && isCommand(a));
  return {
    args,
    flags,
  };
};

/**
 * Checks if a given string represents a valid command.
 * @param cmd - The string to check.
 * @returns True if the string represents a valid command, false otherwise.
 */
const isCommand = (cmd: string): boolean => {
  if (hasIndicator(cmd)) cmd = cmd.slice(2);
  return cli.commands.includes(cmd);
};

/**
 * Checks if a given string has the indicator prefix.
 * @param cmd - The string to check.
 * @returns True if the string has the indicator prefix, false otherwise.
 */
const hasIndicator = (cmd: string): boolean =>
  cmd.substring(0, 2) === cli.indicator && cmd !== cli.indicator;

/**
 * Creates a command object with the provided command name.
 * @param cmd - The command name.
 * @returns A command object or an Error if the command does not exist.
 */
export const command = (cmd: string): JobScraper.CLICommand | Error => {
  if (!isCommand) return Error("Command does not exist.");
  return {
    indicator: cli.indicator,
    name: cmd,
  };
};

/**
 * Logs a message in the development mode.
 * @param msg - The message to log.
 */
export const devModeLog = (msg: string): void => {
  // Add state manager for app (Redux?)
};

export const getSearchDetails = (mySearchSession: SearchSession) => {
  const { args, flags } = processArgs();
  mySearchSession.updateFlags(flags);
  let searchTerm = args.length ? args.join(" ") : searchTerms.default;

  if (mySearchSession.checkDevMode()) {
    console.log("Search Term:", searchTerm);
    console.log("Args:", args);
    console.log("Flags:", flags);
    console.log(flags);
  }

  return {
    flags,
    searchTerm,
  };
};
