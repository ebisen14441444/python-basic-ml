# 02. データ構造

## リスト

リストは複数の値を順番に持つ箱です。

```python
scores = [80, 65, 90]
print(scores[0])
```

リストの番号は `0` から始まります。

```python
scores.append(70)
average = sum(scores) / len(scores)
```

## 辞書

辞書は「キー」と「値」の組み合わせです。

```python
student = {
    "name": "佐藤",
    "math": 80,
    "english": 72,
}

print(student["name"])
```

## リストと辞書の組み合わせ

表のようなデータは、辞書のリストとして表せます。

```python
students = [
    {"name": "佐藤", "score": 80},
    {"name": "鈴木", "score": 65},
    {"name": "田中", "score": 90},
]

for student in students:
    print(student["name"], student["score"])
```

## 機械学習との関係

機械学習では、データは多くの場合「表」として扱います。

| 名前 | 数学 | 英語 | 合格 |
| --- | ---: | ---: | --- |
| 佐藤 | 80 | 72 | True |
| 鈴木 | 55 | 68 | False |

この表をPythonで扱うために、リスト、辞書、Pandasの考え方がつながっていきます。
