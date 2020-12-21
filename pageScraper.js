const scraperObject = {
    url: 'http://books.toscrape.com',
    async scraper(browser, category){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // навигация выбраной страницы
        await page.goto(this.url)
        // Выбрать категорию книги для отображения
        let selectedCategory = await page.$$eval('.side_categories > ul > li > ul > li > a', (links, _category) => {
            // Найдите элемент с совпадающим текстом
            links = links.map(a => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
            let link = links.filter(tx => tx !== null)[0];
            return link.href;
        }, category);
        // Перейти к выбранной категории
        await page.goto(selectedCategory);
        let scrapedData = [];
        // Ждем отрисовки ДОМ(главной страницы)
        async function scrapeCurrentPage() {
            await page.waitForSelector('.page_inner')
            // Получаем ссылку на все необходимые книги
            let urls = await page.$$eval('section ol > li', links => {
                // убедится что книга которую мы ищем есть в наличии
                links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
                // извлечь сcылки из данных
                links = links.map(el => el.querySelector('h3 > a').href)
                return links
            });

            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let dataObj = {};
                let newPage = await browser.newPage()
                await newPage.goto(link)
                dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
                dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
                dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
                    // Удаление новой строки и пробелов табуляции
                    text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
                    // Получите количество имеющихся на складе
                    let regexp = /^.*\((.*)\).*$/i;
                    let stockAvailable = regexp.exec(text)[1].split(' ')[0];
                    return stockAvailable;
                });
                dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
                // dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
                dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
                resolve(dataObj);
                await newPage.close();
            });

            for(link in urls) {
                let currentPageData = await pagePromise(urls[link]);
                scrapedData.push(currentPageData);
                // console.log(currentPageData);
            }
            // Когда все данные на этой странице будут завершены, нажмите следующую кнопку и начните поиск по следующей страницы.
            // Сначала проверяем, существует ли эта кнопка, чтобы знать, действительно ли существует следующая страница.
            let nextButtonExist = false;
            try{
                const nextButton = await page.$eval('.next > a', a => a.textContent);
                nextButtonExist = true;
            }
            catch(err){
                nextButtonExist = false;
            }
            if(nextButtonExist){
                await page.click('.next > a');
                return scrapeCurrentPage(); // Call this function recursively
            }
            await page.close();
            return scrapedData;
        }
        let data = await scrapeCurrentPage();
        console.log(data);
        return data;
    }
}

module.exports = scraperObject;