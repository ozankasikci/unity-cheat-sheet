import * as fs from 'fs';
import * as path from 'path';

interface Section {
    title: string;
    content: string;
    level: number;
    slug: string;
    subsections: Section[];
}

function slugify(text: string): string {
    // Handle URLs in the text
    if (text.includes('http')) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Handle normal text
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/&/g, 'and')
        .replace(/(^-|-$)/g, '');
}

function parseMarkdownSections(content: string): Section[] {
    const lines = content.split('\n');
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentContent: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
        // Handle code block boundaries
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            currentContent.push(line);
            continue;
        }

        if (line.startsWith('#') && !inCodeBlock) {
            // Save previous section if exists
            if (currentSection) {
                currentSection.content = currentContent.join('\n');
                currentContent = [];
            }

            // Parse new section
            const headingMatch = line.match(/^(#+)\s*(.+?)(?:\s*\[(.*?)\])?$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const title = headingMatch[2];
                const link = headingMatch[3];
                
                // Handle special cases and links in the title
                let slug = title;
                if (title === 'Movement & Rotation') {
                    slug = 'movement-rotation';
                } else if (link) {
                    slug = `${slugify(title)}-${slugify(link)}`;
                } else {
                    slug = slugify(title);
                }
                
                const newSection: Section = {
                    title,
                    content: '',
                    level,
                    slug,
                    subsections: []
                };

                // Add to appropriate parent based on level
                if (level === 2) {
                    sections.push(newSection);
                } else if (level === 3 && sections.length > 0) {
                    sections[sections.length - 1].subsections.push(newSection);
                }

                currentSection = newSection;
            }
        } else {
            currentContent.push(line);
        }
    }

    // Save last section
    if (currentSection) {
        currentSection.content = currentContent.join('\n');
    }

    return sections;
}

function generateDocsifyFiles(sections: Section[]): void {
    const docsDir = path.join(__dirname, '..', 'docs');
    
    // Create docs directory if it doesn't exist
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    // Generate _sidebar.md
    const sidebarContent = generateSidebar(sections);
    fs.writeFileSync(path.join(docsDir, '_sidebar.md'), sidebarContent);

    // Generate section files
    sections.forEach(section => {
        const sectionDir = path.join(docsDir, section.slug);
        if (!fs.existsSync(sectionDir)) {
            fs.mkdirSync(sectionDir, { recursive: true });
        }

        // Generate README.md for the section
        const mainContent = `# ${section.title}\n\n${section.content.trim()}`;
        fs.writeFileSync(path.join(sectionDir, 'README.md'), mainContent);

        // Generate subsection files
        section.subsections.forEach(subsection => {
            const content = `# ${subsection.title}\n\n${subsection.content.trim()}`;
            const fileName = subsection.slug.includes('http') ? 
                subsection.slug.split('-https')[0] + '.md' : 
                subsection.slug + '.md';
            fs.writeFileSync(
                path.join(sectionDir, fileName),
                content
            );
        });
    });

    // Generate main README.md with table of contents
    let mainReadme = `# Unity Cheat Sheet\n\n`;
    mainReadme += `A comprehensive guide to Unity development patterns and practices.\n\n`;
    mainReadme += `## Table of Contents\n\n`;
    
    sections.forEach(section => {
        mainReadme += `### [${section.title}](${section.slug}/README.md)\n\n`;
        if (section.subsections.length > 0) {
            section.subsections.forEach(subsection => {
                const fileName = subsection.slug.includes('http') ?
                    subsection.slug.split('-https')[0] : 
                    subsection.slug;
                mainReadme += `- [${subsection.title}](${section.slug}/${fileName}.md)\n`;
            });
            mainReadme += '\n';
        }
    });

    // Write README.md in docs directory
    fs.writeFileSync(path.join(docsDir, 'README.md'), mainReadme);
}

function generateSidebar(sections: Section[]): string {
    let content = '<!-- docs/_sidebar.md -->\n\n';
    content += '* [Home](README.md)\n\n';

    sections.forEach(section => {
        content += `* ${section.title}\n`;
        content += `  * [Overview](${section.slug}/README.md)\n`;
        section.subsections.forEach(subsection => {
            const fileName = subsection.slug.includes('http') ?
                subsection.slug.split('-https')[0] : 
                subsection.slug;
            content += `  * [${subsection.title}](${section.slug}/${fileName}.md)\n`;
        });
        content += '\n';
    });

    return content;
}

// Main execution
const readmePath = path.join(__dirname, '..', '..', 'README.md');
const content = fs.readFileSync(readmePath, 'utf-8');
const sections = parseMarkdownSections(content);

// Generate Docsify files
generateDocsifyFiles(sections);

// Copy the generated README.md to index.md for Docsify
const generatedReadmePath = path.join(__dirname, '..', 'README.md');
if (fs.existsSync(generatedReadmePath)) {
    fs.copyFileSync(
        generatedReadmePath,
        path.join(__dirname, '..', 'index.md')
    );
} 