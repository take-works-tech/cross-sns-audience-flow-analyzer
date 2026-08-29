# Makefile for cross-sns-audience-flow-analyzer — common dev targets (language-aware).
.PHONY: help install dev test lint build clean

help: ## List targets with descriptions
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm ci

dev: ## Set up dev environment / project-specific dev command (see README for language variant)
	npm run dev

test: ## Run test suite
	npm test --silent

lint: ## Run lint / type-check gate
	npm ci && npx eslint . --max-warnings 0 && npx tsc --noEmit

build: ## Build artifacts
	npm run build

clean: ## Remove build artifacts and caches
	rm -rf build/ dist/ node_modules/.cache/ __pycache__/ .pytest_cache/ .mypy_cache/ .ruff_cache/
