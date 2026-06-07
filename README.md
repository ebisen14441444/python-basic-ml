# Python基礎講習会

機械学習講習会に進む前の準備として、Pythonの基本文法、表形式データの扱い、機械学習でよく使う考え方を短時間で確認するための教材です。

## 対象者

- Pythonを初めて学ぶ人
- プログラミング経験は少しあるが、Pythonの書き方に慣れていない人
- この後の機械学習講習会で、コードの意味を追えるようになりたい人

## ゴール

講習後に、次のことができる状態を目指します。

- 変数、条件分岐、繰り返し、関数を読んで書ける
- リスト、辞書、表形式データの扱い方がわかる
- エラーを見て、どこを直せばよいか考えられる
- NumPyとPolarsの基本操作を使える
- 機械学習のサンプルコードに出てくる前処理の意味を理解できる

## 推奨構成

| 時間 | 内容 |
| --- | --- |
| 0:00-0:15 | Pythonと実行環境の確認 |
| 0:15-0:45 | 変数、型、四則演算 |
| 0:45-1:10 | リスト、辞書 |
| 1:10-1:25 | 条件分岐、繰り返し |
| 1:25-1:35 | 休憩 |
| 1:35-1:55 | 関数 |
| 1:55-2:15 | オブジェクトとドット記法 |
| 2:15-2:40 | クラス |
| 2:40-2:50 | よく見るPythonの書き方 |
| 2:50-3:30 | NumPy |
| 3:30-4:00 | Polars |
| 4:00-4:10 | 機械学習講習への接続 |

## ファイル構成

```text
.
├── README.md
├── Makefile
├── requirements.txt
├── docs
│   ├── 00_setup.md
│   ├── 01_python_basics.md
│   ├── 02_data_structures.md
│   ├── 03_control_flow.md
│   ├── 04_functions.md
│   ├── 05_objects.md
│   ├── 06_classes.md
│   ├── 07_python_extras.md
│   ├── 08_numpy_basics.md
│   ├── 09_numpy_multidim.md
│   ├── 10_numpy_indexing.md
│   ├── 11_numpy_calculation.md
│   ├── 12_polars_basics.md
│   ├── 13_polars_select_filter.md
│   ├── 14_polars_ml_prep.md
│   └── 15_bridge_to_ml.md
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
make install-site
```

ローカルで確認します。開発サーバーは `http://127.0.0.1:8004/` で起動します。

```bash
make serve
```

静的ファイルをビルドします。

```bash
make build
```

Cloudflare Pagesで公開する場合は、ビルドコマンドに次を指定します。

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements-site.txt && .venv/bin/python -m mkdocs build
```

出力ディレクトリは `site` です。

## 講師向けメモ

- 初学者向けなので、最初は「暗記」より「読めること」を重視します。
- 機械学習講習会への接続では、モデルそのものよりも「データを表として見る」「列を選ぶ」「型を見る」「入力と正解に分ける」を強調します。
- 受講者の環境差で詰まりやすいため、可能なら講習前に `python --version` と `pip --version` の確認時間を取ってください。
