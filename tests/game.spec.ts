import { test, expect } from "@playwright/test";
import { scenes, cast, simpleClues } from "../src/novel";
test("hela berättelsen med alla personer, fel val, hjälp, sparning och slut", async ({
  page,
}, info) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Börja berättelsen" }).click();
  for (const scene of scenes) {
    await expect(
      page.getByRole("heading", { name: scene.title, exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("img", {
          name: `Illustration av ${cast[scene.speaker].name}`,
          exact: true,
        })
        .first(),
    ).toBeVisible();
    if (scene.id === "daniel-enter") {
      await page.reload();
      await expect(
        page.getByRole("heading", { name: scene.title, exact: true }),
      ).toBeVisible();
      await page.screenshot({ path: info.outputPath("daniel.png") });
    }
    if (scene.kind === "inspect") {
      await expect(
        page.getByRole("button", { name: "Fortsätt →", exact: true }),
      ).toBeDisabled();
      for (const id of scene.items) {
        await page
          .getByRole("button", {
            name: new RegExp(
              simpleClues[id].title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            ),
          })
          .click();
        await expect(page.getByRole("dialog")).toContainText(
          simpleClues[id].text,
        );
        await page
          .getByRole("button", { name: "Tillbaka till berättelsen" })
          .click();
      }
    }
    if (scene.kind === "question") {
      await page.getByRole("button", { name: scene.options[0].label }).click();
      await expect(
        page.getByText(scene.options[0].answer, { exact: true }),
      ).toBeVisible();
    }
    if (scene.kind === "evidence") {
      if (scene.id === "clock-link") {
        await page
          .getByRole("button", { name: new RegExp(simpleClues.desk.title) })
          .click();
        await page.getByRole("button", { name: "Visa beviset" }).click();
        await expect(page.getByText(/Du kan prova igen/)).toBeVisible();
        await page.getByRole("button", { name: "Hjälp", exact: true }).click();
        await page
          .getByRole("button", { name: "Visa tydligare hjälp" })
          .click();
        await page
          .getByRole("button", { name: "Visa tydligare hjälp" })
          .click();
        await expect(page.getByRole("dialog")).toContainText("Hjälp 3 av 3");
        await page.getByRole("button", { name: "Stäng", exact: true }).click();
      }
      for (const id of scene.correct)
        await page
          .getByRole("button", { name: new RegExp(simpleClues[id].title) })
          .click();
      await page
        .getByRole("button", {
          name:
            scene.correct.length === 2
              ? "Koppla ihop de två bevisen"
              : "Visa beviset",
        })
        .click();
      await expect(
        page.getByText(scene.success, { exact: true }),
      ).toBeVisible();
    }
    if (scene.kind === "accuse") {
      await page.getByRole("button", { name: /Daniel Holm/ }).click();
      await expect(
        page.getByText(/Du kan välja en annan person/),
      ).toBeVisible();
      await page.getByRole("button", { name: /Elisabeth Berg/ }).click();
    }
    if (scene.kind !== "finish")
      await page
        .getByRole("button", { name: "Fortsätt →", exact: true })
        .click();
  }
  await expect(
    page.getByRole("heading", { name: "Fallet är löst", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Fallet är löst", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Se dina anteckningar" }).click();
  await expect(page.getByRole("dialog").getByRole("img")).toHaveCount(6);
  await page.getByRole("button", { name: "Deckarord", exact: true }).click();
  for (const word of [
    "Deckare",
    "Misstänkt",
    "Ledtråd",
    "Motiv",
    "Alibi",
    "Villospår",
    "Spänningsuppbyggnad",
    "Upplösning",
  ])
    await expect(
      page
        .getByRole("dialog")
        .getByRole("heading", { name: word, exact: true }),
    ).toBeVisible();
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page.getByRole("button", { name: "Spela igen" }).click();
  await page.getByRole("button", { name: "Starta om", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Börja berättelsen" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("porträtt och dialog på elevdator och liten skärm", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.screenshot({ path: info.outputPath("start.png") });
  await page.getByRole("button", { name: "Börja berättelsen" }).click();
  await page.screenshot({ path: info.outputPath("noren.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: info.outputPath("mobile.png") });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("img", { name: "Illustration av Kommissarie Norén" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Fortsätt →", exact: true }),
  ).toBeVisible();
});
