# 10. NumPyの取り出しとaxis

このページでは、NumPy配列から値を取り出す方法、値を上書きする方法、`axis` を使った集計を扱います。

多次元配列に素直にアクセスできることは、機械学習のコードを読むうえでとても大事です。

## 取り出し方をまとめて見る
### 二次元から取り出す

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

<p><code>X</code> (shape: (4, 3))</p>

<table>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>11</td><td>12</td><td>13</td></tr>
<tr><td>21</td><td>22</td><td>23</td></tr>
<tr><td>31</td><td>32</td><td>33</td></tr>
</tbody>
</table>

取り出した結果は次のようになります。

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>X[0]</code> — 0番目の行</p>
<table>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>X[0, 0]</code> — 値</p>
<table>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>X[:, 0]</code> — 0番目の列</p>
<table>
<tbody>
<tr><td>1</td></tr>
<tr><td>11</td></tr>
<tr><td>21</td></tr>
<tr><td>31</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>X[1:3]</code> — 1〜2行目</p>
<table>
<tbody>
<tr><td>11</td><td>12</td><td>13</td></tr>
<tr><td>21</td><td>22</td><td>23</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>X[:, 1:]</code> — 1列目以降</p>
<table>
<tbody>
<tr><td>2</td><td>3</td></tr>
<tr><td>12</td><td>13</td></tr>
<tr><td>22</td><td>23</td></tr>
<tr><td>32</td><td>33</td></tr>
</tbody>
</table>
</div>

</div>

| 書き方 | 意味 |
| --- | --- |
| `X[0]` | 0番目の行 |
| `X[0, 0]` | 0番目の行、0番目の列 |
| `X[:, 0]` | すべての行の、0番目の列 |
| `X[1:3]` | 1番目から3番目の手前までの行 |
| `X[:, 1:]` | すべての行の、1番目以降の列 |

`X[:, 0]` は、「行は全部、列は0番目」と読めます。

### 行と列の範囲を同時に指定する

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

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>block = X[:2, :2]</code></p>
<table>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>11</td><td>12</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>right_side = X[:, 1:]</code></p>
<table>
<tbody>
<tr><td>2</td><td>3</td></tr>
<tr><td>12</td><td>13</td></tr>
<tr><td>22</td><td>23</td></tr>
<tr><td>32</td><td>33</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>bottom = X[2:, :]</code></p>
<table>
<tbody>
<tr><td>21</td><td>22</td><td>23</td></tr>
<tr><td>31</td><td>32</td><td>33</td></tr>
</tbody>
</table>
</div>

</div>

`X[:2, :2]` は、先頭2行、先頭2列を取り出します。

画像では、こうした範囲指定で一部分を切り出すことがあります。

### 条件で取り出す

条件を使って、条件に合う値だけを取り出すこともできます。

```python
import numpy as np

scores = np.array([80, 55, 90, 45])

passed = scores >= 60

print(passed)
print(scores[passed])
```

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>scores</code></p>
<table>
<tbody>
<tr><td>80</td><td>55</td><td>90</td><td>45</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>passed = scores &gt;= 60</code></p>
<table>
<tbody>
<tr><td>True</td><td>False</td><td>True</td><td>False</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>scores[passed]</code></p>
<table>
<tbody>
<tr><td>80</td><td>90</td></tr>
</tbody>
</table>
</div>

</div>

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

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>X</code></p>
<table>
<tbody>
<tr><td>80</td><td>72</td></tr>
<tr><td>55</td><td>68</td></tr>
<tr><td>90</td><td>86</td></tr>
<tr><td>62</td><td>58</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>y</code></p>
<table>
<tbody>
<tr><td>1</td></tr>
<tr><td>0</td></tr>
<tr><td>1</td></tr>
<tr><td>0</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>positive_X = X[y == 1]</code></p>
<table>
<tbody>
<tr><td>80</td><td>72</td></tr>
<tr><td>90</td><td>86</td></tr>
</tbody>
</table>
</div>

</div>

`X[y == 1]` は、`y` が1の行だけを取り出しています。

### 条件に合う場所を探す

条件に合う値の位置を知りたいときは、`np.where()` を使えます。

```python
import numpy as np

scores = np.array([80, 55, 90, 45])

indices = np.where(scores >= 60)

print(indices)
```

`np.where(scores >= 60)` は、条件に合う場所を返します。

### 代入と上書き

NumPy配列は、取り出し方と同じ書き方で値を上書きできます。

