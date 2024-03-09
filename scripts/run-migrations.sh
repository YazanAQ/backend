#!/usr/bin/env bash
set -eu

# Wait for DNS resolution
sleep 5

node dist/database/bin/migrate.js
