# 00. 環境準備 ローカル環境版

このファイルは、当初の `docs/00_setup.md` の内容を退避したものです。
Google Colab を標準環境にするため、サイト上の環境準備ページからは一度外しています。

## この講習で使うもの

- Python 3.10以上
- ターミナル
- テキストエディタまたはVS Code
- NumPy、Pandas、Matplotlib

## Pythonの確認

ターミナルで次を実行します。

```bash
python3 --version
```

`Python 3.x.x` と表示されればOKです。

## 仮想環境の作成

プロジェクトごとにライブラリを分けるため、仮想環境を使います。

```bash
python3 -m venv .venv
source .venv/bin/activate
```

有効化できると、ターミナルの左側に `(.venv)` のような表示が出ます。

## ライブラリのインストール

```bash
pip install -r requirements.txt
```

## Pythonファイルの実行

```bash
python examples/mini_analysis.py
```

## よくあるエラー

### `command not found: python`

macOSでは `python` ではなく `python3` を使うことが多いです。

### `ModuleNotFoundError`

ライブラリが入っていない、または仮想環境が有効になっていない可能性があります。

```bash
source .venv/bin/activate
pip install -r requirements.txt
```
