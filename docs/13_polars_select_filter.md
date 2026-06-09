# 13. Polarsの列操作と条件抽出の基本

このページでは、Polarsで列を選んだり、条件で行を絞り込んだりします。

Polarsでは、`select()`、`filter()`、`with_columns()` をよく使います。

polarsは列指向なので、列を指定して、それに関数を実行していくような感じになります。

## 列の操作1

### 列を選ぶ

特定の列だけを見たいときは、`select()` を使います。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

penguins = df.select(["species", "island", "body_mass_g"])

print(penguins)
```

`select()` は、列を選ぶためのメソッドです。

リストで列名を渡すと、複数の列を選べます。

### `pl.col()`で列を指定する

Polarsでは、計算や条件を書くときに 直接指定でもいいですが、`pl.col()` をよく使います。
pl.colの引数には正規表現をしようすることもできます。
正規表現とはなんぞやって人は以下のサイトを参考にして下さい。
<a href="https://gametsukurukun.com/regexp-puzzle/" target="_blank" rel="noopener noreferrer">正規表現パズル</a>

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

bill_lengths = df.select(pl.col("bill_length_mm"))

print(bill_lengths)
```

`pl.col("bill_length_mm")` は、「`bill_length_mm` 列を使う」という意味です。

### 条件で行を絞り込む

条件に合う行だけを取り出すときは、`filter()` を使います。

引数に条件を入れることで、指定した行だけ取り出します。

#### 基本

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

adelie = df.filter(pl.col("species") == "Adelie")

print(adelie)
```

`pl.col("species") == "Adelie"` のように書くと、列に対する条件を作れます。

この例では、Adelieという種類のペンギンだけを残しています。

#### `&`を使ってみる

`&` を使うと、複数の条件を組み合わせられます。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

large_male = df.filter(
    (pl.col("body_mass_g") >= 5000) & (pl.col("sex") == "MALE")
)

print(large_male)
```

#### `is_in()`を使ってみる

`is_in()` を使うと、「この値のどれかに含まれる」という条件を書けます。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

selected_species = df.filter(
    pl.col("species").is_in(["Adelie", "Gentoo"])
)

print(selected_species.select(["species", "island", "body_mass_g"]))
```

`is_in(["Adelie", "Gentoo"])` は、`species` がAdelieまたはGentooの行だけを残します。

### 新しい列を作る

新しい列を追加するときは、`with_columns()` を使います。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df = df.with_columns(
    (pl.col("bill_length_mm") / pl.col("bill_depth_mm")).alias("bill_ratio")
)

print(df.select(["species", "bill_length_mm", "bill_depth_mm", "bill_ratio"]))
```

`.alias("bill_ratio")` は、計算結果の列名を `bill_ratio` にする、という意味です。

### 列を並べ替える

`sort`メソッドは並べ替えを可能にします。
デフォルトは昇順で、降順にしたければ、`descending = True`を選択します。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

sorted_df = df.sort("body_mass_g")

print(sorted_df)
```

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

sorted_df = df.sort("body_mass_g", descending=True)

print(sorted_df)
```

複数列を基準にソートすることもできます。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

sorted_df = df.sort(
    ["flipper_length_mm", "body_mass_g"],
    descending=[False, True],
)

print(sorted_df)
```

この例では、まず `flipper_length_mm` を昇順に並べ、同じ種類の中では `body_mass_g` を降順に並べています。

`sort()` は、指定した列で並べ替えるメソッドです。

## 列の操作2

### 列の追加

列の追加には`with_columns`を利用します。

この辺からややこしくなるので、演習をやりながら複雑な操作は理解してください。

`pl.lit()` は、すべての行に同じ値を入れるときに使います。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df = df.with_columns(
    pl.lit("Palmer Penguins").alias("dataset")
)

print(df.select(["species", "island", "dataset"]))
```

作った列を使って、さらに別の列を作ることもあります。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df = df.with_columns(
    (pl.col("bill_length_mm") / pl.col("bill_depth_mm")).alias("bill_ratio")
).with_columns(
    (pl.col("bill_ratio") >= 2.8).alias("high_bill_ratio")
)

print(df.select(["species", "bill_ratio", "high_bill_ratio"]))
```

1つ目の `with_columns()` で `bill_ratio` を作り、2つ目の `with_columns()` でその列を使っています。

### 列の型変換

`cast()` は、列の型を変換するメソッドです。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df = df.with_columns(
    pl.col("body_mass_g").cast(pl.Float64).alias("body_mass_g_float")
)

print(df.select(["body_mass_g", "body_mass_g_float"]).head())
print(df.select("body_mass_g_float").schema)
```

この例では、体重の列を整数から小数の型に変換しています。

### 欠損値を埋める

`fill_null()` は、`null` を別の値で埋めるメソッドです。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

df = df.with_columns(
    pl.col("sex").fill_null("UNKNOWN").alias("sex_filled")
)

print(df.select(["species", "sex", "sex_filled"]))
```

欠損値を消すだけでなく、意味のある値で埋めることも前処理ではよくあります。

!!! warning "`pl.all().fill_null("UNKNOWN")` の注意点"
    すべての列を文字列 `"UNKNOWN"` で埋めると、数値列も含めて全列が文字列型 (`str`) に変換されます。
    数値列の欠損値は `0` や平均値など、型に合った値で埋めるのが安全です。

## グループごとに集計する

### 一つのキーでグループ化して集計

`group_by()` と `agg()` を使います。ここは使い方が難しいので、自身で色々試してみて下さい。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

summary = df.group_by("species").agg(
    pl.col("body_mass_g").mean().alias("mean_body_mass_g")
)

print(summary.sort("mean_body_mass_g", descending=True))
```

`group_by("species")` は、`species` の値ごとに行をまとめます。

`agg()` は、まとめたグループごとに集計するためのメソッドです。今回は一つの集計のみしていますが、複数の集計関数を用いて、一気に集計することも可能です。

今回は種ごとの体重の平均をまとめて、`mean_body_mass_g` カラムとしています。

### 複数のキーで集計

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

summary = df.group_by(["species", "island"]).agg(
    pl.col("body_mass_g").max().alias("max_body_mass_g")
)

print(summary.sort("max_body_mass_g", descending=True))
```

この例では、種類と島の組み合わせごとに、最大体重を集計しています。

### 全ての列を対象に実行

`pl.all()` は、すべての列を対象にしたいときに使います。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

clean_df = df.select(
    pl.all().fill_null("UNKNOWN")
)

print(clean_df)
```

この例では、すべての列に対して `fill_null()` を実行しています。

### 条件にあう行だけ集計

集計の中で `filter()` を使うと、条件に合う行だけを集計できます。

```python
import polars as pl

df = pl.read_csv("examples/penguins.csv")

summary = df.group_by("species").agg(
    pl.col("body_mass_g")
    .filter(pl.col("sex") == "MALE")
    .mean()
    .alias("male_mean_body_mass_g")
)

print(summary.sort("male_mean_body_mass_g", descending=True))
```

この例では、種類ごとにまとめたあと、オスの体重だけを使って平均を計算しています。

## このページのまとめ

- `select()` で列を選ぶ
- `pl.col("列名")` で列を指定する
- `filter()` で条件に合う行を取り出す
- 複数条件では `&` を使える
- `is_in()` で候補に含まれる値を条件にできる
- `with_columns()` で新しい列を作る
- `.alias()` で列名をつける
- `cast()` で列の型を変換できる
- `fill_null()` で欠損値を埋められる
- `group_by()` と `agg()` でグループごとに集計できる
