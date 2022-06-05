MAIN_PACKAGE="reaccord"

RAW_DEV_VERSION=$(jq -r '.version' package.json)
echo "DEV_VERSION: $DEV_VERSION"

GIT_SHORT_HASH=$(git rev-parse --short HEAD)
echo "GIT_SHORT_HASH: $GIT_SHORT_HASH"

# Check previous released version of reaccord@dev

echo "Check previous released version of $MAIN_PACKAGE"
LATEST_DEV_VERSION=$(pnpm view ${MAIN_PACKAGE}@dev version)
echo "Latest version: $LATEST_DEV_VERSION"

if [[ $(echo $LATEST_DEV_VERSION | grep -e "${RAW_DEV_VERSION}.*.${GIT_SHORT_HASH}") ]]; \
then exit 0; fi

NEW_DEV_VERSION="${RAW_DEV_VERSION}.$(date +%s).${GIT_SHORT_HASH}"

# Install dependencies

pnpm ci

# Build dependencies

./node_modules/.bin/turbo run build --filter=./packages/* --cache-dir=".turbo" --no-deps --include-dependencies

# Deprecate previous packages

for PACKAGE in "@reaccord/cli" "@reaccord/jsx" "@reaccord/router" "reaccord"
do
    # Deprecate old package version
    pnpm deprecate ${PACKAGE}@${RAW_DEV_VERSION}-dev "no longer supported"
done

# Update packages version

for PACKAGE in "cli" "jsx" "router" "reaccord"
do
    # Update package version
    cd packages/$PACKAGE

    sed -i.bak "s/workspace:0.0.0-dev/${NEW_DEV_VERSION}/g" package.json && rm package.json.bak
    sed -i.bak "s/0.0.0-dev/${NEW_DEV_VERSION}/g" package.json && rm package.json.bak
    cd ../..
done

# Publish packages

pnpm publish --no-git-checks --tag dev --access public