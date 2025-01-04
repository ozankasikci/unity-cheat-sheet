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

    for (const line of lines) {
        if (line.startsWith('#')) {
            // Save previous section if exists
            if (currentSection) {
                currentSection.content = currentContent.join('\n');
                currentContent = [];
            }

            // Parse new section
            const headingMatch = line.match(/^(#+)\s*(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const title = headingMatch[2];
                
                // Special case for Movement & Rotation
                const slug = title === 'Movement & Rotation' ? 'movement-rotation' : slugify(title);
                
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

function generateDocusaurusDoc(section: Section, parentDir: string = ''): void {
    const docsDir = path.join(__dirname, '..', 'docs');
    const sectionDir = parentDir ? path.join(docsDir, parentDir) : docsDir;

    // Create directory if it doesn't exist
    if (!fs.existsSync(sectionDir)) {
        fs.mkdirSync(sectionDir, { recursive: true });
    }

    // Generate main section file
    const mainContent = `---
sidebar_position: 1
---

# ${section.title}

${section.content}`;

    fs.writeFileSync(
        path.join(sectionDir, 'index.md'),
        mainContent
    );

    // Generate subsection files
    section.subsections.forEach((subsection, index) => {
        const content = `---
sidebar_position: ${index + 2}
---

# ${subsection.title}

${subsection.content}`;

        fs.writeFileSync(
            path.join(sectionDir, `${subsection.slug}.md`),
            content
        );
    });
}

function generateSidebar(sections: Section[]): string {
    const sidebarItems = sections.map(section => {
        const items = [
            `'${section.slug}/index'`,
            ...section.subsections.map(subsection => 
                `'${section.slug}/${subsection.slug}'`
            )
        ];

        return `{
      type: 'category',
      label: '${section.title}',
      link: {
        type: 'doc',
        id: '${section.slug}/index'
      },
      items: [
        ${items.join(',\n        ')}
      ],
    }`;
    });

    return `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    ${sidebarItems.join(',\n    ')}
  ],
};

export default sidebars;
`;
}

// Main execution
const readmePath = path.join(__dirname, '..', '..', 'README.md');
const content = fs.readFileSync(readmePath, 'utf-8');
const sections = parseMarkdownSections(content);

// Generate docs for each section
sections.forEach(section => {
    generateDocusaurusDoc(section, section.slug);
});

// Generate sidebar configuration
const sidebarConfig = generateSidebar(sections);
fs.writeFileSync(
    path.join(__dirname, '..', 'sidebars.ts'),
    sidebarConfig
); 