PYTHON := .venv/bin/python
PIP := .venv/bin/pip

.PHONY: install install-site serve build

.venv/bin/python:
	python3 -m venv .venv

install: .venv/bin/python
	$(PIP) install -r requirements.txt

.venv/.site-deps: requirements-site.txt .venv/bin/python
	$(PIP) install -r requirements-site.txt
	/usr/bin/touch .venv/.site-deps

install-site: .venv/.site-deps

serve: .venv/.site-deps
	$(PYTHON) -m mkdocs serve

build: .venv/.site-deps
	$(PYTHON) -m mkdocs build
