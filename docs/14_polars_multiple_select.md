# 14. Polarsの複雑な操作

もっと複雑な条件でフィルタリングなどをしていきましょう。

## `pl.when`を使ってみよう

`pl.when()` は、条件によって入れる値を変えたいときに使います。

ここでは、翼の長さで `long`、`mid`、`short` に分類します。

| 条件 | 入れる値 |
|---|---|
| `flipper_length_mm > 190` | `long` |
| `flipper_length_mm > 185` | `mid` |
| それ以外 | `short` |

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df_flipper_group = df.with_columns(
    pl.when(pl.col("flipper_length_mm") > 190)
    .then(pl.lit("long"))
    .when(pl.col("flipper_length_mm") > 185)
    .then(pl.lit("mid"))
    .otherwise(pl.lit("short"))
    .alias("flipper_group")
)

print(df_flipper_group.select(["species", "flipper_length_mm", "flipper_group"]).head())
```

`.otherwise()` は、どの条件にも当てはまらないときの値です。

`.otherwise()` を省略すると、どの条件にも当てはまらない行は `null` になります。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df_flipper_group = df.with_columns(
    pl.when(pl.col("flipper_length_mm") > 190)
    .then(pl.lit("long"))
    .alias("flipper_group")
)

print(df_flipper_group.select(["species", "flipper_length_mm", "flipper_group"]).head())
```

## 名前空間の利用

Polarsでは、特定のデータ型に対して豊富な機能を提供する「名前空間 (namespace)」が用意されています。これにより、直感的かつ効率的に専門的な操作を行うことができます。

よく使う名前空間は次のようなものです。

| 書き方 | 対象 | 例 |
|---|---|---|
| `.str` | 文字列 | 文字数、分割、正規表現 |
| `.dt` | 日付や時刻 | 年、月、日、曜日 |
| `.list` | リスト | 最初の要素、長さ |

### 文字列

文字列列には `.str` を使えます。

```python
import polars as pl

people = pl.DataFrame({
    "full_name": [
        "Ada Lovelace (UK)",
        "Alan Turing (UK)",
        "Grace Hopper (US)",
    ]
})
print(people)

people = people.with_columns([
    pl.col("full_name").str.len_chars().alias("name_length"),
    pl.col("full_name").str.split(" ").list.first().alias("first_name"),
    pl.col("full_name").str.extract(r"\((.*?)\)", 1).alias("country"),
])

print("                         ")
print(people)
```

`str.split(" ")` は文字列を空白で分割します。

`str.extract()` は正規表現に一致する部分を取り出します。

### 日付

```python
import polars as pl

logs = pl.DataFrame({
    "date": ["2024-01-05", "2024-02-12", "2024-03-20"],
    "value": [10, 20, 15],
})

print(logs)

logs = logs.with_columns(
    pl.col("date").str.to_date().alias("date")
).with_columns([
    pl.col("date").dt.year().alias("year"),
    pl.col("date").dt.month().alias("month"),
    pl.col("date").dt.day().alias("day"),
])

print("                         ")
print(logs)
```

`str.to_date()` で文字列を日付型として扱えるようにします。

そのあと `.dt.year()`、`.dt.month()`、`.dt.day()` で年、月、日を取り出せます。

### カテゴリ型

同じ文字列が何度も出てくる列は、カテゴリ型に変換すると扱いやすいことがあります。

内部的には文字列を整数にマッピングして管理しています。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

print(df.select("species"))
print(df.select("species").schema)

df = df.with_columns(
    pl.col("species").cast(pl.Categorical).alias("species_category")
)

print("                         ")
print(df.select("species_category"))
print(df.select("species_category").schema)
```

`species` のように、決まった種類の文字列が繰り返し出てくる列はカテゴリ型の候補になります。

## データフレームの結合

結合の仕方をひたすら見ていきましょう。

// 簡単な図解とともにできますか？

結合は、複数のDataFrameをキー列でつなげる操作です。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>students</code></p>
<table>
<thead><tr><th>student_id</th><th>name</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td></tr>
<tr><td>2</td><td>Alan</td></tr>
<tr><td>3</td><td>Grace</td></tr>
<tr><td>4</td><td>Linus</td></tr>
<tr><td>5</td><td>Guido</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>scores</code></p>
<table>
<thead><tr><th>student_id</th><th>score</th></tr></thead>
<tbody>
<tr><td>1</td><td>90</td></tr>
<tr><td>3</td><td>85</td></tr>
<tr><td>4</td><td>70</td></tr>
<tr><td>6</td><td>60</td></tr>
<tr><td>7</td><td>95</td></tr>
</tbody>
</table>
</div>

</div>

`student_id` をキーにして結合します。

### 内部結合

両方のDataFrameに存在するキーだけを残します。

```python
import polars as pl

