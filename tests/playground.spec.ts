import { test, expect } from "@playwright/test";

test("CDD:0001. Check two links on the homepage", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}`);

  await expect(
    page.getByLabel("Link to: Find a Dealer").locator("span")
  ).toContainText("Find a Dealer");
  await expect(
    page.getByLabel("Link to: Commercial Vehicle").locator("span")
  ).toContainText("Why Commercial Vehicle Center");
});

test('headless popup test', async ({ page }) => {
  await page.setContent(
    '<a href="https://playwright.dev" target="_blank">Open</a>'
  );
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('a'),
  ]);
  await popup.waitForLoadState();
  expect(popup.url()).toContain('playwright.dev');
});

