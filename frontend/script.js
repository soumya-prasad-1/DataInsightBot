const API_URL = "";

let currentSQL = "";


// =====================================================
// RECENT QUESTIONS HISTORY
// =====================================================

const HISTORY_KEY = "datainsightbot_recent_questions";

const MAX_HISTORY = 8;


// Get saved history

function getHistory() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem(HISTORY_KEY) || "[]"
            );

        if (Array.isArray(history)) {
            return history;
        }

        return [];

    } catch (error) {

        return [];
    }
}


// Save question to history

function saveQuestionToHistory(question) {

    const cleanQuestion =
        question.trim();

    if (!cleanQuestion) {
        return;
    }


    let history =
        getHistory();


    // Remove duplicate question

    history =
        history.filter(
            item =>
                item.trim().toLowerCase() !==
                cleanQuestion.toLowerCase()
        );


    // Put newest question at the top

    history.unshift(cleanQuestion);


    // Keep only latest 8 questions

    history =
        history.slice(0, MAX_HISTORY);


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );


    renderHistory();
}


// Render history in sidebar

function renderHistory() {

    const container =
        document.getElementById(
            "recent-history-list"
        );

    const clearButton =
        document.getElementById(
            "clear-history"
        );


    // Safety check

    if (!container || !clearButton) {
        return;
    }


    const history =
        getHistory();


    // No history

    if (!history.length) {

        container.innerHTML = `
            <div class="history-empty">
                No recent questions
            </div>
        `;

        clearButton.classList.add("hidden");

        return;
    }


    // Show clear button

    clearButton.classList.remove("hidden");


    // Clear previous history

    container.innerHTML = "";


    // Create history items

    history.forEach(question => {

        const button =
            document.createElement("button");


        button.type = "button";

        button.className =
            "history-item";


        button.title =
            question;


        button.textContent =
            question;


        // When user clicks old question

        button.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "question"
                    );


                input.value =
                    question;


                input.focus();


                // Highlight input

                input.style.borderColor =
                    "#6366f1";


                setTimeout(() => {

                    input.style.borderColor =
                        "";

                }, 800);


                // If on mobile,
                // open AI Analyst

                if (window.innerWidth <= 750) {

                    showAnalyst();

                }

            }
        );


        container.appendChild(button);

    });
}


// Clear all history

function clearHistory() {

    localStorage.removeItem(
        HISTORY_KEY
    );


    renderHistory();
}


// =====================================================
// ASK QUESTION
// =====================================================

async function askQuestion() {

    const questionInput =
        document.getElementById("question");


    const question =
        questionInput.value.trim();


    if (!question) {

        questionInput.focus();

        questionInput.classList.add(
            "input-error"
        );


        setTimeout(() => {

            questionInput.classList.remove(
                "input-error"
            );

        }, 1000);

        return;
    }


    const loading =
        document.getElementById("loading");


    const result =
        document.getElementById("result");


    const analyzeButton =
        document.getElementById(
            "analyze-button"
        );


    const analyzeText =
        document.getElementById(
            "analyze-text"
        );


    // Hide previous result

    result.classList.add("hidden");


    // Show loading

    loading.classList.remove("hidden");


    // Disable button

    analyzeButton.disabled = true;

    analyzeText.textContent =
        "Analyzing";


    // Loading messages

    const loadingTitle =
        document.getElementById(
            "loading-title"
        );


    const loadingSubtitle =
        document.getElementById(
            "loading-subtitle"
        );


    loadingTitle.textContent =
        "DataInsightBot is thinking...";


    loadingSubtitle.textContent =
        "Understanding your question";


    const loadingSteps = [

        {
            title:
                "DataInsightBot is thinking...",
            subtitle:
                "Understanding your question"
        },

        {
            title:
                "Generating SQL...",
            subtitle:
                "Creating a database query"
        },

        {
            title:
                "Analyzing your data...",
            subtitle:
                "Finding useful business insights"
        }

    ];


    let step = 0;


    const loadingInterval =
        setInterval(() => {

            step++;


            if (
                step <
                loadingSteps.length
            ) {

                loadingTitle.textContent =
                    loadingSteps[step].title;


                loadingSubtitle.textContent =
                    loadingSteps[step].subtitle;

            }

        }, 700);


    try {

        const response =
            await fetch(
                `${API_URL}/ask`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question: question
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `Server error (${response.status})`
            );
        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );
        }


        // ==========================================
        // SAVE SUCCESSFUL QUESTION TO HISTORY
        // ==========================================

        saveQuestionToHistory(
            question
        );


        // Save SQL

        currentSQL =
            data.sql || "";


        // Show user's question

        document.getElementById(
            "asked-question"
        ).textContent =
            question;


        // Show AI explanation

        document.getElementById(
            "explanation"
        ).textContent =
            data.explanation ||
            "No explanation available.";


        // Show SQL

        document.getElementById(
            "sql"
        ).textContent =
            data.sql ||
            "No SQL generated.";


        // Create table

        createTable(
            data.columns || [],
            data.rows || []
        );


        // Result count

        const resultCount =
            document.getElementById(
                "result-count"
            );


        const rowCount =
            data.rows
                ? data.rows.length
                : 0;


        resultCount.textContent =
            `${rowCount} ${
                rowCount === 1
                    ? "row"
                    : "rows"
            }`;


        // Reset SQL section

        document
            .getElementById(
                "sql-content"
            )
            .classList.add("hidden");


        document
            .getElementById(
                "sql-arrow"
            )
            .textContent =
                "▼";


        // Show results

        result.classList.remove(
            "hidden"
        );


        // Scroll smoothly to result

        setTimeout(() => {

            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);


    } catch (error) {

        showError(
            error.message
        );

    } finally {

        clearInterval(
            loadingInterval
        );


        loading.classList.add(
            "hidden"
        );


        analyzeButton.disabled =
            false;


        analyzeText.textContent =
            "Analyze";
    }
}


