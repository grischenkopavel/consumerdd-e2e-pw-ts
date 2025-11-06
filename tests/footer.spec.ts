import { test, expect, Locator } from '@playwright/test';

test.describe('Footer', { tag: ['@smoke'] }, async () => {
  test.beforeEach(
    'Navigate to CDD homepage',
    async ({ page, baseURL, context }) => {
      await page.goto(`${baseURL}`);
    }
  );
  test.fixme(
    'CDD-0010. Ford Motor Company copyright',
    {
      tag: [],
      annotation: {
        type: 'description',
        description: `Ford Motor Company copyright "© YYYY Ford Motor Company" is present and reflects current year`,
      },
    },
    async ({ page }) => {
      const copyright: Locator = page.getByRole('link', {
        name: 'Ford Motor Company',
        exact: false,
      });

      const currentYear = new Date().getFullYear();

      await expect(copyright).toHaveText(
        new RegExp(`©\\s*${currentYear}\\s*Ford Motor Company`)
      );
    }
  );
});
