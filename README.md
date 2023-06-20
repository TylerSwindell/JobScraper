# Indeed Job Scraper

This is a Node.js script that scrapes job postings from Indeed.com based on a specified search term. It utilizes the Puppeteer library to automate the process of navigating the Indeed website and extracting job data.

## Prerequisites

- Node.js (version 12 or above)
- NPM (Node Package Manager)

## Installation

1. Clone the repository or download the script file.
2. Open a terminal and navigate to the project directory.
3. Run the following command to install the required dependencies:

   ```
   npm install
   ```

## Usage

To run the script, use the following command:

```
node index.js [searchTerm]
```

- `searchTerm` (optional): The term to search for job postings on Indeed.com. If not provided, the default value is "front end web developer".

The script will launch a headless browser using Puppeteer, navigate to Indeed.com, and perform a search using the specified search term. It will scrape the job card container elements on each page of the search results and display the extracted job data in the console.

## Configuration

You can modify the script's behavior by changing the following variables:

- `screenshotsFolderPath`: The folder path where screenshots will be saved. By default, it is set to "./screenshots".

## License

This project is licensed under the [MIT License](LICENSE).
