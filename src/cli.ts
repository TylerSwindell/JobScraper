import { appSettings } from "./config.js";
import { JobScraper } from "./types.js";
const { cli } = appSettings;

/**
 * Processes command line arguments and separates them into regular arguments and flags.
 * @returns An object with the processed arguments and flags.
 */
export const processArgs = (): {
  args: Array<string>;
  flags: Array<string>;
} => {
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
export const isCommand = (cmd: string): boolean => {
  if (hasIndicator(cmd)) cmd = cmd.slice(2);
  return cli.commands.includes(cmd);
};

/**
 * Checks if a given string has the indicator prefix.
 * @param cmd - The string to check.
 * @returns True if the string has the indicator prefix, false otherwise.
 */
export const hasIndicator = (cmd: string): boolean =>
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
 * Checks if the "--dev-mode" flag is present in the provided flags array.
 * @param flags - An array of flags.
 * @returns True if the "--dev-mode" flag is present, false otherwise.
 */
export const checkDevMode = (flags: JobScraper.SearchFlags): boolean => {
  return flags.devMode;
};

export const updateFlags = (flags: Array<string>): JobScraper.SearchFlags => {
  const devMode = flags.includes(cli.indicator + cli.commands[0]);

  return {
    // TODO: REFACTOR THIS
    devMode,
    indeed: devMode || flags.includes(cli.indicator + cli.commands[1]),
    monster: devMode || flags.includes(cli.indicator + cli.commands[2]),
    linkedin: devMode || flags.includes(cli.indicator + cli.commands[3]),
  };
};

/**
 * Logs a message in the development mode.
 * @param msg - The message to log.
 */
export const devModeLog = (msg: string): void => {
  // Add state manager for app (Redux?)
};
