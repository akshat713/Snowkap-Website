from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated, Any

import bcrypt
import jwt
import httpx
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
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
            <span style="color:#00E599;font-size:20px;font-weight:800;letter-spacing:-0.5px;">Snowkap</span>
            <span style="color:#5A5D6B;font-size:12px;letter-spacing:2px;text-transform:uppercase;float:right;padding-top:6px;">ESG Intelligence</span>
          </td></tr>
          <tr><td style="padding:36px;">
            <h1 style="color:#ffffff;font-size:22px;margin:0 0 18px;">{title}</h1>
            <div style="color:#A0A2AB;font-size:15px;line-height:1.6;">{body_html}</div>
          </td></tr>
          <tr><td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.08);color:#5A5D6B;font-size:12px;">
            Snowkap — Compliance doesn't stop at your border. Neither do we.
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
    {"type": "blog", "category": "Regulatory Explainer", "title": "What CBAM Wave 2 means for automotive importers",
     "excerpt": "A plain-English walkthrough of the phase-in, the sectors affected, and what changes for Tier 1 suppliers.",
     "date_label": "Jun 2026", "read_time": "6 min read", "tags": ["CBAM", "Automotive"],
     "body": "CBAM Wave 2 extends the Carbon Border Adjustment Mechanism into new product categories. For automotive importers, the practical effect is that verified embedded-emissions data becomes a condition of trade, not a nice-to-have. This piece walks through the phase-in timeline, which sectors are pulled in, and what Tier 1 suppliers must prepare over the next two quarters."},
    {"type": "blog", "category": "Sector Deep Dive", "title": "Financed emissions: the Scope 3 category most portfolios ignore",
     "excerpt": "Category 15 is now an active screening criterion for LPs. Here's how financial institutions are catching up.",
     "date_label": "May 2026", "read_time": "8 min read", "tags": ["Scope 3", "Finance"],
     "body": "Financed emissions — Scope 3, Category 15 — are increasingly the single largest line in a financial institution's footprint. This deep dive covers PCAF methodology, data sourcing across portfolio companies, and why LPs now screen on it."},
    {"type": "blog", "category": "Data & Methodology", "title": "Why default values cost more than verified data, every time",
     "excerpt": "The math behind CBAM default markups, and why primary data pays for itself inside one certificate cycle.",
     "date_label": "May 2026", "read_time": "5 min read", "tags": ["CBAM", "Data"],
     "body": "CBAM default values embed a deliberate penalty premium. This article runs the numbers on why verified primary data typically pays for itself within a single certificate cycle."},
    {"type": "blog", "category": "Sector Deep Dive", "title": "EUDR and the beverage supply chain: what's actually in scope",
     "excerpt": "Deforestation-free sourcing rules explained for packaging, cocoa, coffee, and rubber-adjacent supply chains.",
     "date_label": "Apr 2026", "read_time": "7 min read", "tags": ["EUDR", "Beverages"],
     "body": "The EU Deforestation Regulation touches more of the beverage supply chain than most teams assume. Here's what's in scope across packaging, cocoa, coffee and rubber-adjacent inputs."},
    {"type": "whitepaper", "category": "Automotive", "title": "What Germany's Automotive Sector Must Prepare Before CBAM Wave 2",
     "excerpt": "CFO- and procurement-facing — quantifies the cost of inaction and what to do in the next two quarters.",
     "tags": ["Automotive", "EU", "CBAM"], "gated": True,
     "body": "A CFO- and procurement-facing brief quantifying the cost of inaction ahead of CBAM Wave 2."},
    {"type": "whitepaper", "category": "Global", "title": "The State of Supplier ESG Data Across Emerging Markets",
     "excerpt": "Response rates, data quality, and what actually gets non-responsive suppliers to submit primary data.",
     "tags": ["Global", "Supply Chain"], "gated": True,
     "body": "Field data on supplier response rates, data quality, and what actually moves non-responsive suppliers."},
    {"type": "whitepaper", "category": "Reporting", "title": "Multi-Framework Reporting: One Dataset, 25+ Filings",
     "excerpt": "How a single data model satisfies CBAM, CSRD, BRSR, GRI, and IFRS S1/S2 simultaneously.",
     "tags": ["CSRD", "BRSR", "GRI"], "gated": True,
     "body": "How a single source-of-truth data model can satisfy 25+ frameworks from one data entry."},
    {"type": "press", "category": "Company Update", "title": "Snowkap opens EU market entry with Germany and Austria focus",
     "excerpt": "New DACH-focused go-to-market brings verified supplier data infrastructure to European automotive OEMs and importers.",
     "date_label": "Jun 2026", "tags": ["Press"],
     "body": "Snowkap announces a DACH-focused market entry, bringing verified supplier-data infrastructure to European automotive OEMs and importers."},
    {"type": "press", "category": "Partnership", "title": "EcoVadis Carbon Data Network adds strategic verified-data partners",
     "excerpt": "Industry-wide push toward primary-data interoperability across major carbon accounting platforms.",
     "date_label": "Apr 2026", "tags": ["Press"],
     "body": "An industry-wide push toward primary-data interoperability across major carbon accounting platforms."},
    {"type": "press", "category": "Milestone", "title": "Snowkap crosses 700 activated suppliers across Tier 1 and Tier 2 networks",
     "excerpt": "Milestone reflects sustained demand for Managed Supplier Activation across automotive, manufacturing, and consumer goods.",
     "date_label": "Feb 2026", "tags": ["Press"],
     "body": "A milestone reflecting sustained demand for Managed Supplier Activation across sectors."},
    {"type": "event", "category": "Executive Briefing", "title": "CBAM Wave 2 Liability Briefing — Frankfurt",
     "excerpt": "45-minute executive briefing for CSOs and Heads of Sustainability on Wave 2 exposure and what to prepare now.",
     "date_label": "Oct 2026", "location": "In-person · Frankfurt, Germany", "status_label": "upcoming", "tags": ["Event"],
     "body": "A 45-minute executive briefing on CBAM Wave 2 exposure for CSOs and Heads of Sustainability."},
    {"type": "event", "category": "Executive Briefing", "title": "CBAM Wave 2 Liability Briefing — Munich",
     "excerpt": "Same briefing, Munich stop — built for the Bavarian automotive supply base.",
     "date_label": "Oct 2026", "location": "In-person · Munich, Germany", "status_label": "upcoming", "tags": ["Event"],
     "body": "The Munich stop of the DACH roadshow, built for the Bavarian automotive supply base."},
    {"type": "webinar", "category": "Live Demo", "title": "Multi-Framework Reporting: Live Demo",
     "excerpt": "See one data entry mapped across CBAM, CSRD, BRSR, GRI and IFRS in real time.",
     "date_label": "38 min", "status_label": "on-demand", "tags": ["Webinar"],
     "body": "An on-demand demo of one data entry mapped across 25+ frameworks."},
    {"type": "webinar", "category": "CFO Series", "title": "CBAM Cost Modelling for CFOs",
     "excerpt": "How to model CBAM exposure and the ROI of verified data for the finance function.",
     "date_label": "Jul 2026", "status_label": "upcoming", "tags": ["Webinar"],
     "body": "A live session on modelling CBAM exposure and the ROI of verified data for the finance function."},
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
    # seed resources
    if await db.resources.count_documents({}) == 0:
        for r in SEED_RESOURCES:
            rc = Resource(**{**r, "slug": slugify(r["title"])})
            await db.resources.insert_one(rc.to_mongo())
        logger.info("Seeded resources")


@app.on_event("shutdown")
async def shutdown():
    client.close()
