import matplotlib.pyplot as plt
import pandas as pd


def main():
    df = pd.read_csv("examples/scores.csv")

    print("先頭行")
    print(df.head())
    print()

    print("基本統計量")
    print(df[["math", "english"]].describe())
    print()

    df["average"] = (df["math"] + df["english"]) / 2
    print("平均点を追加したデータ")
    print(df)
    print()

    x = df["math"]
    y = df["english"]

    plt.scatter(x, y)
    plt.xlabel("math")
    plt.ylabel("english")
    plt.title("Math and English Scores")
    plt.tight_layout()
    plt.savefig("scores_scatter.png")
    print("scores_scatter.png を作成しました")


if __name__ == "__main__":
    main()
