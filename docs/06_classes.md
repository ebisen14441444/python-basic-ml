# 06. クラス

このページでは、クラスを扱います。

前の章では、`model.fit()` は「`model` オブジェクトの `fit()` メソッドを呼び出している」と読みました。

この章では、`fit()` や `predict()` を持つオブジェクトを、自分で作ってみます。

## クラスは設計図

クラスは、オブジェクトの設計図です。

```python
class ThresholdModel:
    pass

model = ThresholdModel()

print(type(model))
```

`ThresholdModel()` と書くと、`ThresholdModel` クラスからオブジェクトを作れます。

## 属性

属性は、オブジェクトが持っているデータや状態についた名前です。

メソッドは「操作」、属性は「情報」と考えると読みやすいです。

まず、普通の変数と比べてみます。

```python
accuracy = 0.82

print(f"accuracy: {accuracy}")
```

これは、`accuracy` という変数に `0.82` という値を入れています。

属性は、値をオブジェクトの中に入れて、ドットで名前をつけます。

```python
class TrainingResult:
    pass

result = TrainingResult()

result.accuracy = 0.82
result.loss = 0.48

print(f"accuracy: {result.accuracy}")
print(f"loss: {result.loss}")
```

ここでは、`accuracy` と `loss` が `result` オブジェクトの属性です。

`result.accuracy` は、「`result` の中にある `accuracy`」と読みます。

同じ `accuracy` でも、次のように置き場所が違います。

- `accuracy`: そのまま使う変数
- `result.accuracy`: `result` オブジェクトの中にある属性

属性を読むときは `()` をつけません。

- `result.accuracy`: 属性を読む
- `result.loss`: 属性を読む

一方で、メソッドを呼び出すときは `()` をつけます。

- `scores.append(70)`: メソッドを呼び出す
- `model.predict(75)`: メソッドを呼び出す

## `__init__`で初期設定する

オブジェクトを作るときに最初に実行される処理は `__init__` に書きます。

```python
class ThresholdModel:
    def __init__(self, threshold):
        self.threshold = threshold

model = ThresholdModel(threshold=60)

print(f"threshold: {model.threshold}")
```

ここでは、`model` を作った時点で `threshold` という属性を持たせています。

`self.threshold` は、「このオブジェクトの `threshold` 属性」という意味です。

## メソッドを定義する

クラスの中に関数を書くと、そのオブジェクトのメソッドになります。

```python
class ThresholdModel:
    def __init__(self, threshold):
        self.threshold = threshold

    def predict(self, score):
        return score >= self.threshold

model = ThresholdModel(threshold=60)

print(model.predict(75))
print(model.predict(45))
```

`model.predict(75)` は、`model` オブジェクトが持っている `predict()` メソッドを呼び出しています。

## `self`

`self` は、作られたオブジェクト自身を表します。

```python
class ThresholdModel:
    def __init__(self, threshold):
        self.threshold = threshold

    def show_threshold(self):
        print(f"threshold: {self.threshold}")

model = ThresholdModel(threshold=60)

model.show_threshold()
```

`self.threshold` と書くことで、そのオブジェクトが持っている `threshold` を使えます。

## `fit()`を作る

機械学習では、`fit()` は学習するためのメソッドとしてよく使われます。

ここでは、点数リストの平均をしきい値として覚える簡単なモデルを作ります。

```python
class ThresholdModel:
    def __init__(self):
        self.threshold = 60

    def fit(self, scores):
        self.threshold = sum(scores) / len(scores)

    def predict(self, score):
        return score >= self.threshold

model = ThresholdModel()

train_scores = [80, 65, 90]
model.fit(train_scores)

print(f"threshold: {model.threshold}")
print(model.predict(85))
print(model.predict(60))
```

`model.fit(train_scores)` を実行すると、`model` の中の `threshold` が更新されます。

## 状態を持つオブジェクト

オブジェクトは、属性として状態を持てます。

```python
class EarlyStopping:
    def __init__(self, patience):
        self.patience = patience
        self.best_loss = 1.0
        self.bad_count = 0

    def check(self, loss):
        if loss < self.best_loss:
            self.best_loss = loss
            self.bad_count = 0
            return False

        self.bad_count = self.bad_count + 1
        return self.bad_count >= self.patience

early_stopping = EarlyStopping(patience=2)
losses = [0.90, 0.62, 0.48, 0.49, 0.50]

for loss in losses:
    should_stop = early_stopping.check(loss)
    print(f"loss: {loss}, best_loss: {early_stopping.best_loss}, should_stop: {should_stop}")

    if should_stop:
        print("early stopping")
        break
```

`best_loss` や `bad_count` は、`early_stopping` オブジェクトの中に保存されています。

## クラスを読むときの見方

クラスを読むときは、次の順番で見ると追いやすいです。

```python
class ThresholdModel:
    def __init__(self, threshold):
        self.threshold = threshold

    def predict(self, score):
        return score >= self.threshold
```

- `class ThresholdModel`: クラス名
- `__init__`: オブジェクトを作るときの初期設定
- `self.threshold`: オブジェクトが持つ属性
- `predict`: オブジェクトが持つメソッド

## このページのまとめ

- クラスはオブジェクトの設計図
- `ClassName()` でオブジェクトを作る
- `__init__` はオブジェクトを作るときの初期設定
- `self` は作られたオブジェクト自身を表す
- クラスの中に書いた関数はメソッドになる
- `fit()` や `predict()` は、モデルオブジェクトが持つメソッドとして読める
