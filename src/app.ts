import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

async function convertDocxToPdf(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${path.dirname(outputPath)}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error converting ${inputPath}: ${stderr}`);
                return;
            }
            console.log(`Converted ${inputPath} to ${outputPath}`);
            resolve();
        });
    });
}

async function convertAllDocxFiles(inputDir: string, outputDir: string): Promise<void> {
    const files = await fs.readdir(inputDir);

    for (const file of files) {
        if (path.extname(file) === '.docx') {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, `${path.basename(file, '.docx')}.pdf`);
            await convertDocxToPdf(inputPath, outputPath);
        }
    }
}

// Run the conversion for all files in the input directory
const inputDir = path.resolve(__dirname, '../input');
const outputDir = path.resolve(__dirname, '../output');

convertAllDocxFiles(inputDir, outputDir)
    .then(() => console.log('Conversion completed.'))
    .catch(err => console.error('Error during conversion:', err));