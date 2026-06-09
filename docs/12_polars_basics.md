# 12. Polarsの基本

ここからは、Polarsを扱います。

Polarsは、表形式データというエクセルみたいなデータを扱うためのライブラリです。

全体的SQLに似た書き方が多いので、そちらを学習している人はわかりやすいかなと思います。

機械学習講習会ではこの `Polars`を使って、コードを書いていきます。

### ライブラリを読み込む

Polarsは、慣習的に `pl` という短い名前をつけて使います。
ここはどのライブラリでも同じです。

```python
import polars as pl

print(pl.__version__)
```

### DataFrameを作る

表形式のデータは、DataFrameという名前で扱います。

```python
import polars as pl

df = pl.DataFrame({
    "name": ["Sato", "Suzuki", "Tanaka"],
    "math": [80, 55, 90],
    "english": [72, 68, 86],
    "passed": [True, False, True],
})

print(df)
```

DataFrameは、エクセルのような行と列を持つ表のようなオブジェクトです。

今回の例は1人分のデータが1行、点数や合否のような項目が列になります。

ただ基本的には自分で作るより、外部のデータを読み込んでそれを扱っていくことがほとんどです。

### CSVを読み込む

前述の通り、実際のデータ分析では、CSVファイルを読み込むことが多いです。

ここでは、Palmer Penguinsという有名なデータセットを使います。

ペンギンの種類、住んでいる島、くちばしの長さ、体重などが入った表です。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

print(df)
```
## データを見る
### データを見る

データを読み込んだら、まずはデータの中身を見てみましょう。

```python
import polars as pl
df = pl.read_csv("examples/penguins.csv")

print(df.head())
print(df.tail())
print(df.sample(n = 5))
print(df.sample(fraction = 0.05))
```

`head()` は、先頭の数行を見るためのメソッドです。`()`で先頭幾つのデータを見るかを指定します。デフォルトは5つです。
`tail`は末尾を見ます。`sample`はランダムに見ます。

### 行数と列数と型を見る

`shape`で形状の確認、`columns` で列名の一覧を確認できます。

```python
import polars as pl
df = pl.read_csv("examples/penguins.csv")

print(df.shape)
print(df.columns)
print(df.schema)
```

### 統計量を見る
ざっくり統計量を見たい時は`describe()`を使う

```python
import polars as pl
df = pl.read_csv("examples/penguins.csv")

print(df.describe())
```


## このページのまとめ

- Polarsは表形式データを扱うためのライブラリ
- `import polars as pl` と書いて読み込む
- DataFrameは行と列を持つ表のようなオブジェクト
- `pl.read_csv()` でCSVを読み込む
- `head()` で先頭を見る
- `shape`, `columns`, `schema` で表の情報を確認する
