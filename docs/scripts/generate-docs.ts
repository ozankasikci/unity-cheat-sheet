import * as fs from 'fs';
import * as path from 'path';

interface Section {
    title: string;
    content: string;
    slug: string;
    subsections: Section[];
    link?: string;
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

function extractSectionContent(content: string, section: Section): void {
    const lines = content.split('\n');
    let inSection = false;
    let sectionContent: string[] = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle code blocks
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            if (inSection) {
                sectionContent.push(line);
            }
            continue;
        }

        if (!inCodeBlock) {
            // Check for section headers
            const headerMatch = line.match(/^(#{2,4})\s+(.+)$/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const title = headerMatch[2].replace(/\[(.*?)\]\(.*?\)/, '$1').trim();

                if (title === section.title) {
                    inSection = true;
                    continue;
                } else if (inSection && level <= 3) {
                    // Stop when we hit another section of same or higher level
                    break;
                }
            }
        }

        if (inSection) {
            sectionContent.push(line);
        }
    }

    section.content = sectionContent.join('\n').trim();
}

function parseMarkdownTree(content: string): Section[] {
    const lines = content.split('\n');
    const sections: Section[] = [];
    let currentSection: Section | null = null;
    let currentSubsection: Section | null = null;
    let inTableOfContents = false;

    // First pass: Parse table of contents for structure
    for (const line of lines) {
        if (line.trim() === '## Table of Contents') {
            inTableOfContents = true;
            continue;
        }

        if (inTableOfContents) {
            if (line.startsWith('##')) {
                inTableOfContents = false;
                continue;
            }

            if (line.trim().startsWith('-')) {
                const indentLevel = line.search(/[^ ]/) / 2;
                const match = line.match(/- \[(.*?)\]\((.*?)\)/) || line.match(/- (.*)/);
                
                if (match) {
                    const title = match[1];
                    const link = match[2];
                    
                    const section: Section = {
                        title,
                        content: '',
                        slug: slugify(title),
                        subsections: [],
                        link
                    };

                    if (indentLevel === 0) {
                        sections.push(section);
                        currentSection = section;
                        currentSubsection = null;
                    } else if (indentLevel === 1 && currentSection) {
                        currentSection.subsections.push(section);
                        currentSubsection = section;
                    }
                }
            }
        }
    }

    // Second pass: Extract content for each section
    sections.forEach(section => {
        extractSectionContent(content, section);
        section.subsections.forEach(subsection => {
            extractSectionContent(content, subsection);
        });
    });

    return sections;
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findContentForSection(section: Section, fullContent: string): void {
    // Try different heading levels
    let sectionStart = -1;
    let headingLevel = '';
    
    // Try different heading levels (###, ##, ####) until we find the section
    for (const level of ['###', '##', '####']) {
        sectionStart = fullContent.indexOf(`${level} ${section.title}`);
        if (sectionStart !== -1) {
            headingLevel = level;
            break;
        }
    }
    
    if (sectionStart === -1) return;

    // Find the next heading of same or higher level
    let sectionEnd = fullContent.length;
    const possibleEndings = fullContent.substring(sectionStart + 1).match(/^#{1,4} /gm);
    
    if (possibleEndings) {
        const nextHeadingIndex = fullContent.indexOf(possibleEndings[0], sectionStart + 1);
        if (nextHeadingIndex !== -1) {
            sectionEnd = nextHeadingIndex;
        }
    }

    const sectionContent = fullContent.substring(sectionStart, sectionEnd).trim();
    
    // Extract content after the heading
    const contentAfterHeading = sectionContent.substring(headingLevel.length + section.title.length + 1).trim();
    
    // If there's content, set it
    if (contentAfterHeading) {
        section.content = contentAfterHeading;
    }

    // Recursively process subsections
    section.subsections.forEach(subsection => {
        findContentForSection(subsection, fullContent);
    });
}

function generateDocsifyFiles(sections: Section[]): void {
    // Create the base docs directory
    const baseDir = path.join(__dirname, '..');
    const contentDir = path.join(baseDir, 'docs');
    
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }

    // Generate section files
    sections.forEach(section => {
        const sectionDir = path.join(contentDir, section.slug);
        if (!fs.existsSync(sectionDir)) {
            fs.mkdirSync(sectionDir, { recursive: true });
        }

        section.subsections.forEach(subsection => {
            // Generate content for the subsection
            let content = `# ${subsection.title}\n\n`;
            
            if (subsection.content) {
                content += `${subsection.content}\n\n`;
            }

            const fileName = `${subsection.slug}.md`;
            fs.writeFileSync(path.join(sectionDir, fileName), content);
        });
    });

    // Generate _sidebar.md in the base directory
    const sidebarContent = generateSidebar(sections);
    fs.writeFileSync(path.join(baseDir, '_sidebar.md'), sidebarContent);

    // Generate main README.md in the base directory
    const mainReadme = generateMainReadme(sections);
    fs.writeFileSync(path.join(baseDir, 'README.md'), mainReadme);
}

function generateSectionContent(section: Section): string {
    let content = `# ${section.title}\n\n`;
    
    if (section.content) {
        content += `${section.content}\n\n`;
    }

    // For each subsection, add its content and then its own subsections
    section.subsections.forEach(subsection => {
        // For level 4 headings (like Transform.LookAt()), we want them as subsections
        content += `## ${subsection.title}\n\n`;
        if (subsection.content) {
            content += `${subsection.content}\n\n`;
        }
    });

    return content;
}

function generateSidebar(sections: Section[]): string {
    let content = '<!-- docs/_sidebar.md -->\n\n';
    content += '* [Home](README.md)\n\n';

    sections.forEach(section => {
        content += `* ${section.title}\n`;
        section.subsections.forEach(subsection => {
            content += `  * [${subsection.title}](docs/${section.slug}/${subsection.slug}.md)\n`;
            
            // Extract level 4 headings from the content
            const level4Headings = subsection.content.match(/^####\s+(.+)$/gm);
            if (level4Headings) {
                level4Headings.forEach(heading => {
                    const title = heading.replace('#### ', '');
                    // Create anchor that matches docsify's ID generation
                    const anchor = title.toLowerCase()
                        .replace(/[^\w\s-]/g, '') // Remove special characters except whitespace and dash
                        .replace(/\s+/g, '-'); // Replace whitespace with dash
                    content += `    * [${title}](docs/${section.slug}/${subsection.slug}.md#${anchor})\n`;
                });
            }
        });
        content += '\n';
    });

    return content;
}

function generateMainReadme(sections: Section[]): string {
    let content = '# Unity Cheat Sheet\n\n';
    content += 'A comprehensive guide to Unity development patterns and practices.\n\n';
    content += '## Table of Contents\n\n';

    sections.forEach(section => {
        content += `### ${section.title}\n\n`;
        section.subsections.forEach(subsection => {
            content += `- [${subsection.title}](${section.slug}/${subsection.slug}.md)\n`;
        });
        content += '\n';
    });

    return content;
}

// Main execution
const readmePath = path.join(__dirname, '..', '..', 'README.md');
const content = fs.readFileSync(readmePath, 'utf-8');
const sections = parseMarkdownTree(content);

// Find content for each section from the full README
sections.forEach(section => {
    findContentForSection(section, content);
});

// Generate Docsify files
generateDocsifyFiles(sections); 