# 14. Polarsと機械学習の前処理

このページでは、Polarsで機械学習の前処理に近い操作を扱います。

機械学習では、データを読み込んだあと、入力 `X` と正解 `y` に分けることが多いです。

## 入力と正解に分ける

数学と英語の点数から、合格したかどうかを予測したいとします。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

X = df.select(["math", "english"])
y = df.select("passed")

print(X)
print(y)
```

- `X`: モデルに渡す材料
- `y`: モデルに当ててほしい答え

`X` は複数の列を持つ表、`y` は正解ラベルの列です。

## 特徴量を作る

機械学習では、元の列から新しい列を作ることがあります。

ここでは、数学と英語の平均点を作ります。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

df = df.with_columns(
    ((pl.col("math") + pl.col("english")) / 2).alias("average")
)

print(df.select(["math", "english", "average"]))
```

このように、モデルに渡す前にデータを加工することを前処理と呼びます。

## 条件でラベルを作る

既存の列から、`True` / `False` の列を作ることもあります。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

df = df.with_columns(
    (pl.col("math") >= 60).alias("math_passed")
)

print(df.select(["name", "math", "math_passed"]))
```

`pl.col("math") >= 60` の結果が、新しい列として保存されています。

## NumPy配列に変換する

機械学習ライブラリに渡すために、PolarsのDataFrameをNumPy配列に変換することがあります。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

X = df.select(["math", "english"]).to_numpy()
y = df.select("passed").to_numpy()

print(X)
print(y)
print(X.shape)
print(y.shape)
```

`to_numpy()` は、PolarsのDataFrameをNumPy配列に変換するメソッドです。

NumPyの章で見た `shape` を使って、モデルに渡すデータの形を確認できます。

## 学習用と確認用に分ける

本格的には専用のライブラリを使いますが、ここでは前半と後半に分けるだけの例を見ます。

```python
import polars as pl

df = pl.read_csv("examples/scores.csv")

train_df = df[:3]
test_df = df[3:]

print("train")
print(train_df)
print("test")
print(test_df)
```

`df[:3]` は先頭から3行目の手前まで、`df[3:]` は3行目以降を取り出しています。

## このページのまとめ

- 機械学習では `X` と `y` に分けることが多い
- `with_columns()` で特徴量を作れる
- 条件式から `True` / `False` の列を作れる
- `to_numpy()` でNumPy配列に変換できる
- `shape` でモデルに渡すデータの形を確認できる
- 前処理では、モデルに渡す前にデータを整える