students = pl.DataFrame({
    "student_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Alan", "Grace", "Linus", "Guido"],
})

scores = pl.DataFrame({
    "student_id": [1, 3, 4, 6, 7],
    "score": [90, 85, 70, 60, 95],
})

joined = students.join(scores, on="student_id", how="inner")

print(joined)
```

結果は次のようになります。両方に共通する `student_id` だけが残ります。

<table>
<thead><tr><th>student_id</th><th>name</th><th>score</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td><td>90</td></tr>
<tr><td>3</td><td>Grace</td><td>85</td></tr>
<tr><td>4</td><td>Linus</td><td>70</td></tr>
</tbody>
</table>

### 左外部結合

左側のDataFrameの行をすべて残します。

```python
import polars as pl

students = pl.DataFrame({
    "student_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Alan", "Grace", "Linus", "Guido"],
})

scores = pl.DataFrame({
    "student_id": [1, 3, 4, 6, 7],
    "score": [90, 85, 70, 60, 95],
})

joined = students.join(scores, on="student_id", how="left")

print(joined)
```

左側 (`students`) の行はすべて残り、右側に対応するキーがない場合は `null` になります。

<table>
<thead><tr><th>student_id</th><th>name</th><th>score</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td><td>90</td></tr>
<tr><td>2</td><td>Alan</td><td>null</td></tr>
<tr><td>3</td><td>Grace</td><td>85</td></tr>
<tr><td>4</td><td>Linus</td><td>70</td></tr>
<tr><td>5</td><td>Guido</td><td>null</td></tr>
</tbody>
</table>

### 完全外部結合

左右どちらかに存在するキーをすべて残します。

```python
import polars as pl

students = pl.DataFrame({
    "student_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Alan", "Grace", "Linus", "Guido"],
})

scores = pl.DataFrame({
    "student_id": [1, 3, 4, 6, 7],
    "score": [90, 85, 70, 60, 95],
})

joined = students.join(scores, on="student_id", how="full", coalesce=True)

print(joined)
```

左右どちらかにあるキーはすべて残り、足りない値は `null` になります。

<table>
<thead><tr><th>student_id</th><th>name</th><th>score</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td><td>90</td></tr>
<tr><td>2</td><td>Alan</td><td>null</td></tr>
<tr><td>3</td><td>Grace</td><td>85</td></tr>
<tr><td>4</td><td>Linus</td><td>70</td></tr>
<tr><td>5</td><td>Guido</td><td>null</td></tr>
<tr><td>6</td><td>null</td><td>60</td></tr>
<tr><td>7</td><td>null</td><td>95</td></tr>
</tbody>
</table>

### クロス結合

すべての組み合わせを作ります。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>models</code></p>
<table>
<thead><tr><th>model</th></tr></thead>
<tbody>
<tr><td>small</td></tr>
<tr><td>large</td></tr>
<tr><td>huge</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>learning_rates</code></p>
<table>
<thead><tr><th>lr</th></tr></thead>
<tbody>
<tr><td>0.01</td></tr>
<tr><td>0.001</td></tr>
<tr><td>0.0001</td></tr>
</tbody>
</table>
</div>

</div>

```python
import polars as pl

models = pl.DataFrame({"model": ["small", "large", "huge"]})
learning_rates = pl.DataFrame({"lr": [0.01, 0.001, 0.0001]})

grid = models.join(learning_rates, how="cross")

print(grid)
```

3 × 3 = 9 通りの組み合わせができます。

<table>
<thead><tr><th>model</th><th>lr</th></tr></thead>
<tbody>
<tr><td>small</td><td>0.01</td></tr>
<tr><td>small</td><td>0.001</td></tr>
<tr><td>small</td><td>0.0001</td></tr>
<tr><td>large</td><td>0.01</td></tr>
<tr><td>large</td><td>0.001</td></tr>
<tr><td>large</td><td>0.0001</td></tr>
<tr><td>huge</td><td>0.01</td></tr>
<tr><td>huge</td><td>0.001</td></tr>
<tr><td>huge</td><td>0.0001</td></tr>
</tbody>
</table>

### 複数キーで結合

複数の列をキーにすることもできます。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>preds</code></p>
<table>
<thead><tr><th>student_id</th><th>task</th><th>pred</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>0.8</td></tr>
<tr><td>1</td><td>B</td><td>0.4</td></tr>
<tr><td>2</td><td>A</td><td>0.7</td></tr>
<tr><td>2</td><td>B</td><td>0.6</td></tr>
<tr><td>3</td><td>A</td><td>0.9</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>labels</code></p>
<table>
<thead><tr><th>student_id</th><th>task</th><th>label</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>1</td></tr>
<tr><td>1</td><td>B</td><td>0</td></tr>
<tr><td>2</td><td>A</td><td>1</td></tr>
<tr><td>2</td><td>B</td><td>1</td></tr>
<tr><td>3</td><td>A</td><td>0</td></tr>
</tbody>
</table>
</div>

</div>

`student_id` と `task` の2つをキーにして結合します。

```python
import polars as pl

