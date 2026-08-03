# Umbrella Parade Kindle Navi

Kindle KDP出版管理ツール for Umbrella Parade

## 公開ページ

https://umbrellaparade.github.io/Kindle-Publishing-Navi-/

## 機能

- 出版プロジェクト管理（複数書籍対応、ローカルストレージ永続保存）
- Kindle本制作チェックリスト（20ステップ、目標日・メモ付き）
- KDP登録進捗（書籍説明文HTMLエディタ、キーワード管理）
- カテゴリーチェック（KDP実在カテゴリーから選択）
- プロモーション進捗（出版目標・戦略メモ・SNSメモ）
- 原稿Kindle調整ツール（フォーマット判定→ジャンル診断→ルビ→読みやすさ修正→出力）

## 技術スタック

- React 18
- ローカルストレージによるデータ永続化
- docx / file-saver（原稿ダウンロード）

## 開発

```bash
npm install
npm start
```

## ビルド

```bash
npm run build
```

## カスタマイズポイント

- `src/App.js` の `KDP_CATEGORIES` でカテゴリーを追加・変更
- `src/App.js` の `GENRES` でジャンルリストを変更
- `src/App.js` の `KINDLE_STEPS` でチェックリスト項目を変更
- 読みやすさ修正の `runReadabilityFix` 関数をAI API連携に差し替え可能

## ライセンス

© Umbrella Parade / べるぼ
