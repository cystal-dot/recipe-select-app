

ローカルで起動する場合キーは`.env.local`に入れる。  
本番ではvercelのenvで管理。  
```
SUPABASE_URL={}
SUPABASE_SERVICE_ROLE_KEY={}
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
