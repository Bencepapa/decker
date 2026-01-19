// Debug script to test insert-before logic
console.log('=== Testing Insert-Before Logic ===');

// Test case 1: Moving item from index 2 to before index 0
console.log('Test 1: Move from index 2 to before index 0');
let testArray = ['A', 'B', 'C', 'D', 'E'];
console.log('Before:', testArray);

const draggedIndex = 2; // 'C'
const targetIndex = 0; // 'A'
const draggedProgram = testArray[draggedIndex]; // 'C'

// Remove from original position
testArray.splice(draggedIndex, 1);
console.log('After splice remove:', testArray);

// Insert at new position (before target)
const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
testArray.splice(adjustedTargetIndex, 0, draggedProgram);
console.log('After insert:', testArray);
console.log('Expected: ["C", "A", "B", "D", "E"]');

console.log('\n---');

// Test case 2: Moving item from index 0 to before index 3
console.log('Test 2: Move from index 0 to before index 3');
let testArray2 = ['A', 'B', 'C', 'D', 'E'];
console.log('Before:', testArray2);

const draggedIndex2 = 0; // 'A'
const targetIndex2 = 3; // 'D'
const draggedProgram2 = testArray2[draggedIndex2]; // 'A'

// Remove from original position
testArray2.splice(draggedIndex2, 1);
console.log('After splice remove:', testArray2);

// Insert at new position (before target)
const adjustedTargetIndex2 = draggedIndex2 < targetIndex2 ? targetIndex2 - 1 : targetIndex2;
testArray2.splice(adjustedTargetIndex2, 0, draggedProgram2);
console.log('After insert:', testArray2);
console.log('Expected: ["B", "C", "A", "D", "E"]');