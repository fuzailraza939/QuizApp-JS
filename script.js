const questions = [
    {
        question: "HTML stands for?",
        options: ["Hyper Text Markup Language", "HighText Machine Language", "Hyper Tool Multi Language", "Home Tool Markup Language"],
        answer: 0
    },
    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<hyper>"],
        answer: 0
    },
    {
        question: "Which tag is used to insert an image in HTML?",
        options: ["<img>", "<src>", "<picture>", "<image>"],
        answer: 0
    },
    {
        question: "Which tag is used for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        answer: 2
    },
    {
        question: "Which tag is used to insert a line break?",
        options: ["<lb>", "<br>", "<break>", "<newline>"],
        answer: 1
    },
    {
        question: "Which tag is used to create a table row?",
        options: ["<tr>", "<td>", "<th>", "<row>"],
        answer: 0
    },
    {
        question: "Which attribute is used for image source?",
        options: ["src", "href", "link", "path"],
        answer: 0
    },
    {
        question: "Which tag is used for unordered list?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        answer: 0
    },
    {
        question: "Which HTML element is used to define important text?",
        options: ["<important>", "<strong>", "<b>", "<i>"],
        answer: 1
    },
    {
        question: "Which tag is used to define a paragraph?",
        options: ["<para>", "<p>", "<pg>", "<paragraph>"],
        answer: 1
    }
];

let currentQ = 0;
let userAnswers = Array(questions.length).fill(null);

const quizBox     = document.getElementById("quiz-box");
const backBtn     = document.getElementById("backBtn");
const nextBtn     = document.getElementById("nextBtn");
const submitBtn   = document.getElementById("submitBtn");
const result      = document.getElementById("result");
const progressFill = document.getElementById("progressFill");
const qNum        = document.getElementById("qNum");
const qScore      = document.getElementById("qScore");

// ✅ Function to load question
function loadQuestion() {
    const q = questions[currentQ];

    // Animate out then in
    quizBox.style.animation = 'none';
    quizBox.offsetHeight; // reflow
    quizBox.style.animation = 'questionIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both';

    quizBox.innerHTML = "";

    // Question text
    const questionEl = document.createElement("div");
    questionEl.className = "question-text";
    questionEl.textContent = `${currentQ + 1}. ${q.question}`;
    quizBox.appendChild(questionEl);

    // Options
    q.options.forEach((opt, i) => {
        const item = document.createElement("label");
        item.className = "option-item" + (userAnswers[currentQ] === i ? " selected" : "");
        item.setAttribute("for", `opt${i}`);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "option";
        input.id = `opt${i}`;
        input.value = i;
        if (userAnswers[currentQ] === i) input.checked = true;

        const bullet = document.createElement("div");
        bullet.className = "option-bullet";

        const label = document.createElement("span");
        label.className = "option-label";
        label.textContent = opt;

        item.appendChild(input);
        item.appendChild(bullet);
        item.appendChild(label);
        quizBox.appendChild(item);

        // Click to select styling
        item.addEventListener("click", () => {
            document.querySelectorAll(".option-item").forEach(el => el.classList.remove("selected"));
            item.classList.add("selected");
            input.checked = true;
        });
    });

    // Update progress
    const pct = ((currentQ + 1) / questions.length) * 100;
    progressFill.style.width = pct + "%";
    qNum.textContent = `Question ${currentQ + 1} of ${questions.length}`;
    const answered = userAnswers.filter(a => a !== null).length;
    qScore.textContent = `${answered} answered`;

    // Buttons
    backBtn.disabled = currentQ === 0;
    nextBtn.classList.toggle("d-none", currentQ === questions.length - 1);
    submitBtn.classList.toggle("d-none", currentQ !== questions.length - 1);
}

// ✅ Save selected option
function saveAnswer() {
    const selected = document.querySelector("input[name='option']:checked");
    if (selected) {
        userAnswers[currentQ] = parseInt(selected.value);
    }
}

// ✅ Next button
nextBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQ < questions.length - 1) {
        currentQ++;
        loadQuestion();
    }
});

// ✅ Back button
backBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQ > 0) {
        currentQ--;
        loadQuestion();
    }
});

// ✅ Submit button
submitBtn.addEventListener("click", () => {
    saveAnswer();
    let score = 0;
    questions.forEach((q, i) => {
        if (userAnswers[i] === q.answer) score++;
    });

    // Hide quiz UI
    quizBox.innerHTML = "";
    document.getElementById("btnRow").style.display = "none";
    submitBtn.style.display = "none";
    document.getElementById("progressWrap").style.display = "none";
    document.querySelector(".quiz-header").style.display = "none";

    // Score percentage for conic gradient
    const pct = Math.round((score / questions.length) * 100);
    let grade = "Excellent Work";
    let sub = "Outstanding performance on the quiz!";
    if (pct < 50) { grade = "Keep Practicing"; sub = "Review the material and try again."; }
    else if (pct < 80) { grade = "Good Effort"; sub = "You're on the right track!"; }

    result.innerHTML = `
      <div class="result-score-circle" style="--pct: ${pct * 3.6}deg">
        <div class="result-score-inner">
          <div class="score-number">${score}/${questions.length}</div>
          <div class="score-label">Score</div>
        </div>
      </div>
      <div class="result-title">${grade}</div>
      <div class="result-subtitle">${sub} You scored <strong style="color:var(--gold)">${pct}%</strong></div>
      <button class="retry-btn" onclick="location.reload()">Retake Quiz</button>
    `;
});

// ✅ First question load
loadQuestion();
