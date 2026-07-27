"""Snowkap API regression tests."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback via frontend env file
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@snowkap.com"
ADMIN_PASSWORD = "Snowkap@2026"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def admin_token(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Auth ----------
class TestAuth:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200

    def test_login_success(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["user"]["email"] == ADMIN_EMAIL
        assert d["user"]["role"] == "admin"

    def test_login_invalid(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_auth(self, s):
        r = s.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, s, auth_headers):
        r = s.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------- Leads ----------
class TestLeads:
    def test_create_lead(self, s):
        r = s.post(f"{API}/leads", json={
            "kind": "advisor", "name": "TEST_User", "email": "test_lead@example.com",
            "company": "TEST Co", "message": "hello"
        })
        assert r.status_code == 200
        assert r.json()["status"] == "ok"
        assert "id" in r.json()

    def test_list_leads_requires_auth(self, s):
        r = s.get(f"{API}/leads")
        assert r.status_code == 401

    def test_list_leads(self, s, auth_headers):
        r = s.get(f"{API}/leads", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Newsletter ----------
class TestNewsletter:
    def test_subscribe(self, s):
        r = s.post(f"{API}/newsletter", json={
            "email": "test_news@example.com", "role": "CFO", "name": "TEST"
        })
        assert r.status_code == 200

    def test_subscribe_missing_role(self, s):
        r = s.post(f"{API}/newsletter", json={"email": "x@y.com"})
        assert r.status_code == 422

    def test_list_subscribers(self, s, auth_headers):
        r = s.get(f"{API}/newsletter", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Dossier ----------
class TestDossier:
    def test_save_scaling(self, s):
        r = s.post(f"{API}/dossier", json={
            "sector": "Automotive", "region": "EU", "stage": "Scaling", "company_size": "500-5000"
        })
        assert r.status_code == 200
        assert r.json()["recommended_package"] == "Growth"

    def test_save_global(self, s):
        r = s.post(f"{API}/dossier", json={"stage": "Global"})
        assert r.status_code == 200
        assert r.json()["recommended_package"] == "Enterprise"

    def test_save_default_starter(self, s):
        r = s.post(f"{API}/dossier", json={"stage": "Baseline"})
        assert r.status_code == 200
        assert r.json()["recommended_package"] == "Starter"


# ---------- CBAM ----------
class TestCbam:
    def test_sectors(self, s):
        r = s.get(f"{API}/cbam/sectors")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert any(item["name"] == "Iron & Steel" for item in data)

    def test_calc_basic(self, s):
        r = s.post(f"{API}/cbam/calculate", json={
            "sector": "Iron & Steel", "annual_tonnes": 10000
        })
        assert r.status_code == 200
        d = r.json()
        assert d["sector"] == "Iron & Steel"
        assert d["emission_factor"] == 1.9
        # verified = 10000 * 1.9 * 75.36 = 1,431,840
        assert d["verified_cost"] > 0
        assert d["default_cost"] > d["verified_cost"]
        assert d["annual_savings"] > 0

    def test_calc_with_email(self, s):
        r = s.post(f"{API}/cbam/calculate", json={
            "sector": "Aluminium", "annual_tonnes": 5000,
            "email": "test_cbam@example.com", "company": "TEST"
        })
        assert r.status_code == 200
        assert r.json()["annual_savings"] > 0


# ---------- Resources ----------
class TestResources:
    def test_list_all(self, s):
        r = s.get(f"{API}/resources")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 14
        # verify no _id in response (only id)
        for item in data:
            assert "_id" not in item
            assert "id" in item
            assert "slug" in item

    def test_filter_by_type(self, s):
        for t in ["blog", "whitepaper", "press", "event", "webinar"]:
            r = s.get(f"{API}/resources", params={"type": t})
            assert r.status_code == 200
            items = r.json()
            assert len(items) >= 1
            assert all(item["type"] == t for item in items)

    def test_get_by_slug(self, s):
        r = s.get(f"{API}/resources", params={"type": "blog"})
        slug = r.json()[0]["slug"]
        r2 = s.get(f"{API}/resources/{slug}")
        assert r2.status_code == 200
        assert r2.json()["slug"] == slug

    def test_get_404(self, s):
        r = s.get(f"{API}/resources/nonexistent-slug-xyz")
        assert r.status_code == 404

    def test_create_requires_auth(self, s):
        r = s.post(f"{API}/resources", json={"type": "blog", "title": "x"})
        assert r.status_code == 401

    def test_create_update_delete(self, s, auth_headers):
        title = f"TEST_Resource_{int(time.time())}"
        r = s.post(f"{API}/resources", json={
            "type": "blog", "title": title, "excerpt": "test", "body": "body"
        }, headers=auth_headers)
        assert r.status_code == 200
        created = r.json()
        rid = created["id"]
        assert created["title"] == title

        # verify GET
        r2 = s.get(f"{API}/resources/{created['slug']}")
        assert r2.status_code == 200

        # update
        r3 = s.put(f"{API}/resources/{rid}", json={
            "type": "blog", "title": title + "_updated", "body": "updated"
        }, headers=auth_headers)
        assert r3.status_code == 200
        assert r3.json()["title"] == title + "_updated"

        # delete
        r4 = s.delete(f"{API}/resources/{rid}", headers=auth_headers)
        assert r4.status_code == 200


# ---------- Proposals ----------
class TestProposals:
    def test_create_proposal(self, s):
        r = s.post(f"{API}/proposals", json={
            "name": "TEST_Prop", "email": "test_prop@example.com",
            "company": "TEST", "package": "Growth", "items": ["Managed Supplier Activation"]
        })
        assert r.status_code == 200
        assert "id" in r.json()

    def test_list_requires_auth(self, s):
        r = s.get(f"{API}/proposals")
        assert r.status_code == 401

    def test_list_proposals(self, s, auth_headers):
        r = s.get(f"{API}/proposals", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Admin stats ----------
class TestAdminStats:
    def test_stats_requires_auth(self, s):
        r = s.get(f"{API}/admin/stats")
        assert r.status_code == 401

    def test_stats(self, s, auth_headers):
        r = s.get(f"{API}/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ("leads", "proposals", "subscribers", "cbam_calcs", "resources", "dossiers"):
            assert k in d
            assert isinstance(d[k], int)
