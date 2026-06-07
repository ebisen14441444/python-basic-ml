# 13. Polarsの列操作と条件抽出

このページでは、Polarsで列を選んだり、条件で行を絞り込んだりします。

Polarsでは、`select()`、`filter()`、`with_columns()` をよく使います。

## 列を選ぶ

特定の列だけを見たいときは、`select()` を使います。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

scores = df.select(["math", "english"])

print(scores)
```

`select()` は、列を選ぶためのメソッドです。

リストで列名を渡すと、複数の列を選べます。

## 1列だけ選ぶ

1列だけ選ぶこともできます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

math_scores = df.select("math")

print(math_scores)
```

`df.select("math")` は、`math` 列だけを持つDataFrameを返します。

## `pl.col()`で列を指定する

Polarsでは、計算や条件を書くときに `pl.col()` をよく使います。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

math_scores = df.select(pl.col("math"))

print(math_scores)
```

`pl.col("math")` は、「`math` 列を使う」という意味です。

## 条件で行を絞り込む

条件に合う行だけを取り出すときは、`filter()` を使います。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

passed_students = df.filter(pl.col("math") >= 60)

print(passed_students)
```

`pl.col("math") >= 60` のように書くと、列に対する条件を作れます。

この例では、数学が60点以上の行だけを残しています。

## 条件を組み合わせる

複数の条件を組み合わせることもできます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

selected = df.filter(
    (pl.col("math") >= 60) & (pl.col("english") >= 60)
)

print(selected)
```

Polarsで条件を組み合わせるときは、条件全体を `()` で囲みます。

`&` は「両方の条件を満たす」という意味です。

## 新しい列を作る

新しい列を追加するときは、`with_columns()` を使います。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

df = df.with_columns(
    ((pl.col("math") + pl.col("english")) / 2).alias("average")
)

print(df)
```

`.alias("average")` は、計算結果の列名を `average` にする、という意味です。

## 列を並べ替える

データを確認するときは、値で並べ替えることもあります。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

sorted_df = df.sort("math", descending=True)

print(sorted_df)
```

`sort()` は、指定した列で並べ替えるメソッドです。

## このページのまとめ

- `select()` で列を選ぶ
- `pl.col("列名")` で列を指定する
- `filter()` で条件に合う行を取り出す
- 複数条件では `&` を使える
- `with_columns()` で新しい列を作る
- `.alias()` で列名をつける
