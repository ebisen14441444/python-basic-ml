# 10. NumPyの取り出しとaxis

このページでは、NumPy配列から値を取り出す方法、値を上書きする方法、`axis` を使った集計を扱います。

多次元配列に素直にアクセスできることは、機械学習のコードを読むうえでとても大事です。

## 取り出し方をまとめて見る

まずは、2次元配列から値、行、列、範囲を取り出します。

```python
import numpy as np

X = np.array([
    [1, 2, 3],
    [11, 12, 13],
    [21, 22, 23],
    [31, 32, 33],
])

print(X[0])
print(X[0, 0])
print(X[:, 0])
print(X[1:3])
print(X[:, 1:])
```

| 書き方 | 意味 |
| --- | --- |
| `X[0]` | 0番目の行 |
| `X[0, 0]` | 0番目の行、0番目の列 |
| `X[:, 0]` | すべての行の、0番目の列 |
| `X[1:3]` | 1番目から3番目の手前までの行 |
| `X[:, 1:]` | すべての行の、1番目以降の列 |

`:` は「全部」と読むとわかりやすいです。

`X[:, 0]` は、「行は全部、列は0番目」と読めます。

## 行と列の範囲を同時に指定する

行と列の両方に範囲を指定できます。

```python
import numpy as np

X = np.array([
    [1, 2, 3],
    [11, 12, 13],
    [21, 22, 23],
    [31, 32, 33],
])

block = X[:2, :2]
right_side = X[:, 1:]
bottom = X[2:, :]

print(block)
print(right_side)
print(bottom)
```

`X[:2, :2]` は、先頭2行、先頭2列を取り出します。

画像では、こうした範囲指定で一部分を切り出すことがあります。

## 入力 `X` と正解 `y` に分ける

機械学習では、入力データを `X`、正解ラベルを `y` と書くことが多いです。

```python
import numpy as np

data = np.array([
    [80, 72, 1],
    [55, 68, 0],
    [90, 86, 1],
    [62, 58, 0],
])

X = data[:, :2]
y = data[:, 2]

print(X)
print(y)
```

`data[:, :2]` は、すべての行について、先頭から2列目の手前までを取り出しています。

`data[:, 2]` は、すべての行について、2番目の列だけを取り出しています。

## 条件で取り出す

条件を使って、条件に合う値だけを取り出すこともできます。

```python
import numpy as np

scores = np.array([80, 55, 90, 45])

passed = scores >= 60

print(passed)
print(scores[passed])
```

`scores >= 60` の結果は、`True` / `False` の配列になります。

その配列を使うと、条件に合う値だけを取り出せます。

2次元配列でも、行を条件で取り出せます。

```python
import numpy as np

X = np.array([
    [80, 72],
    [55, 68],
    [90, 86],
    [62, 58],
])

y = np.array([1, 0, 1, 0])

positive_X = X[y == 1]

print(positive_X)
```

`X[y == 1]` は、`y` が1の行だけを取り出しています。

## 条件に合う場所を探す

条件に合う値の位置を知りたいときは、`np.where()` を使えます。

```python
import numpy as np

scores = np.array([80, 55, 90, 45])

indices = np.where(scores >= 60)

print(indices)
```

`np.where(scores >= 60)` は、条件に合う場所を返します。

## 代入と上書き

NumPy配列は、取り出し方と同じ書き方で値を上書きできます。

```python
import numpy as np

x = np.arange(5)

x[0] = 100
x[1:4] = [-1, -1, -1]

print(x)
```

`x[1:4]` は3個の場所を指しているので、3個の値を代入しています。

2次元配列でも同じです。

```python
import numpy as np

X = np.array([
    [1, 2, 3],
    [11, 12, 13],
    [21, 22, 23],
])

X[0, 0] = 999
X[:, 1] = 0

print(X)
```

`X[:, 1] = 0` は、すべての行の1番目の列を0にしています。

## スライスへの計算

スライスで取り出した部分に、まとめて計算することもできます。

