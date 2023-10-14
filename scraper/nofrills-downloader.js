const puppeteer = require("puppeteer");

  
async function scrapeNofrills(browser, url) {
// Launch the browser and open a new blank page
  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate the page to a URL
  //   await page.goto('https://patrickgu.ca/');
  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  const arr = await page.evaluate(() => {
    console.log("page eval")
    const qs = document.querySelectorAll("div.css-0:has(h3[data-testid=product-title])");
    const arr = [...qs].map((q) => q.parentNode.parentNode).map((q) => {

        return {
            image: q.parentNode.querySelector("img").src,
            text: q.innerText
        };
    }).map((a) => {
        // console.log(a);
        return a;
    }).filter(({ image, text }) => text.length <= 1000);
    return arr;
  });

  await page.close();

  return arr;
}

const nofrillsUrls = [
    "https://www.nofrills.ca/food/fruits-vegetables/c/28000?navid=flyout-L2-see-all-Fruits-and-Vegetables",
    "https://www.nofrills.ca/food/dairy-eggs/c/28003?navid=flyout-L2-Dairy-and-Eggs",
    "https://www.nofrills.ca/food/pantry/c/28006?navid=flyout-L2-Pantry",
    "https://www.nofrills.ca/food/international-foods/c/58044?navid=flyout-L2-International-Foods",
    "https://www.nofrills.ca/food/meat/c/27998?navid=flyout-L2-Meat",
    "https://www.nofrills.ca/food/fish-seafood/c/27999?navid=flyout-L2-Fish-and-Seafood",
];

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        dumpio: true
    });
    let ans = [];
    for (const url of nofrillsUrls) {
        const things = await scrapeNofrills(browser, url);
        ans = [...ans, ...things];
    }
    console.log(JSON.stringify(ans));

    await browser.close();
})();
