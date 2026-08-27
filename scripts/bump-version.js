const fs = require('fs')
const path = require('path')

const pkgPath = path.resolve(__dirname, '..', 'package.json')
const raw = fs.readFileSync(pkgPath, 'utf8')
const pkg = JSON.parse(raw)

function bumpPatch(version) {
  const parts = version.split('.')
  // ensure at least three parts
  while (parts.length < 3) parts.push('0')
  const patch = parseInt(parts[2].replace(/[^0-9].*$/, ''), 10) || 0
  parts[2] = String(patch + 1)
  return parts.join('.')
}

pkg.version = bumpPatch(pkg.version || '0.0.0')
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log('bumped package.json version to', pkg.version)
