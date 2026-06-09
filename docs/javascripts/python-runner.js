(function () {
  const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/";
  const PYODIDE_POLARS_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/dev/full/";

  let pyodidePromise = null;
  let numpyPromise = null;
  let polarsPromise = null;
  let pillowPromise = null;
  let imageFixturePromise = null;
  let csvFixturePromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (window.loadPyodide) {
          resolve();
        }
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  }

  async function getPyodide() {
    if (!pyodidePromise) {
      pyodidePromise = (async () => {
        const indexURL = isPolarsPage() ? PYODIDE_POLARS_INDEX_URL : PYODIDE_INDEX_URL;
        await loadScript(`${indexURL}pyodide.js`);
        return window.loadPyodide({ indexURL });
      })();
    }

    return pyodidePromise;
  }

  function isNumpyPage() {
    return /\/(08_numpy_basics|09_numpy_multidim|10_numpy_indexing|11_numpy_calculation)\/?(index\.html)?$/.test(window.location.pathname);
  }

  function isImagePage() {
    return /\/11_numpy_calculation\/?(index\.html)?$/.test(window.location.pathname);
  }

  function isPolarsPage() {
    return /\/(12_polars_basics|13_polars_select_filter|14_polars_multiple_select|15_polars_timeseries)\/?(index\.html)?$/.test(window.location.pathname);
  }

  async function preparePackages(pyodide) {
    if (!isNumpyPage()) {
      return;
    }

    if (!numpyPromise) {
      numpyPromise = pyodide.loadPackage("numpy");
    }

    await numpyPromise;

    if (!isImagePage()) {
      return;
    }

    if (!pillowPromise) {
      pillowPromise = pyodide.loadPackage("pillow");
    }

    await pillowPromise;

    if (!imageFixturePromise) {
      imageFixturePromise = (async () => {
        const imageUrl = new URL("../images/numpy_rgb/astronaut_original.png", window.location.href);
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error("画像ファイルを読み込めませんでした。");
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        pyodide.FS.writeFile("/astronaut_original.png", bytes);
      })();
    }

    await imageFixturePromise;
  }

  async function preparePolars(pyodide) {
    if (!isPolarsPage()) {
      return;
    }

    if (!polarsPromise) {
      polarsPromise = pyodide.loadPackage("polars");
    }

    await polarsPromise;

    if (!csvFixturePromise) {
      csvFixturePromise = (async () => {
        pyodide.FS.mkdirTree("/examples");
        pyodide.FS.mkdirTree("examples");
        for (const filename of ["penguins.csv", "flights.csv", "seattle-weather.csv", "scores.csv"]) {
          const csvUrl = new URL(`../data/${filename}`, window.location.href);
          const response = await fetch(csvUrl);
          if (!response.ok) {
            throw new Error(`${filename} を読み込めませんでした。`);
          }
          const csvText = await response.text();
          pyodide.FS.writeFile(`/examples/${filename}`, csvText);
          pyodide.FS.writeFile(`examples/${filename}`, csvText);
        }
      })();
    }

    await csvFixturePromise;
  }

  function getPolarsSetupSource() {
    if (!isPolarsPage()) {
      return "";
    }

    return `
import csv as __runner_csv
import random as runner_random
import re as runner_re
import sys as __runner_sys
import types as __runner_types
import numpy as np

class RunnerDType:
    def __init__(self, name):
        self.name = name

class RunnerSelector:
    def __init__(self, kind):
        self.kind = kind

    def fill_null(self, value):
        return RunnerAllFillNull(value)

class RunnerAllFillNull:
    def __init__(self, value):
        self.value = value

class RunnerExpr:
    def __init__(self, func, name=None, row_filter=None):
        self.func = func
        self.name = name
        self.row_filter = row_filter

    def eval(self, df):
        return self.func(df)

    def alias(self, name):
        self.name = name
        return self

    def _binary(self, other, op):
        if isinstance(other, RunnerExpr):
            return RunnerExpr(lambda df: [op(a, b) if a is not None and b is not None else None for a, b in zip(self.eval(df), other.eval(df))])
        return RunnerExpr(lambda df: [op(a, other) if a is not None else None for a in self.eval(df)])

    def __add__(self, other):
        return self._binary(other, lambda a, b: a + b)

    def __radd__(self, other):
        return self.__add__(other)

    def __truediv__(self, other):
        return self._binary(other, lambda a, b: a / b)

    def __ge__(self, other):
        return self._binary(other, lambda a, b: a >= b)

    def __gt__(self, other):
        return self._binary(other, lambda a, b: a > b)

    def __eq__(self, other):
        return self._binary(other, lambda a, b: a == b)

    def __and__(self, other):
        return RunnerExpr(lambda df: [bool(a) and bool(b) for a, b in zip(self.eval(df), other.eval(df))])

    def is_in(self, values):
        value_set = set(values)
        return RunnerExpr(lambda df: [value in value_set for value in self.eval(df)])

    def fill_null(self, value):
        return RunnerExpr(lambda df: [value if item is None else item for item in self.eval(df)], name=self.name)

    def cast(self, dtype):
        def convert(value):
            if value is None:
                return None
            if dtype.name == "Float64":
                return float(value)
            if dtype.name == "Int64":
                return int(value)
            if dtype.name == "String":
                return str(value)
            if dtype.name == "Categorical":
                return str(value)
            return value
        return RunnerExpr(lambda df: [convert(value) for value in self.eval(df)], name=self.name)

    def filter(self, condition):
        return RunnerExpr(self.func, name=self.name, row_filter=condition)

    def mean(self):
        return RunnerAggExpr(self, "mean")

    def max(self):
        return RunnerAggExpr(self, "max")

    def sum(self):
        return RunnerAggExpr(self, "sum")

    @property
    def str(self):
        return RunnerStringNamespace(self)

    @property
    def dt(self):
        return RunnerDateNamespace(self)

    @property
    def list(self):
        return RunnerListNamespace(self)

class RunnerStringNamespace:
    def __init__(self, expr):
        self.expr = expr

    def len_chars(self):
        return RunnerExpr(lambda df: [len(value) if value is not None else None for value in self.expr.eval(df)], name=self.expr.name)

    def split(self, sep):
        return RunnerExpr(lambda df: [value.split(sep) if value is not None else None for value in self.expr.eval(df)], name=self.expr.name)

    def extract(self, pattern, group_index=1):
        def extract_value(value):
            if value is None:
                return None
            match = runner_re.search(pattern, value)
            return match.group(group_index) if match else None
        return RunnerExpr(lambda df: [extract_value(value) for value in self.expr.eval(df)], name=self.expr.name)

    def to_date(self):
        return RunnerExpr(lambda df: self.expr.eval(df), name=self.expr.name)

class RunnerDateNamespace:
    def __init__(self, expr):
        self.expr = expr

    def year(self):
        return RunnerExpr(lambda df: [int(str(value)[:4]) if value is not None else None for value in self.expr.eval(df)], name=self.expr.name)

    def month(self):
        return RunnerExpr(lambda df: [int(str(value)[5:7]) if value is not None else None for value in self.expr.eval(df)], name=self.expr.name)

    def day(self):
        return RunnerExpr(lambda df: [int(str(value)[8:10]) if value is not None else None for value in self.expr.eval(df)], name=self.expr.name)

class RunnerListNamespace:
    def __init__(self, expr):
        self.expr = expr

    def first(self):
        return RunnerExpr(lambda df: [value[0] if value else None for value in self.expr.eval(df)], name=self.expr.name)

class RunnerWhen:
    def __init__(self, cases, condition):
        self.cases = cases
        self.condition = condition

    def then(self, value):
        value_expr = value if isinstance(value, RunnerExpr) else runner_lit(value)
        return RunnerWhenChain(self.cases + [(self.condition, value_expr)])

class RunnerWhenChain:
    def __init__(self, cases):
        self.cases = cases

    def when(self, condition):
        return RunnerWhen(self.cases, condition)

    def otherwise(self, value):
        fallback = value if isinstance(value, RunnerExpr) else runner_lit(value)
        return RunnerExpr(lambda df: self._eval(df, fallback))

    def alias(self, name):
        return self.otherwise(None).alias(name)

    def _eval(self, df, fallback):
        case_masks = [(condition.eval(df), value.eval(df)) for condition, value in self.cases]
        fallback_values = fallback.eval(df)
        results = []
        for index in range(len(df._records)):
            selected = fallback_values[index]
            for mask, values in case_masks:
                if mask[index]:
                    selected = values[index]
                    break
            results.append(selected)
        return results

class RunnerAggExpr:
    def __init__(self, source_expr, agg_name, name=None):
        self.source_expr = source_expr
        self.agg_name = agg_name
        self.name = name or f"{source_expr.name}_{agg_name}"

    def alias(self, name):
        self.name = name
        return self

    def eval_group(self, rows):
        group_df = RunnerDataFrame.from_records(rows)
        values = self.source_expr.eval(group_df)
        if self.source_expr.row_filter is not None:
            mask = self.source_expr.row_filter.eval(group_df)
            values = [value for value, keep in zip(values, mask) if keep]
        values = [value for value in values if value is not None]
        if self.agg_name == "mean":
            return sum(values) / len(values) if values else None
        if self.agg_name == "max":
            return max(values) if values else None
        if self.agg_name == "sum":
            return sum(values) if values else None
        raise NotImplementedError(f"{self.agg_name} is not supported in this runner.")

class RunnerGroupBy:
    def __init__(self, df, keys):
        self.df = df
        self.keys = [keys] if isinstance(keys, str) else list(keys)

    def agg(self, expr):
        exprs = expr if isinstance(expr, list) else [expr]
        groups = {}
        for row in self.df._records:
            key = tuple(row.get(column) for column in self.keys)
            groups.setdefault(key, []).append(row)

        records = []
        for key, rows in groups.items():
            record = {column: value for column, value in zip(self.keys, key)}
            for agg_expr in exprs:
                record[agg_expr.name] = agg_expr.eval_group(rows)
            records.append(record)

        return RunnerDataFrame.from_records(records)

class RunnerDataFrame:
    def __init__(self, data):
        self._columns = list(data.keys())
        values = list(data.values())
        self._records = [dict(zip(self._columns, row)) for row in zip(*values)] if values else []

    @classmethod
    def from_records(cls, records):
        df = cls({})
        df._records = list(records)
        df._columns = list(records[0].keys()) if records else []
        return df

    @property
    def shape(self):
        return (len(self._records), len(self._columns))

    @property
    def columns(self):
        return list(self._columns)

    @property
    def schema(self):
        schema = {}
        for column in self._columns:
            value = next((row[column] for row in self._records if row.get(column) is not None), None)
            if isinstance(value, bool):
                schema[column] = "Boolean"
            elif isinstance(value, int):
                schema[column] = "Int64"
            elif isinstance(value, float):
                schema[column] = "Float64"
            else:
                schema[column] = "String"
        return schema

    def head(self, n=5):
        return RunnerDataFrame.from_records(self._records[:n])

    def tail(self, n=5):
        return RunnerDataFrame.from_records(self._records[-n:])

    def sample(self, n=None, fraction=None):
        if n is None and fraction is None:
            n = 1
        if fraction is not None:
            n = int(len(self._records) * fraction)
        n = max(0, min(int(n), len(self._records)))
        records = runner_random.Random(0).sample(self._records, n)
        return RunnerDataFrame.from_records(records)

    def drop_nulls(self):
        return RunnerDataFrame.from_records([
            row for row in self._records
            if all(row.get(column) is not None for column in self._columns)
        ])

    def select(self, columns):
        if isinstance(columns, RunnerSelector):
            if columns.kind == "all":
                columns = list(self._columns)
            elif columns.kind == "numeric":
                columns = [
                    column for column in self._columns
                    if any(isinstance(row.get(column), (int, float)) and not isinstance(row.get(column), bool) for row in self._records)
                ]
        if isinstance(columns, RunnerAllFillNull):
            return RunnerDataFrame({
                column: [columns.value if row.get(column) is None else row.get(column) for row in self._records]
                for column in self._columns
            })
        if isinstance(columns, RunnerExpr):
            values = columns.eval(self)
            name = columns.name or "literal"
            return RunnerDataFrame({name: values})
        if isinstance(columns, str):
            columns = [columns]
        data = {}
        for column in columns:
            if isinstance(column, RunnerExpr):
                data[column.name or "literal"] = column.eval(self)
            else:
                data[column] = [row.get(column) for row in self._records]
        return RunnerDataFrame(data)

    def filter(self, expr):
        mask = expr.eval(self)
        return RunnerDataFrame.from_records([row for row, keep in zip(self._records, mask) if keep])

    def with_columns(self, expr):
        records = [dict(row) for row in self._records]
        if isinstance(expr, list):
            result = self
            for item in expr:
                result = result.with_columns(item)
            return result
        values = expr.eval(self)
        name = expr.name or "column"
        for row, value in zip(records, values):
            row[name] = value
        result = RunnerDataFrame.from_records(records)
        if name not in result._columns:
            result._columns.append(name)
        return result

    def sort(self, column, descending=False):
        if isinstance(column, list):
            desc = descending if isinstance(descending, list) else [descending] * len(column)
            records = list(self._records)
            for sort_column, sort_desc in reversed(list(zip(column, desc))):
                records = sorted(records, key=lambda row: (row.get(sort_column) is None, row.get(sort_column)), reverse=sort_desc)
            return RunnerDataFrame.from_records(records)
        records = sorted(self._records, key=lambda row: (row.get(column) is None, row.get(column)), reverse=descending)
        return RunnerDataFrame.from_records(records)

    def group_by(self, keys):
        return RunnerGroupBy(self, keys)

    def group_by_dynamic(self, index_column, every, period=None, closed="left"):
        return RunnerDynamicGroupBy(self, index_column, every)

    def join(self, other, on=None, how="inner", coalesce=False):
        if how == "cross":
            records = []
            for left in self._records:
                for right in other._records:
                    records.append(self._merge_rows(left, right, []))
            return RunnerDataFrame.from_records(records)

        keys = [on] if isinstance(on, str) else list(on)
        right_index = {}
        for row in other._records:
            right_index.setdefault(self._row_key(row, keys), []).append(row)

        if how == "semi":
            return RunnerDataFrame.from_records([row for row in self._records if self._row_key(row, keys) in right_index])
        if how == "anti":
            return RunnerDataFrame.from_records([row for row in self._records if self._row_key(row, keys) not in right_index])

        records = []
        matched_right_ids = set()
        for left in self._records:
            matches = right_index.get(self._row_key(left, keys), [])
            if matches:
                for right in matches:
                    matched_right_ids.add(id(right))
                    records.append(self._merge_rows(left, right, keys))
            elif how in ("left", "full"):
                records.append(self._merge_rows(left, None, keys, other_columns=other._columns))

        if how == "full":
            for right in other._records:
                if id(right) not in matched_right_ids:
                    records.append(self._merge_rows(None, right, keys, left_columns=self._columns))

        return RunnerDataFrame.from_records(records)

    def join_asof(self, other, on):
        records = []
        right_rows = sorted(other._records, key=lambda row: row.get(on))
        for left in sorted(self._records, key=lambda row: row.get(on)):
            candidates = [row for row in right_rows if row.get(on) is not None and row.get(on) <= left.get(on)]
            right = candidates[-1] if candidates else None
            records.append(self._merge_rows(left, right, [on], other_columns=other._columns))
        return RunnerDataFrame.from_records(records)

    def join_where(self, other, predicate):
        records = []
        for left in self._records:
            for right in other._records:
                merged = self._merge_rows(left, right, [])
                test_df = RunnerDataFrame.from_records([merged])
                if predicate.eval(test_df)[0]:
                    records.append(merged)
        return RunnerDataFrame.from_records(records)

    def _row_key(self, row, keys):
        return tuple(row.get(key) for key in keys)

    def _merge_rows(self, left, right, keys, left_columns=None, other_columns=None):
        record = {}
        left_columns = left_columns or self._columns
        other_columns = other_columns or []
        if left is None:
            for column in left_columns:
                record[column] = right.get(column) if column in keys else None
        else:
            record.update(left)
        if right is None:
            for column in other_columns:
                if column not in keys and column not in record:
                    record[column] = None
            return record
        for column, value in right.items():
            if column in keys:
                if column not in record:
                    record[column] = value
                continue
            name = column if column not in record else f"{column}_right"
            record[name] = value
        return record

    def to_numpy(self):
        return np.array([[row.get(column) for column in self._columns] for row in self._records], dtype=object)

    def describe(self):
        rows = []
        stats = ["count", "null_count", "mean", "std", "min", "25%", "50%", "75%", "max"]
        column_info = []
        for column in self._columns:
            non_null = [row.get(column) for row in self._records if row.get(column) is not None]
            numeric = [value for value in non_null if isinstance(value, (int, float)) and not isinstance(value, bool)]
            is_numeric = len(numeric) == len(non_null) and len(non_null) > 0
            column_info.append((column, non_null, numeric, is_numeric))

        def quantile_nearest(values, q):
            sorted_values = sorted(float(value) for value in values)
            index = int(np.floor(q * (len(sorted_values) - 1) + 0.5))
            return sorted_values[index]

        for stat in stats:
            row = {"statistic": stat}
            for column, non_null, numeric, is_numeric in column_info:
                if stat == "count":
                    row[column] = float(len(non_null)) if is_numeric else len(non_null)
                elif stat == "null_count":
                    null_count = len(self._records) - len(non_null)
                    row[column] = float(null_count) if is_numeric else null_count
                elif stat == "mean":
                    row[column] = float(np.array(numeric, dtype=float).mean()) if is_numeric else None
                elif stat == "std":
                    row[column] = float(np.array(numeric, dtype=float).std(ddof=1)) if is_numeric and len(numeric) > 1 else None
                elif stat == "min":
                    row[column] = min(non_null) if non_null else None
                elif stat == "25%":
                    row[column] = quantile_nearest(numeric, 0.25) if is_numeric else None
                elif stat == "50%":
                    row[column] = quantile_nearest(numeric, 0.50) if is_numeric else None
                elif stat == "75%":
                    row[column] = quantile_nearest(numeric, 0.75) if is_numeric else None
                elif stat == "max":
                    row[column] = max(non_null) if non_null else None
            rows.append(row)

        result = RunnerDataFrame.from_records(rows)
        result._columns = ["statistic"] + [column for column, _, _, _ in column_info]
        return result

    def __getitem__(self, item):
        if isinstance(item, slice):
            return RunnerDataFrame.from_records(self._records[item])
        raise TypeError("This runner supports DataFrame slicing only.")

    def __repr__(self):
        lines = [f"shape: {self.shape}"]
        visible = self._records[:10]
        header = " | ".join(self._columns)
        lines.append(header)
        lines.append("-" * len(header))
        for row in visible:
            lines.append(" | ".join("null" if row.get(column) is None else str(row.get(column)) for column in self._columns))
        if len(self._records) > len(visible):
            lines.append("...")
        return "\\n".join(lines)

def __runner_parse_value(value):
    if value == "":
        return None
    if value in ("true", "True", "TRUE"):
        return True
    if value in ("false", "False", "FALSE"):
        return False
    try:
        if "." in value:
            return float(value)
        return int(value)
    except ValueError:
        return value

def __runner_read_csv(path):
    with open("/" + path.lstrip("/"), newline="") as f:
        rows = [
            {key: __runner_parse_value(value) for key, value in row.items()}
            for row in __runner_csv.DictReader(f)
        ]
    return RunnerDataFrame.from_records(rows)

def __runner_col(name):
    return RunnerExpr(lambda df: [row.get(name) for row in df._records], name=name)

def runner_lit(value):
    return RunnerExpr(lambda df: [value for _ in df._records], name="literal")

def __runner_date(year, month, day):
    year_expr = year if isinstance(year, RunnerExpr) else runner_lit(year)
    month_expr = month if isinstance(month, RunnerExpr) else runner_lit(month)
    day_expr = day if isinstance(day, RunnerExpr) else runner_lit(day)
    return RunnerExpr(
        lambda df: [
            f"{int(y):04d}-{int(m):02d}-{int(d):02d}"
            if y is not None and m is not None and d is not None else None
            for y, m, d in zip(year_expr.eval(df), month_expr.eval(df), day_expr.eval(df))
        ],
        name="date",
    )

def __runner_when(condition):
    return RunnerWhen([], condition)

def __runner_all():
    return RunnerSelector("all")

def __runner_numeric():
    return RunnerSelector("numeric")

def __runner_concat(dfs):
    records = []
    for df in dfs:
        records.extend(df._records)
    return RunnerDataFrame.from_records(records)

class RunnerDynamicGroupBy:
    def __init__(self, df, index_column, every):
        self.df = df
        self.index_column = index_column
        self.every = every

    def agg(self, expr):
        exprs = expr if isinstance(expr, list) else [expr]
        groups = {}
        for row in self.df._records:
            value = row.get(self.index_column)
            if self.every == "1y":
                key = f"{str(value)[:4]}-01-01"
            elif self.every == "3mo":
                month = int(str(value)[5:7])
                quarter_month = ((month - 1) // 3) * 3 + 1
                key = f"{str(value)[:4]}-{quarter_month:02d}-01"
            else:
                key = f"{str(value)[:7]}-01"
            groups.setdefault(key, []).append(row)
        records = []
        for key, rows in sorted(groups.items()):
            record = {self.index_column: key}
            for agg_expr in exprs:
                record[agg_expr.name] = agg_expr.eval_group(rows)
            records.append(record)
        return RunnerDataFrame.from_records(records)

__runner_polars = __runner_types.ModuleType("polars")
__runner_selectors = __runner_types.ModuleType("polars.selectors")
__runner_polars.__version__ = "runner-shim"
__runner_polars.DataFrame = RunnerDataFrame
__runner_polars.read_csv = __runner_read_csv
__runner_polars.col = __runner_col
__runner_polars.lit = runner_lit
__runner_polars.date = __runner_date
__runner_polars.when = __runner_when
__runner_polars.all = __runner_all
__runner_polars.Float64 = RunnerDType("Float64")
__runner_polars.Int64 = RunnerDType("Int64")
__runner_polars.String = RunnerDType("String")
__runner_polars.Categorical = RunnerDType("Categorical")
__runner_polars.concat = __runner_concat
__runner_selectors.numeric = __runner_numeric
__runner_sys.modules["polars"] = __runner_polars
__runner_sys.modules["polars.selectors"] = __runner_selectors
`;
  }

  function runCode(pyodide, source) {
    const setupParts = [];

    if (isImagePage()) {
      setupParts.push(`
import numpy as np
from PIL import Image

image = np.array(Image.open("/astronaut_original.png").convert("RGB"))
`);
    }

    const setupSource = setupParts.join("\n");

    const wrappedSource = `
import contextlib
import base64
import io
import json
import traceback

__runner_code = ${JSON.stringify(source)}
__runner_setup = ${JSON.stringify(setupSource)}
__runner_output = io.StringIO()
__runner_globals = {}

try:
    with contextlib.redirect_stdout(__runner_output):
        exec(__runner_setup, __runner_globals, __runner_globals)
        exec(__runner_code, __runner_globals, __runner_globals)
except Exception:
    __runner_payload = {
        "ok": False,
        "output": traceback.format_exc(),
    }
else:
    __runner_images = []
    if "Image" in __runner_globals:
        __runner_image_class = __runner_globals["Image"]
        for __runner_name in ["inverted", "bright", "shifted", "gray"]:
            if __runner_name not in __runner_globals:
                continue

            __runner_array = __runner_globals[__runner_name]
            if not hasattr(__runner_array, "ndim"):
                continue

            if __runner_array.ndim == 2:
                __runner_image = __runner_image_class.fromarray(__runner_array.astype("uint8"), mode="L")
            elif __runner_array.ndim == 3 and __runner_array.shape[2] == 3:
                __runner_image = __runner_image_class.fromarray(__runner_array.astype("uint8"), mode="RGB")
            else:
                continue

            __runner_buffer = io.BytesIO()
            __runner_image.save(__runner_buffer, format="PNG")
            __runner_images.append({
                "name": __runner_name,
                "src": "data:image/png;base64," + base64.b64encode(__runner_buffer.getvalue()).decode("ascii"),
            })

    __runner_payload = {
        "ok": True,
        "output": __runner_output.getvalue(),
        "images": __runner_images,
    }

json.dumps(__runner_payload, ensure_ascii=False)
`;

    return pyodide.runPythonAsync(wrappedSource);
  }

  function createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "python-runner-toolbar";

    const button = document.createElement("button");
    button.className = "python-runner-button";
    button.type = "button";
    button.setAttribute("aria-label", "このコードを実行する");

    const icon = document.createElement("span");
    icon.className = "python-runner-play";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    label.textContent = "Run";

    const status = document.createElement("span");
    status.className = "python-runner-status";
    status.textContent = "未実行";

    button.append(icon, label);
    toolbar.append(button, status);

    return { toolbar, button, status };
  }

  function createOutput() {
    const output = document.createElement("div");
    output.className = "python-runner-output";
    output.hidden = true;

    const text = document.createElement("pre");
    text.className = "python-runner-output-text";

    const code = document.createElement("code");
    text.appendChild(code);

    const images = document.createElement("div");
    images.className = "python-runner-images";

    output.append(text, images);

    return { output, code, images };
  }

  function enhanceBlock(codeBlock) {
    const pre = codeBlock.closest("pre");
    if (!pre || pre.dataset.pythonRunner === "true") {
      return;
    }

    pre.dataset.pythonRunner = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "python-runner";

    const parent = pre.parentElement;
    parent.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const { toolbar, button, status } = createToolbar();
    const { output, code, images } = createOutput();

    wrapper.insertBefore(toolbar, pre);
    wrapper.appendChild(output);

    button.addEventListener("click", async () => {
      const source = codeBlock.textContent.replace(/\n$/, "");

      button.disabled = true;
      status.textContent = "実行中";
      output.hidden = false;
      images.innerHTML = "";
      code.textContent = "Python を準備しています...";

      try {
        const pyodide = await getPyodide();
        if (isNumpyPage()) {
          code.textContent = "NumPy を準備しています...";
        }
        if (isImagePage()) {
          code.textContent = "画像を準備しています...";
        }
        await preparePackages(pyodide);
        if (isPolarsPage()) {
          code.textContent = "Polars を準備しています...";
        }
        await preparePolars(pyodide);
        code.textContent = "実行しています...";

        const result = JSON.parse(await runCode(pyodide, source));
        code.textContent = result.output.trimEnd() || "(出力なし)";
        images.innerHTML = "";
        if (result.images && result.images.length > 0) {
          result.images.forEach((image) => {
            const figure = document.createElement("figure");
            figure.className = "python-runner-image";

            const img = document.createElement("img");
            img.src = image.src;
            img.alt = `${image.name} の実行結果`;

            const caption = document.createElement("figcaption");
            caption.textContent = image.name;

            figure.append(img, caption);
            images.appendChild(figure);
          });
        }
        status.textContent = result.ok ? "完了" : "エラー";
      } catch (error) {
        code.textContent = error && error.message ? error.message : String(error);
        status.textContent = "エラー";
      } finally {
        button.disabled = false;
      }
    });
  }

  function initPythonRunner() {
    if (!/\/(01_python_basics|02_data_structures|03_control_flow|04_functions|05_objects|06_classes|07_python_extras|08_numpy_basics|09_numpy_multidim|10_numpy_indexing|11_numpy_calculation|12_polars_basics|13_polars_select_filter|14_polars_multiple_select|15_polars_timeseries)\/?(index\.html)?$/.test(window.location.pathname)) {
      return;
    }

    document.querySelectorAll("pre > code.language-python").forEach(enhanceBlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPythonRunner);
  } else {
    initPythonRunner();
  }
})();
