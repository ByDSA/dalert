#!/bin/sh
set -e

for file in package.json *.md LICENSE .npmrc; do
  if [ -f "$file" ]; then
    cp "$file" -t ./build
  fi
done

cd build
sed -i '/\"scripts\"/,/},$/d' ./package.json
sed -i 's/"main": "build\/index.js",/"main": "\.\/index.js",/; s/"types": "build\/index.d.ts",/"types": "\.\/index.d.ts",/' ./package.json
