#!/usr/bin/env bash
set -x

SCRIPT_PATH=$(dirname "$(realpath -s "$0")")
TEST_DIR="$(mktemp -d)"

echo "TEST_DIR: ${TEST_DIR}"
echo "PWD: ${PWD}"
echo "SCRIPT_PATH: ${SCRIPT_PATH}"

yes "" | "$(npm init svelte@next "${TEST_DIR}")"
# yes "" | "$(npm init svelte@1.0.0-next.232 "${TEST_DIR}")"
cp -a "${SCRIPT_PATH}"/overwrites/. "${TEST_DIR}"

pushd $TEST_DIR

set -e

npm i
npm i "${SCRIPT_PATH}/../"

# These are peer dependencies that need manual install since we install from folder instead of from npm registry
npm install polka@1.0.0-next.22 compression@^1.7.4

npm run build

popd
npx start-server-and-test "node ${TEST_DIR}/.appengine_build_output/index.js" http://localhost:8080/todos "TEST_DIR=${TEST_DIR}/ mocha ${SCRIPT_PATH}/../tests/test.js"

# To test on real appengine instance
# pushd $TEST_DIR
# gcloud app deploy --project svelte-demo-329602 -q --version e2e-test --no-promote .appengine_build_output/app.yaml
# popd
rm -rf $TEST_DIR
