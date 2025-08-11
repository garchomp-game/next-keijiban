# CI 方針（初期）
- Lint/Typecheck（フロント）
- pytest（バックエンド）
- Playwright（`--project chromium` のみで可）
- Artillery smoke（ジョブ時間を短く）

GitHub Actions を使う場合、DB/Redis は services で起動。Secrets は GitHub Secrets に委譲。
