リンク：https://recipe-select-app.vercel.app/

supabaseのキーは`.env`に格納  
```
NEXT_PUBLIC_SUPABASE_URL={KEY}
NEXT_PUBLIC_SUPABASE_ANON_KEY={KEY}
```

テーブル
```
CREATE TABLE recipes (
    id bigint PRIMARY KEY,
    name text,
    category text,
    ingredients text[]
);
```
