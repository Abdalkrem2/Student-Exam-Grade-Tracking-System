

// Check that the logged-in user is a student
const student = requireRole("Student");

// Stop the code if the user is not a student
if (!student) {
    throw new Error("Student login is required");
}

const results = getResults();

const selectedExamId =
    localStorage.getItem("selectedExamId");

const exam =
    getExamById(selectedExamId);


// =========================
// Get saved exam progress
// =========================

let currentQuestion =
    Number(
        sessionStorage.getItem("currentQuestion")
    ) || 0;

let studentAnswers =
    safeParse(
        sessionStorage.getItem("studentAnswers"),
        {}
    );


// =========================
// Get HTML elements
// =========================

const examTitle =
    document.getElementById("examTitle");

const currentQuestionNumber =
    document.getElementById(
        "currentQuestionNumber"
    );

const totalQuestions =
    document.getElementById("totalQuestions");

const questionLabel =
    document.getElementById("questionLabel");

const questionType =
    document.getElementById("questionType");

const questionText =
    document.getElementById("questionText");

const answersContainer =
    document.getElementById("answersContainer");

const answerMessage =
    document.getElementById("answerMessage");

const progressBar =
    document.getElementById("progressBar");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const submitBtn =
    document.getElementById("submitBtn");

const timer =
    document.getElementById("timer");


// Timer placeholder

timer.textContent = "--:--";


// =========================
// Check exam
// =========================

if (
    exam &&
    exam.questions &&
    exam.questions.length > 0
) {

    if (
        currentQuestion >=
        exam.questions.length
    ) {
        currentQuestion = 0;
    }

    examTitle.textContent =
        exam.title;

    totalQuestions.textContent =
        exam.questions.length;

    showQuestion();

} else {

    questionText.textContent =
        "Exam not found";

    previousBtn.style.display = "none";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
}


// =========================
// Display question
// =========================

function showQuestion() {

    const question =
        exam.questions[currentQuestion];

    const questionNumber =
        currentQuestion + 1;


    currentQuestionNumber.textContent =
        questionNumber;

    questionLabel.textContent =
        "QUESTION " + questionNumber;

    questionType.textContent =
        question.type;

    questionText.textContent =
        question.text;

    answersContainer.innerHTML = "";

    answerMessage.textContent = "";


    // Update progress bar

    const progress =
        (
            questionNumber /
            exam.questions.length
        ) * 100;

    progressBar.style.width =
        progress + "%";


    // MCQ question

    if (question.type === "mcq") {

        question.options.forEach(
            function (option) {

                answersContainer.innerHTML += `
                    <label class="answer-option">

                        <input
                            type="radio"
                            name="answer"
                            value="${option}"
                        >

                        <span>${option}</span>

                    </label>
                `;

            }
        );

    }


    // True or False question

    else if (
        question.type === "true_false"
    ) {

        answersContainer.innerHTML = `
            <label class="answer-option">

                <input
                    type="radio"
                    name="answer"
                    value="true"
                >

                <span>True</span>

            </label>

            <label class="answer-option">

                <input
                    type="radio"
                    name="answer"
                    value="false"
                >

                <span>False</span>

            </label>
        `;

    }


    // Multiple answers question

    else if (
        question.type === "multiple_answer"
    ) {

        question.options.forEach(
            function (option) {

                answersContainer.innerHTML += `
                    <label class="answer-option">

                        <input
                            type="checkbox"
                            name="answer"
                            value="${option}"
                        >

                        <span>${option}</span>

                    </label>
                `;

            }
        );

    }


    // Short answer question

    else if (
        question.type === "short_answer"
    ) {

        answersContainer.innerHTML = `
            <input
                type="number"
                id="shortAnswer"
                class="short-answer-input"
                placeholder="Enter your answer"
            >
        `;

    }


    // Show saved answer

    showSavedAnswer(question);


    // Previous button

    previousBtn.disabled =
        currentQuestion === 0;


    // Next and Submit buttons

    if (
        currentQuestion ===
        exam.questions.length - 1
    ) {

        nextBtn.style.display = "none";

        submitBtn.style.display = "block";

    } else {

        nextBtn.style.display = "block";

        submitBtn.style.display = "none";

    }
}


