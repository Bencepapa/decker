// Quick test of the actual insert-before logic
function testInsertLogic() {
    console.log('=== Testing Insert Logic ===');
    
    // Test Case 1: Move index 2 to before index 0
    let arr1 = ['A', 'B', 'C', 'D', 'E'];
    console.log('Original:', arr1);
    
    const draggedIndex = 2;
    const targetIndex = 0;
    const insertAfter = false; // BEFORE
    
    const draggedProgram = arr1[draggedIndex];
    arr1.splice(draggedIndex, 1);
    console.log('After remove:', arr1);
    
    let adjustedTargetIndex = targetIndex;
    if (draggedIndex < targetIndex) {
        adjustedTargetIndex = targetIndex - 1;
    }
    if (insertAfter) {
        adjustedTargetIndex += 1;
    }
    
    arr1.splice(adjustedTargetIndex, 0, draggedProgram);
    console.log('After insert:', arr1);
    console.log('Expected: ["C", "A", "B", "D", "E"]');
    console.log('Success:', JSON.stringify(arr1) === JSON.stringify(["C", "A", "B", "D", "E"]));
    
    console.log('\n---');
    
    // Test Case 2: Move index 0 to after index 2
    let arr2 = ['A', 'B', 'C', 'D', 'E'];
    console.log('Original:', arr2);
    
    const draggedIndex2 = 0;
    const targetIndex2 = 2;
    const insertAfter2 = true; // AFTER
    
    const draggedProgram2 = arr2[draggedIndex2];
    arr2.splice(draggedIndex2, 1);
    console.log('After remove:', arr2);
    
    let adjustedTargetIndex2 = targetIndex2;
    if (draggedIndex2 < targetIndex2) {
        adjustedTargetIndex2 = targetIndex2 - 1;
    }
    if (insertAfter2) {
        adjustedTargetIndex2 += 1;
    }
    
    arr2.splice(adjustedTargetIndex2, 0, draggedProgram2);
    console.log('After insert:', arr2);
    console.log('Expected: ["B", "C", "A", "D", "E"]');
    console.log('Success:', JSON.stringify(arr2) === JSON.stringify(["B", "C", "A", "D", "E"]));
}

testInsertLogic();