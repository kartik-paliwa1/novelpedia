@echo off
echo Starting Django Server for Google OAuth...
cd /d "C:\Users\Soyam\Downloads\Mvp-hopefully-codex-document-working-features-in-features.md"
call .venv\Scripts\activate.bat
cd server
python manage.py runserver 0.0.0.0:8000
pause