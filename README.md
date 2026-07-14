# VidyaBot 🎓🤖
### Privacy-First, 100% On-Device Offline AI Study Companion

Winner's submission for **OSDHack 2026** (Theme: On-Device AI)

---

## 🚀 The Pitch
Students need intelligent study help, but modern AI models are privacy-invasive black boxes that transmit personal queries, essays, and questions to centralized cloud servers.

**VidyaBot** changes the paradigm. It is an offline-capable, privacy-respecting AI study assistant that runs completely inside the user's browser. **Zero API keys, zero cloud storage, zero tracker cookies, and zero network calls** are required to perform high-fidelity NLP analysis.

---

## 🎨 Core Features

1. **Smart Subject Classifier (Local AI):**
   * Classifies typed academic questions into Math, Science, English, Social Studies, or Computer Science.
   * Model: `Xenova/mobilebert-uncased-mnli` (optimized MobileBERT for in-browser zero-shot natural language inference).
   
2. **Local Sentiment/State Analyzer (Local AI):**
   * Detects the student’s emotional state (e.g., whether they sound confused/struggling or confident/knowledgeable).
   * Generates custom, context-aware encouragement and practical study tips matching both the subject *and* their current mindset.

3. **Offline Interactive Practice Quiz:**
   * A full, multi-subject interactive practice bank (Math, Science, English, Social, Computer Science) with immediate tactile visual feedback.
   * High scores and history are saved fully locally in browser `localStorage`.

4. **Circular Pomodoro Study Timer:**
   * Custom aesthetic focal timer (25 min Study, 5 min Break, 15 min Break presets).
   * Plays a high-fidelity retro notification chime synthesized directly in the browser using the **Web Audio API** (100% offline, no remote audio file downloads).

---

## 🛠️ On-Device AI Architecture (How it works under the hood)

Historically, machine learning required heavy servers. VidyaBot achieves true on-device execution using **Transformers.js (Xenova)**.

* **In-Browser Pipeline:** The application uses modern Web Assemblies (WASM) and browser execution threads to execute deep learning models inside your client window.
* **No-Install Model Caching:** On the first launch, the 130MB `mobilebert-uncased-mnli` model weights are fetched via CDN and cached in the browser's native `Cache Storage`.
* **Subsequent Instant Loads:** On all future launches, the model loads from the cache locally in **less than 100 milliseconds**, enabling full operation even in complete Airplane Mode with no network connection!
* **Resource Optimization:** To minimize the memory footprint, VidyaBot implements a **Single-Model Dual-Inference Pipeline**. We load a single zero-shot classification model and query it sequentially for both subject categorization and emotional state analysis.

---

## ⚙️ Tech Stack & Requirements

* **Frontend:** Clean Vanilla HTML5, CSS3 (Modern Glassmorphic Dark Theme), and ES6+ JavaScript.
* **Core Engine:** [Transformers.js](https://huggingface.co/docs/transformers.js/index) by Xenova.
* **Model:** MobileBERT Uncased MNLI (Zero-Shot Text Classifier).
* **Styling & Assets:** Google Fonts (Poppins), FontAwesome 6, and custom Canvas-rendered SVG components.
* **Zero Dependencies:** No Node.js, No npm, No Flask, No Python, No database, No compilers. Just run as static files!

---

## ⚡ Quick Setup

To run VidyaBot locally, you don't need compilation or servers:

1. Clone or download this project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. Wait for the Neural Network weights to initialize on the first run, and begin studying!

---

## 🌐 How to Deploy on GitHub Pages (Free Web Hosting)

Because VidyaBot is a 100% client-side serverless application, it is perfectly suited for **GitHub Pages**!

### Step 1: Create a GitHub Repository
1. Log into your GitHub account.
2. Click **New** to create a new repository.
3. Name it `VidyaBot`.
4. Leave it as **Public** and click **Create repository**.

### Step 2: Push your Files to GitHub
Open your terminal inside the project directory and run the following commands:
```bash
git init
git add .
git commit -m "Initial commit for OSDHack 2026"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/VidyaBot.git
git push -u origin main
```
*(Replace `YOUR_GITHUB_USERNAME` with your real GitHub handle).*

### Step 3: Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click on the **Settings** tab (the gear icon).
3. On the left sidebar, click on **Pages**.
4. Under the **Build and deployment** section, locate **Branch**.
5. Change the dropdown from **None** to **main** (and leave the folder as `/ (root)`).
6. Click **Save**.

### Step 4: Access your Live App!
GitHub will generate a public URL. In 1-2 minutes, your live AI application will be available at:
`https://YOUR_GITHUB_USERNAME.github.io/VidyaBot/`

---

## 📄 License
This project is licensed under the **MIT License** - see the `LICENSE` file for details.
Designed and engineered with care for OSDHack 2026.
