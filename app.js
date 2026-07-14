/* ==========================================================================
   VIDYABOT CORE PREMIUM JAVASCRIPT
   OSDHack 2026 - Theme: On Device AI
   Powered by Transformers.js (Xenova) & client-side high-fidelity features
   ========================================================================== */

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Force Transformers.js to download directly from the Hugging Face CDN repository
env.allowLocalModels = false;

// Pre-built MCQ Question Bank (100% Offline)
const quizData = {
    Math: [
        { q: "What is the value of x if 3x + 7 = 22?", a: ["x = 5", "x = 3", "x = 15", "x = 9"], c: 0 },
        { q: "What is the derivative of x^2 with respect to x?", a: ["x", "2x", "2", "x^3"], c: 1 },
        { q: "What is the area of a circle with a radius of 7 (use π ≈ 22/7)?", a: ["154 sq units", "44 sq units", "49 sq units", "98 sq units"], c: 0 },
        { q: "Which of the following is a prime number?", a: ["15", "21", "29", "33"], c: 2 },
        { q: "If a triangle has sides 3, 4, and 5, what type of triangle is it?", a: ["Equilateral", "Isosceles", "Right-angled", "Obtuse"], c: 2 }
    ],
    Science: [
        { q: "What is the chemical symbol for Gold?", a: ["Ag", "Au", "Fe", "Pb"], c: 1 },
        { q: "Which organelle is known as the powerhouse of the cell?", a: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], c: 2 },
        { q: "What is the speed of light in a vacuum?", a: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"], c: 0 },
        { q: "What gas do plants absorb from the atmosphere for photosynthesis?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], c: 1 },
        { q: "What is the primary state of matter on the Sun?", a: ["Solid", "Liquid", "Gas", "Plasma"], c: 3 }
    ],
    English: [
        { q: "Who wrote the play 'Romeo and Juliet'?", a: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], c: 1 },
        { q: "What is the synonym of the word 'Obsolete'?", a: ["Modern", "Outdated", "Fashionable", "Active"], c: 1 },
        { q: "Identify the conjunction in: 'I wanted to study, but I was too tired.'", a: ["wanted", "to", "but", "tired"], c: 2 },
        { q: "What is the term for a word that sounds like what it represents?", a: ["Metaphor", "Ononomatopoeia", "Alliteration", "Simile"], c: 1 },
        { q: "Which of the following is an example of an adjective?", a: ["Quickly", "Run", "Beautiful", "Happiness"], c: 2 }
    ],
    Social: [
        { q: "Which is the smallest continent by land area?", a: ["Europe", "Australia", "Antarctica", "South America"], c: 1 },
        { q: "In which year did World War II end?", a: ["1918", "1939", "1945", "1950"], c: 2 },
        { q: "Who was the first President of the United States?", a: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], c: 2 },
        { q: "Which is the longest river in the world?", a: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"], c: 1 },
        { q: "What is the capital city of Japan?", a: ["Beijing", "Seoul", "Tokyo", "Bangkok"], c: 2 }
    ],
    Computer: [
        { q: "What does 'CPU' stand for?", a: ["Central Process Unit", "Computer Processing Unit", "Central Processing Unit", "Control Program Utility"], c: 2 },
        { q: "Which of the following is a non-volatile storage medium?", a: ["RAM", "Cache Memory", "SSD/Hard Drive", "Registers"], c: 2 },
        { q: "What is the primary language used for styling web pages?", a: ["HTML", "CSS", "Python", "SQL"], c: 1 },
        { q: "In programming, what is an 'array'?", a: ["A type of loop", "A collection of elements of same/similar types", "A conditional statement", "A library import"], c: 1 },
        { q: "Which protocol is used for secure communication over the web?", a: ["HTTP", "FTP", "HTTPS", "SMTP"], c: 2 }
    ]
};

