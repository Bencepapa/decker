// Quick validation script to check if drag & drop fix is properly implemented

console.log('=== Drag & Drop Fix Validation ===');

// Check if refreshProgramGrid function exists
if (typeof refreshProgramGrid === 'function') {
    console.log('✅ refreshProgramGrid function exists');
} else {
    console.log('❌ refreshProgramGrid function missing');
}

// Check if CardFactory is available
if (typeof CardFactory !== 'undefined') {
    console.log('✅ CardFactory is available');
} else {
    console.log('❌ CardFactory not available');
}

// Check ProgramCard drag methods
if (typeof CardFactory !== 'undefined') {
    try {
        const testCard = CardFactory.create('program', { m_nClass: 0, m_nRating: 1, m_nLoadedRating: 0 });
        if (testCard.handleDragStart && testCard.handleDragOver && testCard.handleDrop && testCard.handleDragEnd) {
            console.log('✅ ProgramCard drag methods exist');
        } else {
            console.log('❌ ProgramCard drag methods missing');
        }
    } catch (error) {
        console.log('❌ Error creating test card:', error.message);
    }
}

console.log('=== Validation Complete ===');