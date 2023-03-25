#!/usr/bin/env bash
set -x
# Fail on any error
set -e

# Get the directory of this script
SCRIPT_PATH=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
# Create a temp directory for the test
TEST_DIR="$(mktemp -d)"
# Sveltekit version to test against, defaulting to latest
SVELTEKIT_VERSION=${SVELTEKIT_VERSION:-latest}

echo "TEST_DIR: ${TEST_DIR}"
echo "PWD: ${PWD}"
echo "SCRIPT_PATH: ${SCRIPT_PATH}"
echo "SVELTEKIT_VERSION: ${SVELTEKIT_VERSION}"

# Install create svelte
npm install --no-save create-svelte@"${SVELTEKIT_VERSION}"
# Create svelte demo app
node "${SCRIPT_PATH}/create-svelte.js" "${TEST_DIR}"

# Copy overwrites
cp -a "${SCRIPT_PATH}"/overwrites/. "${TEST_DIR}"

pushd $TEST_DIR

set -e

npm i "${SCRIPT_PATH}/../"
npm i

# These are peer dependencies that need manual install since we install from folder instead of from npm registry
npm install polka@1.0.0-next.22 compression@^1.7.4 sirv@^2.0.2 @google-cloud/trace-agent@^7.0.0

npm run build

popd
npx start-server-and-test "node ${TEST_DIR}/build/index.js" http://localhost:8080 "TEST_DIR=${TEST_DIR}/ mocha ${SCRIPT_PATH}/../tests/test.js"

# To test on real appengine instance
# pushd $TEST_DIR
# gcloud app deploy --project svelte-demo-329602 -q --version e2e-test --no-promote build/app.yaml
# popd
rm -rf $TEST_DIR
