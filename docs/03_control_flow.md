# 03. 条件分岐と繰り返し

このページでは、`if` と `for` を扱います。

- `if`: 条件によって処理を変える
- `for`: 複数の値に対して同じ処理を繰り返す

## `if`

### `if`で条件を分ける

`if` は、条件が成り立つときだけ処理を実行するために使います。

```python
score = 75
threshold = 60

if score >= threshold:
    print(f"score: {score}, result: 合格")
```

`score >= threshold` の結果は `True` または `False` です。

```python
score = 75
threshold = 60

print(f"score >= threshold: {score >= threshold}")
```

`if` の後ろには、結果が `True` または `False` になる式を書きます。

### `else`で条件に合わない場合を書く

条件に合わない場合の処理は `else` に書きます。

```python
score = 45
threshold = 60

if score >= threshold:
    print(f"score: {score}, result: 合格")
else:
    print(f"score: {score}, result: 不合格")
```

`if` の中で実行したい行、`else` の中で実行したい行は、右にずらして書きます。このずらし方をインデントと呼びます。
Colab や VS Code では、`Tab` キーを押すとインデントできます。
インデントが見づらいときは、エディタ側で空白を表示すると確認しやすいです。

### `elif`で条件を増やす

条件を増やしたいときは `elif` を使います。

```python
accuracy = 0.82

if accuracy >= 0.90:
    print(f"accuracy: {accuracy}, result: かなり良い")
elif accuracy >= 0.75:
    print(f"accuracy: {accuracy}, result: まずまず")
else:
    print(f"accuracy: {accuracy}, result: 改善が必要")
```

```python
accuracy = 0.60

if accuracy >= 0.90:
    print(f"accuracy: {accuracy}, result: かなり良い")
elif accuracy >= 0.75:
    print(f"accuracy: {accuracy}, result: まずまず")
else:
    print(f"accuracy: {accuracy}, result: 改善が必要")
```

```python
accuracy = 0.90

if accuracy >= 0.90:
    print(f"accuracy: {accuracy}, result: かなり良い")
elif accuracy >= 0.75:
    print(f"accuracy: {accuracy}, result: まずまず")
else:
    print(f"accuracy: {accuracy}, result: 改善が必要")
```

上から順番に条件を確認し、最初に成り立ったところだけが実行されます。

### その他

条件の結果を変数に入れてから使うこともできます。

```python
prediction_score = 0.72
threshold = 0.5

is_positive = prediction_score >= threshold

print(f"is_positive: {is_positive}")
print(type(is_positive))
```

## `for`

### `for`の基本

`for` は、複数の値を順番に取り出して、同じ処理を繰り返すために使います。
`scores` の中から、値が1つずつ取り出されて、`score` に入ります。

```python
scores = [80, 65, 90]

for score in scores:
    print(f"score: {score}")
```

### 合計と平均を計算する

`for` を使うと、複数の値を順番に足していくことができます。

```python
scores = [80, 65, 90]
total = 0

for score in scores:
    total = total + score

print(f"total: {total}")
```

`enumerate` はインデックスを一緒に取り出せるので便利です。
一つ目の変数にループ回数のインデックス、二つ目の変数にリストから出た値が入ります。

```python
scores = [80, 65, 90]
total = 0

for i, score in enumerate(scores):
    total = total + score
    print(f"{i + 1}回目の合計: {total}")

print(f"total: {total}")
```

## `for`と`if`を組み合わせる

複数の予測スコアを、しきい値で順番に判定してみます。

```python
prediction_scores = [0.82, 0.31, 0.67, 0.49]
threshold = 0.5

for prediction_score in prediction_scores:
    if prediction_score >= threshold:
        print(f"prediction_score: {prediction_score}, result: positive")
    else:
        print(f"prediction_score: {prediction_score}, result: negative")
```

`for` の中に `if` を書くと、値を1つずつ見ながら条件分岐できます。

## 損失の変化を見る

機械学習では、学習が進むにつれて `loss` が小さくなっているかを見ることがあります。

```python
losses = [0.90, 0.62, 0.48, 0.39]

for loss in losses:
    print(f"loss: {loss}")
```

改善しない状態が続いたら学習を止めることがあります。これは early stopping と呼ばれます。
ループを途中で止めるときは `break` を使います。

```python
losses = [0.90, 0.62, 0.48, 0.49, 0.50]

best_loss = 1.0
patience = 2
bad_count = 0

for loss in losses:
    if loss < best_loss:
        best_loss = loss
        bad_count = 0
        print(f"loss: {loss}, best_loss: {best_loss}, improved")
    else:
        bad_count = bad_count + 1
        print(f"loss: {loss}, best_loss: {best_loss}, bad_count: {bad_count}")

    if bad_count >= patience:
        print("early stopping")
        break
```

ここでは細かい意味まで覚えなくても大丈夫です。`for` で複数の値を順番に見ながら、`if` で状態を分けている形を読めれば十分です。

## このページのまとめ

- `if` は条件によって処理を変える
- `else` は条件に合わなかった場合を書く
- `elif` は条件を追加するときに使う
- `for` は複数の値に同じ処理を繰り返す
- `for` と `if` は組み合わせて使える
- インデントで処理のまとまりを表す