// Encouragement responses for Local NLI model outputs
const encouragementResponses = {
    Math: {
        confused: "Mathematics can feel abstract, but remember: every complex formula is just simpler steps added together! Break down the problem, write out your givens, and try solving it step-by-step. You've got this!",
        confident: "Fantastic work! Your mathematical foundation is strong. Keep practicing advanced problem sets and try explaining the solution to a peer to lock in your understanding even further!"
    },
    Science: {
        confused: "Science is all about curiosity and experimentation! If a concept or formula feels unclear, try looking for visual analogies or real-world examples. Keep asking questions—that is how breakthroughs happen!",
        confident: "Brilliant! You're analyzing the world with a sharp, scientific mind. Dive deeper into the underlying mechanisms and test your hypotheses with further practice!"
    },
    English: {
        confused: "Language and literature have many layers! If grammar rules or literary themes are confusing you, focus on reading the passage aloud or analyzing the sentence components one piece at a time. Practice makes perfect!",
        confident: "Superb analytical and language skills! Your comprehension is clear. Keep expanding your vocabulary and expressing your ideas in creative essays."
    },
    Social: {
        confused: "History and geography are giant tapestries of interconnected events and places. If dates or locations are hard to remember, try constructing a visual timeline or map. Everything connects together in the end!",
        confident: "Excellent historical/geographical insight! You understand the critical context of our world. Keep exploring primary sources and examining different perspectives."
    },
    Computer: {
        confused: "Coding and computers operate on strict logic. If an algorithm, syntax, or hardware concept feels confusing, draw it out as a flowchart or write down pseudocode. Debugging is just learning what works!",
        confident: "Excellent logic and computational thinking! You are speaking the language of technology. Continue building mini-projects and solving algorithm challenges to sharpen your skills!"
    }
};

/* ==========================================================================
   UI ELEMENT SELECTIONS
   ========================================================================== */
const privacyBanner = document.getElementById('privacy-banner');
const closeBannerBtn = document.getElementById('close-banner-btn');
const toastContainer = document.getElementById('toast-container');

// AI Status elements
const statusLabel = document.getElementById('status-label');
const statusStateText = document.getElementById('status-state-text');
const statusBadge = document.getElementById('status-badge');
const progressBar = document.getElementById('loading-progress');
const loadingFile = document.getElementById('loading-file');
const loadingPercent = document.getElementById('loading-percentage');

// Classifier elements
const studentInput = document.getElementById('student-input');
const analyzeBtn = document.getElementById('analyze-btn');
const aiResultPanel = document.getElementById('ai-result');
const subjectVal = document.getElementById('subject-val');
const subjectConfidenceBar = document.getElementById('subject-confidence-bar');
const subjectPercent = document.getElementById('subject-percent');
const sentimentVal = document.getElementById('sentiment-val');
const sentimentConfidenceBar = document.getElementById('sentiment-confidence-bar');
const sentimentPercent = document.getElementById('sentiment-percent');
const aiResponseText = document.getElementById('ai-response-text');

// Quiz elements
const quizSubjectsWrapper = document.getElementById('quiz-subjects-wrapper');
const quizActivePanel = document.getElementById('quiz-active-panel');
const quizScoreScreen = document.getElementById('quiz-score-screen');
const quizCurrSubjectText = document.getElementById('quiz-curr-subject');
const quizQuestionCounterText = document.getElementById('quiz-question-counter');
const quizQuestionTextText = document.getElementById('quiz-question-text');
const quizOptionsListDiv = document.getElementById('quiz-options-list');
const currScoreValSpan = document.getElementById('curr-score-val');
const highScoreAnnouncement = document.getElementById('high-score-announcement');