// =========================
// Show saved answer
// =========================

function showSavedAnswer(question) {

    const savedAnswer =
        studentAnswers[question.id];

    if (savedAnswer === undefined) {
        return;
    }


    // Short answer

    if (
        question.type === "short_answer"
    ) {

        document.getElementById(
            "shortAnswer"
        ).value = savedAnswer;

        return;

    }


    // Other question types

    const inputs =
        document.getElementsByName("answer");

    inputs.forEach(function (input) {

        if (
            question.type ===
            "multiple_answer"
        ) {

            if (
                savedAnswer.includes(
                    input.value
                )
            ) {
                input.checked = true;
            }

        } else {

            if (
                input.value ===
                String(savedAnswer)
            ) {
                input.checked = true;
            }

        }

    });
}


// =========================
// Save current answer
// =========================

function saveAnswer() {

    const question =
        exam.questions[currentQuestion];

    let answer;


    // Short answer

    if (
        question.type === "short_answer"
    ) {

        answer =
            document.getElementById(
                "shortAnswer"
            ).value;

        if (answer === "") {

            answerMessage.textContent =
                "Please enter an answer";

            return false;

        }

    }


    // Multiple answers

    else if (
        question.type ===
        "multiple_answer"
    ) {

        answer = [];

        const inputs =
            document.getElementsByName(
                "answer"
            );

        inputs.forEach(function (input) {

            if (input.checked) {
                answer.push(input.value);
            }

        });

        if (answer.length === 0) {

            answerMessage.textContent =
                "Please select an answer";

            return false;

        }

    }


    // MCQ and True/False

    else {

        const inputs =
            document.getElementsByName(
                "answer"
            );

        inputs.forEach(function (input) {

            if (input.checked) {
                answer = input.value;
            }

        });

        if (answer === undefined) {

            answerMessage.textContent =
                "Please select an answer";

            return false;

        }

    }


    // Save answer temporarily

    studentAnswers[question.id] =
        answer;

    sessionStorage.setItem(
        "studentAnswers",
        JSON.stringify(studentAnswers)
    );

    answerMessage.textContent = "";

    return true;
}


// =========================
// Next button
// =========================

nextBtn.onclick = function () {

    if (saveAnswer() === false) {
        return;
    }

    currentQuestion++;

    sessionStorage.setItem(
        "currentQuestion",
        currentQuestion
    );

    showQuestion();
};


// =========================
// Previous button
// =========================

previousBtn.onclick = function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        sessionStorage.setItem(
            "currentQuestion",
            currentQuestion
        );

        showQuestion();

    }
};


// =========================
// Submit button
// =========================

submitBtn.onclick = function () {

    if (saveAnswer() === false) {
        return;
    }

    calculateResult();
};


// =========================
// Calculate result
// =========================

function calculateResult() {

    let correctAnswers = 0;


    // Check all answers

    exam.questions.forEach(
        function (question) {

            const studentAnswer =
                studentAnswers[question.id];

            if (
                isAnswerCorrect(
                    question,
                    studentAnswer
                )
            ) {
                correctAnswers++;
            }

        }
    );


    // Calculate score

    const score = Math.round(
        (
            correctAnswers /
            exam.questions.length
        ) * 100
    );


    // Pass or fail

    const passed =
        score >= 50;


    // Format answers

    const formattedAnswers =
        exam.questions.map(
            function (question) {

                return {
                    questionId:
                        question.id,

                    studentAnswer:
                        studentAnswers[
                            question.id
                        ]
                };

            }
        );


    // Create result

    const result = {

        id: generateId("r"),

        studentId: student.id,

        examId: exam.id,

        answers: formattedAnswers,

        score: score,

        passed: passed,

        dateTaken:
            new Date().toISOString()

    };


    // Save result

    results.push(result);

    saveResults(results);


    // Save selected result

    localStorage.setItem(
        "selectedResultId",
        result.id
    );


    // Clear exam progress

    sessionStorage.removeItem(
        "currentQuestion"
    );

    sessionStorage.removeItem(
        "studentAnswers"
    );


    // Open result page

   window.location.href = "results.html";
}