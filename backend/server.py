from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated, Any

import json

import bcrypt
import jwt
import httpx
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, ConfigDict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("snowkap")

# ---------------------------------------------------------------------------
# DB
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ---------------------------------------------------------------------------
# Auth / Email config
# ---------------------------------------------------------------------------
JWT_ALGORITHM = "HS256"
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Snowkap")
LEAD_NOTIFY_EMAIL = os.environ.get("LEAD_NOTIFY_EMAIL", os.environ.get("ADMIN_EMAIL"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


# ---------------------------------------------------------------------------
# Mongo model helpers
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        return cls(**doc)

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        data.pop("_id", None)
        return data


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def send_email(to_email: str, subject: str, html: str, reply_to: Optional[str] = None):
    """Fire-and-forget email via Emergent managed proxy. Never raises."""
    if not EMAIL_KEY:
        logger.warning("EMERGENT_EMAIL_KEY missing, skipping email")
        return
    payload = {"to": [to_email], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            resp = await c.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                                headers={"X-Email-Key": EMAIL_KEY}, json=payload)
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Email send failed to {to_email}: {e}")


def wrap_email(title: str, body_html: str) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#060608;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111216;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <tr><td style="padding:28px 36px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">S<span style="color:#F05A22;">NOW</span>KAP</span>
            <span style="color:#5A5D6B;font-size:12px;letter-spacing:2px;text-transform:uppercase;float:right;padding-top:6px;">ESG Intelligence</span>
          </td></tr>
          <tr><td style="padding:36px;">
            <h1 style="color:#ffffff;font-size:22px;margin:0 0 18px;">{title}</h1>
            <div style="color:#A0A2AB;font-size:15px;line-height:1.6;">{body_html}</div>
          </td></tr>
          <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.08);color:#5A5D6B;font-size:12px;">
            Snowkap — We turn climate complexity into business clarity.
          </td></tr>
        </table>
      </td></tr>
    </table>"""


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LeadCreate(BaseModel):
    kind: str = "contact"  # advisor | proposal | whitepaper | event | webinar | contact | calculator
    name: Optional[str] = None
    email: EmailStr
    company: Optional[str] = None
    job_title: Optional[str] = None
    message: Optional[str] = None
    reference: Optional[str] = None  # e.g. whitepaper title / event name
    meta: Optional[dict] = None


class Lead(BaseDocument):
    kind: str
    name: Optional[str] = None
    email: str
    company: Optional[str] = None
    job_title: Optional[str] = None
    message: Optional[str] = None
    reference: Optional[str] = None
    meta: Optional[dict] = None
    status: str = "new"
    created_at: str = Field(default_factory=now_iso)


class NewsletterCreate(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    company: Optional[str] = None
    role: str  # CFO | COO | Sustainability | Procurement | Other


class Subscriber(BaseDocument):
    email: str
    name: Optional[str] = None
    company: Optional[str] = None
    role: str
    created_at: str = Field(default_factory=now_iso)


class DossierCreate(BaseModel):
    sector: Optional[str] = None
    region: Optional[str] = None
    stage: Optional[str] = None
    company_size: Optional[str] = None
    recommended_package: Optional[str] = None


class Dossier(BaseDocument):
    sector: Optional[str] = None
    region: Optional[str] = None
    stage: Optional[str] = None
    company_size: Optional[str] = None
    recommended_package: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class ProposalCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    job_title: Optional[str] = None
    message: Optional[str] = None
    package: Optional[str] = None
    items: List[str] = []
    dossier: Optional[dict] = None


class Proposal(BaseDocument):
    name: str
    email: str
    company: Optional[str] = None
    job_title: Optional[str] = None
    message: Optional[str] = None
    package: Optional[str] = None
    items: List[str] = []
    dossier: Optional[dict] = None
    status: str = "new"
    created_at: str = Field(default_factory=now_iso)


class CbamInput(BaseModel):
    sector: str
    annual_tonnes: float
    emission_factor: Optional[float] = None
    certificate_price: float = 75.36
    default_markup: float = 0.25
    email: Optional[EmailStr] = None
    company: Optional[str] = None


class ResourceCreate(BaseModel):
    type: str  # blog | whitepaper | press | event | webinar
    title: str
    slug: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    tags: List[str] = []
    date_label: Optional[str] = None
    read_time: Optional[str] = None
    location: Optional[str] = None
    status_label: Optional[str] = None  # upcoming | on-demand | past
    gated: bool = False
    external_url: Optional[str] = None
    image: Optional[str] = None


class Resource(BaseDocument):
    type: str
    title: str
    slug: str
    category: Optional[str] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    tags: List[str] = []
    date_label: Optional[str] = None
    read_time: Optional[str] = None
    location: Optional[str] = None
    status_label: Optional[str] = None
    gated: bool = False
    external_url: Optional[str] = None
    image: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="Snowkap API")
api = APIRouter(prefix="/api")


async def get_current_admin(request: Request) -> dict:
    token = None
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---- Auth ----
@api.post("/auth/login")
async def login(data: LoginInput):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(user["_id"]), user["email"])
    return {"access_token": token, "token_type": "bearer",
            "user": {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}}


@api.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return {"email": admin["email"], "name": admin.get("name", "Admin"), "role": admin.get("role", "admin")}


@api.post("/auth/logout")
async def logout():
    return {"status": "ok"}


# ---- Leads ----
@api.post("/leads")
async def create_lead(data: LeadCreate):
    lead = Lead(**data.model_dump())
    res = await db.leads.insert_one(lead.to_mongo())
    lead.id = str(res.inserted_id)
    ref = f" — {data.reference}" if data.reference else ""
    # notify internal
    asyncio.create_task(send_email(
        LEAD_NOTIFY_EMAIL,
        f"New {data.kind} lead{ref}",
        wrap_email("New lead captured", f"""
            <p><b>Type:</b> {data.kind}{ref}</p>
            <p><b>Name:</b> {data.name or '—'}<br/>
            <b>Email:</b> {data.email}<br/>
            <b>Company:</b> {data.company or '—'}<br/>
            <b>Role:</b> {data.job_title or '—'}</p>
            <p><b>Message:</b><br/>{(data.message or '—')}</p>"""),
        reply_to=data.email))
    # confirm to lead
    asyncio.create_task(send_email(
        data.email,
        "We've received your request — Snowkap",
        wrap_email("Received & logged",
                   f"<p>Hi {data.name or 'there'},</p><p>Thanks for reaching out to Snowkap. "
                   f"A member of our team will come back to you shortly with next steps"
                   f"{(' regarding <b>' + data.reference + '</b>') if data.reference else ''}.</p>"
                   f"<p>— The Snowkap Team</p>")))
    return {"status": "ok", "id": lead.id}


@api.get("/leads")
async def list_leads(admin: dict = Depends(get_current_admin)):
    docs = await db.leads.find().sort("created_at", -1).to_list(1000)
    return [Lead.from_mongo(d).model_dump(by_alias=False) for d in docs]


# ---- Newsletter ----
@api.post("/newsletter")
async def subscribe(data: NewsletterCreate):
    existing = await db.subscribers.find_one({"email": data.email.lower()})
    if existing:
        await db.subscribers.update_one({"_id": existing["_id"]},
                                        {"$set": {"role": data.role, "company": data.company, "name": data.name}})
    else:
        sub = Subscriber(email=data.email.lower(), name=data.name, company=data.company, role=data.role)
        await db.subscribers.insert_one(sub.to_mongo())
    asyncio.create_task(send_email(
        data.email,
        "Welcome to Power of Now — Snowkap",
        wrap_email("You're subscribed to Power of Now",
                   f"<p>Hi {data.name or 'there'},</p>"
                   f"<p>You'll now receive <b>Power of Now</b> — regulatory intelligence tailored to the "
                   f"<b>{data.role}</b> lens: what's changing across CBAM, CSRD, BRSR and beyond, and exactly "
                   f"how it lands on your desk.</p><p>No noise. Only what moves your risk and your numbers.</p>"
                   f"<p>— Snowkap</p>")))
    return {"status": "ok"}


@api.get("/newsletter")
async def list_subscribers(admin: dict = Depends(get_current_admin)):
    docs = await db.subscribers.find().sort("created_at", -1).to_list(2000)
    return [Subscriber.from_mongo(d).model_dump(by_alias=False) for d in docs]


# ---- Dossier ----
PACKAGE_MAP = {
    ("baseline",): "Starter",
    ("scaling",): "Growth",
    ("global",): "Enterprise",
}


@api.post("/dossier")
async def save_dossier(data: DossierCreate):
    rec = data.recommended_package
    if not rec:
        stage = (data.stage or "").lower()
        rec = "Enterprise" if "global" in stage else ("Growth" if "scal" in stage else "Starter")
    doc = Dossier(**{**data.model_dump(), "recommended_package": rec})
    res = await db.dossiers.insert_one(doc.to_mongo())
    doc.id = str(res.inserted_id)
    return {"status": "ok", "id": doc.id, "recommended_package": rec}


# ---- Proposals ----
@api.post("/proposals")
async def create_proposal(data: ProposalCreate):
    prop = Proposal(**data.model_dump())
    res = await db.proposals.insert_one(prop.to_mongo())
    prop.id = str(res.inserted_id)
    items_html = "".join(f"<li>{i}</li>" for i in data.items) or "<li>—</li>"
    asyncio.create_task(send_email(
        LEAD_NOTIFY_EMAIL,
        f"New scoped proposal request — {data.company or data.name}",
        wrap_email("New proposal request", f"""
            <p><b>Name:</b> {data.name}<br/><b>Email:</b> {data.email}<br/>
            <b>Company:</b> {data.company or '—'}<br/><b>Role:</b> {data.job_title or '—'}<br/>
            <b>Package:</b> {data.package or 'Custom'}</p>
            <p><b>Line items:</b></p><ul>{items_html}</ul>
            <p><b>Message:</b><br/>{data.message or '—'}</p>"""),
        reply_to=data.email))
    asyncio.create_task(send_email(
        data.email,
        "Your Snowkap programme brief — received",
        wrap_email("Received & logged",
                   f"<p>Hi {data.name},</p><p>Your scoped brief has reached our team. This isn't a bill — "
                   f"we'll review your selections and come back with a real, scoped proposal, fast.</p>"
                   f"<p>— The Snowkap Team</p>")))
    return {"status": "ok", "id": prop.id}


@api.get("/proposals")
async def list_proposals(admin: dict = Depends(get_current_admin)):
    docs = await db.proposals.find().sort("created_at", -1).to_list(1000)
    return [Proposal.from_mongo(d).model_dump(by_alias=False) for d in docs]


# ---- CBAM Calculator ----
SECTOR_FACTORS = {
    "Iron & Steel": 1.9,
    "Aluminium": 8.6,
    "Cement": 0.9,
    "Fertilisers": 2.1,
    "Hydrogen": 10.0,
    "Electricity": 0.45,
}


@api.get("/cbam/sectors")
async def cbam_sectors():
    return [{"name": k, "factor": v} for k, v in SECTOR_FACTORS.items()]


@api.post("/cbam/calculate")
async def cbam_calculate(data: CbamInput):
    factor = data.emission_factor or SECTOR_FACTORS.get(data.sector, 1.9)
    verified_emissions = data.annual_tonnes * factor
    default_emissions = verified_emissions * (1 + data.default_markup)
    verified_cost = verified_emissions * data.certificate_price
    default_cost = default_emissions * data.certificate_price
    savings = default_cost - verified_cost
    result = {
        "sector": data.sector,
        "emission_factor": round(factor, 3),
        "annual_tonnes": data.annual_tonnes,
        "certificate_price": data.certificate_price,
        "verified_emissions": round(verified_emissions, 1),
        "default_emissions": round(default_emissions, 1),
        "verified_cost": round(verified_cost, 0),
        "default_cost": round(default_cost, 0),
        "annual_savings": round(savings, 0),
    }
    if data.email:
        await db.cbam_calcs.insert_one({
            "email": data.email, "company": data.company, "inputs": data.model_dump(),
            "result": result, "created_at": now_iso()})
        asyncio.create_task(send_email(
            LEAD_NOTIFY_EMAIL, f"CBAM calculator lead — {data.company or data.email}",
            wrap_email("CBAM calculator used",
                       f"<p><b>Email:</b> {data.email}<br/><b>Company:</b> {data.company or '—'}</p>"
                       f"<p><b>Sector:</b> {data.sector} · {data.annual_tonnes:,.0f} t</p>"
                       f"<p><b>Estimated annual saving:</b> €{savings:,.0f}</p>"), reply_to=data.email))
        asyncio.create_task(send_email(
            data.email, "Your CBAM exposure estimate — Snowkap",
            wrap_email("Your CBAM estimate",
                       f"<p>Based on <b>{data.annual_tonnes:,.0f} tonnes</b> in <b>{data.sector}</b>:</p>"
                       f"<p>Cost on default values: <b>€{default_cost:,.0f}/yr</b><br/>"
                       f"Cost on verified primary data: <b>€{verified_cost:,.0f}/yr</b><br/>"
                       f"Potential annual saving: <b style='color:#00E599'>€{savings:,.0f}</b></p>"
                       f"<p>Verified data beats default assumptions — every certificate cycle. "
                       f"Talk to an advisor to lock this in.</p>")))
    return result


# ---- Resources (CMS) ----
def slugify(t: str) -> str:
    import re
    s = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")
    return s[:80]


@api.get("/resources")
async def list_resources(type: Optional[str] = None):
    q = {"type": type} if type else {}
    docs = await db.resources.find(q).sort("created_at", -1).to_list(500)
    return [Resource.from_mongo(d).model_dump(by_alias=False) for d in docs]


@api.get("/resources/{slug}")
async def get_resource(slug: str):
    doc = await db.resources.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return Resource.from_mongo(doc).model_dump(by_alias=False)


@api.post("/resources")
async def create_resource(data: ResourceCreate, admin: dict = Depends(get_current_admin)):
    slug = data.slug or slugify(data.title)
    if await db.resources.find_one({"slug": slug}):
        slug = f"{slug}-{int(datetime.now().timestamp())}"
    r = Resource(**{**data.model_dump(), "slug": slug})
    res = await db.resources.insert_one(r.to_mongo())
    r.id = str(res.inserted_id)
    return r.model_dump(by_alias=False)


@api.put("/resources/{rid}")
async def update_resource(rid: str, data: ResourceCreate, admin: dict = Depends(get_current_admin)):
    update = {k: v for k, v in data.model_dump().items() if v is not None}
    await db.resources.update_one({"_id": ObjectId(rid)}, {"$set": update})
    doc = await db.resources.find_one({"_id": ObjectId(rid)})
    return Resource.from_mongo(doc).model_dump(by_alias=False)


@api.delete("/resources/{rid}")
async def delete_resource(rid: str, admin: dict = Depends(get_current_admin)):
    await db.resources.delete_one({"_id": ObjectId(rid)})
    return {"status": "ok"}


# ---- Admin stats ----
@api.get("/admin/stats")
async def admin_stats(admin: dict = Depends(get_current_admin)):
    return {
        "leads": await db.leads.count_documents({}),
        "proposals": await db.proposals.count_documents({}),
        "subscribers": await db.subscribers.count_documents({}),
        "cbam_calcs": await db.cbam_calcs.count_documents({}),
        "resources": await db.resources.count_documents({}),
        "dossiers": await db.dossiers.count_documents({}),
    }


# ---- Ask Snowkap AI (Claude Opus 4.7 via Emergent universal key) ----
CHAT_SYSTEM = """You are "Snowkap AI", the assistant on snowkap.com — the website of Snowkap, a global ESG technology company (India · Dubai · Singapore).

WHAT SNOWKAP IS: Snowkap combines expert advisory, an AI-powered ESG platform, and embedded managed support to turn climate complexity into business clarity. Three pillars: (1) Advisory — ESG strategy, double materiality, SBTi decarbonisation roadmaps, ratings optimisation (EcoVadis, CDP, DJSI), capacity building; (2) ESG Platform — AI-powered command centre: carbon accounting (Scope 1-3, 60,000+ emission factors, AI-OCR extraction from invoices), multi-framework reporting (BRSR, CSRD/ESRS, GRI, IFRS S1/S2, CDP, TCFD — one data entry, 25+ frameworks), Scope 3 & supplier engagement (tiered assessments, AI verification, proxy gap-filling), Snowkap AI (ESG copilot, auto-compliance transfer, validation engine); (3) Managed Support — embedded specialists who onboard suppliers, coordinate audits, and monitor regulatory change.

PROOF: 1,100+ product carbon footprints calculated · 700+ suppliers onboarded · >90% primary data coverage in one quarter · 3,800+ professionals trained · 25+ frameworks · 6+ industries. Clients include JSW Steel, Daimler (India ops), Schaeffler, MAHLE, Ather, NRB Bearings, Himalaya, Senco Gold, Varun Beverages, Sutherland, KNPC, Fireside Ventures.

USEFUL LINKS on this site: Book a demo / contact → /contact · Platform details → /platform · Services → /services · CBAM exposure calculator (free tool) → /tools/cbam · Customer stories → /customers · Resources → /resources · Product sign-in → https://login.snowkap.com. Contact: sales@snowkap.com, +91 22 4007 9343.

RULES: Be concise (2-4 short sentences unless asked for depth), confident, financially specific, and helpful. Never frame ESG as cost or punishment — it is investment with quantifiable returns. Never invent clients, prices, or features. For pricing, explain engagements are scoped individually and suggest booking a demo. When relevant, point the visitor to a link above. If asked something unrelated to ESG/Snowkap, politely steer back."""

chat_sessions: dict = {}


class ChatInput(BaseModel):
    session_id: str
    message: str


def get_chat(session_id: str) -> LlmChat:
    if session_id not in chat_sessions:
        chat_sessions[session_id] = (
            LlmChat(
                api_key=os.environ["EMERGENT_LLM_KEY"],
                session_id=session_id,
                system_message=CHAT_SYSTEM,
                custom_headers={"anthropic-beta": "task-budgets-2026-03-13"},
            )
            .with_model("anthropic", "claude-opus-4-7")
            .with_params(
                extra_body={"output_config": {"task_budget": {"type": "tokens", "total": 200000}, "effort": "low"}},
                max_tokens=64000,
            )
        )
    return chat_sessions[session_id]


@api.post("/chat/stream")
async def chat_stream(data: ChatInput):
    chat = get_chat(data.session_id)
    await db.chat_messages.insert_one({
        "session_id": data.session_id, "role": "user", "content": data.message, "created_at": now_iso()})

    async def gen():
        parts = []
        try:
            async for ev in chat.stream_message(UserMessage(text=data.message)):
                if isinstance(ev, TextDelta):
                    parts.append(ev.content)
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.error(f"chat stream error: {e}")
            yield f"data: {json.dumps({'error': 'The assistant is unavailable right now. Please try again.'})}\n\n"
        if parts:
            await db.chat_messages.insert_one({
                "session_id": data.session_id, "role": "assistant",
                "content": "".join(parts), "created_at": now_iso()})
        yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@api.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    docs = await db.chat_messages.find({"session_id": session_id}).sort("created_at", 1).to_list(200)
    return [{"role": d["role"], "content": d["content"]} for d in docs]


@api.get("/")
async def root():
    return {"message": "Snowkap API"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup: seed admin + resources
# ---------------------------------------------------------------------------
SEED_RESOURCES = [
    # ---- Blogs (live on snowkap.com) ----
    {"type": "blog", "category": "Carbon & Finance",
     "title": "Your Carbon Numbers are a Financial Asset. Most Companies Still Treat them Like Paperwork.",
     "excerpt": "Verified carbon data now prices debt, wins tenders, and moves valuations. Why the smartest CFOs treat the carbon ledger like the general ledger.",
     "date_label": "Jul 2026", "read_time": "7 min read", "tags": ["Carbon", "Finance"],
     "external_url": "https://snowkap.com/your-carbon-numbers-are-a-financial-asset/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/07/Thumbnail-image.png",
     "body": "Carbon numbers have quietly crossed over from compliance paperwork to financial infrastructure. Lenders price sustainability-linked debt on them, OEMs award contracts on them, and investors screen on them. This piece makes the case for treating your carbon ledger with the same rigour as your general ledger — and shows what changes when you do."},
    {"type": "blog", "category": "Sector Deep Dive",
     "title": "Carbon Is Becoming the Next Real Estate Cost Variable",
     "excerpt": "Embodied carbon, energy performance, and disclosure rules are rewriting how real estate is valued, leased, and financed.",
     "date_label": "Jul 2026", "read_time": "6 min read", "tags": ["Real Estate", "Carbon"],
     "external_url": "https://snowkap.com/carbon-is-becoming-the-next-real-estate-cost-variable/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/07/Thumbnail-Image.jpg",
     "body": "From embodied carbon in construction to operational energy performance, carbon is becoming a line item in every real-estate decision. This deep dive covers the regulations, the valuation impact, and what asset owners should measure now."},
    {"type": "blog", "category": "Regulatory Intelligence",
     "title": "Carbon at the Border: Why CBAM Is Really a Supply Chain Data Regulation",
     "excerpt": "CBAM is framed as a tariff, but it operates as a data regulation. The importers who win will be the ones with verified supplier data.",
     "date_label": "May 2026", "read_time": "8 min read", "tags": ["CBAM", "Supply Chain"],
     "external_url": "https://snowkap.com/carbon-at-the-border/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/CBAM-A-Trade-Regulation-banner.png",
     "body": "The EU's Carbon Border Adjustment Mechanism is usually described as a carbon tariff. In practice it is a supply-chain data regulation: the cost you pay depends on the quality of the emissions data you can produce. This article unpacks the mechanics, the default-value penalty, and the data infrastructure importers need."},
    {"type": "blog", "category": "Carbon & Finance",
     "title": "Data-Driven Decarbonization: How Carbon Accounting is Reshaping Finance and Insurance",
     "excerpt": "Financed and insured emissions are now board-level numbers. How financial institutions are operationalising carbon accounting.",
     "date_label": "Jan 2026", "read_time": "7 min read", "tags": ["Finance", "Carbon Accounting"],
     "external_url": "https://snowkap.com/data-driven-decarbonization-how-carbon-accounting-is-reshaping-finance-and-insurance/",
     "body": "Financial institutions are discovering that their largest emissions sit in their portfolios, not their offices. This piece covers PCAF methodology, data sourcing across portfolio companies, and how carbon accounting is reshaping underwriting and lending."},
    {"type": "blog", "category": "AI & Platform",
     "title": "How Artificial Intelligence is Powering Sustainability",
     "excerpt": "From AI-OCR data extraction to predictive emission forecasting — where AI genuinely moves the needle in ESG operations.",
     "date_label": "Jan 2026", "read_time": "6 min read", "tags": ["AI", "ESG"],
     "external_url": "https://snowkap.com/how-artificial-intelligence-is-powering-sustainability/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/01/How-Artificial-Intelligence-is-Powering-Sustainability-option-3.png",
     "body": "AI is often overhyped in sustainability — and simultaneously underused where it matters. This article maps the genuinely high-leverage applications: document extraction, anomaly detection, framework auto-mapping, and predictive forecasting."},
    {"type": "blog", "category": "Regulatory Intelligence",
     "title": "The Great Unlocking: Why India's CCUS Moment Is Real This Time",
     "excerpt": "Policy, price signals, and industrial demand are converging on carbon capture in India. What business leaders should watch.",
     "date_label": "Apr 2026", "read_time": "9 min read", "tags": ["India", "CCUS"],
     "external_url": "https://snowkap.com/the-great-unlocking-why-indias-ccus-moment-is-real-this-time/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/04/Blog-Image-1.png",
     "body": "India's carbon capture, utilisation and storage moment has been announced many times before. This time, policy incentives, carbon pricing signals, and hard-to-abate industrial demand are aligning. Here's what the unlock looks like."},
    {"type": "blog", "category": "Carbon & Finance",
     "title": "Decarbonizing the Balance Sheet: A Strategic Guide to GHG Emissions for India's Business Leaders",
     "excerpt": "A CXO-level guide connecting GHG baselines, BRSR Core, and CCTS to capital access and valuation.",
     "date_label": "Jan 2026", "read_time": "10 min read", "tags": ["India", "BRSR", "GHG"],
     "external_url": "https://snowkap.com/decarbonizing-the-balance-sheet-a-strategic-guide-to-ghg-emissions-for-indias-business-leaders/",
     "body": "For India's business leaders, GHG emissions have moved from the sustainability report to the balance sheet. This strategic guide connects emissions baselines to BRSR Core assurance, CCTS obligations, capital access, and enterprise value."},
    {"type": "blog", "category": "Regulatory Intelligence",
     "title": "The Snowkap Guide to a Post-COP30 World: Key Outcomes and Business Implications",
     "excerpt": "What actually changed at COP30 — and the three decisions every enterprise should make in response.",
     "date_label": "Dec 2025", "read_time": "8 min read", "tags": ["COP30", "Policy"],
     "external_url": "https://snowkap.com/the-snowkap-guide-to-a-post-cop30-world-key-outcomes-and-business-implications/",
     "body": "COP30 produced fewer headlines and more operational consequences than any COP before it. This guide separates signal from noise and lays out the three decisions every enterprise should make in response."},
    # ---- Whitepapers (gated on snowkap.com) ----
    {"type": "whitepaper", "category": "Finance",
     "title": "Your Climate Disclosure Now Prices Your Debt",
     "excerpt": "How lenders read climate disclosure quality — and the measurable spread between leaders and laggards.",
     "tags": ["Finance", "Disclosure"], "gated": True,
     "external_url": "https://snowkap.com/your-climate-disclosure-now-prices-your-debt/",
     "body": "A finance-facing brief on how climate disclosure quality flows into the cost of debt, with the data lenders actually look at."},
    {"type": "whitepaper", "category": "Supply Chain",
     "title": "The Supplier's Emissions Playbook",
     "excerpt": "A practical playbook for suppliers asked to produce verified emissions data by their OEM customers.",
     "tags": ["Scope 3", "Suppliers"], "gated": True,
     "external_url": "https://snowkap.com/the-suppliers-emissions-playbook/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/06/Supplier-Emission.jpg",
     "body": "OEMs increasingly make verified emissions data a condition of contract. This playbook walks suppliers through baselining, evidence, and submission — step by step."},
    {"type": "whitepaper", "category": "Pharma",
     "title": "The Indian Pharma Decade",
     "excerpt": "Why the next decade of Indian pharma growth runs through ESG — regulatory exposure, buyer expectations, and the data to win.",
     "tags": ["Pharma", "India"], "gated": True,
     "external_url": "https://snowkap.com/the-indian-pharma-decade/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/Pharma-Decade.jpg",
     "body": "Indian pharmaceutical exporters face converging ESG expectations from regulators and global buyers. This whitepaper maps the exposure and the opportunity."},
    {"type": "whitepaper", "category": "India Reporting",
     "title": "The BRSR Guide",
     "excerpt": "Everything a reporting team needs on BRSR and BRSR Core: scope, assurance, timelines, and the data model to satisfy it.",
     "tags": ["BRSR", "India"], "gated": True,
     "external_url": "https://snowkap.com/brsr-guide/",
     "image": "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/BRSR-Guide.jpg",
     "body": "A complete practitioner's guide to BRSR and BRSR Core — scope, assurance requirements, timelines, and the underlying data model."},
    # ---- Webinars ----
    {"type": "webinar", "category": "AI & Automation",
     "title": "Harnessing AI and Automation to Accelerate ESG Goals",
     "excerpt": "How AI is reshaping ESG compliance, reporting, and sustainability planning — automation, regulatory adaptability, risk management, and predictive sustainability.",
     "date_label": "60 min", "status_label": "on-demand", "tags": ["Webinar", "AI"],
     "external_url": "https://snowkap.com/webinars/",
     "body": "Key highlights: AI in ESG compliance — automating data collection, assessment workflows, and multi-framework reporting · Regulatory adaptability — real-time response to evolving standards like BRSR, CSRD, and CDP · Risk management — AI-driven insights to mitigate ESG-related legal and reputational risk · Predictive sustainability — computational AI for emission forecasting and target setting."},
    {"type": "webinar", "category": "Scope 3",
     "title": "Scope 3: A Step-by-Step Roadmap for Pharma and Chemical Suppliers",
     "excerpt": "A practical session for pharma and chemical suppliers building their first credible Scope 3 baseline.",
     "date_label": "45 min", "status_label": "on-demand", "tags": ["Webinar", "Scope 3"],
     "external_url": "https://snowkap.com/scope-3-a-step-by-step-roadmap-for-pharma-and-chemical-suppliers/",
     "body": "A step-by-step roadmap covering supplier data collection, emission factor selection, and audit-ready consolidation for pharma and chemical value chains."},
    # ---- Press ----
    {"type": "press", "category": "In the News",
     "title": "Post Budget 2025: What the Union Budget Means for India's Sustainability Agenda",
     "excerpt": "Snowkap leadership on how Budget 2025 reshapes clean energy, carbon markets, and enterprise ESG incentives.",
     "date_label": "2025", "tags": ["Press"],
     "external_url": "https://snowkap.com/press/",
     "body": "Snowkap's leadership commentary on Union Budget 2025 and its implications for clean energy, carbon markets, and enterprise ESG."},
    {"type": "press", "category": "In the News",
     "title": "Why The World Needs More Women In Sustainability",
     "excerpt": "Snowkap voices on representation, leadership, and why diverse teams build better climate outcomes.",
     "date_label": "2025", "tags": ["Press"],
     "external_url": "https://snowkap.com/press/",
     "body": "Snowkap contributions on representation and leadership in sustainability."},
    {"type": "press", "category": "In the News",
     "title": "2025 Business Trends: Sustainability Moves to the Core of Strategy",
     "excerpt": "Press coverage featuring Snowkap on the year sustainability stopped being a side function.",
     "date_label": "2025", "tags": ["Press"],
     "external_url": "https://snowkap.com/press/",
     "body": "Coverage featuring Snowkap on sustainability's move into core business strategy."},
    # ---- Events ----
    {"type": "event", "category": "Executive Briefing",
     "title": "CBAM Readiness Briefing for Exporters and EU Importers",
     "excerpt": "A 45-minute executive briefing on CBAM exposure, default-value penalties, and the verified-data advantage.",
     "date_label": "Quarterly", "location": "Virtual · Live", "status_label": "upcoming", "tags": ["Event", "CBAM"],
     "external_url": "https://snowkap.com/events-webinars/",
     "body": "Quarterly executive briefing on CBAM exposure and readiness, hosted by Snowkap's regulatory team."},
]


@app.on_event("startup")
async def startup():
    # indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.subscribers.create_index("email", unique=True)
        await db.resources.create_index("slug", unique=True)
    except Exception as e:
        logger.warning(f"index warn: {e}")
    # seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@snowkap.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "Admin", "role": "admin", "created_at": now_iso()})
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})
    # seed resources (versioned — real snowkap.com content)
    meta = await db.meta.find_one({"_id": "seed"})
    if not meta or meta.get("resources_version", 0) < 3:
        await db.resources.delete_many({})
        for r in reversed(SEED_RESOURCES):
            rc = Resource(**{**r, "slug": slugify(r["title"])})
            await db.resources.insert_one(rc.to_mongo())
        await db.meta.update_one({"_id": "seed"}, {"$set": {"resources_version": 3}}, upsert=True)
        logger.info("Seeded resources v2")


@app.on_event("shutdown")
async def shutdown():
    client.close()
