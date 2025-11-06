import { test, expect, Locator } from '@playwright/test';
import { fakerEN_US } from '@faker-js/faker';

const state: string = 'Kansas';
const fakerState: string = fakerEN_US.location.state({ abbreviated: false });
const fakerStateCode: string = fakerEN_US.location.state({ abbreviated: true });

test.describe(
  'CDD. Search by state',
  { tag: ['@search', '@smoke'] },
  async () => {
    test.beforeEach(
      'Navigate to a list of all CVC by state',
      async ({ baseURL, page }) => {
        // const context = await browser.newContext();
        // const pageStates = await context.newPage();
        const allCommercialLink: Locator = page.getByRole('link', {
          name: 'See a list of all Commercial',
        });
        const fordProCommVehicleHeader: Locator = page.getByRole('heading', {
          name: 'Ford Pro Commercial Vehicle',
        });

        await page.goto(`${baseURL}`);
        await allCommercialLink.click();

        await expect(fordProCommVehicleHeader).toHaveText(
          'Ford Pro Commercial Vehicle Centers by state'
        );
      }
    );
    test(
      'CDD-0001. Click on specific state',
      {
        tag: [],
        annotation: {
          type: 'description',
          description: `Click on specific state: ${state} return page with that state`,
        },
      },
      async ({ page }) => {
        await page.getByRole('button', { name: `${state}`, exact: true }).click();

        await expect(
          page.getByRole('heading', { name: `${state}`, exact: true })
        ).toContainText(`${state}`);
      }
    );
    test(
      'CDD-0002. Click on random state',
      {
        tag: [],
        annotation: {
          type: 'description',
          description:
            `Click on random state: ${fakerState}, should return page with that state in title and at least one dealer`,
        },
      },
      async ({ page }) => {
        await page.getByRole('button', { name: fakerState, exact: true }).click();

        await expect(
          page.getByRole('heading', { name: fakerState, exact: false })
        ).toContainText(fakerState);

        await page
          .locator("[class='fds-flex__row fmc-cards']>div")
          .last()
          .waitFor({ state: 'visible' });

        expect(
          await page.locator("[class='fds-flex__row fmc-cards']>div").count()
        ).toBeGreaterThan(0);
      }
    );
    test.afterAll('Tier down', async () => {});
  }
);
