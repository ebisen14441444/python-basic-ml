# 03. NumPyとPandas

## NumPy

NumPyは数値計算を効率よく行うためのライブラリです。

```python
import numpy as np

scores = np.array([80, 65, 90])
print(scores.mean())
print(scores.max())
```

配列にまとめて計算できるため、機械学習の内部でもよく使われます。

```python
scores = np.array([80, 65, 90])
adjusted = scores + 5
print(adjusted)
```

## Pandas

Pandasは表形式データを扱うためのライブラリです。

```python
import pandas as pd

df = pd.read_csv("examples/scores.csv")
print(df.head())
```

## よく使う操作

```python
print(df.info())
print(df.describe())
print(df["math"])
print(df[["math", "english"]])
```

## 条件で絞り込む

```python
passed = df[df["math"] >= 60]
print(passed)
```

## 新しい列を作る

```python
df["average"] = (df["math"] + df["english"]) / 2
print(df)
```

## 機械学習でよく見る形

機械学習では、入力データ `X` と正解ラベル `y` に分けることが多いです。

```python
X = df[["math", "english"]]
y = df["passed"]
```

この `X` と `y` の考え方は、次の機械学習講習会で何度も使います。
