rm -rf dist
tsc -p tsconfig.cjs.json
tsc -p tsconfig.types.json
cp README.md dist/README.md
cp LICENCE dist/LICENCE
cp package.json dist/package.json