preds = pl.DataFrame({
    "student_id": [1, 1, 2, 2, 3],
    "task": ["A", "B", "A", "B", "A"],
    "pred": [0.8, 0.4, 0.7, 0.6, 0.9],
})

labels = pl.DataFrame({
    "student_id": [1, 1, 2, 2, 3],
    "task": ["A", "B", "A", "B", "A"],
    "label": [1, 0, 1, 1, 0],
})

joined = preds.join(labels, on=["student_id", "task"], how="inner")

print(joined)
```

`student_id` と `task` の両方が一致する行だけが残ります。

<table>
<thead><tr><th>student_id</th><th>task</th><th>pred</th><th>label</th></tr></thead>
<tbody>
<tr><td>1</td><td>A</td><td>0.8</td><td>1</td></tr>
<tr><td>1</td><td>B</td><td>0.4</td><td>0</td></tr>
<tr><td>2</td><td>A</td><td>0.7</td><td>1</td></tr>
<tr><td>2</td><td>B</td><td>0.6</td><td>1</td></tr>
<tr><td>3</td><td>A</td><td>0.9</td><td>0</td></tr>
</tbody>
</table>

### セミ結合

右側にキーが存在する左側の行だけを残します。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>students</code></p>
<table>
<thead><tr><th>student_id</th><th>name</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td></tr>
<tr><td>2</td><td>Alan</td></tr>
<tr><td>3</td><td>Grace</td></tr>
<tr><td>4</td><td>Linus</td></tr>
<tr><td>5</td><td>Guido</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>submitted</code></p>
<table>
<thead><tr><th>student_id</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
<tr><td>3</td></tr>
<tr><td>5</td></tr>
</tbody>
</table>
</div>

</div>

```python
import polars as pl

students = pl.DataFrame({
    "student_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Alan", "Grace", "Linus", "Guido"],
})

submitted = pl.DataFrame({"student_id": [1, 3, 5]})

matched = students.join(submitted, on="student_id", how="semi")

print(matched)
```

`submitted` に含まれる `student_id` を持つ行だけが残ります。右側の列は追加されません。

<table>
<thead><tr><th>student_id</th><th>name</th></tr></thead>
<tbody>
<tr><td>1</td><td>Ada</td></tr>
<tr><td>3</td><td>Grace</td></tr>
<tr><td>5</td><td>Guido</td></tr>
</tbody>
</table>

### アンチ結合

右側にキーが存在しない左側の行だけを残します。

```python
import polars as pl

students = pl.DataFrame({
    "student_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Alan", "Grace", "Linus", "Guido"],
})

submitted = pl.DataFrame({"student_id": [1, 3, 5]})

not_submitted = students.join(submitted, on="student_id", how="anti")

print(not_submitted)
```

`submitted` に含まれない `student_id` を持つ行だけが残ります。

<table>
<thead><tr><th>student_id</th><th>name</th></tr></thead>
<tbody>
<tr><td>2</td><td>Alan</td></tr>
<tr><td>4</td><td>Linus</td></tr>
</tbody>
</table>

### Asof結合

時刻が完全一致しないときに、直前の時刻の行を対応させる結合です。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>events</code></p>
<table>
<thead><tr><th>time</th><th>event</th></tr></thead>
<tbody>
<tr><td>1</td><td>start</td></tr>
<tr><td>5</td><td>middle</td></tr>
<tr><td>10</td><td>end</td></tr>
<tr><td>15</td><td>resume</td></tr>
<tr><td>20</td><td>stop</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>measurements</code></p>
<table>
<thead><tr><th>time</th><th>value</th></tr></thead>
<tbody>
<tr><td>0</td><td>100</td></tr>
<tr><td>3</td><td>120</td></tr>
<tr><td>8</td><td>130</td></tr>
<tr><td>12</td><td>140</td></tr>
<tr><td>18</td><td>150</td></tr>
</tbody>
</table>
</div>

</div>

```python
import polars as pl

events = pl.DataFrame({
    "time": [1, 5, 10, 15, 20],
    "event": ["start", "middle", "end", "resume", "stop"],
})

measurements = pl.DataFrame({
    "time": [0, 3, 8, 12, 18],
    "value": [100, 120, 130, 140, 150],
})

joined = events.join_asof(measurements, on="time")

