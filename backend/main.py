from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai

# 1. Masukkan API Key (Ganti dengan API Key Anda yang berawalan AIzaSyA...)
client = genai.Client(api_key="AIzaSyB7oTzCnfSszH-2E3pTQ0sxKUaR6G40Nj8")

app = FastAPI()

# 2. Atur Satpam Keamanan (CORS) agar localhost:3000 bisa masuk
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pertanyaan(BaseModel):
    pesan: str

@app.post("/api/chat")
async def chat_medis(data: Pertanyaan):
    prompt_system = f"""
    Anda adalah MedBot, asisten AI yang ramah tentang edukasi medis dasar.
    Tugas Anda memberikan informasi kesehatan umum. Jawab dengan ringkas dan berempati.
    TIDAK BOLEH memberikan diagnosis medis pasti.
    Pertanyaan pengguna: {data.pesan}
    """

    try:
        # 3. Panggil AI versi terbaru
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_system
        )
        return {"jawaban": response.text}
    
    except Exception as e:
        # Jika gagal, print error LENGKAP ke terminal agar kita tahu penyebabnya
        print(f"\n=== ERROR DARI GOOGLE ===\n{e}\n=========================\n")
        return {"jawaban": "Maaf, sistem AI sedang sibuk. Cek terminal VS Code untuk melihat errornya."}