```python
import numpy as np

x = np.arange(5)

x[0] = 100
x[1:4] = [-1, -1, -1]

print(x)
```

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p>元の <code>x</code></p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
</tbody>
</table>
</div>

<div>
<p>上書き後の <code>x</code></p>
<table>
<tbody>
<tr><td>100</td><td>-1</td><td>-1</td><td>-1</td><td>4</td></tr>
</tbody>
</table>
</div>

</div>

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

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p>元の <code>X</code></p>
<table>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>11</td><td>12</td><td>13</td></tr>
<tr><td>21</td><td>22</td><td>23</td></tr>
</tbody>
</table>
</div>

<div>
<p>上書き後の <code>X</code></p>
<table>
<tbody>
<tr><td>999</td><td>0</td><td>3</td></tr>
<tr><td>11</td><td>0</td><td>13</td></tr>
<tr><td>21</td><td>0</td><td>23</td></tr>
</tbody>
</table>
</div>

</div>

`X[:, 1] = 0` は、すべての行の1番目の列を0にしています。

##　スライス
### スライスへの計算

スライスで取り出した部分に、まとめて計算することもできます。

```python
import numpy as np

x = np.arange(5)

x[1:4] += 5

print(x)
```

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p>元の <code>x</code></p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>x[1:4] += 5</code> 後の <code>x</code></p>
<table>
<tbody>
<tr><td>0</td><td>6</td><td>7</td><td>8</td><td>4</td></tr>
</tbody>
</table>
</div>

</div>

リストでは `+` が結合になることがありますが、NumPy配列では数値計算として扱われます。

代入する場所の数と値の数が合わないと、エラーになります。

エラーが出たときは、どの形の配列に、どんな形の値を入れようとしているかを確認します。

## axis
### `axis` を使わずに集計する

次の表は、月ごとの商品売上だと思ってください。

<p><code>sales</code> (shape: (4, 3)) — 行: 月、列: 商品</p>

<table>
<thead><tr><th></th><th>商品A</th><th>商品B</th><th>商品C</th></tr></thead>
<tbody>
<tr><th>1月</th><td>100</td><td>50</td><td>50</td></tr>
<tr><th>2月</th><td>50</td><td>30</td><td>100</td></tr>
<tr><th>3月</th><td>50</td><td>50</td><td>70</td></tr>
<tr><th>4月</th><td>100</td><td>50</td><td>100</td></tr>
</tbody>
</table>

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

| | 商品A | 商品B | 商品C |
|---|---|---|---|
| 合計 | 300 | 180 | 320 |

ただし、列が増えると少し面倒です。

### `axis` を使って集計する

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

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>by_product = np.sum(sales, axis=0)</code> (shape: (3,)) — 商品ごとの合計</p>
<table>
<thead><tr><th>商品A</th><th>商品B</th><th>商品C</th></tr></thead>
<tbody>
<tr><td>300</td><td>180</td><td>320</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>by_month = np.sum(sales, axis=1)</code> (shape: (4,)) — 月ごとの合計</p>
<table>
<thead><tr><th>1月</th><th>2月</th><th>3月</th><th>4月</th></tr></thead>
<tbody>
<tr><td>200</td><td>180</td><td>170</td><td>250</td></tr>
</tbody>
</table>
</div>

</div>

`sales.shape` は `(4, 3)` です。

`axis=0` は、0番目の軸を集計して消します。月の軸が消えるので、商品ごとの合計が残り、形は `(3,)` になります。

`axis=1` は、1番目の軸を集計して消します。商品の軸が消えるので、月ごとの合計が残り、形は `(4,)` になります。

### 集約関数

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

<p><code>axis=0</code> で集計した結果 (商品ごと)</p>

<table>
<thead><tr><th>関数</th><th>商品A</th><th>商品B</th><th>商品C</th></tr></thead>
<tbody>
<tr><th><code>np.mean</code></th><td>75.0</td><td>45.0</td><td>80.0</td></tr>
<tr><th><code>np.max</code></th><td>100</td><td>50</td><td>100</td></tr>
<tr><th><code>np.min</code></th><td>50</td><td>30</td><td>50</td></tr>
</tbody>
</table>

