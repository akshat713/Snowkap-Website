"""Tests for new chat endpoints and resource v3 fields (external_url, image)."""
import os
import json
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"


# ---- Resources v3 ----
class TestResourcesV3:
    def test_blog_has_external_url_and_image(self):
        r = requests.get(f"{API}/resources", params={"type": "blog"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 8, f"expected >=8 blog items, got {len(items)}"
        with_external = [i for i in items if i.get("external_url")]
        with_image = [i for i in items if i.get("image")]
        assert len(with_external) >= 6, f"expected most blogs to have external_url, got {len(with_external)}"
        assert len(with_image) >= 5, f"expected most blogs to have image, got {len(with_image)}"
        # verify external_url points to snowkap.com
        for i in with_external:
            assert "snowkap.com" in i["external_url"]

    def test_whitepapers_count(self):
        r = requests.get(f"{API}/resources", params={"type": "whitepaper"})
        assert r.status_code == 200
        assert len(r.json()) >= 4

    def test_press_has_external_url(self):
        r = requests.get(f"{API}/resources", params={"type": "press"})
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 3
        assert any(i.get("external_url") for i in items)

    def test_webinars(self):
        r = requests.get(f"{API}/resources", params={"type": "webinar"})
        assert r.status_code == 200
        assert len(r.json()) >= 2

    def test_events(self):
        r = requests.get(f"{API}/resources", params={"type": "event"})
        assert r.status_code == 200
        assert len(r.json()) >= 1


# ---- Chat (LLM budget: exactly 2 short messages total) ----
class TestChat:
    def test_history_empty_new_session(self):
        sid = f"pytest-{uuid.uuid4()}"
        r = requests.get(f"{API}/chat/history/{sid}")
        assert r.status_code == 200
        assert r.json() == []

    def test_stream_two_messages_and_history_persists(self):
        """Send 2 short messages, verify SSE streaming + persisted history."""
        sid = f"pytest-chat-{uuid.uuid4()}"
        messages = [
            "What is Snowkap in one sentence?",
            "And which frameworks do you support?",
        ]
        for msg in messages:
            with requests.post(
                f"{API}/chat/stream",
                json={"session_id": sid, "message": msg},
                stream=True,
                timeout=90,
            ) as r:
                assert r.status_code == 200, r.text
                got_delta = False
                got_done = False
                collected = ""
                for line in r.iter_lines(decode_unicode=True):
                    if not line:
                        continue
                    if line.startswith("data: "):
                        payload = line[6:]
                        if payload == "[DONE]":
                            got_done = True
                            break
                        try:
                            obj = json.loads(payload)
                        except Exception:
                            continue
                        if "delta" in obj:
                            got_delta = True
                            collected += obj["delta"]
                        elif "error" in obj:
                            pytest.fail(f"chat error: {obj['error']}")
                assert got_done, "did not receive [DONE]"
                assert got_delta, "no delta events received"
                assert len(collected) > 5, f"response too short: {collected!r}"

        # Verify history persisted: 2 user + 2 assistant messages
        h = requests.get(f"{API}/chat/history/{sid}")
        assert h.status_code == 200
        hist = h.json()
        roles = [m["role"] for m in hist]
        assert roles.count("user") == 2, f"expected 2 user msgs, got {roles}"
        assert roles.count("assistant") == 2, f"expected 2 assistant msgs, got {roles}"
        # ordering: alternates user, assistant, user, assistant
        assert roles == ["user", "assistant", "user", "assistant"], roles
