with open('.github/workflows/ci.yml', 'r') as f:
    content = f.read()

content = content.replace('env:\n        ESLINT_USE_FLAT_CONFIG: false', 'env:\n        ESLINT_USE_FLAT_CONFIG: false\n        FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true')

content = content.replace('steps:\n    - uses: actions/checkout@v4', 'env:\n      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true\n    steps:\n    - uses: actions/checkout@v4')

with open('.github/workflows/ci.yml', 'w') as f:
    f.write(content)
