// ============================================
// VOKABELTRAINER - MAIN APPLICATION
// ============================================

// ============================================
// DATA MANAGEMENT
// ============================================

class VocabularyTrainer {
    constructor() {
        this.vocabularies = [];
        this.lists = [];
        this.progress = {};
        this.activities = [];
        this.currentPage = 'home';
        this.currentLearningMode = 'flashcards';
        this.currentLearningList = '';
        this.currentLearningIndex = 0;
        this.currentQuizScore = 0;
        this.currentQuizTotal = 0;
        this.isCardFlipped = false;
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderHome();
        this.updateStats();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('vocabularyTrainerData');
            if (stored) {
                const data = JSON.parse(stored);
                this.vocabularies = data.vocabularies || [];
                this.lists = data.lists || [];
                this.progress = data.progress || {};
                this.activities = data.activities || [];
            }
        } catch (error) {
            console.error('Error loading data from storage:', error);
        }
    }

    saveToStorage() {
        try {
            const data = {
                vocabularies: this.vocabularies,
                lists: this.lists,
                progress: this.progress,
                activities: this.activities,
            };
            localStorage.setItem('vocabularyTrainerData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to storage:', error);
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });

        // Home Page Actions
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleHomeAction(action);
            });
        });

        // Vocabulary Management
        document.getElementById('add-vocab-btn').addEventListener('click', () => {
            this.showVocabForm();
        });

        document.getElementById('import-ocr-btn').addEventListener('click', () => {
            this.showOCRForm();
        });

        document.getElementById('vocab-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVocabulary();
        });

        document.getElementById('cancel-form-btn').addEventListener('click', () => {
            this.hideVocabForm();
        });

        document.getElementById('cancel-ocr-btn').addEventListener('click', () => {
            this.hideOCRForm();
        });

        document.getElementById('ocr-process-btn').addEventListener('click', () => {
            this.processOCRImage();
        });

        document.getElementById('vocab-search').addEventListener('input', (e) => {
            this.filterVocabularies(e.target.value);
        });

        // Lists Management
        document.getElementById('create-list-btn').addEventListener('click', () => {
            this.showListForm();
        });

        document.getElementById('list-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addList();
        });

        document.getElementById('cancel-list-form-btn').addEventListener('click', () => {
            this.hideListForm();
        });

        // Learning Modes
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.mode-btn').classList.add('active');
                this.currentLearningMode = e.target.closest('.mode-btn').dataset.mode;
            });
        });

        document.getElementById('start-learn-btn').addEventListener('click', () => {
            this.startLearning();
        });

        // Flashcard Controls
        document.getElementById('flip-card-btn').addEventListener('click', () => {
            this.flipCard();
        });

        document.getElementById('correct-btn').addEventListener('click', () => {
            this.recordProgress(true);
            this.nextFlashcard();
        });

        document.getElementById('wrong-btn').addEventListener('click', () => {
            this.recordProgress(false);
            this.nextFlashcard();
        });

        document.getElementById('exit-learning-btn').addEventListener('click', () => {
            this.exitLearning();
        });

        // Quiz Controls
        document.getElementById('next-question-btn').addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        document.getElementById('exit-quiz-btn').addEventListener('click', () => {
            this.exitLearning();
        });

        // Typing Mode Controls
        document.getElementById('submit-typing-btn').addEventListener('click', () => {
            this.checkTypingAnswer();
        });

        document.getElementById('exit-typing-btn').addEventListener('click', () => {
            this.exitLearning();
        });

        // Dashboard
        document.getElementById('export-data-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data-btn').addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('reset-data-btn').addEventListener('click', () => {
            if (confirm('Möchtest du wirklich alle Daten löschen? Dies kann nicht rückgängig gemacht werden.')) {
                this.resetAllData();
            }
        });

        // Modal
        document.getElementById('modal-close') && document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', () => {
            this.closeModal();
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        // Show selected page
        document.getElementById(page).classList.add('active');
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        this.currentPage = page;

        // Render page content
        switch (page) {
            case 'vocabulary':
                this.renderVocabularyPage();
                break;
            case 'lists':
                this.renderListsPage();
                break;
            case 'learn':
                this.renderLearnPage();
                break;
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'home':
                this.renderHome();
                break;
        }
    }

    handleHomeAction(action) {
        switch (action) {
            case 'learn-mode':
                this.navigateTo('learn');
                break;
            case 'quiz-mode':
                this.navigateTo('learn');
                setTimeout(() => {
                    document.querySelector('[data-mode="quiz"]').click();
                }, 100);
                break;
            case 'add-vocab':
                this.navigateTo('vocabulary');
                setTimeout(() => {
                    this.showVocabForm();
                }, 100);
                break;
            case 'ocr-upload':
                this.navigateTo('vocabulary');
                setTimeout(() => {
                    this.showOCRForm();
                }, 100);
                break;
        }
    }

    // ============================================
    // VOCABULARY MANAGEMENT
    // ============================================

    addVocabulary() {
        const german = document.getElementById('vocab-german').value.trim();
        const english = document.getElementById('vocab-english').value.trim();
        const example = document.getElementById('vocab-example').value.trim();
        const listId = document.getElementById('vocab-list').value;

        if (!german || !english) {
            alert('Bitte fülle Deutsch und Englisch aus');
            return;
        }

        const vocab = {
            id: Date.now(),
            german,
            english,
            example,
            listId: listId || null,
            createdAt: new Date().toISOString(),
        };

        this.vocabularies.push(vocab);
        this.saveToStorage();
        this.hideVocabForm();
        this.renderVocabularyPage();
        this.addActivity(`Vokabel hinzugefügt: ${german}`);
        this.updateStats();
    }

    deleteVocabulary(id) {
        if (confirm('Möchtest du diese Vokabel wirklich löschen?')) {
            this.vocabularies = this.vocabularies.filter(v => v.id !== id);
            this.saveToStorage();
            this.renderVocabularyPage();
            this.updateStats();
        }
    }

    editVocabulary(id) {
        const vocab = this.vocabularies.find(v => v.id === id);
        if (!vocab) return;

        document.getElementById('vocab-german').value = vocab.german;
        document.getElementById('vocab-english').value = vocab.english;
        document.getElementById('vocab-example').value = vocab.example || '';
        document.getElementById('vocab-list').value = vocab.listId || '';
        document.getElementById('form-title').textContent = 'Vokabel bearbeiten';

        const formContainer = document.getElementById('vocab-form-container');
        formContainer.classList.remove('hidden');

        const form = document.getElementById('vocab-form');
        const oldSubmitHandler = form.onsubmit;
        form.onsubmit = (e) => {
            e.preventDefault();
            const german = document.getElementById('vocab-german').value.trim();
            const english = document.getElementById('vocab-english').value.trim();
            const example = document.getElementById('vocab-example').value.trim();
            const listId = document.getElementById('vocab-list').value;

            vocab.german = german;
            vocab.english = english;
            vocab.example = example;
            vocab.listId = listId || null;

            this.saveToStorage();
            this.hideVocabForm();
            this.renderVocabularyPage();
            form.onsubmit = oldSubmitHandler;
        };
    }

    showVocabForm() {
        document.getElementById('form-title').textContent = 'Neue Vokabel hinzufügen';
        document.getElementById('vocab-form').reset();
        document.getElementById('vocab-form-container').classList.remove('hidden');
    }

    hideVocabForm() {
        document.getElementById('vocab-form-container').classList.add('hidden');
        document.getElementById('vocab-form').reset();
        document.getElementById('form-title').textContent = 'Neue Vokabel hinzufügen';
    }

    filterVocabularies(searchTerm) {
        const filtered = this.vocabularies.filter(v =>
            v.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.english.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderVocabularyList(filtered);
    }

    renderVocabularyPage() {
        this.updateListSelect();
        this.renderVocabularyList(this.vocabularies);
    }

    renderVocabularyList(vocabs) {
        const container = document.getElementById('vocab-list');
        container.innerHTML = '';

        if (vocabs.length === 0) {
            container.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 2rem;">Noch keine Vokabeln hinzugefügt. Starte jetzt!</div>';
            return;
        }

        vocabs.forEach(vocab => {
            const card = document.createElement('div');
            card.className = 'vocab-card';
            card.innerHTML = `
                <div class="vocab-card-header">
                    <div>
                        <div class="vocab-german">${this.escapeHtml(vocab.german)}</div>
                        <div class="vocab-english">${this.escapeHtml(vocab.english)}</div>
                    </div>
                </div>
                ${vocab.example ? `<div class="vocab-example">"${this.escapeHtml(vocab.example)}"</div>` : ''}
                ${vocab.listId ? `<div class="vocab-list-tag">${this.getListName(vocab.listId)}</div>` : ''}
                <div class="vocab-actions">
                    <button class="btn btn-secondary" onclick="app.editVocabulary(${vocab.id})">✏️ Bearbeiten</button>
                    <button class="btn btn-danger" onclick="app.deleteVocabulary(${vocab.id})">🗑️ Löschen</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // ============================================
    // LISTS MANAGEMENT
    // ============================================

    addList() {
        const name = document.getElementById('list-name').value.trim();
        const description = document.getElementById('list-description').value.trim();

        if (!name) {
            alert('Bitte gib einen Namen für die Liste ein');
            return;
        }

        const list = {
            id: Date.now(),
            name,
            description,
            createdAt: new Date().toISOString(),
        };

        this.lists.push(list);
        this.saveToStorage();
        this.hideListForm();
        this.renderListsPage();
        this.updateListSelect();
        this.addActivity(`Liste erstellt: ${name}`);
    }

    deleteList(id) {
        if (confirm('Möchtest du diese Liste wirklich löschen? Die Vokabeln bleiben erhalten.')) {
            this.lists = this.lists.filter(l => l.id !== id);
            this.vocabularies.forEach(v => {
                if (v.listId === id) v.listId = null;
            });
            this.saveToStorage();
            this.renderListsPage();
            this.updateListSelect();
        }
    }

    showListForm() {
        document.getElementById('list-form').reset();
        document.getElementById('list-form-container').classList.remove('hidden');
    }

    hideListForm() {
        document.getElementById('list-form-container').classList.add('hidden');
        document.getElementById('list-form').reset();
    }

    renderListsPage() {
        const grid = document.getElementById('lists-grid');
        grid.innerHTML = '';

        if (this.lists.length === 0) {
            grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 2rem;">Noch keine Listen erstellt.</div>';
            return;
        }

        this.lists.forEach(list => {
            const vocabCount = this.vocabularies.filter(v => v.listId === list.id).length;
            const learnedCount = this.vocabularies.filter(v => 
                v.listId === list.id && this.progress[v.id]?.learned
            ).length;

            const card = document.createElement('div');
            card.className = 'list-card';
            card.innerHTML = `
                <h3>${this.escapeHtml(list.name)}</h3>
                ${list.description ? `<p>${this.escapeHtml(list.description)}</p>` : ''}
                <div class="list-stats">
                    <div class="list-stat">
                        <div class="list-stat-value">${vocabCount}</div>
                        <div class="list-stat-label">Vokabeln</div>
                    </div>
                    <div class="list-stat">
                        <div class="list-stat-value">${learnedCount}</div>
                        <div class="list-stat-label">Gelernt</div>
                    </div>
                </div>
                <div class="list-actions">
                    <button class="btn btn-primary" onclick="app.startLearningList(${list.id})">📚 Lernen</button>
                    <button class="btn btn-secondary" onclick="app.showListView(${list.id})">📋 Anzeigen</button>
                    <button class="btn btn-danger" onclick="app.deleteList(${list.id})">🗑️ Löschen</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    updateListSelect() {
        const select = document.getElementById('vocab-list');
        const learnSelect = document.getElementById('learn-list-select');

        [select, learnSelect].forEach(s => {
            if (!s) return;
            const currentValue = s.value;
            s.innerHTML = '<option value="">-- Keine Liste --</option>';
            this.lists.forEach(list => {
                const option = document.createElement('option');
                option.value = list.id;
                option.textContent = list.name;
                s.appendChild(option);
            });
            s.value = currentValue;
        });
    }

    getListName(listId) {
        const list = this.lists.find(l => l.id === listId);
        return list ? list.name : 'Unbekannt';
    }

    // ============================================
    // LEARNING MODES
    // ============================================

    renderLearnPage() {
        this.updateListSelect();
    }

    startLearning() {
        const mode = this.currentLearningMode;
        const listId = document.getElementById('learn-list-select').value;

        let vocabs = this.vocabularies;
        if (listId) {
            vocabs = vocabs.filter(v => v.listId === listId);
        }

        if (vocabs.length === 0) {
            alert('Keine Vokabeln verfügbar. Bitte füge zuerst Vokabeln hinzu.');
            return;
        }

        this.currentLearningList = listId;
        this.currentLearningIndex = 0;
        this.currentQuizScore = 0;
        this.currentQuizTotal = 0;
        this.isCardFlipped = false;

        document.getElementById('learn-mode-selector').style.display = 'none';

        if (mode === 'flashcards') {
            this.startFlashcards(vocabs);
        } else if (mode === 'quiz') {
            this.startQuiz(vocabs);
        } else if (mode === 'typing') {
            this.startTyping(vocabs);
        }
    }

    startLearningList(listId) {
        document.getElementById('learn-list-select').value = listId;
        this.navigateTo('learn');
        setTimeout(() => {
            document.getElementById('start-learn-btn').click();
        }, 100);
    }

    // ============================================
    // FLASHCARD MODE
    // ============================================

    startFlashcards(vocabs) {
        this.currentLearningVocabs = vocabs;
        document.getElementById('flashcard-container').classList.remove('hidden');
        this.showFlashcard(0);
    }

    showFlashcard(index) {
        const vocab = this.currentLearningVocabs[index];
        if (!vocab) {
            this.endLearning();
            return;
        }

        this.isCardFlipped = false;
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('card-german').textContent = vocab.german;
        document.getElementById('card-english').textContent = vocab.english;
        document.getElementById('card-example').textContent = vocab.example || '';

        const progress = ((index + 1) / this.currentLearningVocabs.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = `${index + 1} / ${this.currentLearningVocabs.length}`;
    }

    flipCard() {
        const card = document.getElementById('flashcard');
        card.classList.toggle('flipped');
        this.isCardFlipped = !this.isCardFlipped;
    }

    nextFlashcard() {
        this.currentLearningIndex++;
        if (this.currentLearningIndex < this.currentLearningVocabs.length) {
            this.showFlashcard(this.currentLearningIndex);
        } else {
            this.endLearning();
        }
    }

    // ============================================
    // QUIZ MODE
    // ============================================

    startQuiz(vocabs) {
        this.currentLearningVocabs = vocabs;
        document.getElementById('quiz-container').classList.remove('hidden');
        this.showQuizQuestion(0);
    }

    showQuizQuestion(index) {
        const vocab = this.currentLearningVocabs[index];
        if (!vocab) {
            this.endLearning();
            return;
        }

        document.getElementById('quiz-feedback').style.display = 'none';
        document.getElementById('next-question-btn').style.display = 'none';

        const progress = ((index) / this.currentLearningVocabs.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = progress + '%';
        document.getElementById('quiz-progress-text').textContent = `${index} / ${this.currentLearningVocabs.length}`;

        document.getElementById('quiz-question-text').textContent = `Übersetze: ${vocab.german}`;

        const options = this.generateQuizOptions(vocab);
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';

        options.forEach((option, i) => {
            const button = document.createElement('div');
            button.className = 'quiz-option';
            button.textContent = option;
            button.addEventListener('click', () => {
                this.checkQuizAnswer(option === vocab.english, vocab, button);
            });
            optionsContainer.appendChild(button);
        });
    }

    generateQuizOptions(vocab) {
        const options = [vocab.english];
        const otherVocabs = this.currentLearningVocabs.filter(v => v.id !== vocab.id);

        while (options.length < 4 && otherVocabs.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherVocabs.length);
            options.push(otherVocabs[randomIndex].english);
            otherVocabs.splice(randomIndex, 1);
        }

        return options.sort(() => Math.random() - 0.5);
    }

    checkQuizAnswer(isCorrect, vocab, button) {
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            button.classList.add('correct');
            this.currentQuizScore++;
            document.getElementById('quiz-feedback').textContent = '✅ Richtig!';
            document.getElementById('quiz-feedback').className = 'quiz-feedback correct';
            this.recordProgress(true, vocab.id);
        } else {
            button.classList.add('incorrect');
            document.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.textContent === vocab.english) {
                    opt.classList.add('correct');
                }
            });
            document.getElementById('quiz-feedback').textContent = `❌ Falsch! Richtig: ${vocab.english}`;
            document.getElementById('quiz-feedback').className = 'quiz-feedback incorrect';
            this.recordProgress(false, vocab.id);
        }

        document.getElementById('quiz-feedback').style.display = 'block';
        document.getElementById('next-question-btn').style.display = 'inline-block';
    }

    nextQuizQuestion() {
        this.currentLearningIndex++;
        if (this.currentLearningIndex < this.currentLearningVocabs.length) {
            this.showQuizQuestion(this.currentLearningIndex);
        } else {
            this.endLearning();
        }
    }

    // ============================================
    // TYPING MODE
    // ============================================

    startTyping(vocabs) {
        this.currentLearningVocabs = vocabs;
        document.getElementById('typing-container').classList.remove('hidden');
        this.showTypingQuestion(0);
    }

    showTypingQuestion(index) {
        const vocab = this.currentLearningVocabs[index];
        if (!vocab) {
            this.endLearning();
            return;
        }

        const progress = ((index) / this.currentLearningVocabs.length) * 100;
        document.getElementById('typing-progress-fill').style.width = progress + '%';
        document.getElementById('typing-progress-text').textContent = `${index} / ${this.currentLearningVocabs.length}`;

        document.getElementById('typing-word').textContent = vocab.german;
        document.getElementById('typing-input').value = '';
        document.getElementById('typing-feedback').innerHTML = '';
        document.getElementById('typing-input').focus();
    }

    checkTypingAnswer() {
        const vocab = this.currentLearningVocabs[this.currentLearningIndex];
        const userAnswer = document.getElementById('typing-input').value.trim().toLowerCase();
        const correctAnswer = vocab.english.toLowerCase();

        const feedback = document.getElementById('typing-feedback');

        if (userAnswer === correctAnswer) {
            feedback.innerHTML = '✅ Richtig!';
            feedback.className = 'typing-feedback correct';
            this.recordProgress(true, vocab.id);
            this.currentQuizScore++;

            setTimeout(() => {
                this.currentLearningIndex++;
                if (this.currentLearningIndex < this.currentLearningVocabs.length) {
                    this.showTypingQuestion(this.currentLearningIndex);
                } else {
                    this.endLearning();
                }
            }, 1500);
        } else {
            feedback.innerHTML = `❌ Falsch! Richtig: ${vocab.english}`;
            feedback.className = 'typing-feedback incorrect';
            this.recordProgress(false, vocab.id);
        }
    }

    // ============================================
    // PROGRESS TRACKING
    // ============================================

    recordProgress(isCorrect, vocabId = null) {
        if (!vocabId) {
            vocabId = this.currentLearningVocabs[this.currentLearningIndex].id;
        }

        if (!this.progress[vocabId]) {
            this.progress[vocabId] = {
                attempts: 0,
                correct: 0,
                incorrect: 0,
                learned: false,
                lastReview: null,
            };
        }

        this.progress[vocabId].attempts++;
        if (isCorrect) {
            this.progress[vocabId].correct++;
        } else {
            this.progress[vocabId].incorrect++;
        }

        this.progress[vocabId].lastReview = new Date().toISOString();

        const successRate = this.progress[vocabId].correct / this.progress[vocabId].attempts;
        if (successRate >= 0.8 && this.progress[vocabId].attempts >= 3) {
            this.progress[vocabId].learned = true;
        }

        this.saveToStorage();
    }

    // ============================================
    // LEARNING END
    // ============================================

    endLearning() {
        const mode = this.currentLearningMode;
        const totalVocabs = this.currentLearningVocabs.length;
        let score = 0;

        if (mode === 'quiz' || mode === 'typing') {
            score = this.currentQuizScore;
        } else if (mode === 'flashcards') {
            score = Object.values(this.progress).filter(p => p.learned).length;
        }

        const percentage = Math.round((score / totalVocabs) * 100);

        this.showEndLearningModal(mode, score, totalVocabs, percentage);
        this.exitLearning();
    }

    showEndLearningModal(mode, score, total, percentage) {
        const modeText = {
            'flashcards': 'Karteikarten-Sitzung',
            'quiz': 'Quiz',
            'typing': 'Schreib-Übung'
        }[mode];

        alert(`${modeText} abgeschlossen!\n\nErgebnis: ${score}/${total} (${percentage}%)\n\nGute Arbeit, Justin! 🎉`);
        this.addActivity(`${modeText} abgeschlossen: ${percentage}% Erfolgsquote`);
    }

    exitLearning() {
        document.getElementById('learn-mode-selector').style.display = 'block';
        document.getElementById('flashcard-container').classList.add('hidden');
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('typing-container').classList.add('hidden');
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    updateStats() {
        const total = this.vocabularies.length;
        const learned = Object.values(this.progress).filter(p => p.learned).length;
        const attempts = Object.values(this.progress).reduce((sum, p) => sum + p.attempts, 0);
        const correct = Object.values(this.progress).reduce((sum, p) => sum + p.correct, 0);
        const successRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-learned').textContent = learned;
        document.getElementById('stat-success').textContent = successRate + '%';
    }

    renderHome() {
        this.updateStats();
    }

    renderDashboard() {
        const total = this.vocabularies.length;
        const learned = Object.values(this.progress).filter(p => p.learned).length;
        const attempts = Object.values(this.progress).reduce((sum, p) => sum + p.attempts, 0);
        const correct = Object.values(this.progress).reduce((sum, p) => sum + p.correct, 0);
        const successRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

        document.getElementById('dash-total-vocabs').textContent = total;
        document.getElementById('dash-learned-vocabs').textContent = learned;
        document.getElementById('dash-success-rate').textContent = successRate + '%';
        document.getElementById('dash-streak').textContent = this.calculateStreak();

        this.renderActivityList();
        this.renderProgressChart();
    }

    calculateStreak() {
        if (this.activities.length === 0) return 0;

        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        for (let i = 0; i < this.activities.length; i++) {
            const actDate = new Date(this.activities[i].timestamp).toDateString();
            if (actDate === today || actDate === yesterday) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    renderActivityList() {
        const container = document.getElementById('activity-list');
        container.innerHTML = '';

        if (this.activities.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Noch keine Aktivitäten</p>';
            return;
        }

        this.activities.slice(-10).reverse().forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            const date = new Date(activity.timestamp);
            item.innerHTML = `
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${date.toLocaleDateString('de-DE')} ${date.toLocaleTimeString('de-DE')}</div>
            `;
            container.appendChild(item);
        });
    }

    renderProgressChart() {
        const ctx = document.getElementById('progress-chart');
        if (!ctx) return;

        const vocabs = this.vocabularies;
        const labels = vocabs.slice(-10).map(v => v.german);
        const data = vocabs.slice(-10).map(v => {
            const p = this.progress[v.id];
            return p ? (p.correct / p.attempts * 100) : 0;
        });

        if (window.progressChart) {
            window.progressChart.destroy();
        }

        window.progressChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Erfolgsquote (%)',
                    data: data,
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    }
                }
            }
        });
    }

    addActivity(text) {
        this.activities.push({
            text,
            timestamp: new Date().toISOString(),
        });
        this.saveToStorage();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportData() {
        const data = {
            vocabularies: this.vocabularies,
            lists: this.lists,
            progress: this.progress,
            exportDate: new Date().toISOString(),
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vokabeltrainer-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('Daten exportiert!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.vocabularies = data.vocabularies || [];
                    this.lists = data.lists || [];
                    this.progress = data.progress || {};
                    this.saveToStorage();
                    alert('Daten importiert!');
                    this.navigateTo('home');
                } catch (error) {
                    alert('Fehler beim Importieren: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    resetAllData() {
        this.vocabularies = [];
        this.lists = [];
        this.progress = {};
        this.activities = [];
        this.saveToStorage();
        alert('Alle Daten wurden gelöscht!');
        this.navigateTo('home');
    }

    showListView(listId) {
        const list = this.lists.find(l => l.id === listId);
        if (!list) return;

        const vocabs = this.vocabularies.filter(v => v.listId === listId);
        
        document.getElementById('lists-grid').style.display = 'none';
        document.getElementById('list-view-container').classList.remove('hidden');
        document.getElementById('list-view-title').textContent = list.name;
        
        this.renderListViewTable(vocabs, listId);
    }

    backFromListView() {
        document.getElementById('lists-grid').style.display = 'grid';
        document.getElementById('list-view-container').classList.add('hidden');
    }

    renderListViewTable(vocabs, listId) {
        const table = document.getElementById('list-view-table');
        table.innerHTML = '';

        if (vocabs.length === 0) {
            table.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Keine Vokabeln in dieser Liste.</div>';
            return;
        }

        const tableHTML = '<table class="editable-table"><thead><tr><th>Deutsch</th><th>Englisch</th><th>Beispielsatz</th><th>Aktionen</th></tr></thead><tbody id="list-table-body"></tbody></table>';
        table.innerHTML = tableHTML;

        const tbody = document.getElementById('list-table-body');
        vocabs.forEach((vocab, index) => {
            const row = document.createElement('tr');
            row.id = 'vocab-row-' + vocab.id;
            const rowHTML = '<td><input type="text" class="table-input" value="' + this.escapeHtml(vocab.german) + '" data-vocab-id="' + vocab.id + '" data-field="german"></td>' +
                '<td><input type="text" class="table-input" value="' + this.escapeHtml(vocab.english) + '" data-vocab-id="' + vocab.id + '" data-field="english"></td>' +
                '<td><input type="text" class="table-input" value="' + this.escapeHtml(vocab.example || '') + '" data-vocab-id="' + vocab.id + '" data-field="example"></td>' +
                '<td><button class="btn btn-small btn-success" onclick="app.saveTableRow(' + vocab.id + ')">Speichern</button>' +
                '<button class="btn btn-small btn-danger" onclick="app.deleteVocabulary(' + vocab.id + ')">Loeschen</button></td>';
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
    }

    saveTableRow(vocabId) {
        const vocab = this.vocabularies.find(v => v.id === vocabId);
        if (!vocab) return;

        const germanInput = document.querySelector('input[data-vocab-id="' + vocabId + '"][data-field="german"]');
        const englishInput = document.querySelector('input[data-vocab-id="' + vocabId + '"][data-field="english"]');
        const exampleInput = document.querySelector('input[data-vocab-id="' + vocabId + '"][data-field="example"]');

        const german = germanInput.value.trim();
        const english = englishInput.value.trim();
        const example = exampleInput.value.trim();

        if (!german || !english) {
            alert('Deutsch und Englisch duerfen nicht leer sein');
            return;
        }

        vocab.german = german;
        vocab.english = english;
        vocab.example = example;

        this.saveToStorage();
        this.addActivity('Vokabel bearbeitet: ' + german);
        alert('Vokabel gespeichert!');
    }
}

// ============================================
// OCR FUNCTIONALITY (continued in next section)
// ============================================

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new VocabularyTrainer();
});
