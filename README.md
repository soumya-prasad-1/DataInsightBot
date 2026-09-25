# DataInsightBot 🤖📊

DataInsightBot is an AI-powered business analytics project that helps users understand company data by simply asking questions in natural language.

Instead of manually writing SQL queries, users can ask questions like **"Which department has the highest average salary?"** and the application uses Gemini AI to generate the required SQL query, fetch the data from the database, and explain the result in simple terms.

The project also includes a Machine Learning module that uses Random Forest to predict future sales revenue.

## ✨ Features

- Ask questions about company data using natural language
- Automatically generate SQL queries using Gemini AI
- Execute queries on a SQLite database
- Get AI-generated explanations of query results
- View query results in a clean table
- Predict future sales revenue using Machine Learning
- Modern web interface built with HTML, CSS and JavaScript
- SQL validation for safer database queries

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- Uvicorn

### AI
- Google Gemini API
- google-genai

### Database
- SQLite

### Machine Learning
- Pandas
- Scikit-learn
- Random Forest Regression

## 📁 Project Structure

    DataInsightBot/
    │
    ├── backend/
    │   ├── database/
    │   ├── chat_service.py
    │   ├── database_query.py
    │   ├── database_setup.py
    │   ├── gemini_service.py
    │   ├── insert_data.py
    │   ├── main.py
    │   ├── ml_prediction.py
    │   ├── schema.py
    │   ├── sql_validator.py
    │   └── test_database.py
    │
    ├── frontend/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    │
    ├── .gitignore
    └── README.md

## 🔄 How It Works

The AI Analyst follows this simple flow:

    User Question
          ↓
      Gemini AI
          ↓
    SQL Query Generation
          ↓
      SQL Validation
          ↓
    SQLite Database
          ↓
      Query Result
          ↓
     AI Explanation
          ↓
         User

For example, a user can ask:

> Which department has the highest average salary?

DataInsightBot converts the question into an SQL query, runs it on the database, and then explains the result in simple terms.

The ML module works separately by using historical sales data with a Random Forest model to generate future revenue predictions.

## 🚀 How to Run

### 1. Clone the Repository

    git clone https://github.com/soumya-prasad-1/DataInsightBot.git
    cd DataInsightBot

### 2. Install the Required Packages

    pip install fastapi uvicorn python-dotenv pandas scikit-learn google-genai

### 3. Add Your Gemini API Key

Create a file named `.env` inside the `backend` folder.

    backend/.env

Add your API key:

    GEMINI_API_KEY=your_api_key_here

Keep this file private. Do not upload it to GitHub.

### 4. Start the Backend

Run this command from the project folder:

    uvicorn backend.main:app --reload

The backend will run at:

    http://127.0.0.1:8000

### 5. Open the Frontend

Open `frontend/index.html` using VS Code Live Server.

## 💬 Example Questions

You can ask questions such as:

- Which department has the highest average salary?
- Which department has the most employees?
- What are the total sales?
- Show me the sales data.
- Which department has the lowest average salary?

## 📈 Machine Learning

The project includes a Random Forest Regression model for sales prediction.

It uses historical sales data to learn patterns and predict future revenue. The predictions are displayed directly in the web interface.

## 🔐 Security

The project includes SQL validation before executing generated queries.

The Gemini API key is stored in an environment file and is excluded from GitHub using `.gitignore`.

## 🎯 What I Learned

While building DataInsightBot, I worked with:

- Natural language to SQL generation
- Gemini API integration
- FastAPI backend development
- SQLite database operations
- SQL validation
- Machine Learning with Random Forest
- HTML, CSS and JavaScript
- Connecting a frontend with a Python backend
- Handling API responses and errors

## 👩‍💻 Author

**Soumya Prasad**

B.Tech CSE (Data Science)

GitHub: https://github.com/soumya-prasad-1