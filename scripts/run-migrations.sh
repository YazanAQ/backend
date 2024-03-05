#!/usr/bin/env bash
set -eu

# Wait for DNS resolution
sleep 5

node dist/bin/migrate.js
