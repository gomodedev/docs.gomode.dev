// Browser acceptance for Go Mode host galleries, guides, local search, mobile navigation, and keyboard access.
import { expect, test } from "@playwright/test";

test("homepage loads real host captures without horizontal overflow", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  for (const image of await page.locator("main img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await image.evaluate((element) => (element as HTMLImageElement).decode());
    await expect(image).toHaveAttribute("alt", /.+/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("homepage.png"), fullPage: true });
  expect(errors).toEqual([]);
});

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
  for (const image of await page.locator("main img:visible").all()) {
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

test("captures follow the documentation appearance override", async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const capture = page.locator('a[href*="/screenshots/caic-tasks-"]:visible');
  await capture.scrollIntoViewIfNeeded();
  const image = capture.getByRole("img");
  await expect(image).toHaveJSProperty("complete", true);
  await expect(capture).toHaveAttribute("href", /caic-tasks-light\.webp$/);
  if (info.project.name === "mobile") await page.getByRole("button", { name: "mobile navigation" }).click();
  await page.getByRole("switch", { name: "Switch to dark theme" }).filter({ visible: true }).click();
  if (info.project.name === "mobile") await page.getByRole("button", { name: "mobile navigation" }).click();
  await expect(image).toHaveJSProperty("currentSrc", new URL("/screenshots/caic-tasks-dark.webp", page.url()).href);
  await expect(capture).toHaveAttribute("href", /caic-tasks-dark\.webp$/);
  const opened = page.waitForEvent("popup");
  await capture.click();
  const fullSize = await opened;
  await expect(fullSize.locator("img")).toBeVisible();
  expect(fullSize.url()).toMatch(/caic-tasks-dark\.webp$/);
  await fullSize.close();

  await page.route("**/assets/*.js", (route) => route.abort());
  await page.reload();
  await capture.scrollIntoViewIfNeeded();
  await expect(capture).toHaveAttribute("href", /caic-tasks-dark\.webp$/);
  await expect(image).toHaveJSProperty("currentSrc", new URL("/screenshots/caic-tasks-dark.webp", page.url()).href);
});
