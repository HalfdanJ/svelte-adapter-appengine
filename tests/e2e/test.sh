SCRIPT_PATH=$(dirname "$(realpath -s "$0")")
TEST_DIR="$(mktemp -dt svelte-adapter-appengine)"

echo "TEST_DIR: ${TEST_DIR}"
echo "PWD: ${PWD}"
echo "SCRIPT_PATH: ${SCRIPT_PATH}"

yes "" | "$(npm init svelte@next "${TEST_DIR}")"
cp "${SCRIPT_PATH}"/svelte.config.js "${TEST_DIR}"

pushd $TEST_DIR
npm install
npm install "${SCRIPT_PATH}/../../"

# These are peer dependencies that need manual install since we install from folder instead of from npm registry
npm install polka@1.0.0-next.22 compression@^1.7.4

npm run build

gcloud app deploy --project svelte-demo-329602 -q --version e2e-test --no-promote .appengine_build_output/app.yaml