// Timer elements
const timerTimeDisplay = document.getElementById('timer-time');
const timerStateLabel = document.getElementById('timer-state-badge');
const timerPlayBtn = document.getElementById('timer-play-btn');
const timerPauseBtn = document.getElementById('timer-pause-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerPresetPills = document.querySelectorAll('.timer-preset-pill');

// Stats metrics
const statQuestionsText = document.getElementById('stat-questions');
const statHighScoreVal = document.getElementById('high-score-val');
const statSessionsText = document.getElementById('stat-sessions');
const statTimeTodayText = document.getElementById('stat-time-today');

// Bottom Nav & CTA
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
const heroCtaBtn = document.getElementById('hero-cta');

/* ==========================================================================
   APP STATE MANAGEMENT & PERSISTENCE
   ========================================================================== */
let classifier = null;
let stats = {
    questionsAnswered: parseInt(localStorage.getItem('vidyabot_questions_answered') || '0'),
    aiQueriesMade: parseInt(localStorage.getItem('vidyabot_ai_queries') || '0'),
    studyTimeSeconds: parseInt(localStorage.getItem('vidyabot_study_time_seconds') || '0'),
    highScore: parseInt(localStorage.getItem('vidyabot_quiz_high_score') || '0')
};

// Update Stats display dynamically
function updateStatsUI() {
    statQuestionsText.innerText = stats.questionsAnswered;
    statHighScoreVal.innerText = stats.highScore;
    statSessionsText.innerText = stats.aiQueriesMade;
    
    // Format Study Time (Seconds -> clean human readable string)
    if (stats.studyTimeSeconds < 60) {
        statTimeTodayText.innerText = `${stats.studyTimeSeconds}s`;
    } else {
        const mins = Math.floor(stats.studyTimeSeconds / 60);
        const secs = stats.studyTimeSeconds % 60;
        statTimeTodayText.innerText = `${mins}m ${secs}s`;
    }
}

// Increment statistics helper
function incrementStat(key, value = 1) {
    stats[key] += value;
    localStorage.setItem(`vidyabot_${getStorageKeySuffix(key)}`, stats[key].toString());
    updateStatsUI();
}

function getStorageKeySuffix(key) {
    if (key === 'questionsAnswered') return 'questions_answered';
    if (key === 'aiQueriesMade') return 'ai_queries';
    if (key === 'studyTimeSeconds') return 'study_time_seconds';
    if (key === 'highScore') return 'quiz_high_score';
    return key;
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-premium ${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'warning') iconClass = 'fa-exclamation-triangle';
    
    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatically fade out and remove toast
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ==========================================================================
   ON-DEVICE NEURAL NETWORK PIPELINE INITS
   ========================================================================== */
async function initOnDeviceModel() {
    try {
        console.log("Loading zero-shot classification neural model...");
        showToast("Initializing local AI neural weights...", "info");
        
        classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli', {
            progress_callback: (data) => {
                if (data.status === 'progress') {
                    const percent = Math.round(data.progress);
                    progressBar.style.width = `${percent}%`;
                    loadingPercent.innerText = `${percent}%`;
                    if (data.file) {
                        loadingFile.innerText = `Fetching weights: ${data.file.substring(data.file.lastIndexOf('/') + 1)}`;
                    }
                } else if (data.status === 'initiate') {
                    loadingFile.innerText = "Setting up execution environments...";
                } else if (data.status === 'done') {
                    loadingFile.innerText = "Loading complete! Model cached locally.";
                }
            }
        });

        // Hide initialization labels / update to Ready State
        statusLabel.className = 'status-label ready';
        statusLabel.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span id="status-state-text">Local Neural Network Operational</span>';
        statusBadge.className = 'status-indicator-badge ready';
        statusBadge.innerText = 'Online';
        analyzeBtn.disabled = false;
        
        showToast("Local AI Model cached and ready to run!", "success");
        console.log("Zero-shot neural classification pipeline is initialized!");

    } catch (error) {
        console.error("Critical error starting on-device model:", error);
        loadingFile.innerText = `Startup Failed: ${error.message}`;
        statusLabel.className = 'status-label';
        statusLabel.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span style="color: var(--danger)">Initialization Failed</span>';
        statusBadge.className = 'status-indicator-badge';
        statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        statusBadge.style.color = '#ef4444';
        statusBadge.innerText = 'Error';
        showToast("Local neural setup failed. Check internet access for cache first.", "warning");
    }
}

