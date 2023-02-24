import puppeteer from 'puppeteer';
import { isM2 } from './utils.js';
import { selectors } from './constants.js';
import { URL, targetName, targetId } from './targets.js';

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

  await page.evaluate(
    ({ selectors, targetId, targetName }) => {
      const comments = document.querySelectorAll(selectors.comment);

      let found = false;

      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        const author = comment
          .querySelector(selectors.commentAuthor)
          .innerText.trim();

        console.log(author);

        if (author === targetName || author === targetId) {
          comment.scrollIntoView();
          found = true;
          break;
        }
      }

      if (!found) {
        console.log('Could not find comment');
      }
    },
    { selectors, targetName, targetId }
  );
};
runScrape();

const waitForTime = (milliseconds) => {
  return new Promise((r) => setTimeout(r, milliseconds));
};

const scrollPage = async (page) => {
  await page.evaluate(() => {
    window.scrollTo(0, document.querySelector('ytd-app').scrollHeight);
  });
  await waitForTime(1000);
  const atEnd = await page.evaluate(() => {
    const app = document.querySelector('ytd-app');
    return window.innerHeight + window.scrollY >= app.scrollHeight;
  });

  if (!atEnd) {
    await scrollPage(page);
  }
};
