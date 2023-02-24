import puppeteer from 'puppeteer';
import { isM2 } from './utils.js';
import { selectors } from './constants.js';
import { URL } from './target.js';

const browserOptions = {
  headless: false,
};

if (isM2()) {
  browserOptions.executablePath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const runScrape = async () => {
  const browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();

  await page.goto(URL);

  await waitForTime(5000);

  await scrollPage(page);

  await page.evaluate((selectors) => {
    const comments = document.querySelectorAll(selectors.comment);
    console.log(comments);
  }, selectors);
};
runScrape();

const waitForTime = (milliseconds) => {
  return new Promise((r) => setTimeout(r, milliseconds));
};

const scrollPage = async (page) => {
  await page.evaluate((selectors) => {
    window.scrollTo(0, document.querySelector(selectors.app).scrollHeight);
  }, selectors);

  await waitForTime(1000);

  const atEnd = await page.evaluate((selectors) => {
    const app = document.querySelector(selectors.app);
    return window.innerHeight + window.scrollY >= app.scrollHeight;
  }, selectors);

  if (!atEnd) {
    await scrollPage(page);
  }
};
