#!/usr/bin/env bash

# If we have modified src/ files that do not end in `.test.ts`,
# rebuild the docs and add a commit.
git diff --name-only master..HEAD \
  | grep -Ei 'src/.*.ts' \
  | if grep -Eivq 'src/.*.test.ts'; then \
      yarn docs; \
      git add docs/*; \
      git commit -m 'updated docs'; \
    fi
