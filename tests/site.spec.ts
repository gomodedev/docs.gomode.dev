// Browser acceptance for Go Mode guides, local search, native captures, mobile navigation, and keyboard access.
import { expect, test } from "@playwright/test";

test("documentation supports Android setup, search, and responsive navigation", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.location().url.endsWith("/this-page-does-not-exist"))
      errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Set up Android", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Android setup" })).toBeVisible();
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(image).toHaveAttribute("alt", /.+/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Control+Home");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({ path: info.outputPath("android-guide.png"), fullPage: true });
  await page.screenshot({ path: info.outputPath("android-guide-top.png") });
  await page.getByRole("button", { name: "Search", exact: false }).first().click();
  await page.getByRole("searchbox").fill("voice gateway");
  const result = page
    .getByRole("link", { name: /Voice gateway/, exact: false })
    .filter({ visible: true })
    .first();
  await expect(result).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("searchbox")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Search", exact: false }).first()).toBeFocused();
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "mobile navigation" }).click();
    await page.getByRole("link", { name: "Build a host", exact: true }).filter({ visible: true }).click();
  } else {
    await page.getByRole("link", { name: "Build a host", exact: true }).click();
  }
  await expect(page.getByRole("heading", { level: 1, name: "Host integration" })).toBeVisible();
  const missing = await page.goto("/this-page-does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "PAGE NOT FOUND" })).toBeVisible();
  expect(errors).toEqual([]);
});