// Perform On-Device Zero-Shot Inference
async function analyzeQuestion() {
    const text = studentInput.value.trim();
    if (!text) {
        showToast("Please provide input text to analyze!", "warning");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Processing locally...</span>';
    showToast("Analyzing text context locally on-device...", "info");

    try {
        console.log("Executing classification engine...");
        
        // Subject Classifier
        const subjectLabels = ['Math', 'Science', 'English', 'Social', 'Computer'];
        const subjectResults = await classifier(text, subjectLabels);
        const topSubject = subjectResults.labels[0];
        const subjectScore = Math.round(subjectResults.scores[0] * 100);

        // Student Sentiment (Frustrated/Confused vs Confident)
        const sentimentLabels = ['confused', 'confident'];
        const sentimentResults = await classifier(text, sentimentLabels);
        const topSentiment = sentimentResults.labels[0];
        const sentimentScore = Math.round(sentimentResults.scores[0] * 100);

        // UI Updates
        subjectVal.innerText = topSubject;
        subjectConfidenceBar.style.width = `${subjectScore}%`;
        subjectPercent.innerText = `${subjectScore}% confidence`;

        sentimentVal.innerText = topSentiment === 'confused' ? 'Confused' : 'Confident';
        sentimentConfidenceBar.style.width = `${sentimentScore}%`;
        sentimentPercent.innerText = `${sentimentScore}% confidence`;

        // Smart Feedback Responses
        const encouragement = encouragementResponses[topSubject][topSentiment];
        aiResponseText.innerText = encouragement;

        // Display results block with nice animations
        aiResultPanel.style.display = 'flex';
        aiResultPanel.classList.add('fadeInUp');
        aiResultPanel.scrollIntoView({ behavior: 'smooth' });

        incrementStat('aiQueriesMade', 1);
        showToast("Analysis complete!", "success");

    } catch (error) {
        console.error("Local classification exception:", error);
        showToast(`Local query analysis error: ${error.message}`, "warning");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> <span>Analyze with AI</span>';
    }
}

analyzeBtn.addEventListener('click', analyzeQuestion);

/* ==========================================================================
   OFFLINE COMPANION: OFFLINE PRACTICE QUIZ SYSTEM
   ========================================================================== */
let currentQuizSubject = 'Math';
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;

function setupQuizEvents() {
    const pills = quizSubjectsWrapper.querySelectorAll('.quiz-pill-btn');
    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            pills.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            const subject = e.target.getAttribute('data-subject');
            startQuiz(subject);
        });
    });
}

function startQuiz(subject) {
    currentQuizSubject = subject;
    currentQuestions = quizData[subject];
    currentQuestionIndex = 0;
    currentScore = 0;

    quizActivePanel.style.display = 'flex';
    quizScoreScreen.style.display = 'none';

    renderQuizQuestion();
}

function renderQuizQuestion() {
    quizOptionsListDiv.innerHTML = '';
    
    const question = currentQuestions[currentQuestionIndex];
    quizCurrSubjectText.innerText = currentQuizSubject;
    quizQuestionCounterText.innerText = `Question ${currentQuestionIndex + 1}/5`;
    quizQuestionTextText.innerText = question.q;

    // Generate option list with beautiful layout
    question.a.forEach((option, idx) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'quiz-premium-option';
        optionBtn.innerText = option;
        optionBtn.addEventListener('click', () => verifyQuizAnswer(idx, optionBtn));
        quizOptionsListDiv.appendChild(optionBtn);
    });
}

function verifyQuizAnswer(selectedIndex, selectedBtn) {
    const question = currentQuestions[currentQuestionIndex];
    const optionButtons = quizOptionsListDiv.querySelectorAll('.quiz-premium-option');

    // Prevent double clicking other choices
    optionButtons.forEach(btn => btn.disabled = true);

    incrementStat('questionsAnswered', 1);

    if (selectedIndex === question.c) {
        selectedBtn.classList.add('correct');
        selectedBtn.classList.add('flash-correct');
        currentScore++;
        showToast("Correct Answer! Keep it up.", "success");
        playAudioTone(600, 'sine', 0.15); // Short sweet sound
    } else {
        selectedBtn.classList.add('incorrect');
        selectedBtn.classList.add('shake');
        
        // Highlight correct option too
        optionButtons[question.c].classList.add('correct');
        showToast("Incorrect answer. Let's study further!", "warning");
        playAudioTone(250, 'sawtooth', 0.2); // Low buzzer tone
    }

    // Go to next question after small transition delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            renderQuizQuestion();
        } else {
            finishQuizSession();
        }
    }, 1500);
}

