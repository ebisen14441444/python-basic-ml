# 09. NumPyの操作

このページでは、NumPy配列の情報を読む方法、形を変える方法、配列を結合・分割する方法を扱います。

NumPyでは、値そのものだけでなく、「何次元か」「どんな形か」「どんな型か」を読むことがとても大事です。

## 配列の属性と型
### 属性
NumPy配列は、配列についての情報を属性として持っています。

```python
import numpy as np

X = np.array([
    [80, 72, 1],
    [55, 68, 0],
    [90, 86, 1],
])

print(X.dtype)
print(X.ndim)
print(X.shape)
print(X.size)
print(X.T)
```

| 属性 | 意味 |
| --- | --- |
| `dtype` | 配列の中の値の型 |
| `ndim` | 配列が何次元か |
| `shape` | 配列の形 |
| `size` | 配列の中の値の数 |
| `T` | 行と列を入れ替えた配列 |

`X.shape` が `(3, 3)` なら、3行3列の配列です。

機械学習では、`X.shape` を見て「何件のデータがあり、特徴量が何個あるか」を確認することがよくあります。

### `dtype`

`dtype` 属性は、配列の中の値の型です。

```python
import numpy as np

scores = np.array([80, 65, 90])
rates = np.array([0.80, 0.65, 0.90])
image = np.array([0, 128, 255], dtype=np.uint8)
complex_values = np.array([1 + 2j, 3 + 4j])

print(scores.dtype)
print(rates.dtype)
print(image.dtype)
print(complex_values.dtype)
```

`int32` や `int64` は整数、`float64` は小数を表します。

整数が `int32` になるか `int64` になるかは、実行環境によって変わることがあります。

`uint8` は、0から255までの整数を扱う型です。画像の明るさや色を表す値でよく見ます。

`complex` は複素数の型です。普通の表データではあまり出ませんが、音声や信号処理では見かけることがあります。

`uint8` は少ないメモリで0から255までの値を表せる型です。データが小さくなると、結果として処理や転送が軽くなることがあります。

## 配列の形状
### `reshape`

`reshape()` を使うと、要素数を変えずに配列の形を変えられます。

```python
import numpy as np

values = np.arange(6)
matrix1 = values.reshape(2, 3)
matrix2 = values.reshape(2, -1)

print(values)
print(matrix1)
print(matrix2)
print(matrix1.shape)
print(matrix2.shape)
```

`np.arange(6)` は6個の値を持ちます。

それを `reshape(2, 3)` で2行3列に変えています。

`-1` を使うと、その次元の大きさはNumPyが自動計算します。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>values</code> (shape: (6,))</p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>matrix1 = values.reshape(2, 3)</code> (shape: (2, 3))</p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>matrix2 = values.reshape(2, -1)</code> (shape: (2, 3))</p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
</tbody>
</table>
</div>

</div>

`reshape(2, -1)` は「2行で、列はNumPyが計算」という意味です。6個の値を2行に並べるので、列は自動的に3になります。

### もっと多次元にする

画像や深層学習では、3次元以上の配列もよく出てきます。

```python
import numpy as np

values = np.arange(24)

array_2d = values.reshape(4, 6)
array_3d = values.reshape(2, 3, 4)
array_4d = values.reshape(1, 2, 3, 4)

print(array_2d)
print(array_2d.shape)
print(array_3d)
print(array_3d.shape)
print(array_4d.shape)
```

`reshape(2, 3, 4)` は、3行4列が2層あるような形です。

最初は出力を見ながら、「外側から順にまとまりが増えている」と読むとわかりやすいです。

<p><code>array_2d</code> (shape: (4, 6))</p>

<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
<tr><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr>
<tr><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td></tr>
<tr><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td></tr>
</tbody>
</table>

<p><code>array_3d</code> (shape: (2, 3, 4)) — 3行4列が2層</p>

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p>1層目</p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td>7</td></tr>
<tr><td>8</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
</div>

<div>
<p>2層目</p>
<table>
<tbody>
<tr><td>12</td><td>13</td><td>14</td><td>15</td></tr>
<tr><td>16</td><td>17</td><td>18</td><td>19</td></tr>
<tr><td>20</td><td>21</td><td>22</td><td>23</td></tr>
</tbody>
</table>
</div>

</div>

各shapeの意味は次のとおりです。

| 配列 | shape | 意味 |
|---|---|---|
| `array_2d` | (4, 6) | 4行6列 |
| `array_3d` | (2, 3, 4) | 3行4列が2層 |
| `array_4d` | (1, 2, 3, 4) | (3行4列が2層) のかたまりが1つ |

### 形を変えるときの注意

要素数が合わない形には変えられません。

```python
import numpy as np

values = np.arange(6)

print(values.reshape(3, 2))
```

6個の値は、3行2列にもできます。

<p><code>values.reshape(3, 2)</code> (shape: (3, 2))</p>

<table>
<tbody>
<tr><td>0</td><td>1</td></tr>
<tr><td>2</td><td>3</td></tr>
<tr><td>4</td><td>5</td></tr>
</tbody>
</table>

