# 01. Pythonの基本

## 変数

変数は値に名前をつける仕組みです。

```python
name = "佐藤"
age = 20
height = 170.5
```

Pythonでは、値の種類を「型」と呼びます。

| 型 | 例 | 意味 |
| --- | --- | --- |
| `int` | `10` | 整数 |
| `float` | `3.14` | 小数 |
| `str` | `"hello"` | 文字列 |
| `bool` | `True` | 真偽値 |

## 条件分岐

条件によって処理を変えたいときは `if` を使います。

```python
score = 75

if score >= 80:
    print("よくできました")
elif score >= 60:
    print("合格です")
else:
    print("復習しましょう")
```

## 繰り返し

同じような処理を何度も行うときは `for` を使います。

```python
scores = [80, 65, 90]

for score in scores:
    print(score)
```

## 関数

関数は、処理に名前をつけて再利用する仕組みです。

```python
def judge(score):
    if score >= 60:
        return "合格"
    return "不合格"

result = judge(72)
print(result)
```

## 機械学習でなぜ必要か

機械学習のコードでも、次のような基本文法がよく出てきます。

- データの行を繰り返し処理する
- 値の条件によって前処理を変える
- 同じ処理を関数にまとめる
- 結果を変数に保存して次の処理へ渡す
