@echo off
title [인터넷 업로드]
echo ======================================================
echo  최신 게임 코드를 인터넷(GitHub)에 업로드합니다...
echo ======================================================
echo.

git add .
git commit -m "Update kids math game"
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================
    echo  [성공] 인터넷 업로드가 완료되었습니다!
    echo ======================================================
    echo.
    echo [인스타그램 / 스마트폰 접속 링크]
    echo     https://lsw53120-byte.github.io/kids-math-game/
    echo.
    echo * 위 주소를 복사하여 인스타 프로필이나 스토리에 올리세요!
    echo ======================================================
) else (
    echo.
    echo [오류] 업로드 중 문제가 발생했습니다.
    echo 인터넷 연결을 확인하고 잠시 후 다시 실행해 주세요.
)

pause
