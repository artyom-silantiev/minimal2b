rm -rf dist
npx tsc -p tsconfig.cjs.json
npx tsc -p tsconfig.types.json
cp README.md dist/README.md
cp LICENCE dist/LICENCE
cp package.json dist/package.json
