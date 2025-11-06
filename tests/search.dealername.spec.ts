import { test, expect, Locator } from '@playwright/test';

const dealerName: string = 'Citrus';
const wrongDealerName: string = 'wrong Dealer Name';

test.describe('CDD. Search by dealer name', { tag: ['@smoke'] }, async () => {
  test.beforeEach('Navigate to CDD homepage', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}`);
  });
  test(
    'CDD-0006. Search by specific dealer name',
    {
      tag: [],
      annotation: {
        type: 'description',
        description: `Search by specific dealer name: ${dealerName} should return search page with results`,
      },
    },
    async ({ page }) => {
      const searchByName: Locator = page.locator(
        '[id="CVCConsumerSiteSearchByDealerName"]'
      );
      const resultsLabel: Locator = page.getByRole('heading', {
        name: 'Results',
        exact: false,
      });
      const dealerCardName: Locator = page
        .locator('div[class*="dealer-card"] p[class*="heading6"]')
        .first();

      await searchByName.fill(`${dealerName}`);
      await searchByName.press('Enter');

      await expect(resultsLabel).toHaveText(RegExp(/Results.*\d+/));
      expect(await dealerCardName.count()).toBeGreaterThan(0);
      await expect(dealerCardName).toContainText(`${dealerName}`);
    }
  );
  test(
    'CDD-0007. Search by wrong dealer name',
    {
      tag: [],
      annotation: {
        type: 'description',
        description: `Search by wrong dealer name ${wrongDealerName} should return "No Results" page`,
      },
    },
    async ({ page }) => {
      const searchByName: Locator = page.locator(
        '[id="CVCConsumerSiteSearchByDealerName"]'
      );
      const resultsLabel: Locator = page.getByRole('heading', {
        name: 'Results',
        exact: false,
      });
      const dealerCard: Locator = page
        .locator('div[class*="dealer-card"]')
        .first();

      await searchByName.fill(`${wrongDealerName}`);
      await searchByName.press('Enter');

      await expect(resultsLabel).toHaveText(RegExp(/No Results/));
      expect(await dealerCard.count()).toBe(0);
    }
  );
});
