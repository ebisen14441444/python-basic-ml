# 02. データ構造

このページでは、複数の値をまとめて扱うための基本を見ます。

- `list`: 複数の値を順番に並べる
- `dict`: 名前をつけて値を持つ

## リスト

### リストの基本

リストは、複数の値を順番に持つための型です。
`[]` で囲みます。

```python
scores = [80, 65, 90]

print(scores)
print(type(scores))
```

リストの中の値は、左から順番に番号で取り出せます。プログラミング言語の番号は大抵 `0` から始まるので注意しましょう。

```python
scores = [80, 65, 90]

print(f"1番目の点数: {scores[0]}")
print(f"2番目の点数: {scores[1]}")
print(f"3番目の点数: {scores[2]}")
```

### リストの長さ

リストに値がいくつ入っているかは `len()` で確認できます。

```python
scores = [80, 65, 90]

print(f"データ数: {len(scores)}")
```

合計は `sum()` で計算できます。

```python
scores = [80, 65, 90]

total = sum(scores)
average = total / len(scores)

print(f"合計: {total}")
print(f"平均: {average}")
```

### リストに値を追加する

リストに値を追加するときは `append()` を使います。

```python
scores = [80, 65, 90]

scores.append(70)

print(scores)
print(f"データ数: {len(scores)}")
```

`append()` は、リストの最後に値を1つ追加します。

リストは、値の順番に意味があるときに便利です。

## 辞書

### 辞書の基本

辞書は、キーと値の組み合わせでデータを持つ型です。
下の例では `math` がキーで、`80` が値です。

```python
sample = {
    "math": 80,
    "english": 72,
    "label": 1,
}

print(sample)
print(type(sample))
```

値を取り出すときは、キーを指定します。

```python
sample = {
    "math": 80,
    "english": 72,
    "label": 1,
}

print(f"math: {sample['math']}")
print(f"english: {sample['english']}")
print(f"label: {sample['label']}")
```

### キーと値を見る

辞書にどんなキーがあるかは `keys()`、どんな値があるかは `values()` で確認できます。

```python
sample = {
    "math": 80,
    "english": 72,
    "label": 1,
}

print(sample.keys())
print(f"values: {sample.values()}")
```

### 辞書に値を追加する

辞書に新しい値を追加するときは、新しいキーを `[]` の中に書いて、値を入れます。

```python
sample = {
    "math": 80,
    "english": 72,
}

sample["label"] = 1

print(sample)
```

すでにあるキーに値を入れると、その値が上書きされます。

```python
sample = {
    "math": 80,
    "english": 72,
}

sample["math"] = 85

print(sample)
```

### 辞書のリスト

複数人のデータは、辞書をリストに入れると表のように扱えます。

```python
samples = [
    {"name": "Sato", "math": 80, "english": 72, "label": 1},
    {"name": "Suzuki", "math": 55, "english": 68, "label": 0},
    {"name": "Tanaka", "math": 90, "english": 86, "label": 1},
]

print(samples[0])
print(samples[1])
```

1件分のデータを取り出してから、キーを指定して値を取り出せます。

```python
samples = [
    {"name": "Sato", "math": 80, "english": 72, "label": 1},
    {"name": "Suzuki", "math": 55, "english": 68, "label": 0},
    {"name": "Tanaka", "math": 90, "english": 86, "label": 1},
]

first_sample = samples[0]

print(f"name: {first_sample['name']}")
print(f"math: {first_sample['math']}")
print(f"label: {first_sample['label']}")
```

次の章で扱う `for` を使うと、このような複数のデータを順番に処理できます。

## このページのまとめ

- `list` は複数の値を順番に持つ
- リストの番号は `0` から始まる
- `len()` でリストの長さを確認できる
- `dict` はキーと値の組み合わせで持つ
- 辞書の値はキーを指定して取り出す
- 辞書のリストを使うと、表のようなデータを表せる
