# 12. Polarsの基本

このページでは、Polarsの基本を扱います。

Polarsは、表形式データを扱うためのライブラリです。

CSVファイルを読み込んだり、行数や列名を確認したりできます。

## ライブラリを読み込む

Polarsは、慣習的に `pl` という短い名前をつけて使います。

```python
import polars as pl

print(pl.__version__)
```

`import polars as pl` は、「Polarsを `pl` という名前で使います」という意味です。

## DataFrameを作る

表形式のデータは、DataFrameとして扱います。

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

DataFrameは、行と列を持つ表のようなオブジェクトです。

1人分のデータが1行、点数や合否のような項目が列になります。

## CSVを読み込む

実際のデータ分析では、CSVファイルを読み込むことが多いです。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

print(df)
```

Colabで実行する場合は、CSVファイルをアップロードしてからパスを指定します。

## 先頭を見る

データを読み込んだら、まず先頭を見ます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

print(df.head())
```

`head()` は、先頭の数行を見るためのメソッドです。

読み込んだデータが想定どおりか、まずここで確認します。

## 行数と列数を見る

DataFrameの形は `shape` で確認できます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

print(df.shape)
print(df.columns)
```

`shape` は属性なので `()` をつけません。

`columns` も属性で、列名の一覧を確認できます。

## 型を見る

列ごとの型は `schema` で確認できます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

print(df.schema)
```

`i64` は整数、`str` は文字列、`bool` は `True` / `False` を表します。

表データを扱うときは、列名だけでなく型も見る習慣をつけると安全です。

## このページのまとめ

- Polarsは表形式データを扱うためのライブラリ
- `import polars as pl` と書いて読み込む
- DataFrameは行と列を持つ表のようなオブジェクト
- `pl.read_csv()` でCSVを読み込む
- `head()` で先頭を見る
- `shape`, `columns`, `schema` で表の情報を確認する
