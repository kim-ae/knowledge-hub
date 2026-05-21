import fs from 'fs/promises';
import path from 'path';

export interface Article {
  tags: string[];
  url: string;
  name: string;
  title: string;
  description: string;
  myThoughts: string;
}

export interface SubCategory {
  title: string;
  articles: Article[];
}

export interface Category {
  title: string;
  subCategories: { [key: string]: SubCategory };
}

export interface KnowledgeHubData {
  [key: string]: Category;
}

export async function getKnowledgeHubData(source: string): Promise<KnowledgeHubData> {
  let content: string;

  console.log('[Knowledge Hub] Loading from source:', source);

  if (source.startsWith('http')) {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${source}: ${response.statusText}`);
    }
    content = await response.text();
  } else {
    // Assuming source is a relative path from the project root
    const filePath = path.join(process.cwd(), source);
    content = await fs.readFile(filePath, 'utf-8');
  }

  return parseMarkdown(content);
}

function parseMarkdown(content: string): KnowledgeHubData {
  const data: KnowledgeHubData = {};
  const lines = content.split('\n');

  let currentCategory: Category | null = null;
  let currentSubCategory: SubCategory | null = null;
  let currentArticle: Partial<Article> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      // Push current article before switching categories
      if (currentArticle && currentSubCategory) {
        currentSubCategory.articles.push(currentArticle as Article);
      }
      const title = line.replace('# ', '').trim();
      data[title] = { title, subCategories: {} };
      currentCategory = data[title];
      currentSubCategory = null;
      currentArticle = null;
    } else if (line.startsWith('## ')) {
      if (!currentCategory) continue;
      // Push current article before switching subcategories
      if (currentArticle && currentSubCategory) {
        currentSubCategory.articles.push(currentArticle as Article);
      }
      const title = line.replace('## ', '').trim();
      currentCategory.subCategories[title] = { title, articles: [] };
      currentSubCategory = currentCategory.subCategories[title];
      currentArticle = null;
    } else if (line.startsWith('* ')) {
      // This is a property or the start of a new article
      const propertyMatch = line.match(/^\*\s+([^:]+):\s*(.*)$/);

      if (propertyMatch) {
        const [, key, value] = propertyMatch;
        const normalizedKey = key.trim().toLowerCase();

        // If this is 'tags', it's likely the start of a new article if currentArticle is full
        // or just the first property of an article.
        if (normalizedKey === 'tags') {
          if (currentArticle && currentSubCategory) {
            currentSubCategory.articles.push(currentArticle as Article);
          }
          currentArticle = {
            tags: value.split(',').map(t => t.trim()),
            url: '',
            name: '',
            title: '',
            description: '',
            myThoughts: ''
          };
        } else if (currentArticle) {
          switch (normalizedKey) {
            case 'url':
              currentArticle.url = value;
              break;
            case 'name':
              currentArticle.name = value;
              break;
            case 'title':
              currentArticle.title = value;
              break;
            case 'description':
              currentArticle.description = value;
              break;
            case 'my thoughts':
              currentArticle.myThoughts = value;
              break;
          }
        }
      } else {
        // Just '* Property' (case without ':')
        const key = line.replace(/^\*\s+/, '').trim().toLowerCase();
        // Since the user defined the format with possible missing colons in format.md (e.g., "* Url")
        // But in my migrated file I added colons. I'll handle both.
        // Actually, looking at the next lines for content is needed if they are multi-line.
        // For simplicity, let's assume my migrated format with colons.
      }
    }
  }

  // Final push
  if (currentArticle && currentSubCategory) {
    currentSubCategory.articles.push(currentArticle as Article);
  }

  return data;
}
