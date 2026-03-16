#!/bin/bash

set -e

# ── Config ────────────────────────────────────────────
LOGS_DIR="./logs"
TEMPLATE_DIR="./temp/template"
INDEX="./index.md"

# ── Helpers ───────────────────────────────────────────
insert_before_last_2_lines() {
    local file="$1"
    local line="$2"
    local insert_at=$(( $(wc -l < "$file") - 2 ))
    sed -i "" -e "${insert_at}a\\"$'\n'"${line}"$'\n' "$file"
}

# ── Ensure year index exists ──────────────────────────
ensure_year() {
    local year="$1"
    local year_dir="$LOGS_DIR/$year"

    [ -d "$year_dir" ] && return

    mkdir -p "$year_dir"
    sed "s/{{year}}/$year/g" "$TEMPLATE_DIR/year.md" > "$year_dir/index.md"
    insert_before_last_2_lines "$INDEX" "- [$year]($LOGS_DIR/$year/index.md)"

    echo "Created year $year"
}

# ── Ensure month index exists ─────────────────────────
ensure_month() {
    local year="$1"
    local month="$2"
    local month_dir="$LOGS_DIR/$year/$month"

    [ -d "$month_dir" ] && return

    mkdir -p "$month_dir"
    sed -e "s/{{year}}/$year/g" \
        -e "s/{{month}}/$month/g" \
        "$TEMPLATE_DIR/month.md" > "$month_dir/index.md"
    insert_before_last_2_lines "$LOGS_DIR/$year/index.md" "- [$year-$month](./$month/index.md)"

    echo "Created month $year/$month"
}

# ── Migrate a single log folder ───────────────────────
migrate_log() {
    local folder="$1"
    local name=$(basename "$folder")

    # Skip if not in YYYY-MM-DD format
    if [[ ! "$name" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        return
    fi

    local year="${name:0:4}"
    local month="${name:5:2}"
    local day="${name:8:2}"
    local new_dir="$LOGS_DIR/$year/$month/$day"

    ensure_year "$year"
    ensure_month "$year" "$month"

    # Move contents into new structure
    mkdir -p "$new_dir"
    cp -r "$folder"/* "$new_dir/" 2>/dev/null || true
    rm -rf "$folder"

    insert_before_last_2_lines "$LOGS_DIR/$year/$month/index.md" "- [$name](./$day/index.md)"

    echo "Migrated $name → $year/$month/$day"
}

# ── Main ──────────────────────────────────────────────
echo "Starting migration..."

for folder in "$LOGS_DIR"/????-??-??; do
    migrate_log "$folder"
done

echo "Migration complete."