import os
import re

base_dir = r"c:\Users\오구링\Desktop\자동화\kids_math_game"

with open(os.path.join(base_dir, "style.css"), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(base_dir, "audio.js"), "r", encoding="utf-8") as f:
    audio = f.read()

with open(os.path.join(base_dir, "game.js"), "r", encoding="utf-8") as f:
    game = f.read()

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

# 1. CSS 인라인 치환 (<link rel="stylesheet" href="style.css">)
html = re.sub(r'<link[^>]*href=["\']style\.css["\'][^>]*>', f'<style>\n{css}\n</style>', html)

# 2. JS 인라인 치환 (<script src="audio.js"></script> 및 <script src="game.js"></script>)
script_pattern = r'<script[^>]*src=["\']audio\.js["\'][^>]*><\/script>\s*<script[^>]*src=["\']game\.js["\'][^>]*><\/script>'
js_bundle = f'<script>\n{audio}\n\n{game}\n</script>'
html, count = re.subn(script_pattern, lambda m: js_bundle, html)

output_path = os.path.join(base_dir, "독립실행_kids_math_game.html")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print("치환된 스크립트 태그 수:", count)
print("단일 파일 생성 완료! 크기:", os.path.getsize(output_path), "바이트")
