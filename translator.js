// Momolator translation functions - testable module

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
    // Replace periods and dashes with placeholders to avoid conflict with morse
    const textWithPlaceholders = text.replace(/\./g, '§').replace(/-/g, '¤');
    
    return textWithPlaceholders.toUpperCase()
        .split('')
        .map(char => {
            if (char.match(/[§¤,:;!?'"()]/)) {
                // Keep punctuation as is
                return char;
            } else if (morseCode[char]) {
                return morseCode[char];
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
        } else if (letter.match(/^[§¤,:;!?'"()]+$/)) {
            // Keep punctuation as is, convert placeholders back to original characters
            if (letter === '§') {
                result += '.';
            } else if (letter === '¤') {
                result += '-';
            } else {
                result += letter;
            }
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

function translateToMomo(text) {
    const morse = textToMorse(text);
    return morseToMomo(morse);
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
        } else if (char.match(/[.,:;!?'"()-]/)) {
            if (currentToken) {
                tokens.push(currentToken);
                currentToken = '';
            }
            // Convert punctuation back to placeholders for processing
            if (char === '.') {
                tokens.push('§');
            } else if (char === '-') {
                tokens.push('¤');
            } else {
                tokens.push(char);
            }
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
        } else if (token.match(/^[§¤,:;!?'"()]$/)) {
            result += token + ' ';
        } else {
            // Split momo token by uppercase letters (BbbbBBlbb -> [Bbbb, B, Blbb])
            const momoLetters = token.split(/(?=[BL])/).filter(part => part.length > 0);
            
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
            if (letter.match(/^[§¤,:;!?'"()]$/)) {
                if (letter === '§') {
                    return '.';
                } else if (letter === '¤') {
                    return '-';
                } else {
                    return letter;
                }
            }
            const translated = reverseMorseCode[letter];
            return translated || '';
        }).join('');
        
        // Capitalize first letter of each word
        return translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1).toLowerCase();
    }).join(' ');
}

function translateToEnglish(momo) {
    const morse = momoToMorse(momo);
    return morseToText(morse);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        textToMorse,
        morseToMomo,
        momoToMorse,
        morseToText,
        translateToMomo,
        translateToEnglish
    };
}

// Export for browser usage (global functions)
if (typeof window !== 'undefined') {
    window.translateToMomo = translateToMomo;
    window.translateToEnglish = translateToEnglish;
}