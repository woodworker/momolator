// Simple unit tests for Momolator
const assert = require('assert');
const { textToMorse, morseToMomo, translateToMomo, translateToEnglish } = require('./translator.js');

// Simple test runner
function runTest(name, testFn) {
    try {
        testFn();
        console.log(`✓ ${name}`);
    } catch (error) {
        console.log(`✗ ${name}: ${error.message}`);
    }
}

// Test textToMorse function
runTest('textToMorse - simple word', () => {
    const result = textToMorse('HELLO');
    const expected = '.... . .-.. .-.. ---';
    assert.strictEqual(result, expected);
});

runTest('textToMorse - with period', () => {
    const result = textToMorse('HELLO.');
    const expected = '.... . .-.. .-.. --- §';
    assert.strictEqual(result, expected);
});

// Test morseToMomo function
runTest('morseToMomo - simple word', () => {
    const result = morseToMomo('.... . .-.. .-.. ---');
    const expected = 'BbbbBBlbbBlbbLll';
    assert.strictEqual(result, expected);
});

runTest('morseToMomo - with period', () => {
    const result = morseToMomo('.... . .-.. .-.. --- §');
    const expected = 'BbbbBBlbbBlbbLll.';
    assert.strictEqual(result, expected);
});

// Test full translation
runTest('translateToMomo - complete flow', () => {
    const result = translateToMomo('Hello!');
    const expected = 'BbbbBBlbbBlbbLll!';
    assert.strictEqual(result, expected);
});

runTest('translateToMomo - with period', () => {
    const result = translateToMomo('Hi.');
    const expected = 'BbbbBb.';
    assert.strictEqual(result, expected);
});

// Test round-trip translation
runTest('Round-trip translation - Hello.', () => {
    const original = 'Hello.';
    const momo = translateToMomo(original);
    const backToEnglish = translateToEnglish(momo);
    assert.strictEqual(backToEnglish.toLowerCase(), original.toLowerCase());
});

runTest('Round-trip translation - Hello!', () => {
    const original = 'Hello!';
    const momo = translateToMomo(original);
    const backToEnglish = translateToEnglish(momo);
    assert.strictEqual(backToEnglish.toLowerCase(), original.toLowerCase());
});

runTest('Round-trip translation - Hello - Momo', () => {
    const original = 'Hello - Momo';
    const momo = translateToMomo(original);
    const backToEnglish = translateToEnglish(momo);
    assert.strictEqual(backToEnglish.toLowerCase(), original.toLowerCase());
});

console.log('\nTest run complete!');