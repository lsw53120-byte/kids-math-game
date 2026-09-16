from PIL import Image, ImageDraw, ImageFont
import os

base_dir = r"c:\Users\오구링\Desktop\자동화\kids_math_game"

def create_app_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 둥근 모서리 사각형 배경 (코랄 핑크)
    radius = int(size * 0.22)
    # 배경 채우기
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=(255, 107, 139, 255))
    
    # 내부 안쪽 테두리 하이라이트
    margin = int(size * 0.04)
    draw.rounded_rectangle([(margin, margin), (size - 1 - margin, size - 1 - margin)], 
                           radius=int(radius * 0.8), outline=(255, 214, 222, 200), width=int(size * 0.02))

    # 중앙에 귀여운 장식 원 (크림 옐로우)
    center = size // 2
    circle_r = int(size * 0.32)
    draw.ellipse([(center - circle_r, center - circle_r), (center + circle_r, center + circle_r)], fill=(255, 243, 191, 255))

    # 텍스트 시도 (Windows 맑은 고딕 또는 기본)
    try:
        font_path = "C:\\Windows\\Fonts\\malgun.ttf"
        font = ImageFont.truetype(font_path, int(size * 0.3))
        text = "수학"
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((center - w // 2, center - h // 2 - int(size * 0.02)), text, font=font, fill=(214, 51, 108, 255))
    except Exception:
        # 폰트 없을 경우 별 모양 그리기
        pass

    out_path = os.path.join(base_dir, filename)
    img.save(out_path, "PNG")
    print(f"생성 완료: {out_path}")

create_app_icon(192, "icon-192.png")
create_app_icon(512, "icon-512.png")
