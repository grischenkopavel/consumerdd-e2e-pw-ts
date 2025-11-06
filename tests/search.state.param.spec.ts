import { test, expect, Locator } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

test.describe(
  'CDD-0002. Search by state functionality',
  { tag: [] },
  async () => {
    test.beforeAll('Navigate to a list of all CVC by state', async ({}) => {});
    const validStates = parse(fs.readFileSync('test-data/states.csv'), {
      skip_empty_lines: true,
      columns: true,
    }) as unknown as Array<{ state: string; stateCode: string }>;

    for (const { state } of validStates) {
      test(`Get CVC dealers list for ${state} state. Should return page with that state in title and at least one dealer`, async ({
        baseURL,
        page,
      }) => {
        const allCommercialLink: Locator = page.getByRole('link', {
          name: 'See a list of all Commercial',
        });
        const stateLocator: Locator = page.getByRole('button', {
          name: state,
          exact: true,
        });
        const stateHeadingLocator: Locator = page.getByRole('heading', {
          name: state,
          exact: true,
        });
        const stateContainerLocator: Locator = page.locator(
          "[class='fds-flex__row fmc-cards']>div"
        );

        await page.goto(`${baseURL}`);
        await allCommercialLink.click();
        await stateLocator.click();

        await expect(stateHeadingLocator).toContainText(state);

        await stateContainerLocator.last().waitFor({ state: 'visible' });

        expect(await stateContainerLocator.count()).toBeGreaterThan(0);
      });
    }
  }
);
