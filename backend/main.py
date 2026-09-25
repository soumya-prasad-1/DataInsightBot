from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.chat_service import chat_with_database
from backend.ml_prediction import predict_future_sales


app = FastAPI(title="DataInsightBot API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Question(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "DataInsightBot API is running"
    }


@app.post("/ask")
def ask_question(data: Question):

    if not data.question.strip():
        return {
            "success": False,
            "error": "Please enter a question."
        }

    try:

        result = chat_with_database(
            data.question
        )

        return result

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }


@app.get("/prediction")
def prediction():

    try:

        data = predict_future_sales(30)

        data["sale_date"] = data[
            "sale_date"
        ].astype(str)

        return {
            "success": True,
            "data": data.to_dict(
                orient="records"
            )
        }

    except Exception as error:

        return {
            "success": False,
            "error": str(error)
        }