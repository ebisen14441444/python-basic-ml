# Python基礎講習会

機械学習講習会に進む前の準備として、Pythonの基本文法、データ処理、簡単な可視化、機械学習でよく使う考え方を短時間で確認するための教材です。

## 対象者

- Pythonを初めて学ぶ人
- プログラミング経験は少しあるが、Pythonの書き方に慣れていない人
- この後の機械学習講習会で、コードの意味を追えるようになりたい人

## ゴール

講習後に、次のことができる状態を目指します。

- 変数、条件分岐、繰り返し、関数を読んで書ける
- リスト、辞書、表形式データの扱い方がわかる
- エラーを見て、どこを直せばよいか考えられる
- NumPyとPandasの基本操作を使える
- Matplotlibで簡単なグラフを描ける
- 機械学習のサンプルコードに出てくる前処理の意味を理解できる

## 推奨構成

| 時間 | 内容 |
| --- | --- |
| 0:00-0:15 | Pythonと実行環境の確認 |
| 0:15-0:50 | 変数、型、条件分岐、繰り返し |
| 0:50-1:20 | 関数、リスト、辞書 |
| 1:20-1:35 | 休憩 |
| 1:35-2:10 | NumPy入門 |
| 2:10-2:45 | Pandas入門 |
| 2:45-3:10 | 可視化と簡単なデータ確認 |
| 3:10-3:30 | 機械学習講習への接続 |

## ファイル構成

```text
.
├── README.md
├── requirements.txt
├── docs
│   ├── 00_setup.md
│   ├── 01_python_basics.md
│   ├── 02_data_structures.md
│   ├── 03_numpy_pandas.md
│   └── 04_bridge_to_ml.md
└── examples
    ├── mini_analysis.py
    └── scores.csv
```

## 使い方

必要なライブラリをインストールします。

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

サンプルを実行します。

```bash
python examples/mini_analysis.py
```

## サイトとして見る

サイト用の依存関係をインストールします。

```bash
python3 -m pip install -r requirements-site.txt
```

ローカルで確認します。

```bash
mkdocs serve
```

静的ファイルをビルドします。

```bash
mkdocs build
```

Cloudflare Pagesで公開する場合は、ビルドコマンドに次を指定します。

```bash
python3 -m pip install -r requirements-site.txt && python3 -m mkdocs build
```

出力ディレクトリは `site` です。

## 講師向けメモ

- 初学者向けなので、最初は「暗記」より「読めること」を重視します。
- 機械学習講習会への接続では、モデルそのものよりも「データを表として見る」「列を選ぶ」「欠損や型を見る」「入力と正解に分ける」を強調します。
- 受講者の環境差で詰まりやすいため、可能なら講習前に `python --version` と `pip --version` の確認時間を取ってください。
