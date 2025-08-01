// UI handlers for the Momolator
// Translation logic is in translator.js

function translateToMomoHandler() {
    const englishText = document.getElementById('english-text').value;
    if (!englishText.trim()) {
        document.getElementById('momo-text').value = '';
        return;
    }
    
    try {
        const momo = window.translateToMomo(englishText);
        document.getElementById('momo-text').value = momo;
    } catch (error) {
        console.error('Translation error:', error);
        document.getElementById('momo-text').value = 'Error in translation';
    }
}

function translateToEnglishHandler() {
    const momoText = document.getElementById('momo-text').value;
    if (!momoText.trim()) {
        document.getElementById('english-text').value = '';
        return;
    }
    
    try {
        const english = window.translateToEnglish(momoText);
        document.getElementById('english-text').value = english;
    } catch (error) {
        console.error('Translation error:', error);
        document.getElementById('english-text').value = 'Error in translation';
    }
}

// Add event listeners for real-time clearing
document.addEventListener('DOMContentLoaded', function() {
    const englishTextArea = document.getElementById('english-text');
    const momoTextArea = document.getElementById('momo-text');
    
    if (englishTextArea) {
        englishTextArea.addEventListener('input', function() {
            if (this.value.trim() === '') {
                momoTextArea.value = '';
            }
        });
    }
    
    if (momoTextArea) {
        momoTextArea.addEventListener('input', function() {
            if (this.value.trim() === '') {
                englishTextArea.value = '';
            }
        });
    }
    
    // Add some sample text on page load
    if (englishTextArea) {
        englishTextArea.value = 'Hello Matara Kan!';
        translateToMomoHandler();
    }
});

// Toggle spoiler section
function toggleSpoiler() {
    const content = document.getElementById('spoiler-content');
    const arrow = document.querySelector('.spoiler-arrow');
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        arrow.classList.add('open');
    } else {
        content.style.display = 'none';
        arrow.classList.remove('open');
    }
}