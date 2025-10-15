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
