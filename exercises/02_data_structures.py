"""リストと辞書の演習です。"""

students = [
    {"name": "Sato", "math": 80, "english": 72},
    {"name": "Suzuki", "math": 55, "english": 68},
    {"name": "Tanaka", "math": 90, "english": 86},
]


def add_average(student):
    """student辞書に average キーを追加して返す。"""
    # TODO: math と english の平均を計算して追加してください
    return student


def passed_students(students):
    """平均点が60点以上の学生だけを返す。"""
    results = []
    for student in students:
        # TODO: 条件を追加してください
        results.append(student)
    return results


students_with_average = []
for student in students:
    students_with_average.append(add_average(student))

print(students_with_average)
print(passed_students(students_with_average))
