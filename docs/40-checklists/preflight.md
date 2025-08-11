# 実装前チェックリスト（Preflight）

## 方針確定
- [ ] 非機能: 同時接続/可用性/保持期間（開発値で可）
- [ ] 認証方式: JWT HS256（期限/issuer/audience 決定）
- [ ] ドメイン/ルーム命名規約

## 準備
- [ ] docker-compose（pg/redis）
- [ ] .env.example（backend/frontend）
- [ ] OpenAPI & WS 定義の最終化

## セキュリティ/運用
- [ ] CORS/CSP 方針
- [ ] Rate Limit（REST/WS）
- [ ] 監視メトリクス（req/s, latency, WS connections）

## テスト/リリース
- [ ] Playwright シナリオ合意
- [ ] Artillery WS スモーク
- [ ] バージョニングと変更通知ルール
