#!/bin/bash

set -e

# ── Config ────────────────────────────────────────────
DATE=$(date '+%Y-%m-%d')
YEAR=$(date '+%Y')
MONTH=$(date '+%m')
DAY=$(date '+%d')

LOGS_DIR="./logs"
TEMPLATE_DIR="./scripts/template"
INDEX="./index.md"

YEAR_DIR="$LOGS_DIR/$YEAR"
MONTH_DIR="$YEAR_DIR/$MONTH"
DAY_DIR="$MONTH_DIR/$DAY"

# ── Guard ─────────────────────────────────────────────
if [ -f "$DAY_DIR/$YEAR-$MONTH-$DAY.md" ]; then
    echo "Log for $DATE already exists, skipping."
    exit 0
fi

# ── Helpers ───────────────────────────────────────────
insert_before_last_2_lines() {
    local file="$1"
    local line="$2"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "Error: File $file does not exist"
        return 1
    fi
    
    # Check if file has at least 2 lines
    local line_count=$(wc -l < "$file")
    if [ "$line_count" -lt 2 ]; then
        echo "Error: File $file has fewer than 2 lines"
        return 1
    fi
    
    local insert_at=$(( line_count - 2 ))
    sed -i "" "${insert_at}a\\"$'\n'"${line}"$'\n' "$file"
}

# ── Create year ───────────────────────────────────────
create_year() {
    [ -f "$LOGS_DIR/$YEAR.md" ] && return

    mkdir -p "$YEAR_DIR"

    sed "s/{{year}}/$YEAR/g" "$TEMPLATE_DIR/year.md" > "$YEAR_DIR/$YEAR.md"

    insert_before_last_2_lines "$INDEX" "- [$YEAR]($LOGS_DIR/$YEAR/$YEAR.md)"

    echo "Created year $YEAR"
}

# ── Create month ──────────────────────────────────────
create_month() {
    [ -f "$YEAR_DIR/$YEAR-$MONTH.md" ] && return

    mkdir -p "$MONTH_DIR"

    sed -e "s/{{year}}/$YEAR/g" \
        -e "s/{{month}}/$MONTH/g" \
        "$TEMPLATE_DIR/month.md" > "$MONTH_DIR/$YEAR-$MONTH.md"

    insert_before_last_2_lines "$YEAR_DIR/$YEAR.md" "- [$YEAR-$MONTH](./$MONTH/$YEAR-$MONTH.md)"

    echo "Created month $YEAR/$MONTH"
}

# ── Create day ────────────────────────────────────────
create_day() {
    mkdir -p "$DAY_DIR"

    sed -e "s/{{year}}/$YEAR/g" \
        -e "s/{{month}}/$MONTH/g" \
        -e "s/{{date}}/$DAY/g" \
        "$TEMPLATE_DIR/date.md" > "$DAY_DIR/$YEAR-$MONTH-$DAY.md"

    insert_before_last_2_lines "$MONTH_DIR/$YEAR-$MONTH.md" "- [$DATE](./$DAY/$YEAR-$MONTH-$DAY.md)"

    echo "Created day $DATE"
}

# ── Main ──────────────────────────────────────────────
create_year
create_month
create_day