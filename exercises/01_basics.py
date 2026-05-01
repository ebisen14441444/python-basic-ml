"""Python基本文法の演習です。

TODOを埋めてから、次のコマンドで実行してください。

python exercises/01_basics.py
"""


def judge_score(score):
    """点数が60点以上なら 'pass'、それ以外なら 'fail' を返す。"""
    # TODO: if文を使って実装してください
    return None


def average(numbers):
    """数値リストの平均値を返す。"""
    # TODO: sum と len を使って実装してください
    return None


scores = [80, 55, 72, 90]

print("判定:")
for score in scores:
    print(score, judge_score(score))

print("平均:", average(scores))
