# 15. Polarsで時系列データを扱う

このページでは、日付を持つデータをPolarsで扱います。

時系列データでは、日ごとのデータを月ごとや四半期ごとにまとめることがよくあります。

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

CSVから読み込んだ直後の `date` は、文字列として扱われます。

日付として集計したいときは、`str.to_date()` で日付型に変換します。

```python
import polars as pl

weather_df = pl.read_csv("examples/seattle-weather.csv").with_columns(
    pl.col("date").str.to_date()
)

print(weather_df.head())
print(weather_df.schema)
```

`with_columns()` の中で `date` 列を変換すると、以降の処理で日付として扱えるようになります。

## 動的グループ化

Polarsでは、`group_by_dynamic()` を使うと、日付や時刻の列をもとに一定期間ごとに行をまとめられます。

日ごとのデータを月ごと、四半期ごと、年ごとにまとめたいときに使います。

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

### 四半期ごとに分ける

// quarterly_precip = weather_df.sort("date").group_by_dynamic(
//     index_column="date",
//     every="3mo",
//     period="3mo", # ウィンドウの期間（省略可）
//     closed="left", # ウィンドウの開始点を含む（省略可）
// ).agg(
//     pl.col("precipitation").sum().alias("total_precipitation")
// )
// quarterly_precip.head() こんなの

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

時系列データでは、「月ごと」「四半期ごと」「年ごと」のように期間でまとめる場面があります。

## このページのまとめ

- `str.to_date()` で文字列の日付を日付型に変換できる
- `group_by_dynamic()` で時系列データを期間ごとに集計できる
- `every="1mo"` で月ごと、`every="3mo"` で四半期ごとにまとめられる
- 時系列の集計では、先に日付列で `sort()` しておく
