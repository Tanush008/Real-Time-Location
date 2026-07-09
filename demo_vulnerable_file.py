"""User management module — intentionally contains seeded issues for demo purposes."""
import sqlite3
import pickle
import subprocess

# --- Security issues ---

# 1. Hardcoded secret (Gitleaks + Semgrep hardcoded-secret-assignment)
API_KEY = "sk_live_51H8xJ9aB3cD4eF5gH6iJ7kL8mN9oP0qR"

def get_user(conn, username):
    # 2. SQL injection via string formatting (Semgrep sql-string-concat-injection)
    query = "SELECT * FROM users WHERE username = '%s'" % username
    return conn.execute(query).fetchone()

def run_user_command(cmd):
    # 3. eval() on external input (Bandit B307 + Semgrep python-eval-usage)
    return eval(cmd)

def load_session(data):
    # 4. insecure deserialization (Semgrep insecure-deserialization-pickle)
    return pickle.loads(data)

def run_backup(path):
    # 5. shell injection via subprocess shell=True (Semgrep subprocess-shell-true)
    subprocess.run("tar -cvf backup.tar " + path, shell=True)


# --- Code quality issues (checked against docs/coding-standards.md) ---

def process(a, b, c, d, e, f, g):  # too many params (standards: max 5)
    # deeply nested conditionals (standards: max 3 levels, use guard clauses)
    if a:
        if b:
            if c:
                if d:
                    return e + f + g
    return None

def valid(x):  # boolean function not named as predicate (should be is_valid)
    return x > 0

def doStuff(Data):  # wrong naming convention: should be snake_case
    try:
        result = Data / 0
    except:  # bare except (standards: never use bare except)
        pass
    return result
