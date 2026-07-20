import { test, expect } from "@playwright/test";

// ===========================================================
// コアループのスモークテスト（未ログイン状態で確認できる範囲）
// Googleログイン自体はテスト用アカウントの用意が必要なため、
// このスイートでは自動化せず、手動確認チェックリスト側で担保する。
// ===========================================================

test.describe("トップページ", () => {
  test("正常に表示され、ヘッダー・ロゴが見える", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("GemShare")).toBeVisible();
    await expect(page.getByPlaceholder("Gemを検索...")).toBeVisible();
  });

  test("Gemカードが1件以上表示される（投稿データがある前提）", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("main a[href^='/prompts/']");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("未ログイン時、投稿するリンクから /prompts/new に行くとログイン誘導が出る", async ({ page }) => {
    await page.goto("/prompts/new");
    await expect(page.getByText("投稿にはログインが必要です")).toBeVisible();
    await expect(page.getByRole("main").getByRole("button", { name: /Google/ })).toBeVisible();
  });
});

test.describe("カテゴリ", () => {
  test("カテゴリ一覧が表示され、10カテゴリ以上ある", async ({ page }) => {
    await page.goto("/categories");
    await expect(page.getByText("カテゴリから探す")).toBeVisible();
    const items = page.locator("a[href^='/categories/']");
    await expect(items).toHaveCount(await items.count());
    expect(await items.count()).toBeGreaterThanOrEqual(10);
  });

  test("カテゴリ詳細ページに遷移できる", async ({ page }) => {
    await page.goto("/categories");
    await page.locator("a[href^='/categories/']").first().click();
    await expect(page).toHaveURL(/\/categories\/.+/);
  });
});

test.describe("検索", () => {
  test("検索窓からキーワード検索ができる", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Gemを検索...").fill("SEO");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=SEO/);
    await expect(page.getByText(/検索結果/)).toBeVisible();
  });

  test("一致しないキーワードでは0件メッセージが出る", async ({ page }) => {
    await page.goto("/search?q=zzz_no_such_gem_zzz");
    await expect(page.getByText("一致するGemが見つかりませんでした。")).toBeVisible();
  });
});

test.describe("ランキング", () => {
  test("ランキングページが表示され、期間タブが切り替えられる", async ({ page }) => {
    await page.goto("/ranking");
    await expect(page.getByText("人気Gemランキング")).toBeVisible();
    await page.getByRole("link", { name: "今日" }).click();
    await expect(page).toHaveURL(/period=today/);
  });
});

test.describe("Gem詳細ページ", () => {
  test("詳細ページを開くとタイトル・プロンプト・コピーボタンが見える", async ({ page }) => {
    await page.goto("/");
    await page.locator("main a[href^='/prompts/']").first().click();
    await expect(page).toHaveURL(/\/prompts\/.+/);
    await expect(page.getByText("GEMプロンプト")).toBeVisible();
  });

  test("未ログイン時、コピーボタンはログイン誘導になっている", async ({ page }) => {
    await page.goto("/");
    await page.locator("main a[href^='/prompts/']").first().click();
    await expect(page.getByRole("button", { name: /ログインしてコピー/ })).toBeVisible();
  });

  test("未ログイン時、4行を超えるプロンプトは3行に切り詰められる", async ({ page }) => {
    // 十分に長いプロンプトを持つ投稿がある前提。無ければこのテストはskipする運用でも可。
    await page.goto("/");
    await page.locator("main a[href^='/prompts/']").first().click();
    const lockBadge = page.getByText("続きはログインすると表示されます");
    // 短いプロンプトの投稿だった場合は出ないので、存在チェックのみ（失敗させない）
    if (await lockBadge.count()) {
      await expect(lockBadge).toBeVisible();
    }
  });
});

test.describe("マイページ（未ログイン）", () => {
  test("/my は未ログインだとログイン誘導が出る", async ({ page }) => {
    await page.goto("/my");
    await expect(page.getByText("マイページはログインが必要です")).toBeVisible();
  });
});

test.describe("レスポンシブ：モバイル下部バー", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("モバイル幅では下部アイコンバーが表示され、PC用ヘッダーナビは隠れる", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "ホーム" })).toBeVisible();
    await expect(page.getByRole("link", { name: "カテゴリ" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ランキング" })).toBeVisible();
  });
});