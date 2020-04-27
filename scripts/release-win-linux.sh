#!/usr/bin/env bash

set -e

yarn --link-duplicates --pure-lockfile
yarn release --linux --win
