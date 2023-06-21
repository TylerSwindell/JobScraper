import { appSettings } from "./config.js";
import { JobScraper } from "./types.js";
const { searchTerms, cli } = appSettings;

class SearchSession {
  private static _instance: SearchSession;

  private flags: JobScraper.Flags = {
    devMode: false,
    indeed: false,
    monster: false,
    linkedin: false,
  };
  private args: JobScraper.SearchArgs;
  private searchTerm: string;

  private constructor() {
    //...
  }

  public checkDevMode(): boolean {
    return this.flags.devMode;
  }

  public updateFlags(flags: JobScraper.SearchFlags): void {
    const devMode = flags.includes(cli.indicator + cli.commands[0]);
    const allFlagsOn = devMode || flags.length === 0;

    // TODO: REFACTOR THIS
    this.flags = {
      devMode,
      indeed: allFlagsOn || flags.includes(cli.indicator + cli.commands[1]),
      monster: allFlagsOn || flags.includes(cli.indicator + cli.commands[2]),
      linkedin: allFlagsOn || flags.includes(cli.indicator + cli.commands[3]),
    };
  }

  public updateArgs(args: Array<string> | string): void {
    if (typeof args === "string") {
      this.args = args.split(" ");
      this.setSearchTerm(args.length ? args : searchTerms.default);
    } else {
      this.args = args;
      this.setSearchTerm(args.length ? args.join(" ") : searchTerms.default);
    }
  }

  public updateSession(cli: JobScraper.CLIInput): void {
    this.updateFlags(cli.flags);
    this.updateArgs(cli.args);
  }

  public getSearchTerm(): string {
    return this.searchTerm;
  }

  public setSearchTerm(term: string): void {
    this.searchTerm = term;
  }

  public isActiveFlag(flag: string) {
    return this.flags[flag];
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}

export default SearchSession;
