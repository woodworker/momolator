// Morse code dictionary
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': '/'
};

// Reverse morse code dictionary for decoding
const reverseMorseCode = {};
for (const [key, value] of Object.entries(morseCode)) {
    reverseMorseCode[value] = key;
}

function textToMorse(text) {
    return text.toUpperCase()
        .split('')
        .map(char => {
            if (morseCode[char]) {
                return morseCode[char];
            } else if (char.match(/[.,:;!?'"()-]/)) {
                // Keep punctuation as is
                return char;
            } else {
                return '';
            }
        })
        .filter(code => code !== '')
        .join(' ');
}

function morseToMomo(morse) {
    const letters = morse.split(' ');
    let result = '';

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];

        if (letter === '/') {
            result += ' ';
        } else if (letter.match(/^[,:;!?'"()]+$/)) {
            // Keep punctuation as is (but not dots/dashes which are morse code)
            result += letter;
        } else if (letter) {
            // Convert morse to momo: . -> b, - -> l
            const momoLetter = letter.replace(/\./g, 'b').replace(/-/g, 'l');

            // First character of each letter is uppercase to mark letter boundary
            if (momoLetter.length > 0) {
                result += momoLetter.charAt(0).toUpperCase() + momoLetter.slice(1);
            }
        }
    }

    return result;
}

function momoToMorse(momo) {
    let result = '';

    // Split into tokens: words, punctuation, and momo letter groups
    const tokens = [];
    let currentToken = '';

    for (let i = 0; i < momo.length; i++) {
        const char = momo[i];

        if (char === ' ') {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = '';
            }
            tokens.push(' ');
        } else if (char.match(/[,:;!?'"()-]/)) {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = '';
            }
            tokens.push(char);
        } else {
            currentToken += char;
        }
    }

    // Don't forget the last token
    if (currentToken) {
        tokens.push(currentToken);
    }

    // Process each token
    for (const token of tokens) {
        if (token === ' ') {
            result += '/ ';
        } else if (token.match(/^[,:;!?'"()-]$/)) {
            result += token + ' ';
        } else {
            // Split momo token by uppercase letters (BbbbBBlbb -> [Bbbb, B, Blbb])
            const momoLetters = token.split(/(?=[BL])/).filter(part => part.length > 0);
            console.log("Momo letters:", token, momoLetters);

            for (const momoLetter of momoLetters) {
                // Convert each momo letter to morse
                const morseCode = momoLetter.replace(/B/g, '.').replace(/L/g, '-').replace(/b/g, '.').replace(/l/g, '-');
                result += morseCode + ' ';
            }
        }
    }

    return result.trim();
}

function morseToText(morse) {
    const words = morse.split(' / ');

    return words.map(word => {
        const letters = word.split(' ').filter(letter => letter !== '');

        const translatedWord = letters.map(letter => {
            if (letter.match(/^[,:;!?'"()]+$/)) {
                return letter;
            }
            const translated = reverseMorseCode[letter];
            return translated || '';
        }).join('');
        
        // Capitalize first letter of each word
        return translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1).toLowerCase();
    }).join(' ');
}

function translateToMomo() {
    const englishText = document.getElementById('english-text').value;
    if (!englishText.trim()) {
        document.getElementById('momo-text').value = '';
        return;
    }

    try {
        const morse = textToMorse(englishText);
        const momo = morseToMomo(morse);
        document.getElementById('momo-text').value = momo;
    } catch (error) {
        console.error('Translation error:', error);
        document.getElementById('momo-text').value = 'Error in translation';
    }
}

function translateToEnglish() {
    const momoText = document.getElementById('momo-text').value;
    if (!momoText.trim()) {
        document.getElementById('english-text').value = '';
        return;
    }

    try {
        const morse = momoToMorse(momoText);
        const english = morseToText(morse);
        console.log("Momo text:", momoText);
        console.log("Morse code:", morse);
        console.log("Translated English:", english);
        document.getElementById('english-text').value = english;
    } catch (error) {
        console.error('Translation error:', error);
        document.getElementById('english-text').value = 'Error in translation';
    }
}

// Add event listeners for real-time translation (optional)
document.getElementById('english-text').addEventListener('input', function() {
    if (this.value.trim() === '') {
        document.getElementById('momo-text').value = '';
    }
});

document.getElementById('momo-text').addEventListener('input', function() {
    if (this.value.trim() === '') {
        document.getElementById('english-text').value = '';
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

// Add some sample text on page load
window.addEventListener('load', function() {
    document.getElementById('english-text').value = 'Hello Matara Kan!';
    translateToMomo();
});