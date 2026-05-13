import re

with open('src/pages/Auth.test.tsx', 'r') as f:
    content = f.read()

# Remove the test for demo login button since we removed it from the component
content = re.sub(r"it\('renders demo login button', \(\) => {.*?}\);", '', content, flags=re.DOTALL)

with open('src/pages/Auth.test.tsx', 'w') as f:
    f.write(content)
