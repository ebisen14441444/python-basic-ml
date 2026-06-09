# 06. クラス

このページでは、クラスを扱います。

前の章では、`model.fit()` は「`model` オブジェクトの `fit()` メソッドを呼び出している」と読みました。

この章では、機械学習でよく見るオブジェクトを、自分で作ってみます。

前章までで扱った文字列、リスト、辞書なども、Pythonが最初から用意してくれているオブジェクトです。

`class` を使うと、自分で新しい種類のオブジェクトを作れるようになります。
## 基本
### クラスは設計図

クラスは、オブジェクトの設計図です。
車を作るときに設計図が必要なように、オブジェクトを作るときにも設計図があると考えます。

`class` には、そのオブジェクトが持つ属性やメソッドをまとめて書きます。
まずは、中身が空のクラスを作ってみます。

このクラスからオブジェクトを作る行為をインスタンス化と言います。

```python
class Conv2d:
    pass

conv = Conv2d()

print(type(conv))
```

`Conv2d()` と書くと、`Conv2d` クラスからオブジェクトを作れます。

### 属性

属性は、オブジェクトが持っているデータや状態についた名前です。
メソッドは「操作」、属性は「情報」と考えると読みやすいです。
車の例えで言うなら、「右に曲がる」のような動作はメソッドで、ガソリン容量や高さのような情報は属性です。

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
属性は情報そのものなので、関数のように呼び出す必要がありません。

- `result.accuracy`

一方で、メソッドを呼び出すときは `()` をつけます。

- `scores.append(70)`

## 書き方
### `__init__`で初期設定する

オブジェクトを作るときに最初に実行される処理は `__init__` に書きます。

ここでは、画像認識などでよく出てくる `Conv2d` っぽいものを作ってみます。

本物の `Conv2d` はもっと複雑ですが、ここでは「設定を持ったオブジェクト」として見ます。

```python
class Conv2d:
    def __init__(self, in_channels, out_channels, kernel_size):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size

    def forward(self, image_shape):
        height = image_shape[0]
        width = image_shape[1]
        output_height = height - self.kernel_size + 1
        output_width = width - self.kernel_size + 1
        return [output_height, output_width, self.out_channels]

conv = Conv2d(in_channels=3, out_channels=16, kernel_size=3)
output_shape = conv.forward([32, 32, 3])

print(f"in_channels: {conv.in_channels}")
print(f"out_channels: {conv.out_channels}")
print(f"kernel_size: {conv.kernel_size}")
print(f"output_shape: {output_shape}")
```

ここでは、`conv` を作った時点で、次の属性を持たせています。

- `in_channels`: 入力のチャンネル数
- `out_channels`: 出力のチャンネル数
- `kernel_size`: フィルタの大きさ

`self.in_channels` は、「このオブジェクトの `in_channels` 属性」という意味です。

`Conv2d(in_channels=3, out_channels=16, kernel_size=3)` と書いたとき、`3` や `16` が `__init__` に渡され、オブジェクトの属性として保存されます。

この形がわかると、ライブラリのコードも少し読みやすくなります。

```text
conv = Conv2d(in_channels=3, out_channels=16, kernel_size=3)
```

これは、「3チャンネルの入力を受け取り、16チャンネルの出力を作る、サイズ3のフィルタを持つConv2dを作る」と読めます。

`forward()` の説明は、次のセクションでします。

### メソッドを定義する

クラスの中に関数を書くと、そのオブジェクトのメソッドになります。
`Conv2d` なら、入力を受け取って出力を作る動作がメソッドになります。
車の例えで言うなら、「右に曲がる」のような動作を定義する部分です。

ここでは本物の画像計算はせず、入力の形から出力の形だけを返す `forward()` を作ります。

```python
class Conv2d:
    def __init__(self, in_channels, out_channels, kernel_size):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size

    def forward(self, image_shape):
        height = image_shape[0]
        width = image_shape[1]
        output_height = height - self.kernel_size + 1
        output_width = width - self.kernel_size + 1
        return [output_height, output_width, self.out_channels]

conv = Conv2d(in_channels=3, out_channels=16, kernel_size=3)

output_shape = conv.forward([32, 32, 3])

print(f"output_shape: {output_shape}")
```

`def forward` のところで定義されているように、リストを引数で受け取って、`image_shape` という変数としてメソッド内では扱っています。
`conv.forward([32, 32, 3])` は、`conv` オブジェクトが持っている `forward()` メソッドを呼び出しています。

属性に対して、メソッドは `conv.forward(...)` のように、そのオブジェクトに処理をさせるものです。
メソッドは、オブジェクトが持っている関数だと考えると読みやすいです。

`forward()` の中では、`__init__`で属性として保存しておいた `kernel_size` や `out_channels` を使っています。

### `self`とは
`self` は、作られたオブジェクト自身を表します。

たとえば `conv = Conv2d(...)` で作ったオブジェクト `conv` に対して、`conv.forward(...)` と書くとします。
このとき、`forward()` の中では `conv` 自身を `self` という名前で受け取っています。

