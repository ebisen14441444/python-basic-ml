# 00. 環境準備

## この講習の標準環境

この講習では、基本的に **Google Colab** を使います。

Google Colab はブラウザ上で Python を実行できるサービスです。自分のPCに Python や VS Code を入れていなくても、同じ画面でコードを書いて実行できます。

## 使うもの

- Google アカウント
- ブラウザ
- Google Colab

VS Code やローカルの Python 環境は必須ではありません。

## Colabを開く

下のバッジから、講習で使うノートブックを Colab で開けます。

<a href="https://colab.research.google.com/github/ebisen14441444/python-basic-ml/blob/main/notebook.ipynb" target="_blank" rel="noopener noreferrer"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"></a>

リンクが開けない場合は、次のURLをブラウザで開いてください。

```text
https://colab.research.google.com/github/ebisen14441444/python-basic-ml/blob/main/notebook.ipynb
```

開いたら、画面上部のメニューから次を選び、自分用のコピーを作ります。

```text
ファイル > ドライブにコピーを保存
```

コピーを作ると、自分の Google Drive 上でノートブックを編集できるようになります。

## セルを実行する

Colab では、コードを書く場所を「セル」と呼びます。

コードセルに次のように書いて、左側の実行ボタンを押します。

```python
print("Hello, Python")
```

実行結果として `Hello, Python` と表示されればOKです。

セルは、上から順番に実行していくのが基本です。途中のセルを飛ばすと、後のセルで使う変数やデータがまだ作られていないことがあります。

## ライブラリを使う

この講習では、NumPy や Polars などのライブラリを使います。

NumPy は Colab ですぐ使えることが多いです。Polars が入っていない場合は、次のようにインストールします。

```python
!pip install polars
```

例えば、次のコードはそのまま実行できます。

```python
import polars as pl

data = {
    "name": ["Sato", "Suzuki", "Tanaka"],
    "score": [80, 65, 90],
}

df = pl.DataFrame(data)
print(df)
```

## ファイルを使う

CSV ファイルなどを使う場合は、Colab の左側にあるファイルアイコンからアップロードできます。

アップロードしたファイルは、ノートブックから次のように読み込めます。

```python
import polars as pl

df = pl.read_csv("scores.csv")
print(df.head())
```

アップロードしたファイルは、Colab の接続が切れると消えることがあります。必要なファイルは、配布されたノートブックや Google Drive に残しておくと安心です。

## VS Codeを使う場合

VS Code は、この講習を受けるためには必須ではありません。

ただし、講習後に自分のPCで `.py` ファイルを書いたり、複数のファイルをまとめて管理したり、GitHub を使ったりする場合には便利です。

もちろん VsCodeやローカル環境でやってもらってもいいです。
