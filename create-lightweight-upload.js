const fs = require('fs');
const path = require('path');

console.log('📦 Creating lightweight project for GitHub upload...');
console.log();

const sourceDir = process.cwd();
const uploadDir = path.join(sourceDir, 'temp-upload-light');

// Clean and create upload directory
if (fs.existsSync(uploadDir)) {
    fs.rmSync(uploadDir, { recursive: true, force: true });
}
fs.mkdirSync(uploadDir, { recursive: true });

// Helper function to copy files recursively, excluding specified patterns
function copyDirectory(src, dest, excludePatterns = []) {
    if (!fs.existsSync(src)) return;
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        // Skip excluded patterns
        const shouldExclude = excludePatterns.some(pattern => {
            if (typeof pattern === 'string') {
                return item === pattern || srcPath.includes(pattern);
            }
            return pattern.test(item);
        });
        
        if (shouldExclude) {
            console.log(`⏭️  Skipping: ${item}`);
            continue;
        }
        
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDirectory(srcPath, destPath, excludePatterns);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper function to copy single file
function copyFile(src, dest) {
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`✅ Copied: ${path.basename(src)}`);
    }
}

try {
    // Patterns to exclude (heavy files/folders)
    const excludePatterns = [
        'node_modules',
        'build',
        'dist',
        '.git',
        '.vercel',
        'temp-upload',
        'temp-upload-clean',
        'temp-upload-light',
        /\.log$/,
        /\.zip$/,
        /\.tar\.gz$/
    ];
    
    console.log('📁 Copying client source files...');
    const clientSrc = path.join(sourceDir, 'client');
    const clientDest = path.join(uploadDir, 'client');
    if (fs.existsSync(clientSrc)) {
        fs.mkdirSync(clientDest, { recursive: true });
        copyDirectory(clientSrc, clientDest, excludePatterns);
    }
    
    console.log('🖥️  Copying server files...');
    const serverSrc = path.join(sourceDir, 'server');
    const serverDest = path.join(uploadDir, 'server');
    if (fs.existsSync(serverSrc)) {
        fs.mkdirSync(serverDest, { recursive: true });
        copyDirectory(serverSrc, serverDest, excludePatterns);
    }
    
    console.log('🤖 Copying AI service files...');
    const aiSrc = path.join(sourceDir, 'ai-service');
    const aiDest = path.join(uploadDir, 'ai-service');
    if (fs.existsSync(aiSrc)) {
        fs.mkdirSync(aiDest, { recursive: true });
        copyDirectory(aiSrc, aiDest, excludePatterns);
    }
    
    console.log('📜 Copying scripts...');
    const scriptsSrc = path.join(sourceDir, 'scripts');
    const scriptsDest = path.join(uploadDir, 'scripts');
    if (fs.existsSync(scriptsSrc)) {
        fs.mkdirSync(scriptsDest, { recursive: true });
        copyDirectory(scriptsSrc, scriptsDest, excludePatterns);
    }
    
    console.log('⚙️  Copying configuration files...');
    // Copy root configuration files
    const configFiles = [
        'package.json',
        'package-lock.json',
        'vercel.json',
        'README.md',
        '.gitignore',
        'Dockerfile',
        'DEPLOY-NOW.md'
    ];
    
    configFiles.forEach(file => {
        copyFile(path.join(sourceDir, file), path.join(uploadDir, file));
    });
    
    console.log();
    console.log('✅ Lightweight project created successfully!');
    console.log(`📁 Location: ${uploadDir}`);
    console.log();
    
    // Calculate approximate size
    function getFolderSize(folderPath) {
        let size = 0;
        try {
            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    size += getFolderSize(filePath);
                } else {
                    size += stats.size;
                }
            });
        } catch (err) {
            // Ignore errors
        }
        return size;
    }
    
    const sizeBytes = getFolderSize(uploadDir);
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    
    console.log(`📊 Estimated size: ${sizeMB} MB`);
    console.log();
    console.log('📋 NEXT STEPS:');
    console.log('1. Navigate to temp-upload-light folder');
    console.log('2. Select ALL files and folders (Ctrl+A)');
    console.log('3. Right-click → Send to → Compressed folder');
    console.log('4. Upload the ZIP to GitHub');
    console.log();
    console.log('🎯 This should be well under the 25MB GitHub limit!');
    
} catch (error) {
    console.error('❌ Error creating lightweight upload:', error.message);
    process.exit(1);
}