| 書き方 | 意味 |
| --- | --- |
| `np.sum(x, axis=...)` | 合計 |
| `np.mean(x, axis=...)` | 平均 |
| `np.max(x, axis=...)` | 最大値 |
| `np.min(x, axis=...)` | 最小値 |
| `np.std(x, axis=...)` | 標準偏差 |
| `np.argmax(x, axis=...)` | 最大値の場所 |
| `np.argmin(x, axis=...)` | 最小値の場所 |

### 簡単なプーリング

CNNでは、画像の小さな領域から最大値や平均値を取る処理が出てきます。

ここでは、3チャンネル・4行4列の領域に対して、チャンネルごとに最大値と平均値を計算してみます。

```python
import numpy as np

patch = np.array([
    [
        [1, 3, 2, 0],
        [2, 4, 1, 5],
        [0, 6, 3, 2],
        [1, 2, 4, 7],
    ],
    [
        [5, 1, 0, 2],
        [3, 8, 2, 1],
        [4, 0, 6, 3],
        [2, 5, 1, 9],
    ],
    [
        [0, 2, 4, 6],
        [1, 3, 5, 7],
        [8, 6, 4, 2],
        [9, 7, 5, 3],
    ],
])

max_pooled = np.max(patch, axis=0)
avg_pooled = np.mean(patch, axis=(1, 2))

print(patch.shape)
print(max_pooled)
print(avg_pooled)
```

<p><code>patch</code> (shape: (3, 4, 4)) — 3チャンネル × 4行4列</p>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p>チャンネル0</p>
<table>
<tbody>
<tr><td>1</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>2</td><td>4</td><td>1</td><td>5</td></tr>
<tr><td>0</td><td>6</td><td>3</td><td>2</td></tr>
<tr><td>1</td><td>2</td><td>4</td><td>7</td></tr>
</tbody>
</table>
</div>

<div>
<p>チャンネル1</p>
<table>
<tbody>
<tr><td>5</td><td>1</td><td>0</td><td>2</td></tr>
<tr><td>3</td><td>8</td><td>2</td><td>1</td></tr>
<tr><td>4</td><td>0</td><td>6</td><td>3</td></tr>
<tr><td>2</td><td>5</td><td>1</td><td>9</td></tr>
</tbody>
</table>
</div>

<div>
<p>チャンネル2</p>
<table>
<tbody>
<tr><td>0</td><td>2</td><td>4</td><td>6</td></tr>
<tr><td>1</td><td>3</td><td>5</td><td>7</td></tr>
<tr><td>8</td><td>6</td><td>4</td><td>2</td></tr>
<tr><td>9</td><td>7</td><td>5</td><td>3</td></tr>
</tbody>
</table>
</div>

</div>

`axis=0` で集約すると、チャンネルの軸が消えるので、残るのは行と列だけになり、shapeは `(4, 4)` になります。各位置で「3チャンネルのうちの最大値」を取った結果です。

<p><code>max_pooled = np.max(patch, axis=0)</code> (shape: (4, 4))</p>

<table>
<thead><tr><th></th><th>列0</th><th>列1</th><th>列2</th><th>列3</th></tr></thead>
<tbody>
<tr><th>行0</th><td>5</td><td>3</td><td>4</td><td>6</td></tr>
<tr><th>行1</th><td>3</td><td>8</td><td>5</td><td>7</td></tr>
<tr><th>行2</th><td>8</td><td>6</td><td>6</td><td>3</td></tr>
<tr><th>行3</th><td>9</td><td>7</td><td>5</td><td>9</td></tr>
</tbody>
</table>

`axis=(1, 2)` のように複数の軸を指定すると、行と列を同時に集約するので、残るのはチャンネルの軸だけになり、shapeは `(3,)` になります。

<p><code>avg_pooled = np.mean(patch, axis=(1, 2))</code> (shape: (3,))</p>

<table>
<thead><tr><th>チャンネル0</th><th>チャンネル1</th><th>チャンネル2</th></tr></thead>
<tbody>
<tr><td>2.6875</td><td>3.25</td><td>4.5</td></tr>
</tbody>
</table>

出来上がった形状をよくみてください。

### テンソル

3次元以上の配列は、テンソルと呼ばれることがあります。

```python
import numpy as np

image = np.zeros((32, 32, 3))
batch = np.zeros((10, 32, 32, 3))

print(image.shape)
print(batch.shape)
```

| 変数 | shape | 意味 |
|---|---|---|
| `image` | (32, 32, 3) | 32行×32列×3チャンネルの画像1枚 |
| `batch` | (10, 32, 32, 3) | (32行×32列×3チャンネル) の画像10枚 |

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