つまり、次のようなイメージです。

- 外から見ると `conv.in_channels`
- クラスの中から見ると `self.in_channels`

どちらも「そのオブジェクトが持っている `in_channels`」を見ています。

```python
class Conv2d:
    def __init__(self, in_channels, out_channels, kernel_size):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size

    def show_config(self):
        print(f"in_channels: {self.in_channels}")
        print(f"out_channels: {self.out_channels}")
        print(f"kernel_size: {self.kernel_size}")

conv = Conv2d(in_channels=3, out_channels=16, kernel_size=3)

conv.show_config()
```

`self.in_channels` と書くことで、そのオブジェクトが持っている `in_channels` を使えます。

ここで大事なのは、`show_config()` の中で使っている値が、`conv` を作ったときの設定だということです。

つまり、オブジェクトは属性を持っていて、メソッドの中でその属性を使えます。
`self` があるから、同じクラスから複数のオブジェクトを作っても、それぞれ別の属性として区別できます。

```python
class Conv2d:
    def __init__(self, in_channels, out_channels, kernel_size):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size

conv_small = Conv2d(in_channels=3, out_channels=16, kernel_size=3)
conv_large = Conv2d(in_channels=3, out_channels=32, kernel_size=5)

print(f"small: {conv_small.out_channels}, kernel_size={conv_small.kernel_size}")
print(f"large: {conv_large.out_channels}, kernel_size={conv_large.kernel_size}")
```

`conv_small` と `conv_large` は同じ `Conv2d` クラスから作っていますが、持っている属性は別々です。

## やってみよう
### 試しに`fit()`を作ってみる

機械学習では、`fit()` は学習するためのメソッドとしてよく使われます。

ここでは、最小二乗法で直線を学習する簡単なモデルを作ります。

入力 `x` から、`y = weight * x + bias` の形で予測するモデルです。

最小二乗法は、「データにできるだけよく合う直線」を探す方法です。

ここでは、次のように考えます。

- `weight`: 直線の傾き
- `bias`: 直線の切片
- `fit()`: データから `weight` と `bias` を計算する
- `predict()`: 計算した `weight` と `bias` を使って予測する

```python
class LinearRegression:
    def __init__(self):
        self.weight = 0
        self.bias = 0

    def fit(self, x_values, y_values):
        x_mean = sum(x_values) / len(x_values)
        y_mean = sum(y_values) / len(y_values)

        numerator = 0
        denominator = 0

        for x, y in zip(x_values, y_values):
            numerator = numerator + (x - x_mean) * (y - y_mean)
            denominator = denominator + (x - x_mean) ** 2

        self.weight = numerator / denominator
        self.bias = y_mean - self.weight * x_mean

    def predict(self, x):
        return self.weight * x + self.bias

model = LinearRegression()

x_train = [1, 2, 3, 4]
y_train = [2, 4, 6, 8]

model.fit(x_train, y_train)

print(f"weight: {model.weight}")
print(f"bias: {model.bias}")
print(f"prediction: {model.predict(5)}")
```

`model.fit(x_train, y_train)` を実行すると、`model` の中の `weight` と `bias` が更新されます。

`fit()` の中では、まず `x` と `y` の平均を計算しています。

```text
x_mean = sum(x_values) / len(x_values)
y_mean = sum(y_values) / len(y_values)
```

そのあと、各データが平均からどれくらいズレているかを使って、直線の傾きを計算しています。

- `numerator`: `x` が平均より大きいとき、`y` も平均より大きいかを見ている
- `denominator`: `x` 自体がどれくらいばらついているかを見ている

最後に、傾き `weight` が決まったあと、平均の位置を通るように `bias` を決めています。

```text
self.weight = numerator / denominator
self.bias = y_mean - self.weight * x_mean
```

`predict()` は、`fit()` で覚えた `weight` と `bias` を使って予測します。

つまり、`fit()` はモデルに学習させるメソッド、`predict()` は学習後のモデルで予測するメソッドです。

## 読み方
### クラスの読み方

クラスを読むときは、次の順番で見ると追いやすいです。

```python
class Conv2d:
    def __init__(self, in_channels, out_channels, kernel_size):
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.kernel_size = kernel_size

    def forward(self, image_shape):
        height = image_shape[0]
        width = image_shape[1]
        output_height = height - self.kernel_size + 1
        output_width = width - self.kernel_size + 1
        return [output_height, output_width, self.out_channels]
```

- `class Conv2d`: クラス名
- `__init__`: オブジェクトを作るときの初期設定
- `self.in_channels`: オブジェクトが持つ属性
- `forward`: オブジェクトが持つメソッド

## このページのまとめ

- クラスはオブジェクトの設計図
- `ClassName()` でオブジェクトを作る
- `__init__` はオブジェクトを作るときの初期設定
- `self` は作られたオブジェクト自身を表す
- クラスの中に書いた関数はメソッドになる
- `fit()` や `predict()` は、モデルオブジェクトが持つメソッドとして読める
