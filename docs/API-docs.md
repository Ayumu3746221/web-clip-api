## 要件

- ユーザーがアカウントを登録・ログインできる
- ユーザーはURLをクリップできる
  1. タイトルを設定できる
  2. コメントを付与できる
  3. クリップした記事に複数の「タグの付け外しができる」
- 自分がクリップした記事を一覧・検索できる
- 特定のタグがついた記事一覧を取得できる

---

## アカウント認証

### OAuth認証
```bash
GET /api/v1/auth/${provider}
```
- `${provider}`のOAuth認証を実施する

### コールバック
```bash
GET /api/v1/auth/${provider}/callback
```
- `/api/v1/auth/${provider}`のコールバック先
- このエンドポイントのイベントハンドラ内でJWTを発行する

---

## クリップ

### クリップ一覧取得
```bash
GET /api/v1/me/clips
```
- ユーザーが持つクリップの一覧を表示する

**レスポンスボディ**
```json
{
    "clips": [
        {
            "clip_id": 1,
            "clip_name": "mdn web docs",
            "clip_comment": "モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url": "https://developer.mozilla.org/ja/docs/Web"
        },
        {
            "clip_id": 2,
            "clip_name": "Honoの日本語ドキュメント",
            "clip_comment": "Typescriptの軽量なAPIフレームワーク",
            "clip_url": "https://hono-ja.pages.dev/docs/"
        }
    ]
}
```

---

### クリップ検索
```bash
GET /api/v1/me/clips?q=mdn
```
- ユーザーが持つクリップを検索する（前方一致検索）
- `q`の設定がない場合は400を返す
- 該当するものがなかった場合は空のJSONを返す

**レスポンスボディ**
```json
{
    "query": "mdn",
    "totalResults": "1",
    "clips": [
        {
            "clip_id": 1,
            "clip_name": "mdn web docs",
            "clip_comment": "モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url": "https://developer.mozilla.org/ja/docs/Web"
        }
    ]
}
```

---

### 新しいクリップ作成
```bash
POST /api/v1/me/clips
```
**リクエストボディ**
```json
{
    "clip_name": "mdn web docs",
    "clip_comment": "モダンWebに関しての日本語訳ドキュメンテーション",
    "clip_url": "https://developer.mozilla.org/ja/docs/Web"
}
```
- ヘッダーにトークンがない場合は401を返す
- `clip_name`または`clip_url`が欠けている場合は400を返す

---

### クリップ更新
```bash
PUT /api/v1/me/clips/${clip_id}
```
**リクエストボディ**
```json
{
    "clip_name": "モダンWebドックス"
}
```
- ヘッダーにトークンがない場合は401を返す
- `clip_id`に該当するクリップが存在しない場合は400を返す

---

### クリップ削除
```bash
DELETE /api/v1/me/clips/${clip_id}
```
- ヘッダーにトークンがない場合は401を返す
- `clip_id`に該当するリソースがない場合は404を返す

---

## タグについて

### タグ検索
```bash
GET /api/v1/tags?q="doc"
```
- クエリパラメータに対して前方一致検索
- 該当する要素がない場合は空のJSONを返す
- `q`が設定されずにリクエストがあった場合は400を返す
- ヘッダーにトークンがない場合は401を返す

**レスポンスボディ**
```json
{
    "query": "doc",
    "totalResult": 1,
    "tags": [
        {
            "tag_id": 1,
            "tag_name": "docs"
        }
    ]
}
```

---

### タグ付きクリップ取得
```bash
GET /api/v1/me/clips?tag_name=docs
```
- `tag_id`が該当しているタグがついているユーザーのクリップを返す
- 該当するクリップがない場合は空のJSONを返す

**レスポンスボディ**
```json
{
    "tag_id": 1,
    "tag_name": "docs",
    "clips": [
        {
            "clips_id": 1,
            "clip_name": "mdn web docs",
            "clip_comment": "モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url": "https://developer.mozilla.org/ja/docs/Web"
        }
    ]
}
```

---

### 新しいタグ作成
```bash
POST /api/v1/tags
```
**リクエストボディ**
```json
{
    "tag_name": "React"
}
```
- すでに`tag_name`が存在している場合、409を返す
- ヘッダーにトークンがない場合は401を返す

---

## ClipにTagsをつける

### タグ付与
```bash
POST /api/v1/me/clips/${clip_id}/tags
```
**リクエストボディ**
```json
{
    "tag_id": 1
}
```
- ユーザー個人のクリップにタグをつける
- 同一のクリップとタグのペアがあった場合は400を返す
- ヘッダーにトークンがない場合は401を返す