module.exports = {
  root: true,
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['prettier', 'standard'],
  rules: {
    'prettier/prettier': 'error'
  },
  env: {
    node: true,
    mocha: true
  }
}
