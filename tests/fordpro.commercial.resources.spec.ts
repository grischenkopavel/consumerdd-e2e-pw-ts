import { test, expect, Locator } from '@playwright/test';

test.describe('Links redirection', { tag: ['@smoke'] }, async () => {
  test.beforeEach(
    'Navigate to CDD homepage',
    async ({ page, baseURL, context }) => {
      await page.goto(`${baseURL}`);
    }
  );
  test.fixme(
    'CDD-0008. Ford Pro Commercial Resources links redirection',
    {
      tag: [],
      annotation: [{
        type: 'description',
        description: `Ford Pro Commercial Resources links redirection. Should redirect to external resources in new tab`,
      },
      {type: 'note', description: 'Works only in UI or headed mode!'}
    ]
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
      const finSimpleTargetURLRegex: RegExp =
        /^\/?https?:\/\/(?:www\.)?ford\.com\/finance\/commercial\-financing\/?$/;

      const fleetCareTargetURLRegex: RegExp =
        /^\/?https?:\/\/(?:www\.)?fleetcare.ford.com\/?/;
      const commercialSolutionsTargetURLRegex: RegExp =
        /^\/?https?:\/\/(?:www\.)?fordpro.com\/en-us\/intelligence\/\/$/;

      await expect(fordProCommercialResourcesCount).toHaveCount(4);

      const finSimpleHref = await finSimple.getAttribute('href');
      const fleetCareHref = await fleetCare.getAttribute('href');
      const commercialSolutionsHref = await commercialSolutions.getAttribute(
        'href'
      );

      await page.goto(validateAndNormalizeHref(finSimpleHref!));

      await expect(page).toHaveURL(finSimpleTargetURLRegex);

      await page.goto(validateAndNormalizeHref(fleetCareHref!));

      await expect(page).toHaveURL(fleetCareTargetURLRegex);

      await page.goto(validateAndNormalizeHref(commercialSolutionsHref!));

      await expect(page).toHaveURL(commercialSolutionsTargetURLRegex);
    }
  );
});

function validateAndNormalizeHref(href: string) {
  if (href != '') {
    const normalizedUrl = href?.startsWith('//') ? `https:${href}` : href;
    return normalizedUrl;
  } else {
    throw new Error(`Wrong input string: ${href}`);
  }
}