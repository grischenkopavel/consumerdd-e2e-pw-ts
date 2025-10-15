import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe(
  "CDD-0001. Search by stage",
  { tag: ["@search", "@smoke"] },
  async () => {
    test.beforeEach(
      "Navigate to a list of all CVC by state",
      async ({ baseURL, page }) => {
        // const context = await browser.newContext();
        // const pageStates = await context.newPage();
        await page.goto(`${baseURL}`);
        await page
          .getByRole("link", { name: "See a list of all Commercial" })
          .click();

        await expect(
          page.getByRole("heading", {
            name: "Ford Pro Commercial Vehicle",
          })
        ).toHaveText("Ford Pro Commercial Vehicle Centers by state");
      }
    );
    test(
      "Click on specific state",
      {
        tag: [],
        annotation: {
          type: "description",
          description: "Click on specific state return page with that state",
        },
      },
      async ({ page }) => {
        await page.getByRole("button", { name: "California" }).click();

        await expect(
          page.getByRole("heading", { name: "California", exact: true })
        ).toContainText("California");
      }
    );
    test("Click on random state", async ({ page }) => {
      const state: string = faker.location.state();
      
      await page.getByRole("button", { name: state }).click();

      await expect(
        page.getByRole("heading", { name: state, exact: true })
      ).toContainText(state);
    });
    test.afterAll("Tier down", async () => {
      
    });
  }
);
