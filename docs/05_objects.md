# 05. オブジェクトとドット記法

このページでは、`model.fit()` のようなコードを読むための準備をします。

機械学習のコードでは、次のような書き方がよく出てきます。

```text
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

この形を読むときは、まず `.` の左側と右側に分けます。

- `model`: オブジェクト
- `.fit()`: `model` が持っているメソッド
- `.predict()`: `model` が持っているメソッド

オブジェクトはメソッドを持っています。
よく例えられるのは、車というオブジェクトがあったら、メソッドは「右に曲がる」や「エンジンをかける」のような操作です。
このとき、車の設計図にあたるものを `class` と表現しますが、これは次の章で扱いましょう。

## ドット記法

`.` は、オブジェクトが持っているものを使うための記号です。

```python
scores = [80, 65, 90]

scores.append(70)

print(scores)
```

`scores.append(70)` は、`scores` というリストオブジェクトが持っている `append()` メソッドを呼び出しています。

## 型によって使えるメソッドが違う

リストにはリスト用のメソッドがあります。

```python
scores = [80, 65, 90]

scores.append(70)

print(scores)
print(type(scores))
```

文字列には文字列用のメソッドがあります。

```python
name = "sato"

upper_name = name.upper()

print(f"name: {name}")
print(f"upper_name: {upper_name}")
print(type(name))
```

辞書には辞書用のメソッドがあります。

```python
sample = {"math": 80, "english": 72, "label": 1}

print(sample.keys())
print(sample.values())
print(type(sample))
```

オブジェクトの型によって、使えるメソッドが変わります。

## よく使うメソッド

メソッドは大量にあります。ここでは、よく見るものだけに絞っておきます。

### リストのメソッド

| メソッド | 使い方 | 意味 |
| --- | --- | --- |
| `append()` | `scores.append(70)` | 末尾に値を追加する |
| `extend()` | `scores.extend([70, 88])` | 複数の値をまとめて追加する |
| `insert()` | `scores.insert(0, 100)` | 指定した位置に値を追加する |
| `remove()` | `scores.remove(65)` | 指定した値を削除する |
| `pop()` | `scores.pop()` | 末尾の値を取り出して削除する |
| `sort()` | `scores.sort()` | リストを並べ替える |
| `count()` | `scores.count(80)` | 指定した値の個数を数える |

```python
scores = [80, 65, 90]

scores.append(70)
scores.sort()

print(scores)
print(f"80の個数: {scores.count(80)}")
```

### 文字列のメソッド

| メソッド | 使い方 | 意味 |
| --- | --- | --- |
| `upper()` | `name.upper()` | 大文字にする |
| `lower()` | `name.lower()` | 小文字にする |
| `strip()` | `text.strip()` | 前後の空白を削除する |
| `replace()` | `text.replace("old", "new")` | 文字列を置き換える |
| `split()` | `text.split(",")` | 文字列を分割する |
| `startswith()` | `name.startswith("S")` | 指定した文字で始まるか調べる |
| `isdigit()` | `text.isdigit()` | 数字だけでできているか調べる |

```python
text = "  loss:0.48  "

clean_text = text.strip()
new_text = clean_text.replace(":", "=")

print(f"clean_text: {clean_text}")
print(f"new_text: {new_text}")
print(f"starts_with_loss: {clean_text.startswith('loss')}")
```

### 辞書のメソッド

| メソッド | 使い方 | 意味 |
| --- | --- | --- |
| `keys()` | `sample.keys()` | キーの一覧を見る |
| `values()` | `sample.values()` | 値の一覧を見る |
| `items()` | `sample.items()` | キーと値の組を一覧で見る |
| `get()` | `sample.get("math")` | キーを指定して値を取り出す |
| `update()` | `sample.update({"label": 1})` | 辞書に値を追加・更新する |
| `pop()` | `sample.pop("label")` | 指定したキーの値を取り出して削除する |

```python
sample = {"math": 80, "english": 72}

sample.update({"label": 1})

print(sample.keys())
print(sample.values())
print(sample.get("label"))
```

## 使えないメソッドを呼ぶとエラーになる

リストには `append()` がありますが、`upper()` はありません。

次のコードは、エラーになります。

```python
scores = [80, 65, 90]

scores.upper()
```

`AttributeError` は、そのオブジェクトに指定した属性やメソッドがないときに出るエラーです。

エラーが出たら、まず「`.` の左側は何の型か」「`.` の右側の名前はその型で使えるか」を確認します。

```python
scores = [80, 65, 90]

print(type(scores))
```

## 関数とメソッド

関数は、単独で呼び出せます。

```python
scores = [80, 65, 90]

print(len(scores))
```

メソッドは、オブジェクトの後ろから呼び出します。

```python
scores = [80, 65, 90]

scores.append(70)

print(scores)
```

どちらも処理に名前をつけたものですが、メソッドは特定のオブジェクトにくっついている、という違いがあります。

次の章では、メソッドや属性を持つオブジェクトを自分で作るために、クラスを扱います。

## このページのまとめ

- `.` はオブジェクトが持っているものを使う記号
- `object.method()` の形でメソッドを呼び出す
- 型によって使えるメソッドが違う
- 使えないメソッドを呼ぶと `AttributeError` になる
- 関数は単独で呼び出し、メソッドはオブジェクトの後ろから呼び出す