function finishQuizSession() {
    quizActivePanel.style.display = 'none';
    quizScoreScreen.style.display = 'flex';
    currScoreValSpan.innerText = currentScore;

    // Update high score if new score beats it
    if (currentScore > stats.highScore) {
        stats.highScore = currentScore;
        localStorage.setItem('vidyabot_quiz_high_score', currentScore.toString());
        highScoreAnnouncement.style.display = 'block';
        showToast(`New Personal High Score: ${currentScore}/5!`, "success");
        playAudioTone(800, 'sine', 0.5); // Victory tone
    } else {
        highScoreAnnouncement.style.display = 'none';
    }
    updateStatsUI();
}

/* ==========================================================================
   OFFLINE COMPANION: STUDY TIMER (POMODORO)
   ========================================================================== */
let timerInterval = null;
let timerSecondsRemaining = 25 * 60;
let isTimerRunning = false;
let currentPresetMinutes = 25;

function updateTimerDisplay() {
    const mins = Math.floor(timerSecondsRemaining / 60);
    const secs = timerSecondsRemaining % 60;
    timerTimeDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    timerPlayBtn.style.display = 'none';
    timerPauseBtn.style.display = 'inline-flex';
    showToast("Study timer active. Focus mode turned on!", "success");

    timerInterval = setInterval(() => {
        timerSecondsRemaining--;
        updateTimerDisplay();
        incrementStat('studyTimeSeconds', 1);

        if (timerSecondsRemaining <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timerPlayBtn.style.display = 'inline-flex';
            timerPauseBtn.style.display = 'none';
            playNotificationTone();
            showToast("Session finished! Relax or start another timer.", "success");
            alert("⏰ Timer Complete! Time for a refreshing break.");
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerPlayBtn.style.display = 'inline-flex';
    timerPauseBtn.style.display = 'none';
    showToast("Timer paused.", "info");
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerPlayBtn.style.display = 'inline-flex';
    timerPauseBtn.style.display = 'none';
    timerSecondsRemaining = currentPresetMinutes * 60;
    updateTimerDisplay();
}

// Preset Pills handler
timerPresetPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
        timerPresetPills.forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        
        const minutes = parseInt(e.target.getAttribute('data-minutes'));
        currentPresetMinutes = minutes;
        
        if (minutes === 25) {
            timerStateLabel.innerText = "Focusing";
            timerStateLabel.className = "timer-state-label focus";
        } else {
            timerStateLabel.innerText = "Resting";
            timerStateLabel.className = "timer-state-label break";
        }
        
        resetTimer();
        showToast(`Timer adjusted to ${minutes} minutes.`, "info");
    });
});

timerPlayBtn.addEventListener('click', startTimer);
timerPauseBtn.addEventListener('click', pauseTimer);
timerResetBtn.addEventListener('click', resetTimer);

/* ==========================================================================
   OFFLINE SYNTHESIZER SOUND ENGINE
   ========================================================================== */
function playAudioTone(freq, type = 'sine', duration = 0.2) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn("Client-side Synthesizer not permitted to run:", e);
    }
}

function playNotificationTone() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // High fidelity double-chime tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.3); // A5

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.warn("Audio Context is blocked by browser policy:", e);
    }
}

/* ==========================================================================
   PAGE EVENTS & BEHAVIORS
   ========================================================================== */

// Dismiss Sticky Banner
const isBannerDismissed = localStorage.getItem('vidyabot_banner_dismissed') === 'true';
if (isBannerDismissed) {
    privacyBanner.classList.add('hidden');
}

closeBannerBtn.addEventListener('click', () => {
    privacyBanner.classList.add('hidden');
    localStorage.setItem('vidyabot_banner_dismissed', 'true');
    showToast("Privacy banner dismissed. Settings saved locally.", "info");
});

// Start Learning Hero CTA Handler
heroCtaBtn.addEventListener('click', () => {
    document.getElementById('classifier-card').scrollIntoView({ behavior: 'smooth' });
    showToast("Ready to start study! Enter text to begin.", "success");
});

// Highlight Active Bottom Navigation Link on click/scroll
bottomNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        bottomNavItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
    });
});

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    initOnDeviceModel();
    setupQuizEvents();
    startQuiz('Math'); // Default start quiz on load
    updateTimerDisplay();
    updateStatsUI();
});
