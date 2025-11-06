import { test, expect, Locator } from '@playwright/test';
import { fakerEN_US } from '@faker-js/faker';

const zipCode: string = '90210';
const wrongZipCode: string = '99999';
const stateCode: string = fakerEN_US.location.state({ abbreviated: true });
const randomZipCode: string = fakerEN_US.location.zipCode({
  state: stateCode,
  format: '#####',
});

test.describe(
  'CDD. Search by zip',
  { tag: ['@search', '@smoke'] },
  async () => {
    test.beforeEach('Navigate to the homepage', async ({ baseURL, page }) => {
      await page.goto(`${baseURL}`);
    });
    test(
      'CDD-0003. Search by specific zip',
      {
        tag: [],
        annotation: {
          type: 'description',
          description: 'Search by specific zip should return search page',
        },
      },
      async ({ page }) => {
        const searchByZip: Locator = page.locator(
          '[id="CVCConsumerSiteSearchByDealerZipCode"]'
        );
        const resultsLabel: Locator = page.getByRole('heading', {
          name: 'Results',
          exact: false,
        });
        const dealerCard: Locator = page.locator('[class*="dealer-card"]');

        await searchByZip.fill(`${zipCode}`);
        await searchByZip.press('Enter');

        await expect(resultsLabel).toHaveText(RegExp(/Results.*\d+/));
        expect(await dealerCard.count()).toBeGreaterThan(0);
        const searchResult = await resultsLabel.textContent();
      }
    );
    test(
      `CDD-0004. Search by random zip`,
      {
        tag: [],
        annotation: {
          type: 'description',
          description: `Search by random zip: ${randomZipCode} should return search page`,
        },
      },
      async ({ page }) => {
        const searchByZip: Locator = page.locator(
          '[id="CVCConsumerSiteSearchByDealerZipCode"]'
        );
        const resultsLabel: Locator = page.getByRole('heading', {
          name: 'Results',
          exact: false,
        });
        const dealerCard: Locator = page.locator('[class*="dealer-card"]');

        await searchByZip.fill(`${randomZipCode}`);
        await searchByZip.press('Enter');

        const resultsLabelText = await resultsLabel.textContent();

        if (/Results.*\d+/.test(resultsLabelText ?? '')) {
          await expect(resultsLabel).toHaveText(/Results.*\d+/);
          expect(await dealerCard.count()).toBeGreaterThan(0);
        } else if (/No Results/.test(resultsLabelText ?? '')) {
          expect(await dealerCard.count()).toBe(0);
        } else {
          expect
            .soft(false, `Unexpected results label text: "${resultsLabelText}"`)
            .toBe(true);
        }
      }
    );
    test(
      'CDD-0005. Search by wrong zip',
      {
        tag: [],
        annotation: {
          type: 'description',
          description: `Search by wrong zip: ${wrongZipCode} should return no results page`,
        },
      },
      async ({ page }) => {
        const searchByZip: Locator = page.locator(
          '[id="CVCConsumerSiteSearchByDealerZipCode"]'
        );
        const resultsLabel: Locator = page.getByRole('heading', {
          name: 'Results',
          exact: false,
        });
        const dealerCard: Locator = page.locator('[class*="dealer-card"]');

        await searchByZip.fill(`${randomZipCode}`);
        await searchByZip.press('Enter');

        await expect(resultsLabel).toHaveText(/No Results/);
        expect(await dealerCard.count()).toBe(0);
      }
    );
  }
);
