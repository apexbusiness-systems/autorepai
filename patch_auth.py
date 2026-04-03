import re

with open('src/pages/Auth.tsx', 'r') as f:
    content = f.read()

# Remove handleDemoLogin
content = re.sub(r'const handleDemoLogin.*?};', '', content, flags=re.DOTALL)

# Remove the Demo Account button and the "Or continue with" divider
content = re.sub(r'<div className="relative my-4">.*?<Button variant="outline" onClick={handleDemoLogin}.*?</Button>', '', content, flags=re.DOTALL)

with open('src/pages/Auth.tsx', 'w') as f:
    f.write(content)
