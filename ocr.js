// ============================================
// OCR FUNCTIONALITY - TESSERACT.JS INTEGRATION
// ============================================

// Extend VocabularyTrainer class with OCR methods
Object.assign(VocabularyTrainer.prototype, {
    showOCRForm() {
        document.getElementById('ocr-form-container').classList.remove('hidden');
        document.getElementById('ocr-preview').classList.add('hidden');
        document.getElementById('ocr-status').classList.add('hidden');
        document.getElementById('ocr-results').classList.add('hidden');
        document.getElementById('ocr-form').reset();
    },

    hideOCRForm() {
        document.getElementById('ocr-form-container').classList.add('hidden');
        document.getElementById('ocr-form').reset();
        document.getElementById('ocr-preview').classList.add('hidden');
        document.getElementById('ocr-status').classList.add('hidden');
        document.getElementById('ocr-results').classList.add('hidden');
    },

    async processOCRImage() {
        const fileInput = document.getElementById('ocr-image');
        const file = fileInput.files[0];

        if (!file) {
            alert('Bitte wähle ein Bild aus');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('ocr-preview-img').src = e.target.result;
            document.getElementById('ocr-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);

        // Show status
        const statusDiv = document.getElementById('ocr-status');
        statusDiv.classList.remove('hidden');
        statusDiv.innerHTML = '<span class="spinner">⏳</span> Bild wird analysiert...';

        try {
            // Use Tesseract.js to extract text
            const result = await Tesseract.recognize(file, 'deu+eng');
            const text = result.data.text;

            // Parse vocabulary pairs
            const vocabs = this.parseVocabularyFromText(text);

            if (vocabs.length === 0) {
                statusDiv.innerHTML = '❌ Keine Vokabelpaare erkannt. Bitte versuche es mit einem anderen Bild.';
                return;
            }

            // Show results
            this.displayOCRResults(vocabs);
            statusDiv.classList.add('hidden');
        } catch (error) {
            console.error('OCR Error:', error);
            statusDiv.innerHTML = '❌ Fehler bei der Bildanalyse: ' + error.message;
        }
    },

    parseVocabularyFromText(text) {
        const vocabs = [];
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        // Enhanced parsing with multiple strategies
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Skip lines that are too short or are likely headers
            if (line.length < 3 || /^(vokabel|english|deutsch|word|translation|unit|chapter|lektion)$/i.test(line)) continue;

            // Remove common OCR artifacts and line numbers at the start
            let cleanLine = line.replace(/^[\d.\s)\-]+/, '').trim();
            if (cleanLine.length < 3) continue;

            let parts = [];

            // Strategy 1: Split by explicit separators (most reliable)
            if (cleanLine.includes(' - ')) {
                parts = cleanLine.split(' - ').map(p => p.trim());
            } else if (cleanLine.includes(' – ')) {
                parts = cleanLine.split(' – ').map(p => p.trim());
            } else if (cleanLine.includes(' — ')) {
                parts = cleanLine.split(' — ').map(p => p.trim());
            } else if (cleanLine.includes(' | ')) {
                parts = cleanLine.split(' | ').map(p => p.trim());
            } else if (cleanLine.includes('\t')) {
                parts = cleanLine.split('\t').map(p => p.trim());
            } else if (cleanLine.includes('  ')) {
                // Multiple spaces as separator
                parts = cleanLine.split(/\s{2,}/).map(p => p.trim());
            } else {
                // Strategy 2: Try to detect language and split
                const words = cleanLine.split(/\s+/);
                if (words.length >= 2) {
                    let splitPoint = -1;
                    
                    for (let j = 1; j < words.length; j++) {
                        const leftPart = words.slice(0, j).join(' ');
                        const rightPart = words.slice(j).join(' ');
                        
                        if (leftPart.length >= 2 && rightPart.length >= 2) {
                            if (this.looksLikeGerman(leftPart) && this.looksLikeEnglish(rightPart)) {
                                splitPoint = j;
                                break;
                            }
                            if (splitPoint === -1) {
                                splitPoint = j;
                            }
                        }
                    }
                    
                    if (splitPoint > 0) {
                        parts = [
                            words.slice(0, splitPoint).join(' '),
                            words.slice(splitPoint).join(' ')
                        ];
                    }
                }
            }

            if (parts.length >= 2) {
                let german = parts[0].trim();
                let english = parts[1].trim();

                // Clean up common OCR artifacts
                german = german.replace(/[^a-zA-ZäöüßÄÖÜ\s-]/g, '').trim();
                english = english.replace(/[^a-zA-Z\s-]/g, '').trim();

                // Validate length
                if (german.length >= 2 && english.length >= 2) {
                    vocabs.push({
                        german: german,
                        english: english,
                        example: ''
                    });
                }
            }
        }

        // Remove duplicates and invalid entries
        const seen = new Set();
        return vocabs.filter(v => {
            if (v.german.length < 2 || v.english.length < 2) return false;
            
            const key = v.german.toLowerCase() + '-' + v.english.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    },

    looksLikeGerman(word) {
        const germanChars = /[äöüßÄÖÜ]/i;
        const germanEndings = /(en|er|el|heit|keit|ung|nis)$/i;
        return germanChars.test(word) || germanEndings.test(word) || word.length <= 10;
    },

    looksLikeEnglish(word) {
        const englishEndings = /(ing|tion|ness|ment|able|ible|ful|less|ly)$/i;
        const commonEnglish = /^(the|a|an|is|are|be|have|has|do|does|can|will|would|should|could)$/i;
        return englishEndings.test(word) || commonEnglish.test(word) || word.length <= 10;
    },

    displayOCRResults(vocabs) {
        const resultsDiv = document.getElementById('ocr-results');
        const resultsList = document.getElementById('ocr-results-list');

        resultsList.innerHTML = '';

        // Create a container for checkboxes
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.marginBottom = '1rem';

        vocabs.forEach((vocab, index) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.padding = '0.75rem';
            item.style.borderRadius = 'var(--radius)';
            item.style.backgroundColor = 'var(--bg-secondary)';
            item.style.marginBottom = '0.5rem';
            item.style.gap = '0.75rem';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'ocr-vocab-' + index;
            checkbox.checked = true;
            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.flexShrink = '0';

            const label = document.createElement('label');
            label.htmlFor = 'ocr-vocab-' + index;
            label.style.flex = '1';
            label.style.cursor = 'pointer';
            label.style.display = 'flex';
            label.style.flexDirection = 'column';
            label.style.gap = '0.25rem';
            label.innerHTML = '<div style="font-weight: 500; color: var(--text-primary);">' + this.escapeHtml(vocab.german) + '</div>' +
                '<div style="color: var(--text-secondary); font-size: 0.875rem;">' + this.escapeHtml(vocab.english) + '</div>';

            item.appendChild(checkbox);
            item.appendChild(label);
            checkboxContainer.appendChild(item);
        });

        resultsList.appendChild(checkboxContainer);

        // Add button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '0.75rem';
        buttonContainer.style.marginTop = '1rem';
        buttonContainer.style.flexWrap = 'wrap';

        // Import Selected button
        const importBtn = document.createElement('button');
        importBtn.type = 'button';
        importBtn.className = 'btn btn-primary';
        importBtn.textContent = 'Ausgewählte importieren';
        importBtn.onclick = () => this.importSelectedOCRVocabularies();
        buttonContainer.appendChild(importBtn);

        // Import All button
        const importAllBtn = document.createElement('button');
        importAllBtn.type = 'button';
        importAllBtn.className = 'btn btn-success';
        importAllBtn.textContent = 'Alle importieren';
        importAllBtn.onclick = () => this.importAllOCRVocabularies(vocabs);
        buttonContainer.appendChild(importAllBtn);

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Abbrechen';
        cancelBtn.onclick = () => this.hideOCRForm();
        buttonContainer.appendChild(cancelBtn);

        resultsList.appendChild(buttonContainer);

        this.ocrResults = vocabs;
        resultsDiv.classList.remove('hidden');
    },

    importSelectedOCRVocabularies() {
        const selectedIndices = [];
        for (let i = 0; i < this.ocrResults.length; i++) {
            const checkbox = document.getElementById('ocr-vocab-' + i);
            if (checkbox && checkbox.checked) {
                selectedIndices.push(i);
            }
        }

        if (selectedIndices.length === 0) {
            alert('Bitte wähle mindestens eine Vokabel aus');
            return;
        }

        let importedCount = 0;
        selectedIndices.forEach((index) => {
            const vocab = this.ocrResults[index];
            if (!vocab) return;

            const newVocab = {
                id: Date.now() + importedCount,
                german: vocab.german,
                english: vocab.english,
                example: vocab.example || '',
                listId: null,
                createdAt: new Date().toISOString(),
            };

            this.vocabularies.push(newVocab);
            importedCount++;
        });

        this.saveToStorage();
        this.addActivity(importedCount + ' Vokabeln aus OCR importiert');
        this.hideOCRForm();
        this.renderVocabularyPage();
        alert(importedCount + ' Vokabel' + (importedCount !== 1 ? 'n' : '') + ' wurde' + (importedCount !== 1 ? 'n' : '') + ' importiert!');
        this.updateStats();
    },

    importAllOCRVocabularies(vocabs) {
        vocabs.forEach((vocab, index) => {
            const newVocab = {
                id: Date.now() + index,
                german: vocab.german,
                english: vocab.english,
                example: vocab.example || '',
                listId: null,
                createdAt: new Date().toISOString(),
            };
            this.vocabularies.push(newVocab);
        });

        this.saveToStorage();
        this.addActivity(vocabs.length + ' Vokabeln aus OCR importiert');
        this.hideOCRForm();
        this.renderVocabularyPage();
        alert(vocabs.length + ' Vokabeln wurden importiert!');
        this.updateStats();
    }
});
