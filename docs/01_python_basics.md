# 01. Pythonの基本

## `print()`で結果を見る

`print()` は、値や計算結果を画面に表示するための関数です。

```python
print("Hello, Python")
print(100)
print(80 + 72)
```

Colab ではセルの最後に書いた値が表示されることもありますが、この講習では途中の値を確認するために `print()` を使います。

## 足し算する

Python では、電卓のように足し算ができます。

```python
print(10 + 3)
print(80 + 72)
```

プログラミング言語を扱う上で、型は大切な概念です。型は、整数、小数、文字列などの値の種類を表します。

同じ `+` でも、数値に使うと足し算になり、文字列に使うと文字列の連結になります。型によってできることが変わるので、値の型を丁寧に確認しましょう。

`10` や `80` のような整数は、Python では `int` という型です。

型を確認したいときは `type()` を使います。

```python
print(type(10))
print(type(10 + 3))
```

`int` 同士を足すと、結果も `int` になります。

```python
total = 80 + 72

print(total)
print(type(total))
```

## 引き算と掛け算

引き算には `-`、掛け算には `*` を使います。

```python
print(10 - 3)
print(10 * 3)
```

これも、 `int` 同士の計算なので結果は `int` です。

```python
remaining = 10 - 3
count = 10 * 3
print(remaining)
print(type(remaining))
print(count)
print(type(count))
```

## 割り算

割り算には `/` を使います。

```python
print(10 / 3)
print(10 / 2)
```

`/` を使った割り算の結果は、小数になります。小数は `float` という型で扱います。

```python
result = 10 / 2

print(result)
print(type(result))
```

結果が `5` ちょうどでも、`/` で割ると `5.0` のように表示されます。

点数の平均を出すときも、割り算を使うので `float` になることが多いです。

```python
math = 80
english = 72

average = (math + english) / 2

print(average)
print(type(average))
```

### 商と余り

割り算に関係する演算として、`//` と `%` もよく使います。

```python
print(10 // 3)
print(10 % 3)
```

- `//`: 割り算の商を求める
- `%`: 割り算の余りを求める

```python
quotient = 10 // 3
remainder = 10 % 3

print(quotient)
print(type(quotient))
print(remainder)
print(type(remainder))
```

例えば、偶数か奇数かを調べたいときは、2で割った余りを見ます。

```python
number = 7
print(number % 2)
```

余りが `0` なら偶数、`1` なら奇数です。

## 変数に入れて計算する

変数は、値に名前をつける仕組みです。

```python
score = 80
bonus = 5

new_score = score + bonus

print(new_score)
```

`=` は「等しい」という意味ではなく、右側の値や計算結果に名前をつけるために使います。

```python
score = 80
score = score + 5

print(score)
```

## 文字列`str`を扱う

名前やメッセージのような文字は `str` という型です。

```python
name = "Sato"

print(name)
print(type(name))
```

同じ `10` に見えても、数値の `10` と文字列の `"10"` は別のものです。

```python
print(10 + 5)
print("10" + "5")
```

数値の `+` は足し算ですが、文字列の `+` は文字列をつなげる動きになります。

## f-string

計算結果を文章の中に入れたいときは、`f` から始まる文字列を使うと読みやすくなります。

```python
name = "Sato"
average = 76.0

print(f"{name}さんの平均点は{average}です")
```

## 不等号

値を比べると、結果は `True` または `False` になります。
同じかどうかは `==` で確認します。

```python
score = 75
dabako_score = 68
ofen_score = 70
ranger_score = 70

print(score >= 60)
print(score < 60)
print(dabako_score == ofen_score)
print(ofen_score == ranger_score)
```

この `True` / `False` の型が `bool` です。

```python
score = 75
passed = score >= 60

print(passed)
print(type(passed))
```

## このページのまとめ

- 途中の値を確認するときは `print()` を使う
- 整数は `int`
- 割り算の結果は `float` になりやすい
- 文字列は `str`
- 比較の結果は `bool`
- 型は `type()` で確認できる