// =====================================================
// CREATE TABLE
// =====================================================

function createTable(columns, rows) {

    const container =
        document.getElementById(
            "table-container"
        );


    if (!columns.length) {

        container.innerHTML = `
            <div class="empty-result">
                No data was returned.
            </div>
        `;

        return;
    }


    let html =
        "<table><thead><tr>";


    columns.forEach(column => {

        html += `
            <th>
                ${escapeHTML(column)}
            </th>
        `;

    });


    html +=
        "</tr></thead><tbody>";


    if (!rows.length) {

        html += `
            <tr>
                <td colspan="${columns.length}">
                    No matching records found.
                </td>
            </tr>
        `;

    } else {

        rows.forEach(row => {

            html += "<tr>";


            row.forEach(value => {

                html += `
                    <td>
                        ${escapeHTML(value)}
                    </td>
                `;

            });


            html += "</tr>";

        });

    }


    html +=
        "</tbody></table>";


    container.innerHTML =
        html;
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// SET QUESTION
// =====================================================

function setQuestion(question) {

    const input =
        document.getElementById(
            "question"
        );


    input.value =
        question;


    input.focus();


    input.style.borderColor =
        "#6366f1";


    setTimeout(() => {

        input.style.borderColor =
            "";

    }, 800);
}


// =====================================================
// NEW QUESTION
// =====================================================

function newQuestion() {

    const input =
        document.getElementById(
            "question"
        );


    input.value = "";


    document
        .getElementById("result")
        .classList.add(
            "hidden"
        );


    input.focus();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// TOGGLE SQL
// =====================================================

function toggleSQL() {

    const content =
        document.getElementById(
            "sql-content"
        );


    const arrow =
        document.getElementById(
            "sql-arrow"
        );


    const isHidden =
        content.classList.contains(
            "hidden"
        );


    if (isHidden) {

        content.classList.remove(
            "hidden"
        );

        arrow.textContent =
            "▲";

    } else {

        content.classList.add(
            "hidden"
        );

        arrow.textContent =
            "▼";
    }
}


// =====================================================
// COPY SQL
// =====================================================

async function copySQL(event) {

    event.stopPropagation();


    if (!currentSQL) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            currentSQL
        );


        const button =
            event.currentTarget;


        const originalText =
            button.textContent;


        button.textContent =
            "Copied ✓";


        setTimeout(() => {

            button.textContent =
                originalText;

        }, 1500);


    } catch (error) {

        alert(
            "Could not copy SQL."
        );
    }
}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    const result =
        document.getElementById(
            "result"
        );


    result.innerHTML = `

        <div class="error-card">

            <div class="error-icon">
                ⚠️
            </div>

            <div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

                <button
                    onclick="newQuestion()"
                    class="new-question-button"
                >
                    Try again
                </button>

            </div>

        </div>

    `;


    result.classList.remove(
        "hidden"
    );
}


// =====================================================
// SHOW ANALYST
// =====================================================

function showAnalyst() {

    document
        .getElementById(
            "analyst-section"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "prediction"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "page-title"
        )
        .textContent =
            "AI Analyst";


    updateSidebar(0);
}


// =====================================================
// SHOW PREDICTION
// =====================================================

async function showPrediction() {

    document
        .getElementById(
            "analyst-section"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "prediction"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "page-title"
        )
        .textContent =
            "ML Prediction";


    updateSidebar(1);


    try {

        const response =
            await fetch(
                `${API_URL}/prediction`
            );


        if (!response.ok) {

            throw new Error(
                `Server error (${response.status})`
            );
        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error ||
                "Prediction failed."
            );
        }


        let html = `
            <table>

                <thead>

                    <tr>
                        <th>Date</th>
                        <th>Predicted Revenue</th>
                    </tr>

                </thead>

                <tbody>
        `;


        result.data.forEach(item => {

            html += `
                <tr>

                    <td>
                        ${escapeHTML(
                            item.sale_date
                        )}
                    </td>

                    <td>
                        ${Number(
                            item.predicted_revenue
                        ).toFixed(2)}
                    </td>

                </tr>
            `;

        });


        html += `
                </tbody>

            </table>
        `;


        document.getElementById(
            "prediction-table"
        ).innerHTML =
            html;


    } catch (error) {

        document.getElementById(
            "prediction-table"
        ).innerHTML = `

            <div class="empty-result">

                Prediction error:
                ${escapeHTML(
                    error.message
                )}

            </div>

        `;
    }
}


// =====================================================
// SIDEBAR
// =====================================================

function updateSidebar(activeIndex) {

    const buttons =
        document.querySelectorAll(
            ".sidebar-button"
        );


    buttons.forEach(
        (button, index) => {

            if (
                index === activeIndex
            ) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );
            }

        }
    );
}


// =====================================================
// ENTER KEY
// =====================================================

document
    .getElementById("question")
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                askQuestion();

            }

        }
    );


// =====================================================
// LOAD HISTORY WHEN PAGE OPENS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderHistory();

    }
);