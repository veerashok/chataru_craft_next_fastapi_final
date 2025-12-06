
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change_me")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

def get_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS enquiries (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          source_page TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL,
          description TEXT,
          image TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

admin_sessions: Dict[str, datetime] = {}
SESSION_AGE = timedelta(days=7)
SESSION_COOKIE_NAME = "admin_session"

def get_session_token(request: Request) -> Optional[str]:
    return request.cookies.get(SESSION_COOKIE_NAME)

def require_admin(request: Request):
    token = get_session_token(request)
    if not token or token not in admin_sessions:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if datetime.utcnow() - admin_sessions[token] > SESSION_AGE:
        admin_sessions.pop(token, None)
        raise HTTPException(status_code=401, detail="Session expired")

class EnquiryIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    sourcePage: Optional[str] = None

class AdminLogin(BaseModel):
    password: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/admin/login")
def admin_login(data: AdminLogin, response: Response):
    if not data.password or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Wrong password")

    token = secrets.token_hex(32)
    admin_sessions[token] = datetime.utcnow()

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=int(SESSION_AGE.total_seconds())
    )
    return {"success": True}

@app.post("/api/admin/logout")
def admin_logout(request: Request, response: Response):
    token = get_session_token(request)
    if token and token in admin_sessions:
        admin_sessions.pop(token, None)

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        httponly=True,
        secure=True,
        samesite="none",
        path="/"
    )
    return {"success": True}

@app.post("/api/enquiry")
def create_enquiry(data: EnquiryIn):
    if not data.name or not data.email or not data.message:
        raise HTTPException(status_code=400, detail="Name, email and message are required")

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO enquiries (name, email, phone, message, source_page)
        VALUES (%s, %s, %s, %s, %s);
        """,
        (data.name, data.email, data.phone or "", data.message, data.sourcePage or "")
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"success": True, "message": "Enquiry submitted successfully."}

@app.get("/api/admin/enquiries")
def list_enquiries(request: Request):
    require_admin(request)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, email, phone, message, source_page, created_at
        FROM enquiries ORDER BY created_at DESC;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.get("/api/products")
def list_products():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, price, description, image, created_at
        FROM products ORDER BY created_at DESC;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/admin/products")
def create_product(
    request: Request,
    name: str = Form(...),
    price: int = Form(...),
    description: str = Form(""),
    image: UploadFile = File(...)
):
    require_admin(request)

    filename = f"{int(datetime.utcnow().timestamp())}_{image.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(image.file.read())

    img_path = f"/uploads/{filename}"

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO products (name, price, description, image)
        VALUES (%s, %s, %s, %s);
        """,
        (name, int(price), description or "", img_path)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"success": True}

@app.put("/api/admin/products/{product_id}")
def update_product(
    product_id: int,
    request: Request,
    name: str = Form(...),
    price: int = Form(...),
    description: str = Form(""),
    image: UploadFile = File(None)
):
    require_admin(request)

    conn = get_conn()
    cur = conn.cursor()

    if image is not None:
        filename = f"{int(datetime.utcnow().timestamp())}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(image.file.read())
        img_path = f"/uploads/{filename}"
        cur.execute(
            """
            UPDATE products
            SET name=%s, price=%s, description=%s, image=%s
            WHERE id=%s;
            """,
            (name, int(price), description or "", img_path, product_id)
        )
    else:
        cur.execute(
            """
            UPDATE products
            SET name=%s, price=%s, description=%s
            WHERE id=%s;
            """,
            (name, int(price), description or "", product_id)
        )

    conn.commit()
    cur.close()
    conn.close()
    return {"success": True}

@app.delete("/api/admin/products/{product_id}")
def delete_product(product_id: int, request: Request):
    require_admin(request)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM products WHERE id=%s;", (product_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"success": True}
