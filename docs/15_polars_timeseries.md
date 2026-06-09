# 15. Polarsで時系列データを扱う

このページでは、日付を持つデータをPolarsで扱います。

時系列データでは、日ごとのデータを月ごとや四半期ごとにまとめたり、特定の期間だけを切り出したりすることがよくあります。

ここで扱うのは、こんな操作です。

- 文字列の日付を「日付型」に変換する
- 日付から年・月・曜日などの情報を取り出す
- ある期間だけを取り出す（フィルタ）
- 月ごと・四半期ごとに集計する
- 移動平均（直近7日の平均など）を計算する

## 日付のあるデータを読む

ここでは、Seattle Weatherのデータを使います。

このデータは、日ごとの天気、降水量、最高気温、最低気温、風速を記録した時系列データです。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv")

print(weather_df.head())
```

`date`、`precipitation`、`temp_max`、`temp_min`、`wind`、`weather` などの列があります。

### 日付列を日付型に変換する

CSVから読み込んだ直後の `date` は、ただの文字列として扱われます。

文字列のままだと「月ごとにまとめる」「2013年だけ取り出す」といった日付らしい処理ができないので、まず日付型に変換します。

文字列を日付に変換するときは、`str.to_date()` を使います。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

print(weather_df.head())
print(weather_df.schema)
```

`with_columns()` の中で `date` 列を変換すると、以降の処理で日付として扱えるようになります。

`schema` を見ると、`date` 列の型が `Date` になっていることが確認できます。

!!! tip "日付の書式が独特なとき"
    `2024/01/15` や `15-Jan-2024` のような独自の書式は、`str.to_date("%Y/%m/%d")` のようにフォーマットを指定します。
    `%Y` は4桁の年、`%m` は2桁の月、`%d` は2桁の日です。

## 日付から情報を取り出す

日付型の列からは、`dt` というアクセサを使って「年だけ」「月だけ」「曜日だけ」を取り出せます。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

weather_with_parts = weather_df.with_columns([
    pl.col("date").dt.year().alias("year"),
    pl.col("date").dt.month().alias("month"),
    pl.col("date").dt.weekday().alias("weekday"),
])

print(weather_with_parts.select(["date", "year", "month", "weekday"]).head())
```

| メソッド | 取り出すもの |
|---|---|
| `dt.year()` | 年 (例: 2012) |
| `dt.month()` | 月 (1〜12) |
| `dt.day()` | 日 (1〜31) |
| `dt.weekday()` | 曜日 (1=月曜、7=日曜) |

### 取り出した情報でグループ化する

`dt` で取り出した列を `group_by()` に渡すと、「月ごと」「曜日ごと」の集計ができます。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

monthly_avg = weather_df.group_by(
    pl.col("date").dt.month().alias("month")
).agg(
    pl.col("temp_max").mean().alias("mean_temp_max")
).sort("month")

print(monthly_avg)
```

これで、年をまたいで「1月の平均最高気温」「2月の平均最高気温」…が出せます。

## 期間でフィルタする

特定の期間のデータだけを取り出したいときは、いつもの `filter()` に日付の条件を書きます。

日付リテラルを書くときは、`pl.date(year, month, day)` を使うと分かりやすいです。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

summer_2013 = weather_df.filter(
    (pl.col("date") >= pl.date(2013, 6, 1))
    & (pl.col("date") <= pl.date(2013, 8, 31))
)

print(summer_2013.head())
print(f"行数: {summer_2013.height}")
```

`>=` と `<=` を `&` でつなぐことで、「2013年6月1日から2013年8月31日まで」の範囲を取り出しています。

## 動的グループ化

Polarsでは、`group_by_dynamic()` を使うと、日付や時刻の列をもとに一定期間ごとに行をまとめられます。

日ごとのデータを月ごと、四半期ごと、年ごとにまとめたいときに使います。

`dt.month()` で取り出してから `group_by()` する方法と違って、こちらは「2012年1月」「2012年2月」のように年と月の組み合わせでまとめてくれます。

### 月ごとにデータを集計する

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

monthly_weather = weather_df.sort("date").group_by_dynamic(
    index_column="date",
    every="1mo",
).agg([
    pl.col("precipitation").sum().alias("monthly_precipitation"),
    pl.col("temp_max").mean().alias("mean_temp_max"),
])

print(monthly_weather.head())
```

`index_column="date"` は、どの日付列を基準にまとめるかを指定しています。

`every="1mo"` は、1か月ごとのまとまりを作るという意味です。

この例では、日ごとのデータを1か月ごとにまとめて、月ごとの降水量の合計と最高気温の平均を計算しています。

!!! warning "先に sort しておく"
    `group_by_dynamic()` は日付が並んでいることを前提にしているので、必ず先に `sort("date")` をしておきます。

### 四半期ごとに分ける

`every` を変えれば、四半期や年単位の集計もできます。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

quarterly_precip = weather_df.sort("date").group_by_dynamic(
    index_column="date",
    every="3mo",
    period="3mo",
    closed="left",
).agg(
    pl.col("precipitation").sum().alias("total_precipitation")
)

print(quarterly_precip.head())
```

`every="3mo"` にすると、3か月ごとのまとまりを作れます。

| 引数 | 意味 |
|---|---|
| `every` | 次のウィンドウまでの間隔 |
| `period` | 1つのウィンドウの長さ（省略すると `every` と同じ） |
| `closed` | ウィンドウの端を含むかどうか (`"left"`, `"right"`, `"both"`, `"none"`) |

時系列データでは、「月ごと」「四半期ごと」「年ごと」のように期間でまとめる場面があります。

### よく使う期間の指定

`every` には次のような文字列が指定できます。

| 文字列 | 意味 |
|---|---|
| `"1d"` | 1日 |
| `"1w"` | 1週間 |
| `"1mo"` | 1か月 |
| `"3mo"` | 3か月（四半期） |
| `"1y"` | 1年 |

## 移動平均を計算する

時系列データでは、日々の値がガタガタしすぎて傾向が見えにくいことがあります。

そんなときは、**移動平均（直近 N 日の平均）** をとると、なめらかな線になって傾向が見やすくなります。

Polarsでは、`rolling_mean()` を使います。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

weather_smooth = weather_df.sort("date").with_columns(
    pl.col("temp_max").rolling_mean(window_size=7).alias("temp_max_7day_avg")
)

print(weather_smooth.select(["date", "temp_max", "temp_max_7day_avg"]).head(10))
```

`window_size=7` は、「自分を含めた直近7日間で平均をとる」という意味です。

最初の数行は、まだ7日分のデータがないので `null` になります。

同じ仲間に、`rolling_sum()`（合計）や `rolling_max()`（最大）もあります。

## このページのまとめ

- `str.to_date()` で文字列の日付を日付型に変換できる
- `dt.year()` / `dt.month()` / `dt.weekday()` で日付から要素を取り出せる
- 日付の比較には `pl.date(2013, 6, 1)` のようなリテラルが使える
- `group_by_dynamic()` で時系列データを期間ごとに集計できる
    - `every="1mo"` で月ごと、`every="3mo"` で四半期ごと、`every="1y"` で年ごと
    - 使う前に `sort("date")` しておく
- `rolling_mean(window_size=7)` で移動平均を計算できる
