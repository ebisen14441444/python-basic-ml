import polars as pl


def main():
    df = pl.read_csv("examples/scores.csv")

    print("先頭行")
    print(df.head())
    print()

    print("列ごとの平均")
    print(df.select(["math", "english"]).mean())
    print()

    df = df.with_columns(
        ((pl.col("math") + pl.col("english")) / 2).alias("average")
    )
    print("平均点を追加したデータ")
    print(df)
    print()

    passed_students = df.filter(pl.col("passed"))
    print("合格した人")
    print(passed_students)
    print()

    x = df.select(["math", "english"])
    y = df.select("passed")

    print("入力 X")
    print(x)
    print()

    print("正解 y")
    print(y)


if __name__ == "__main__":
    main()
