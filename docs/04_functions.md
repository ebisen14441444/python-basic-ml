# 04. 関数

このページでは、関数を扱います。

関数は、処理に名前をつけて再利用するための仕組みです。

```python
def greet():
    print("Hello")

greet()
```

`def` で関数を作り、関数名の後ろに `()` をつけて実行します。

## 引数 戻り値

### 基本

関数に値を渡したいときは、引数を使います。
`()` の中に引数を書きましょう。

```python
def show_score(score):
    print(f"score: {score}")

show_score(80)
show_score(65)
```

関数を作るときに書く `score` は、関数の中で使う変数です。

### 複数の引数

引数は複数渡せます。

```python
def show_scores(math, english):
    print(f"数学: {math}")
    print(f"英語: {english}")

show_scores(80, 72)
```

渡す値の順番も考慮されます。

```python
def show_scores(count, score):
    print(f"{count + 1}回目の点数は{score}です")

show_scores(3, 80)
show_scores(80, 3)
```

### 戻り値

関数の中で計算した結果を外に返したいときは `return` を使います。

```python
def calc_average(math, english):
    total = math + english
    average = total / 2
    return average

average = calc_average(80, 72)

print(f"average: {average}")
```

`return` された値は、変数に入れて次の処理で使えます。

```python
def calc_average(math, english):
    total = math + english
    average = total / 2
    return average

average = calc_average(80, 72)

print(f"average: {average}")

if average >= 60:
    print("passed")
else:
    print("failed")
```

## 変数
### スコープ

変数には、使える範囲があります。この範囲をスコープと呼びます。

関数の中で作った変数は、基本的に関数の外では使えません。

次のコードは、エラーになります。

```python
def calc_average(math, english):
    total = math + english
    average = total / 2
    return average

calc_average(80, 72)

print(average)
```

`average` は関数の中で作った変数なので、関数の外からそのまま使おうとすると `NameError` になります。

エラーメッセージには、どの名前が見つからなかったかが書かれています。

関数の外で使いたい値は、`return` で返して、別の変数に入れます。

```python
def calc_average(math, english):
    total = math + english
    average = total / 2
    return average

average = calc_average(80, 72)

print(f"average: {average}")
```

## やってみよう
### 条件分岐を関数にまとめる

同じ判定を何度も使う場合は、関数にしておくと読みやすくなります。

```python
def judge_passed(score):
    if score >= 60:
        return True
    else:
        return False

print(judge_passed(75))
print(judge_passed(45))
```

`return` すると、その時点で関数の処理は終わります。

```python
def judge_passed(score):
    if score >= 60:
        return True

    return False

print(judge_passed(75))
print(judge_passed(45))
```

### デフォルト引数

よく使う値は、最初から決めておくこともできます。

```python
def judge_passed(score, threshold=60):
    return score >= threshold

print(judge_passed(75))
print(judge_passed(75, threshold=80))
```

`threshold=60` のように書くと、値を渡さなかったときの初期値になります。

### リストを関数に渡す

関数には、リストも渡せます。

```python
def calc_average(scores):
    total = sum(scores)
    average = total / len(scores)
    return average

scores = [80, 65, 90]
average = calc_average(scores)

print(f"average: {average}")
```

## このページのまとめ

- 関数は `def` で作る
- 関数は `()` をつけて実行する
- 引数を使うと、関数に値を渡せる
- `return` を使うと、関数の外へ値を返せる
- 関数の中で作った変数にはスコープがある
- よく使う処理は関数にまとめると読みやすくなる
