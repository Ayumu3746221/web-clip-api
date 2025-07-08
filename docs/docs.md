## 要件

- ユーザーがアカウントを登録・ログインできる
- ユーザーはURLをクリップできる
1. タイトルを設定できる
2. コメントを付与できる
3. クリップした記事に複数の「タグの付け外しができる」
- 自分がクリップした記事を一覧・検索できる。
- 特定のタグがついた記事一覧を取得できる。

## アカウント認証

```bash
GET /api/v1/auth/${provider}
```
- ${Provider}のOAuth認証を実施する。

```bash
GET /api/v1/auth/${provider}/callback
```
- /api/v1/auth/${provider}のコールバック先
- このエンドポイントのイベントハンドラ内でJWTを発行する。

## クリップ

```bash
GET /api/v1/me/clips
```
- ユーザーが持つクリップの一覧を表示する
- user_idが

**レスポンスボディ**
```json
{
    "clips":[
        {
            "clip_id":1,
            "clip_name":"mdn web docs",
            "clip_comment":"モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url":"https://developer.mozilla.org/ja/docs/Web"
        },
        {
            "clip_id":2,
            "clip_name":"Honoの日本語ドキュメント",
            "clip_comment":"Typescriptの軽量なAPIフレームワーク",
            "cli@_url":"https://hono-ja.pages.dev/docs/"
        }
    ]
}
```

```bash
GET /api/v1/me/clips?q=mdn
```

- ユーザーが持つクリップを検索する（前方一致検索）
- qの設定がない場合は400を返す。
- 該当するものがなかった場合は空のJsonを返す

**レスポンスボディ**
```json
{
    "query":"mdn",
    "totalResults":"1",
    "clips":[
        {
            "clip_id":1,
            "clip_name":"mdn web docs",
            "clip_comment":"モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url":"https://developer.mozilla.org/ja/docs/Web"
        },
    ]
}
```

```bash
POST /api/v1/me/clips
```
- 新しいクリップを作成する

**リクエストボディー**
```json
{
    "clip_name":"mdn web docs",
    "clip_comment":"モダンWebに関しての日本語訳ドキュメンテーション",
    "clip_url":"https://developer.mozilla.org/ja/docs/Web"
}
```
- ヘッダーにトークンがない場合は401を返す。
- clip_name または clip_urlが欠けている場合は400を返す。

```bash
PUT /api/v1/me/clips/${clip_id}
```
**リクエストボディー**
```json
{
    "clip_name":"モダンWebドックス"
}
```
- ヘッダーにトークンがない場合は401を返す。
- clip_idに該当するclipが存在しない場合は400を返す

```bash
DELETE /api/v1/me/clips/${clip_id}
```

- ヘッダーにトークンがない場合は401を返す。
- clip_idに該当するリソースがない場合は404を返す。

# タグについて

```bash
GET /api/v1/tags?q="doc"
```

- クエリパラメータに対して前方一致検索
- 該当する要素がない場合は空のJSONを返す
- qが設定されずにリクエストがあった場合は400を返す
- ヘッダーにトークンがない場合は401を返す

**レスポンスボディー**
```json
{
    "query":"doc",
    "totalResult":1,
    "tags":[
        {
            "tag_id":1,
            "tag_name":"docs"
        }
    ]
}
```

```bash
GET /api/v1/me/clips?tag_name=docs
```

- tag_idが該当しているtagがついてるユーザーのクリップを返す。
- 該当するclipがない場合はからのJSONを返す。

**レスポンスボディ**
```json
{
    "tag_id":1,
    "tag_name":"docs",
    "clips":[
        {
            "clips_id":1,
            "clip_name":"mdn web docs",
            "clip_comment":"モダンWebに関しての日本語訳ドキュメンテーション",
            "clip_url":"https://developer.mozilla.org/ja/docs/Web"
        }
    ]
}
```

```bash
POST /api/v1/tags
```

- すでにtag_nameが存在している場合、409を返す
- ヘッダーにトークンがない場合は401を返す。

**リクエストボディ**
```json
{
    "tag_name":"React"
}
```


# ClipにTagsをつける。

```bash
POST /api/v1/me/clips/${clip_id}/tags
```

- ユーザー個人のクリップにタグをつける
- もし、同一のclipとtagのペアがあった場合は400を返す
- ヘッダーにトークンがない場合は401を返す。

**リクエストボディー**
```json
{
    "tag_id":1
}
```