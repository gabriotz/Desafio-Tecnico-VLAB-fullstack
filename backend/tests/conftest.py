import sys
import os
import pytest
import asyncio

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope="session")
def event_loop():
    """Create a session-scoped event loop to share across all tests."""
    policy = asyncio.DefaultEventLoopPolicy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()
