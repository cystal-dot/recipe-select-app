**注意**  
ローカル用のDBを用意していないので起動はsupabaseのDBに繋ぐ必要あり。ということで2025年1月現在は私のPCからかリンクからしか見られない。  
ユーザー制御を入れていないため、自由にupdateができてしまうのでリンクは載せていない。  

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
