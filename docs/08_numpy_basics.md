# 08. NumPy：配列を作成する

## NumPyとは
ここからは、NumPyの基本を扱います。

NumPyは、数値をまとめて計算するためのライブラリです。

機械学習では、画像、音声、表の数値列などを、数値のまとまりとして扱うことが多いです。

行列みたいなものを`for`を使わずに一気に扱うためにあります。

## 準備
### ライブラリを読み込む

Pythonに最初から入っていない機能を使うときは、`import` でライブラリを読み込みます。

NumPyは、慣習的に `np` という短い名前をつけて使います。

```python
import numpy as np

scores = np.array([80, 65, 90])

print(scores)
print(type(scores))
```

`import numpy as np` は、「NumPyを `np` という名前で使います」という意味です。

`np.array()` で作ったものは、NumPy配列です。Pythonのリストに似ていますが、数値をまとめて計算するためのメソッドや機能を持っています。

## 配列を作る
### 基本
NumPyでは、数値のまとまりを配列として扱います。

まずは、よく使う作り方をまとめて見てみます。

```python
import numpy as np

scores = np.array([80, 65, 90])
numbers = np.arange(10, 20)
matrix = np.arange(9).reshape(3, 3)
zeros = np.zeros((4, 4))
ones = np.ones(3)
evenly_spaced = np.linspace(0, 1, 5)

print(scores)
print(numbers)
print(matrix)
print(zeros)
print(ones)
print(evenly_spaced)
```

上のコードで使った関数を整理すると、次のようになります。

| 書き方 | 何を作るか |
| --- | --- |
| `np.array([80, 65, 90])` | PythonのリストからNumPy配列を作る |
| `np.arange(10, 20)` | 10から19までの連続した整数の配列を作る |
| `np.arange(9).reshape(3, 3)` | 0から8までの配列を作り、3行3列に形を変える |
| `np.zeros((4, 4))` | すべての値が0の4行4列の配列を作る |
| `np.ones(3)` | すべての値が1の長さ3の配列を作る |
| `np.linspace(0, 1, 5)` | 0から1までを5個に等間隔で分けた配列を作る |

`reshape()` は、配列の形を変えるメソッドです。

`np.arange(9)` で作った配列には9個の値が入っているので、`3 × 3 = 9` の形に変えられます。

### 同じ形の配列を作る

すでにある配列と同じ形で、0や1だけの配列を作ることもできます。

```python
import numpy as np

image = np.array([
    [255, 128, 0],
    [64, 32, 16],
])

zeros = np.zeros_like(image)
ones = np.ones_like(image)

print(zeros)
print(ones)
```

`np.zeros_like(image)` は、`image` と同じ形の0だけの配列を作ります。

`np.ones_like(image)` は、`image` と同じ形の1だけの配列を作ります。

画像や表のデータと同じ形の「入れ物」を作りたいときに使います。

## NumPy配列の演算
### 基本
リストに `+ 5` と書いても、全員に5点足す動きにはなりません。

```python
scores = [80, 65, 90]

print(scores + [5])
```

リストの `+` は、リスト同士をつなげる動きになります。

NumPy配列では、配列全体に対してまとめて計算できます。

```python
import numpy as np

scores = np.array([80, 65, 90])

adjusted_scores = scores + 5
scaled_scores = scores / 100

print(adjusted_scores)
print(scaled_scores)
```

`scores + 5` は、`scores` の中の値すべてに5を足しています。

`scores / 100` は、`scores` の中の値すべてを100で割っています。

### 内積

内積は、2つの配列の値を対応する場所ごとに掛けて、最後に足し合わせる計算です。

```python
import numpy as np

scores = np.array([80, 72])
weights = np.array([0.6, 0.4])

weighted_score = np.dot(scores, weights)

print(weighted_score)
```

この例では、次の計算をしています。

```text
80 * 0.6 + 72 * 0.4
```

機械学習では、入力の値に重みを掛けて足し合わせる計算がよく出てきます。

同じ計算は、`@` を使っても書けます。

```python
import numpy as np

scores = np.array([80, 72])
weights = np.array([0.6, 0.4])

weighted_score = scores @ weights

print(weighted_score)
```

### 集計する

NumPy配列は、合計、平均、最大値なども簡単に計算できます。

```python
import numpy as np

x = np.array([16, 12, 12, 11, 11])

print(np.sum(x))
print(np.prod(x))
print(np.mean(x))
print(np.std(x))
print(np.median(x))
print(len(x))
print(np.max(x))
print(np.min(x))
print(np.argmax(x))
print(np.argmin(x))
```

よく使う集計関数を整理すると、次のようになります。

| 書き方 | 意味 |
| --- | --- |
| `np.sum(x)` | 合計 |
| `np.prod(x)` | すべて掛け合わせた値 |
| `np.mean(x)` | 平均 |
| `np.std(x)` | 標準偏差 |
| `np.median(x)` | 中央値 |
| `len(x)` | 要素数 |
| `np.max(x)` | 最大値 |
| `np.min(x)` | 最小値 |
| `np.argmax(x)` | 最大値の場所 |
| `np.argmin(x)` | 最小値の場所 |

2つの配列を比べて、場所ごとの大きい値や小さい値を取ることもできます。

```python
import numpy as np

model_a = np.array([0.82, 0.76, 0.91])
model_b = np.array([0.80, 0.79, 0.88])

best_scores = np.maximum(model_a, model_b)
worst_scores = np.minimum(model_a, model_b)

print(best_scores)
print(worst_scores)
```

`np.maximum()` は、対応する場所ごとに大きい値を取ります。

`np.minimum()` は、対応する場所ごとに小さい値を取ります。

## その他
### 乱数を作る

練習用のデータや、ランダムな初期値を作るときに乱数を使います。

```python
import numpy as np

uniform_values = np.random.rand(5)
normal_values = np.random.randn(5)

print(uniform_values)
print(normal_values)
```

`np.random.rand()` は、0以上1未満の一様乱数を作ります。

`np.random.randn()` は、平均0、標準偏差1の正規分布に近い乱数を作ります。

機械学習では、重みの初期値やダミーデータを作るときに乱数が出てきます。

### 型の変換

NumPy配列の型を変えたいときは、`astype()` を使います。

```python
import numpy as np

scores = np.array([80.0, 65.0, 90.0])
int_scores = scores.astype(int)

print(scores)
print(scores.dtype)
print(int_scores)
print(int_scores.dtype)
```

`astype(int)` は、配列の中の値を整数として扱う配列に変換します。

画像の処理では、`uint8` という型もよく出てきます。

```python
import numpy as np

values = np.array([0, 128, 255])
image_values = values.astype(np.uint8)

print(image_values)
print(image_values.dtype)
```

`uint8` は、0から255までの整数を扱う型です。

RGB画像の明るさや色の値でよく使われます。

## このページのまとめ

- NumPyは数値をまとめて計算するためのライブラリ
- `import numpy as np` と書いて読み込む
- `np.array()` で配列を作る
- `np.arange()`, `np.zeros()`, `np.ones()`, `np.linspace()` もよく使う
- NumPy配列はまとめて足し算や割り算ができる
- `np.dot()` や `@` で内積を計算できる
- `np.sum()`, `np.mean()`, `np.max()` などで集計できる
- `np.random.rand()` と `np.random.randn()` で乱数を作れる
- `astype()` で配列の型を変換できる
