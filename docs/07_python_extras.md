# 07. よく見るPythonの書き方

このページでは、この先のコードで見かけるPythonの書き方を扱います。

ここで出てくる書き方は、最初から全部書ける必要はありません。

まずは、コードを読んだときに「これはこういう意味か」と追えることを目指します。

## 内包表記
### 内包表記とは

内包表記は、`for` を短く書く書き方です。

まずは、普通の `for` で書いてみます。

```python
scores = [80, 65, 90]

passed = []

for score in scores:
    passed.append(score >= 60)

print(passed)
```

同じ処理は、内包表記で次のように書けます。

```python
scores = [80, 65, 90]

passed = [score >= 60 for score in scores]

print(passed)
```

`[score >= 60 for score in scores]` は、「`scores` から `score` を1つずつ取り出して、`score >= 60` の結果をリストにする」と読みます。

AIが生成するPythonコードや、ライブラリのサンプルコードではよく出てきます。

### 条件つきの内包表記

条件に合う値だけを残すこともできます。

これは、普通の `for` で書くと次のような処理です。

```python
scores = [80, 55, 90, 45]

passed_scores = []

for score in scores:
    if score >= 60:
        passed_scores.append(score)

print(passed_scores)
```

こんな感じで書けます
```python
scores = [80, 55, 90, 45]

passed_scores = [score for score in scores if score >= 60]

print(passed_scores)
```


## `lambda`

### lambdaとは
`lambda` は、名前をつけずに小さな関数を書くための仕組みです。

```python
double = lambda x: x * 2

print(double(3))
```

普通の関数で書くと、次と同じような意味です。

```python
def double(x):
    return x * 2

print(double(3))
```

`lambda x: x * 2` は、「`x` を受け取って、`x * 2` を返す関数」と読みます。

`lambda` は、短い処理を一時的に渡したいときに使われます。

### `lambda`を使った例

次のコードでは、点数を受け取って合格かどうかを返す関数を作っています。

```python
judge_passed = lambda score: score >= 60

print(judge_passed(75))
print(judge_passed(45))
```

ただし、無理に `lambda` を使わなくて大丈夫です。

読みやすさを優先するなら、`def` で書く方がわかりやすいことも多いです。

講習会でも極力使わないようにしています。

## 継承

### 継承とは
継承は、すでにあるクラスをもとに、新しいクラスを作る仕組みです。

```python
class BaseModel:
    def fit(self):
        print("fit")

class LinearModel(BaseModel):
    pass

model = LinearModel()

model.fit()
```

`class LinearModel(BaseModel):` は、「`BaseModel` をもとにして `LinearModel` を作る」と読みます。

`LinearModel` の中には `fit()` を書いていませんが、`BaseModel` から受け継いでいるので `model.fit()` を呼び出せます。

親のメソッドを子供は定義していないのに使えます。

### メソッドを上書きする

継承したクラスでは、メソッドを上書きできます。

```python
class BaseModel:
    def predict(self, x):
        return 0

class LinearModel(BaseModel):
    def predict(self, x):
        return x * 2

model = LinearModel()

print(model.predict(5))
```

このように、もとのクラスの動きを新しいクラスで変えることがあります。子のメソッドが優先されます。

### `super()`

`super()` は、親クラスの処理を呼び出すために使います。

PyTorchでは、次のようなコードをよく見ます。

```text
class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
```

これは `MyModel` が `nn.Module` を親として継承しています。
ここでは、簡単な例で見てみます。

```python
class BaseModel:
    def __init__(self):
        self.name = "base"

class LinearModel(BaseModel):
    def __init__(self):
        super().__init__()
        self.weight = 2

model = LinearModel()

print(f"name: {model.name}")
print(f"weight: {model.weight}")
```

`super().__init__()` を呼ぶことで、親クラス `BaseModel` の `__init__()` が実行されます。

その結果、`LinearModel` のオブジェクトも `name` 属性を持てます。

## このページのまとめ

- 内包表記は、`for` を短く書く書き方
- `lambda` は、名前をつけない小さな関数
- 継承は、すでにあるクラスをもとに新しいクラスを作る仕組み
- `super()` は、親クラスの処理を呼び出すために使う
- まずは自分で完璧に書くより、読めることを優先する
