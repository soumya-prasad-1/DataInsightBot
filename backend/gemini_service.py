import os
import time

from dotenv import load_dotenv
from google import genai

from backend.schema import DATABASE_SCHEMA


# ==========================================
# LOAD .ENV
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)


# ==========================================
# API KEY
# ==========================================

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in backend/.env file")


# ==========================================
# GEMINI CLIENT
# ==========================================

client = genai.Client(api_key=api_key)


# ==========================================
# MODEL
# ==========================================

MODEL_NAME = "gemini-3.5-flash-lite"


# ==========================================
# GEMINI REQUEST
# ==========================================

def generate_content(prompt):

    max_retries = 3

    for attempt in range(max_retries):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )

            return response

        except Exception as error:

            error_message = str(error)

            if (
                "503" in error_message
                or "UNAVAILABLE" in error_message
            ):

                if attempt < max_retries - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                else:

                    raise Exception(
                        "Gemini is temporarily unavailable. "
                        "Please try again in a few seconds."
                    )

            else:

                raise error


# ==========================================
# GENERATE SQL
# ==========================================

def generate_sql(question):

    prompt = f"""
You are an AI Business Analyst.

Convert the user's question into a SQLite SQL query.

DATABASE SCHEMA:

{DATABASE_SCHEMA}

RULES:

1. Generate only SELECT queries.
2. Do not use INSERT.
3. Do not use UPDATE.
4. Do not use DELETE.
5. Do not use DROP.
6. Do not use ALTER.
7. Do not use CREATE.
8. Use only tables and columns present in the schema.
9. Return only the SQL query.
10. Do not use markdown.
11. The database is SQLite.

USER QUESTION:

{question}
"""

    response = generate_content(prompt)

    sql = response.text.strip()

    # Remove markdown if Gemini adds it
    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")

    return sql.strip()


# ==========================================
# EXPLAIN RESULT
# ==========================================

def explain_result(question, sql, result):

    prompt = f"""
You are an AI Business Analyst.

Explain the database result to the user
in simple and clear business language.

USER QUESTION:

{question}

SQL QUERY:

{sql}

DATABASE RESULT:

{result}

Give a short and easy-to-understand explanation.

Do not mention internal programming details.
"""

    response = generate_content(prompt)

    return response.text.strip()