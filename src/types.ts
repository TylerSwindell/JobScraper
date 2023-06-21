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

  export type SearchFlags = {
    devMode: boolean;
    indeed: boolean;
    monster: boolean;
  };
}
