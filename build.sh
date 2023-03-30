rm -rf dist
tsc -p tsconfig.cjs.json
tsc -p tsconfig.types.json
cp package.json dist/package.json
