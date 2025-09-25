// Simple script to add sample data to MongoDB
// Usage: node add-sample-data.js

const {exec} = require('child_process');

console.log('🚀 Adding sample data to MongoDB...');

// Run the main script
exec('node INSERT_SAMPLE_DATA.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error: ${error}`);
        return;
    }

    if (stderr) {
        console.error(`❌ stderr: ${stderr}`);
        return;
    }

    console.log(`✅ Success: ${stdout}`);
    console.log('\n🎉 Sample data has been added to your database!');
    console.log('\n📋 You can now demonstrate:');
    console.log('   • INSERT operations with new records');
    console.log('   • UPDATE operations on existing records');
    console.log('   • DELETE operations to remove records');
    console.log('\n💡 Tip: Use the user IDs shown in the output for your demo!');
});