print(joined)
```

各 `events.time` に対して、それ以下の最大の `measurements.time` の `value` が対応します。

<table>
<thead><tr><th>time</th><th>event</th><th>value</th></tr></thead>
<tbody>
<tr><td>1</td><td>start</td><td>100</td></tr>
<tr><td>5</td><td>middle</td><td>120</td></tr>
<tr><td>10</td><td>end</td><td>130</td></tr>
<tr><td>15</td><td>resume</td><td>140</td></tr>
<tr><td>20</td><td>stop</td><td>150</td></tr>
</tbody>
</table>

### 非等価結合

等しいかどうかではなく、大小関係などの条件で結合することもあります。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>sales</code></p>
<table>
<thead><tr><th>amount</th></tr></thead>
<tbody>
<tr><td>80</td></tr>
<tr><td>120</td></tr>
<tr><td>250</td></tr>
<tr><td>350</td></tr>
<tr><td>500</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>discounts</code></p>
<table>
<thead><tr><th>min_amount</th><th>discount_rate</th></tr></thead>
<tbody>
<tr><td>100</td><td>0.05</td></tr>
<tr><td>200</td><td>0.10</td></tr>
<tr><td>400</td><td>0.20</td></tr>
</tbody>
</table>
</div>

</div>

`amount >= min_amount` を満たす組み合わせを残します。

```python
import polars as pl

sales = pl.DataFrame({
    "amount": [80, 120, 250, 350, 500],
})

discounts = pl.DataFrame({
    "min_amount": [100, 200, 400],
    "discount_rate": [0.05, 0.10, 0.20],
})

joined = sales.join_where(
    discounts,
    pl.col("amount") >= pl.col("min_amount"),
)

print(joined)
```

条件を満たす組み合わせがすべて残ります。`amount=500` は3つすべての割引条件を満たすので3行になります。

<table>
<thead><tr><th>amount</th><th>min_amount</th><th>discount_rate</th></tr></thead>
<tbody>
<tr><td>120</td><td>100</td><td>0.05</td></tr>
<tr><td>250</td><td>100</td><td>0.05</td></tr>
<tr><td>250</td><td>200</td><td>0.10</td></tr>
<tr><td>350</td><td>100</td><td>0.05</td></tr>
<tr><td>350</td><td>200</td><td>0.10</td></tr>
<tr><td>500</td><td>100</td><td>0.05</td></tr>
<tr><td>500</td><td>200</td><td>0.10</td></tr>
<tr><td>500</td><td>400</td><td>0.20</td></tr>
</tbody>
</table>

### 縦に結合

同じ列を持つDataFrameを縦に積み上げるときは、`pl.concat()` を使います。

<div style="display: flex; gap: 2rem; flex-wrap: wrap;">

<div>
<p><code>train</code></p>
<table>
<thead><tr><th>split</th><th>score</th></tr></thead>
<tbody>
<tr><td>train</td><td>0.80</td></tr>
<tr><td>train</td><td>0.90</td></tr>
<tr><td>train</td><td>0.85</td></tr>
</tbody>
</table>
</div>

<div>
<p><code>test</code></p>
<table>
<thead><tr><th>split</th><th>score</th></tr></thead>
<tbody>
<tr><td>test</td><td>0.70</td></tr>
<tr><td>test</td><td>0.75</td></tr>
<tr><td>test</td><td>0.72</td></tr>
</tbody>
</table>
</div>

</div>

```python
import polars as pl

train = pl.DataFrame({
    "split": ["train", "train", "train"],
    "score": [0.80, 0.90, 0.85],
})

test = pl.DataFrame({
    "split": ["test", "test", "test"],
    "score": [0.70, 0.75, 0.72],
})

all_scores = pl.concat([train, test])

print(all_scores)
```

行が縦に積み上げられます。

<table>
<thead><tr><th>split</th><th>score</th></tr></thead>
<tbody>
<tr><td>train</td><td>0.80</td></tr>
<tr><td>train</td><td>0.90</td></tr>
<tr><td>train</td><td>0.85</td></tr>
<tr><td>test</td><td>0.70</td></tr>
<tr><td>test</td><td>0.75</td></tr>
<tr><td>test</td><td>0.72</td></tr>
</tbody>
</table>

## 今回のまとめ

- `pl.when().then().otherwise()` で条件分岐を書ける
- `.otherwise()` を省略すると `null` になる
- `.str`、`.dt`、`.list` のような名前空間がある
- 文字列は長さ、分割、正規表現抽出ができる
- 日付はパースして、年、月、日を取り出せる
- カテゴリ型は、同じ文字列が繰り返し出る列で候補になる
- `join()` でDataFrame同士を結合できる
- `pl.concat()` で縦方向に結合できる
