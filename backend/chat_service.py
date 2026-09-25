from backend.gemini_service import generate_sql, explain_result
from backend.database_query import execute_query
from backend.sql_validator import validate_sql


def chat_with_database(question):
    """
    Complete DataInsightBot pipeline:

    User Question
        ↓
    Gemini generates SQL
        ↓
    SQL Validator
        ↓
    SQLite Database
        ↓
    Gemini explains result
        ↓
    Final Answer
    """

    # =========================
    # Step 1: Generate SQL
    # =========================

    sql = generate_sql(question)

    # =========================
    # Step 2: Validate SQL
    # =========================

    valid, validation_message = validate_sql(sql)

    if not valid:
        return {
            "success": False,
            "question": question,
            "sql": sql,
            "error": validation_message
        }

    # =========================
    # Step 3: Execute SQL
    # =========================

    result = execute_query(sql)

    # =========================
    # Step 4: Check database error
    # =========================

    if "error" in result:
        return {
            "success": False,
            "question": question,
            "sql": sql,
            "error": result["error"]
        }

    # =========================
    # Step 5: Generate explanation
    # =========================

    explanation = explain_result(
        question,
        sql,
        result["rows"]
    )

    # =========================
    # Step 6: Return everything
    # =========================

    return {
        "success": True,
        "question": question,
        "sql": sql,
        "columns": result["columns"],
        "rows": result["rows"],
        "explanation": explanation
    }


# ==========================================
# Test Chatbot
# ==========================================

if __name__ == "__main__":

    print("=" * 60)
    print("DataInsightBot - AI Powered Business Analyst")
    print("=" * 60)

    # Ask user for question
    question = input("\nAsk your question: ")

    print("\nProcessing your question...")

    try:

        response = chat_with_database(question)

        # =========================
        # Successful response
        # =========================

        if response["success"]:

            print("\n" + "=" * 60)
            print("ANSWER")
            print("=" * 60)

            print("\n" + response["explanation"])

            # =========================
            # Show SQL
            # =========================

            print("\n" + "-" * 60)
            print("GENERATED SQL")
            print("-" * 60)

            print(response["sql"])

            # =========================
            # Show database result
            # =========================

            print("\n" + "-" * 60)
            print("DATABASE RESULT")
            print("-" * 60)

            print("Columns:")
            print(response["columns"])

            print("\nRows:")

            if len(response["rows"]) == 0:
                print("No results found.")

            else:
                for row in response["rows"]:
                    print(row)

        # =========================
        # Failed response
        # =========================

        else:

            print("\n" + "=" * 60)
            print("QUERY FAILED")
            print("=" * 60)

            print("\nError:")
            print(response["error"])

            print("\nGenerated SQL:")
            print(response["sql"])

    except Exception as error:

        print("\n" + "=" * 60)
        print("ERROR")
        print("=" * 60)

        print(error)

    print("\n" + "=" * 60)
    print("Process completed.")
    print("=" * 60)