```python
import numpy as np

x = np.arange(5)

x[1:4] += 5

print(x)
```

リストでは `+` が結合になることがありますが、NumPy配列では数値計算として扱われます。

代入する場所の数と値の数が合わないと、エラーになります。

エラーが出たときは、どの形の配列に、どんな形の値を入れようとしているかを確認します。

## `axis` を使わずに集計する

次の表は、月ごとの商品売上だと思ってください。

```python
import numpy as np

sales = np.array([
    [100, 50, 50],
    [50, 30, 100],
    [50, 50, 70],
    [100, 50, 100],
])

print(np.sum(sales[:, 0]))
print(np.sum(sales[:, 1]))
print(np.sum(sales[:, 2]))
```

列を1つずつ取り出せば、商品ごとの合計を計算できます。

ただし、列が増えると少し面倒です。

## `axis` を使って集計する

`axis` を指定すると、どの軸を集計して消すかを指定できます。

```python
import numpy as np

sales = np.array([
    [100, 50, 50],
    [50, 30, 100],
    [50, 50, 70],
    [100, 50, 100],
])

by_product = np.sum(sales, axis=0)
by_month = np.sum(sales, axis=1)

print(by_product)
print(by_product.shape)
print(by_month)
print(by_month.shape)
```

`sales.shape` は `(4, 3)` です。

`axis=0` は、0番目の軸を集計して消します。月の軸が消えるので、商品ごとの合計が残り、形は `(3,)` になります。

`axis=1` は、1番目の軸を集計して消します。商品の軸が消えるので、月ごとの合計が残り、形は `(4,)` になります。

## 集約関数

`axis` は、合計以外の集約関数でも使えます。

```python
import numpy as np

sales = np.array([
    [100, 50, 50],
    [50, 30, 100],
    [50, 50, 70],
    [100, 50, 100],
])

print(np.mean(sales, axis=0))
print(np.max(sales, axis=0))
print(np.min(sales, axis=0))
```

| 書き方 | 意味 |
| --- | --- |
| `np.sum(x, axis=...)` | 合計 |
| `np.mean(x, axis=...)` | 平均 |
| `np.max(x, axis=...)` | 最大値 |
| `np.min(x, axis=...)` | 最小値 |
| `np.std(x, axis=...)` | 標準偏差 |
| `np.argmax(x, axis=...)` | 最大値の場所 |
| `np.argmin(x, axis=...)` | 最小値の場所 |

## 簡単なプーリング

CNNでは、画像の小さな領域から最大値や平均値を取る処理が出てきます。

ここでは、2行2列の領域に対して最大値と平均値を計算してみます。

```python
import numpy as np

patch = np.array([
    [1, 3],
    [2, 4],
])

max_pooled = np.max(patch)
avg_pooled = np.mean(patch)

print(max_pooled)
print(avg_pooled)
```

実際のCNNでは、こうした計算を画像のいろいろな場所で行います。

ここでは「小さな領域を集約して、値を1つにする」と読めれば十分です。

## テンソル

3次元以上の配列は、テンソルと呼ばれることがあります。

```python
import numpy as np

image = np.zeros((32, 32, 3))
batch = np.zeros((10, 32, 32, 3))

print(image.shape)
print(batch.shape)
```

`image.shape` は `(32, 32, 3)` です。

これは、32行、32列、3チャンネルの画像だと読めます。

`batch.shape` は `(10, 32, 32, 3)` です。

これは、10枚の画像をまとめた配列だと読めます。

PyTorchなどの深層学習ライブラリでも、テンソルという言葉がよく出てきます。

## このページのまとめ

- `X[0]` で行を取り出せる
- `X[0, 1]` のように行と列を指定できる
- `X[:, 0]` は、すべての行の0番目の列を取り出す
- `:` は「全部」と読むとわかりやすい
- `True` / `False` の配列で条件に合う行や値を取り出せる
- スライスを使って配列の一部を上書きできる
- `axis` は、集約して消す軸を指定する
- 3次元以上の配列はテンソルと呼ばれることがある
