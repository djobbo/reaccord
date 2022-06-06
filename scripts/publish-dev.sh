#!/usr/bin/env bash

MAIN_PACKAGE="reaccord"
PKG_FOLDERS=("jsx" "reaccord" "cli" "router")
PACKAGES=("@reaccord/jsx" "reaccord" "@reaccord/cli" "@reaccord/router")

RAW_DEV_VERSION=$(jq -r '.version' package.json)
echo "DEV_VERSION: $DEV_VERSION"

GIT_SHORT_HASH=$(git rev-parse --short HEAD)
echo "GIT_SHORT_HASH: $GIT_SHORT_HASH"

# Check previous released version of reaccord@dev

echo "Check previous released version of $MAIN_PACKAGE"
LATEST_DEV_VERSION=$(pnpm view ${MAIN_PACKAGE}@dev version)
echo "Latest version: $LATEST_DEV_VERSION"

if [[ $LATEST_DEV_VERSION =~ "${RAW_DEV_VERSION}"\..*\."${GIT_SHORT_HASH}" ]]; \
then echo "Version already up to date"; exit 0; fi

NEW_DEV_VERSION="${RAW_DEV_VERSION}-dev.$(date +%s).${GIT_SHORT_HASH}"

# Install dependencies

pnpm ci

# Build dependencies

./node_modules/.bin/turbo run build --filter=./packages/* --cache-dir=".turbo" --no-deps --include-dependencies

# Update packages version

for FOLDER in "${PKG_FOLDERS[@]}"
do
    PACKAGE=${PACKAGES[$FOLDER]}
    echo "Updating ${PACKAGE} version to ${NEW_DEV_VERSION}"
    cd packages/"$FOLDER" || exit 1

    # Build package
    pnpm build || true

    # Deprecate old package version
    OLD_DEV_VERSION=$(pnpm view "${PACKAGE}"@dev version)
    pnpm deprecate "${PACKAGE}@${OLD_DEV_VERSION}" "no longer supported"
    echo "Deprecated ${PACKAGE}@${OLD_DEV_VERSION}"

    # Update package version
    sed -i.bak "s/workspace:0.0.0-dev/${NEW_DEV_VERSION}/g" package.json && rm package.json.bak
    sed -i.bak "s/0.0.0-dev/${NEW_DEV_VERSION}/g" package.json && rm package.json.bak
    
    # Publish packages
    pnpm publish --no-git-checks --tag dev --access public
    echo "Published ${PACKAGE}@${NEW_DEV_VERSION}"
    cd ../.. || exit 1
done
