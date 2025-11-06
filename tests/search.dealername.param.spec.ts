import { test, expect, Locator } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const validDealerNames = parse(fs.readFileSync('test-data/dealername.csv'), {
  skip_empty_lines: true,
  columns: true,
}) as unknown as Array<{ dealerName: string }>;

for (const { dealerName } of validDealerNames) {
  test.describe(
    'CDD. Search by dealer name parametrized',
    { tag: ['@smoke'] },
    async () => {
      test.beforeEach('Navigate to CDD homepage', async ({ page, baseURL }) => {
        await page.goto(`${baseURL}`);
      });
      test(
        `CDD-0009. Search by specific dealer name: ${dealerName}`,
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

          await expect(resultsLabel).toHaveText(RegExp(/Results.*\d+/),{timeout: 3000});
          expect(await dealerCardName.count()).toBeGreaterThan(0);
          await expect(dealerCardName).toContainText(`${dealerName}`, {ignoreCase: true});
        }
      );
    }
  );
}
