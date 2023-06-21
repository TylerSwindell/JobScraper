export namespace JobScraper {
  export type CLICommand = {
    indicator: string;
    name: string;
  };

  export type JobData = {
    id: string;
    title: string;
    salary: string | "Unlisted";
    companyName: string;
    companyLocation: string;
    desc: Array<string>;
    href: string;
  };

  export type SearchArgs = Array<string>;
  export type SearchFlags = Array<string>;

  export type Flags = {
    devMode: boolean;
    indeed: boolean;
    monster: boolean;
    linkedin: boolean;
  };

  export type CLIInput = {
    args: SearchArgs;
    flags: SearchFlags;
  };

  export enum SEARCH_STATUS {
    "No Result",
    "Search Error",
    "Started",
    "Complete",
  }
}
