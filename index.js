const browserObject = require('./browser')
const scraperController = require("./pageController")

let browserInstance = browserObject.startBrowser()

scraperController(browserInstance)
// let browser;
//
// const HEADLESS = false;
//
// async function main() {
//
// 	browser = await puppeteer.launch({ headless: HEADLESS });
//
// 	const page = await browser.newPage();
//
// 	const search = 'BMW e3';
// 	const city = 'warsaw';
// 	// const daysSinced = '1'
//
// 	const url = `https://www.facebook.com/marketplace/${city}/search/?query=${search}`;
//
// 	await page.goto(url);
//
// 	// b3onmgus ph5uu5jm g5gj957u buofh1pr cbu4d94t rj1gh0hx j83agx80 rq0escxv fnqts5cd fo9g3nie n1dktuyu e5nlhep0 ecm0bbzt
//
// 	await page.waitFor("div[data-testid='marketplace_search_feed_content']")
//
// 	const items = await page.evaluate(() => {
// 		const products = Array.from(document.querySelectorAll("div[data-testid='marketplace_search_feed_content'] > div > div:first-child > div")).map(product => {
// 			return {
// 				title: product.querySelector("span") ? product.querySelector("span").innerText : ''
// 			}
// 		})
// 		return products
// 	})
// 	console.log(items)
// }
// main();