一方で、4行2列にするには8個の値が必要なので、形が合いません。

`-1` は便利ですが、複数の場所を `-1` にすると、NumPyがどちらをどの大きさにすればよいか決められません。

## 配列の結合 分割
### 配列を結合する

`np.concatenate()` は、すでにある軸に沿って配列をつなげます。

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

connected = np.concatenate([a, b])

print(connected)
print(connected.shape)
```

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>a</code> (shape: (3,))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>b</code> (shape: (3,))</p>
<table>
<tbody>
<tr><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>connected</code> (shape: (6,))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
</div>

</div>

2次元配列では、`axis` を指定すると行方向にも列方向にも結合できます。

```python
import numpy as np

a = np.array([
    [1, 2],
    [3, 4],
])

b = np.array([
    [5, 6],
    [7, 8],
])

rows = np.concatenate([a, b], axis=0)
columns = np.concatenate([a, b], axis=1)

print(rows)
print(rows.shape)
print(columns)
print(columns.shape)
```

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>a</code> (shape: (2, 2))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>b</code> (shape: (2, 2))</p>
<table>
<tbody>
<tr><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td></tr>
</tbody>
</table>
</div>

</div>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>rows = concatenate([a, b], axis=0)</code> (shape: (4, 2))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
<tr><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>columns = concatenate([a, b], axis=1)</code> (shape: (2, 4))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td><td>5</td><td>6</td></tr>
<tr><td>3</td><td>4</td><td>7</td><td>8</td></tr>
</tbody>
</table>
</div>

</div>

`axis=0` では行が増えます。

`axis=1` では列が増えます。

### `stack` で新しい軸を作る

`np.stack()` は、新しい軸を作って配列を重ねます。

```python
import numpy as np

image1 = np.array([
    [1, 2],
    [3, 4],
])

image2 = np.array([
    [5, 6],
    [7, 8],
])

batch = np.stack([image1, image2])

print(batch)
print(batch.shape)
```

`image1` と `image2` はどちらも2行2列です。

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>image1</code> (shape: (2, 2))</p>
<table>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>image2</code> (shape: (2, 2))</p>
<table>
<tbody>
<tr><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td></tr>
</tbody>
</table>
</div>

</div>

`np.stack([image1, image2])` にすると、「2枚の2行2列画像」のような3次元配列になります。

<p><code>batch</code> (shape: (2, 2, 2))</p>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p>1枚目</p>
<table>
<tbody>
<tr><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td></tr>
</tbody>
</table>
</div>

<div>
<p>2枚目</p>
<table>
<tbody>
<tr><td>5</td><td>6</td></tr>
<tr><td>7</td><td>8</td></tr>
</tbody>
</table>
</div>

</div>

`concatenate` は既存の軸に沿ってつなげる、`stack` は新しい軸を作って重ねる、と考えると読みやすいです。

| 関数 | 軸 | shapeの変化例 |
|---|---|---|
| `np.concatenate` | 既存の軸に沿ってつなぐ | (2, 2) + (2, 2) → (4, 2) or (2, 4) |
| `np.stack` | 新しい軸を作る | (2, 2) + (2, 2) → (2, 2, 2) |

### 配列を分割する

`np.split()` を使うと、配列を分割できます。

```python
import numpy as np

values = np.arange(12)

parts = np.split(values, 3)

print(parts[0])
print(parts[1])
print(parts[2])
```

<p><code>values</code> (shape: (12,))</p>

<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>parts[0]</code></p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td><td>3</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>parts[1]</code></p>
<table>
<tbody>
<tr><td>4</td><td>5</td><td>6</td><td>7</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>parts[2]</code></p>
<table>
<tbody>
<tr><td>8</td><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
</div>

</div>

2次元配列も分割できます。

```python
import numpy as np

X = np.arange(12).reshape(4, 3)

upper, lower = np.split(X, 2, axis=0)

print(upper)
print(lower)
```

<p><code>X</code> (shape: (4, 3))</p>

<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
<tr><td>6</td><td>7</td><td>8</td></tr>
<tr><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>

<div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">

<div>
<p><code>upper</code> (shape: (2, 3))</p>
<table>
<tbody>
<tr><td>0</td><td>1</td><td>2</td></tr>
<tr><td>3</td><td>4</td><td>5</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>lower</code> (shape: (2, 3))</p>
<table>
<tbody>
<tr><td>6</td><td>7</td><td>8</td></tr>
<tr><td>9</td><td>10</td><td>11</td></tr>
</tbody>
</table>
</div>

</div>

`axis=0` で分割すると、行方向に分かれます。

## このページのまとめ

- `dtype` は配列の中の値の型
- `shape` は配列の形
- `ndim` は配列が何次元か
- `size` は配列の中の値の数
- `reshape()` で配列の形を変えられる
- `-1` を使うと、reshapeの一部を自動計算できる
- `np.concatenate()` は既存の軸に沿って結合する
- `np.stack()` は新しい軸を作って重ねる
- `np.split()` で配列を分割できる
