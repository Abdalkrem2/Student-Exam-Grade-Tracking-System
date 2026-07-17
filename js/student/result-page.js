// =========================
// Check logged-in student
// =========================

const student = requireRole("Student");


// =========================
// Get data using storage.js
// =========================

const results = getResults();

const selectedResultId =
    localStorage.getItem("selectedResultId");

const result = results.find(function (item) {
    return item.id === selectedResultId;
});


// =========================
// Get HTML elements
// =========================

const resultCard =
    document.getElementById("resultCard");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const examName =
    document.getElementById("examName");

const resultStatus =
    document.getElementById("resultStatus");

const scoreElement =
    document.getElementById("score");

const correctAnswersElement =
    document.getElementById("correctAnswers");

const incorrectAnswersElement =
    document.getElementById("incorrectAnswers");

const totalQuestionsElement =
    document.getElementById("totalQuestionsResult");

const resultMessage =
    document.getElementById("resultMessage");

const resultDescription =
    document.getElementById("resultDescription");

const reviewExamBtn =
    document.getElementById("reviewExamBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const confettiContainer =
    document.getElementById("confettiContainer");


// =========================
// Check result
// =========================

if (student && result) {

    // Make sure this result belongs to the student
    if (result.studentId === student.id) {
        displayResult();
    } else {
        showResultNotFound();
    }

} else if (student) {

    showResultNotFound();

}


// =========================
// Result not found
// =========================

function showResultNotFound() {

    resultTitle.textContent =
        "Result Not Found";

    resultDescription.textContent =
        "No exam result is available.";

    resultIcon.textContent = "!";

    reviewExamBtn.textContent =
        "Back to Dashboard";
}


// =========================
// Display result
// =========================

function displayResult() {

    // Find exam using storage.js
    const exam =
        getExamById(result.examId);


    // Get exam information
    let examTitle = "Exam";
    let totalQuestions = 0;

    if (exam) {

        examTitle = exam.title;

        totalQuestions =
            exam.questions.length;

    }


    // Calculate correct answers
    const correctAnswers = Math.round(
        (result.score / 100) *
        totalQuestions
    );


    // Calculate incorrect answers
    const incorrectAnswers =
        totalQuestions - correctAnswers;


    // Display result information
    examName.textContent =
        examTitle;

    scoreElement.textContent =
        result.score + "/100";

    correctAnswersElement.textContent =
        correctAnswers;

    incorrectAnswersElement.textContent =
        incorrectAnswers;

    totalQuestionsElement.textContent =
        totalQuestions;


    // Passed or failed
    if (result.passed === true) {

        showPassedResult();

    } else {

        showFailedResult();

    }
}


// =========================
// Passed state
// =========================

function showPassedResult() {

    resultCard.classList.add("passed");

    resultIcon.textContent = "✓";

    resultTitle.textContent =
        "Congratulations!";

    resultStatus.textContent =
        "PASSED";

    resultMessage.textContent =
        "Great work! You passed the exam.";

    resultDescription.textContent =
        "Keep learning and continue your excellent progress.";

    createConfetti();
}


// =========================
// Failed state
// =========================

function showFailedResult() {

    resultCard.classList.add("failed");

    resultIcon.textContent = "×";

    resultTitle.textContent =
        "Keep Trying!";

    resultStatus.textContent =
        "FAILED";

    resultMessage.textContent =
        "You did not pass this exam.";

    resultDescription.textContent =
        "Review the material and keep practicing for future exams.";
}


// =========================
// Create simple confetti
// =========================

function createConfetti() {

    const colors = [
        "#13b86d",
        "#0063ca",
        "#8250ed",
        "#f5b942"
    ];

    for (let i = 0; i < 20; i++) {

        const confetti =
            document.createElement("span");

        confetti.className =
            "confetti";

        const randomColor =
            Math.floor(
                Math.random() * colors.length
            );

        confetti.style.backgroundColor =
            colors[randomColor];

        confetti.style.left =
            Math.random() * 100 + "%";

        confetti.style.top =
            Math.random() * 30 + "%";

        confetti.style.animationDelay =
            Math.random() * 2 + "s";

        confettiContainer.appendChild(
            confetti
        );
    }
}


// =========================
// Back to dashboard
// =========================

reviewExamBtn.onclick = function () {

    localStorage.removeItem(
        "selectedResultId"
    );

    window.location.href =
        "dashboard.html";
};


// Logout

document.getElementById("logoutBtn").onclick = function () {

    logout();

};