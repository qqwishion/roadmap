from django.shortcuts import render
from django.http import HttpResponse
from pathlib import Path
import os

def index(request):
    build_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "build" / "index.html"
    if not build_path.exists():
        return HttpResponse("index.html not found", status=404)
    with open(build_path, encoding="utf-8") as f:
        return HttpResponse(f.read())
