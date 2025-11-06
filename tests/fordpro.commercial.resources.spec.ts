import { test, expect, Locator } from '@playwright/test';

test.describe('Links redirection', { tag: ['@smoke'] }, async () => {
  test.beforeEach(
    'Navigate to CDD homepage',
    async ({ page, baseURL, context }) => {
      await page.goto(`${baseURL}`);
    }
  );
  test(
    'CDD-0008. Ford Pro Commercial Resources links redirection',
    {
      tag: [],
      annotation: {
        type: 'description',
        description: `Ford Pro Commercial Resources links redirection. Should redirect to external resources in new tab`,
      },
    },
    async ({ page, context }) => {
      const fordProCommercialResourcesCount: Locator = page.locator(
        '[id*="CVCConsumerSiteResourceSection"] [class*="resources"]'
      );
      const upfits: Locator = page.getByRole('link', {
        name: 'Ford Upfits',
      });
      const finSimple: Locator = page.getByRole('link', {
        name: 'Ford Pro FinSimple',
      });
      const fleetCare: Locator = page.getByRole('link', {
        name: 'Ford Fleet',
      });
      const commercialSolutions: Locator = page.getByRole('link', {
        name: 'Ford Commercial Solutions',
      });
      const finSimpleTargetURL: string =
        'https://www.ford.com/finance/commercial-financing/';
      const fleetCareTargetURL: string = 'https://www.fleetcare.ford.com/';
      const commercialSolutionsTargetURL: string =
        'https://www.fordpro.com/en-us/intelligence//';

      await expect(fordProCommercialResourcesCount).toHaveCount(4);

      const pagePromise = context.waitForEvent('page');
      await finSimple.click();

      const finSimplePage = await pagePromise;
      await finSimplePage.waitForLoadState('load');
      await finSimplePage.waitForLoadState('domcontentloaded');
      console.log('New page URL:', finSimplePage.url());

      //expect(finSimplePage.url()).toBe(finSimpleTargetURL);
      await finSimplePage.close();
    }
  );
});
