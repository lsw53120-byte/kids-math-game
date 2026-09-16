import http.server
import socketserver
import socket
import os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # 공유기/외부 IP 확인용 더미 연결
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

local_ip = get_ip()
url = f"http://{local_ip}:{PORT}"

print("=" * 60)
print(" 📱 [냠냠 팡팡! 6세 수학 놀이터] 안드로이드 폰 접속 서버 실행 중")
print("=" * 60)
print(f"\n👉 안드로이드 폰(크롬/삼성인터넷) 주소창에 아래 주소를 입력하세요:")
print(f"\n     {url}\n")
print("-" * 60)
print("💡 꿀팁:")
print(" 1. PC와 안드로이드 폰이 같은 Wi-Fi에 연결되어 있어야 합니다.")
print(" 2. 스마트폰 브라우저 메뉴(점 3개)에서 [홈 화면에 추가]를 누르면")
print("    진짜 앱처럼 바탕화면에 아이콘이 생겨 언제든 바로 플레이할 수 있습니다!")
print("=" * 60)
print("서버를 종료하려면 이 창을 닫거나 Ctrl+C를 누르세요.\n")

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버가 종료되었습니다.")
