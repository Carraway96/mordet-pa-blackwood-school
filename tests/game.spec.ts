import { test, expect } from "@playwright/test";
import { clues, people, connections } from "../src/story";
test("hela fallet, fel svar, sparning och omstart", async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Öppna fallet" }).click();
  await page.getByRole("button", { name: "Tillbaka till fallet" }).click();
  await page.screenshot({ path: "../../work/start-library.png" });
  for (const c of clues.filter((c) => c.room === "library")) {
    await page.getByRole("button", { name: c.name, exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText(c.text);
    await page.getByRole("button", { name: "Tillbaka till fallet" }).click();
  }
  await page.getByRole("button", { name: "Börja utredningen" }).click();
  await page.getByRole("button", { name: "Tillbaka till fallet" }).click();
  await page.reload();
  await expect(page.getByText("4/8 bevis")).toBeVisible();
  for (const room of ["hall", "office"]) {
    await page
      .getByRole("button", {
        name: room === "hall" ? "Korridoren" : "Rektorsexpeditionen",
        exact: true,
      })
      .click();
    for (const c of clues.filter((c) => c.room === room)) {
      await page.getByRole("button", { name: c.name, exact: true }).click();
      await page.getByRole("button", { name: "Tillbaka till fallet" }).click();
    }
  }
  await page.getByRole("button", { name: "Behöver du en ledtråd?" }).click();
  await page.getByRole("button", { name: "Visa tydligare hjälp" }).click();
  await page.getByRole("button", { name: "Visa tydligare hjälp" }).click();
  await expect(page.getByRole("dialog")).toContainText("Nivå 3");
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page.getByRole("button", { name: "Förhör de misstänkta" }).click();
  for (const p of Object.values(people)) {
    await page.getByRole("button", { name: p.name, exact: true }).click();
    for (const q of p.questions) {
      await page.getByRole("button", { name: q.q }).click();
      await expect(page.getByRole("dialog")).toContainText(q.a);
    }
  }
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page
    .getByRole("button", { name: "Anteckningsbok", exact: false })
    .click();
  for (const c of connections) {
    for (const id of c.pair)
      await page
        .getByRole("dialog")
        .getByRole("button", {
          name: new RegExp(clues.find((x) => x.id === id)!.name),
        })
        .click();
    await expect(page.getByRole("dialog").getByRole("status")).toContainText(
      c.title,
    );
  }
  await page.screenshot({ path: "../../work/notebook.png" });
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page.getByRole("button", { name: "Förhör de misstänkta" }).click();
  for (const p of Object.values(people)) {
    await page.getByRole("button", { name: p.name, exact: true }).click();
    await page.getByRole("button", { name: p.confrontQ, exact: false }).click();
    await expect(page.getByRole("dialog")).toContainText(p.confront);
  }
  await page.getByRole("button", { name: "Stäng", exact: true }).click();
  await page.getByRole("button", { name: "Samla till avslöjandet" }).click();
  await page.getByLabel("Vem begick mordet?").selectOption("daniel");
  await page.getByRole("button", { name: "Presentera min lösning" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText(
    "håller inte ihop",
  );
  await page.getByLabel("Vem begick mordet?").selectOption("elisabeth");
  await page.getByLabel("Vilket motiv").selectOption("sale");
  for (const id of ["clock", "lock", "ledger"])
    await page
      .getByLabel(clues.find((c) => c.id === id)!.name, { exact: true })
      .check();
  await page.getByRole("button", { name: "Presentera min lösning" }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Fortsätt berättelsen" }).click();
  await page.getByRole("button", { name: "Se hur deckaren" }).click();
  await expect(page.getByText("Du läste mellan spåren.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Du läste mellan spåren.")).toBeVisible();
  await page.getByRole("button", { name: "Spela igen", exact: true }).click();
  await page
    .getByRole("button", { name: "Starta om spelet", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Öppna fallet" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("startskärm och liten elevskärm", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.screenshot({ path: "../../work/start.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Öppna fallet" }).click();
  await page.getByRole("button", { name: "Tillbaka till fallet" }).click();
  await page.screenshot({ path: "../../work/mobile.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
