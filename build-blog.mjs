import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, 'content', 'blog');
const OUTPUT_DIR = __dirname; // Generating them directly in the root for now

// A simple function to generate the HTML wrapper for individual blog posts
function generateBlogPostHTML(meta, contentHtml) {
    return `<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${meta.title} | 4dlernen GmbH</title>
    <meta name="description" content="Blogpost: ${meta.title}">
    <link rel="canonical" href="https://4dlernen.de/blog-${meta.slug}.html">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488',
                            900: '#134e4a', dark: '#0f172a', red: '#e11d48',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .glass-nav {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        /* Basic markdown typography styling */
        .markdown-body h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1.5rem; color: #111827; }
        .markdown-body h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1f2937; }
        .markdown-body h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .markdown-body p { margin-bottom: 1.25rem; line-height: 1.75; color: #4b5563; }
        .markdown-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; color: #4b5563; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body strong { font-weight: 600; color: #111827; }
        .markdown-body table { width: 100%; text-align: left; border-collapse: collapse; margin-top: 2rem; margin-bottom: 2rem; }
        .markdown-body th { padding: 1rem; border-bottom: 2px solid #e5e7eb; color: #111827; background: #f9fafb; font-weight: 600;}
        .markdown-body td { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
        .markdown-body img { border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 2rem auto; display: block; max-width: 100%; }
        .markdown-body hr { margin: 3rem 0; border: 0; border-top: 1px solid #e5e7eb; }
        .markdown-body blockquote { border-left: 4px solid #14b8a6; padding-left: 1rem; font-style: italic; color: #6b7280; }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased selection:bg-brand-500 selection:text-white">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-nav shadow-sm drop-shadow py-2" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <!-- Logo -->
                <a href="index.html" class="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition">
                    <div class="text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-2">
                        <i class="fa-solid fa-fire-burner text-brand-red"></i>
                        <span>4D<span class="text-brand-500">LERNEN</span></span>
                    </div>
                </a>
                <!-- Desktop Menu -->
                <div class="hidden md:flex space-x-8 items-center">
                    <a href="leistungen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Leistungen</a>
                    <a href="vr-trainer.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">VR-Trainer</a>
                    <a href="unternehmen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Für Unternehmen</a>
                    <a href="brandschutz-wissen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Wissen</a>
                    <a href="blog.html" class="text-sm font-bold text-brand-500 transition-colors">Blog</a>
                    <a href="kontakt.html" class="px-5 py-2.5 rounded-full bg-brand-dark text-white text-sm font-semibold hover:bg-brand-500 hover:shadow-lg transition-all duration-300">Kontakt</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header Section -->
    <header class="pt-32 pb-16 bg-brand-dark text-white relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6 max-w-4xl mx-auto">${meta.title}</h1>
            <p class="text-gray-300">Veröffentlicht am: ${new Date(meta.date).toLocaleDateString("de-DE")}</p>
        </div>
    </header>

    <!-- Content -->
    <article class="py-16 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="markdown-body text-lg">
                ${contentHtml}
            </div>
        </div>
    </article>

    <!-- Navigation Back -->
    <div class="max-w-4xl mx-auto px-4 text-center pb-16">
         <a href="blog.html" class="inline-flex px-8 py-3 rounded-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-all">Zurück zur Übersicht</a>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
                <a href="index.html" class="hover:text-white transition-colors">Startseite</a>
                <a href="blog.html" class="hover:text-white transition-colors">Blog</a>
                <a href="kontakt.html" class="hover:text-white transition-colors">Impressum & Datenschutz</a>
            </div>
            <div class="mt-8 text-gray-500 text-xs">
                &copy; ${new Date().getFullYear()} 4dlernen GmbH. Alle Rechte vorbehalten.
            </div>
        </div>
    </footer>
</body>
</html>`;
}

// Generate the blog.html page
function generateBlogIndexHTML(posts) {
    let postsListHtml = posts.map(post => {
        return `
        <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-sm text-brand-500 font-bold mb-2">${new Date(post.date).toLocaleDateString("de-DE")}</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4"><a href="blog-${post.slug}.html" class="hover:text-brand-500 transition-colors">${post.title}</a></h2>
            <a href="blog-${post.slug}.html" class="text-brand-600 font-semibold hover:text-brand-800">Artikel lesen &rarr;</a>
        </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="de" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog & Magazin | 4dlernen GmbH</title>
    <meta name="description" content="Aktuelle Artikel und Fachbeiträge rund um digitales Brandschutztraining und VR.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488',
                            900: '#134e4a', dark: '#0f172a', red: '#e11d48',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .glass-nav {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 antialiased selection:bg-brand-500 selection:text-white">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-nav shadow-sm drop-shadow py-2" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <a href="index.html" class="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition">
                    <div class="text-2xl font-extrabold tracking-tight text-brand-dark flex items-center gap-2">
                        <i class="fa-solid fa-fire-burner text-brand-red"></i>
                        <span>4D<span class="text-brand-500">LERNEN</span></span>
                    </div>
                </a>
                <div class="hidden md:flex space-x-8 items-center">
                    <a href="leistungen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Leistungen</a>
                    <a href="vr-trainer.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">VR-Trainer</a>
                    <a href="unternehmen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Für Unternehmen</a>
                    <a href="brandschutz-wissen.html" class="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors">Wissen</a>
                    <a href="blog.html" class="text-sm font-bold text-brand-500 transition-colors">Blog</a>
                    <a href="kontakt.html" class="px-5 py-2.5 rounded-full bg-brand-dark text-white text-sm font-semibold hover:bg-brand-500 hover:shadow-lg transition-all duration-300">Kontakt</a>
                </div>
            </div>
        </div>
    </nav>

    <header class="pt-32 pb-16 bg-brand-dark text-white text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-4xl md:text-5xl font-extrabold mb-6">Blog & Magazin</h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">Expertenartikel, Vergleiche und Best Practices für modernes Brandschutztraining.</p>
        </div>
    </header>

    <section class="py-24 bg-gray-50">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            ${postsListHtml}
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 text-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
                <a href="index.html" class="hover:text-white transition-colors">Startseite</a>
                <a href="blog.html" class="hover:text-white transition-colors">Blog</a>
                <a href="kontakt.html" class="hover:text-white transition-colors">Impressum & Datenschutz</a>
            </div>
            <div class="mt-8 text-gray-500 text-xs">
                &copy; ${new Date().getFullYear()} 4dlernen GmbH. Alle Rechte vorbehalten.
            </div>
        </div>
    </footer>
</body>
</html>`;
}

function build() {
    if (!fs.existsSync(BLOG_DIR)) {
        console.warn(`Der Ordner ${BLOG_DIR} existiert nicht. Abgebrochen.`);
        return;
    }

    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    const posts = [];

    files.forEach(file => {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse frontmatter
        const parsed = matter(fileContent);
        const meta = parsed.data;
        meta.slug = file.replace('.md', '');
        
        // Convert to HTML
        const contentHtml = marked(parsed.content);
        const finalHtml = generateBlogPostHTML(meta, contentHtml);
        
        // Save post HTML
        const outputFilename = `blog-${meta.slug}.html`;
        fs.writeFileSync(path.join(OUTPUT_DIR, outputFilename), finalHtml);
        console.log(`[✔] Generiert: ${outputFilename}`);
        
        posts.push(meta);
    });

    // Sort posts by date desc
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate Blog Index
    const blogIndexHtml = generateBlogIndexHTML(posts);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'blog.html'), blogIndexHtml);
    console.log(`[✔] Generiert: blog.html`);
}

build();
