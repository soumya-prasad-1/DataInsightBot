const API_URL = "http://127.0.0.1:8000";


async function askQuestion() {

    const question = document
        .getElementById("question")
        .value
        .trim();

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    document
        .getElementById("loading")
        .classList.remove("hidden");

    document
        .getElementById("result")
        .classList.add("hidden");

    try {

        const response = await fetch(
            `${API_URL}/ask`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error);
        }

        document.getElementById("explanation")
            .textContent = data.explanation;

        document.getElementById("sql")
            .textContent = data.sql;

        createTable(
            data.columns,
            data.rows
        );

        document
            .getElementById("result")
            .classList.remove("hidden");

    } catch (error) {

        alert(
            "Error: " + error.message
        );

    } finally {

        document
            .getElementById("loading")
            .classList.add("hidden");
    }
}


function createTable(columns, rows) {

    let html = "<table><thead><tr>";

    columns.forEach(column => {
        html += `<th>${column}</th>`;
    });

    html += "</tr></thead><tbody>";

    rows.forEach(row => {

        html += "<tr>";

        row.forEach(value => {
            html += `<td>${value}</td>`;
        });

        html += "</tr>";
    });

    html += "</tbody></table>";

    document.getElementById(
        "table-container"
    ).innerHTML = html;
}


async function showPrediction() {

    document
        .getElementById("result")
        .classList.add("hidden");

    document
        .getElementById("prediction")
        .classList.remove("hidden");

    try {

        const response = await fetch(
            `${API_URL}/prediction`
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error);
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
                    <td>${item.sale_date}</td>
                    <td>${Number(
                        item.predicted_revenue
                    ).toFixed(2)}</td>
                </tr>
            `;
        });

        html += "</tbody></table>";

        document.getElementById(
            "prediction-table"
        ).innerHTML = html;

    } catch (error) {

        alert(
            "Prediction error: " +
            error.message
        );
    }
}


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