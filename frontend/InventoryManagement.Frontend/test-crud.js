const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('--- LOGGING IN ---');
    await page.goto('http://localhost:4200/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Products Test
    await page.goto('http://localhost:4200/products');
    await page.waitForTimeout(1000); // give it a second to load products
    
    console.log('--- PRODUCTS TABLE BEFORE ---');
    let rows = await page.$$eval('tbody tr', trs => trs.map(tr => tr.innerText.replace(/\n/g, ' ')));
    rows.forEach(r => console.log(r));

    console.log('--- ADDING PRODUCT ---');
    await page.click('button:has-text("Add New Product")');
    await page.fill('input[formControlName="name"]', 'Playwright Product');
    await page.fill('input[formControlName="price"]', '99.99');
    await page.fill('input[formControlName="quantity"]', '42');
    
    // Select the second option (usually the first real category since first is "Select Category" with value "")
    await page.selectOption('select[formControlName="categoryId"]', { index: 1 });
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    console.log('--- PRODUCTS TABLE AFTER ADD ---');
    rows = await page.$$eval('tbody tr', trs => trs.map(tr => tr.innerText.replace(/\n/g, ' ')));
    rows.forEach(r => console.log(r));

    console.log('--- TESTING UPDATE ---');
    await page.click('button.btn-outline-primary', { strict: false }); // Click the first edit button
    await page.fill('input[formControlName="quantity"]', '999');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    console.log('--- PRODUCTS TABLE AFTER EDIT ---');
    rows = await page.$$eval('tbody tr', trs => trs.map(tr => tr.innerText.replace(/\n/g, ' ')));
    rows.forEach(r => console.log(r));

  } catch(e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
