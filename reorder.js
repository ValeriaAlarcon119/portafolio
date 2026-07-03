const fs = require('fs');
const path = require('path');

const filePath = path.join('C:', 'Users', 'Valeria', 'Documents', 'Portafolio', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

const startStr = '<div class="projects-grid">';
const endStr = '      </div>\n    </div>\n  </section>\n\n  <!-- ===== EDUCATION ===== -->';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find projects grid boundaries');
    process.exit(1);
}

const gridContent = content.substring(startIdx + startStr.length, endIdx);

// Split articles by comment and article tag
const parts = gridContent.split(/(?=<!--[\s\S]*?-->\s*<article)/);
const articles = parts.map(p => p.trim()).filter(p => p.length > 0);

const articleDict = {};
articles.forEach(a => {
    const match = a.match(/id="(proj-[^"]+)"/);
    if (match) {
        articleDict[match[1]] = a;
    }
});

const keygoHtml = `<!-- KEYGO -->
        <article class="project-card project-featured" id="proj-keygo">
          <div class="project-img-wrap">
            <img src="projects/keygo.png" alt="KeyGo" class="project-img">
            <div class="project-overlay">
              <a href="https://keygo.com.co" target="_blank" class="overlay-btn" data-en="Live Site"
                data-es="Sitio en vivo">Live Site</a>
            </div>
            <span class="project-badge badge-live">✦ Live</span>
          </div>
          <div class="project-info">
            <div class="project-meta">
              <span class="project-type" data-en="B2B2C Key Management Platform" data-es="Plataforma de Gestión de Llaves B2B2C">B2B2C Key Management</span>
              <span class="project-year">2026</span>
            </div>
            <h3 class="project-title">KeyGo — Gestión Inteligente de Llaves</h3>
            <p class="project-desc"
              data-en="Innovative platform for managing and tracking physical keys using NFC and digital codes. Features role-based access, secure payments via Wompi, and real-time movement tracking to streamline property management in Medellín."
              data-es="Plataforma innovadora para la gestión y seguimiento de llaves físicas mediante NFC y códigos digitales. Cuenta con accesos por rol, pagos seguros con Wompi y trazabilidad en tiempo real para optimizar la entrega de llaves en propiedades turísticas.">
              Innovative platform for managing and tracking physical keys using NFC and digital codes. Features role-based access, secure payments via Wompi, and real-time movement tracking to streamline property management in Medellín.
            </p>
            <div class="project-stack">
              <span>NestJS 11</span><span>React Native</span><span>Expo</span><span>PostgreSQL</span><span>Prisma</span><span>TypeScript</span><span>Supabase</span>
            </div>
            <div class="project-actions">
              <a href="https://keygo.com.co" target="_blank" class="btn btn-sm btn-primary" data-en="🌐 Visit Site"
                data-es="🌐 Visitar">🌐 Visit Site</a>
            </div>
          </div>
        </article>`;

articleDict['proj-keygo'] = keygoHtml;

const desiredOrder = [
    'proj-lemarj',
    'proj-keygo',
    'proj-grayola',
    'proj-mallku',
    'proj-pelicula-elite',
    'proj-soleia',
    'proj-destinos',
    'proj-levj',
    'proj-solicitudes'
];

let newGridContent = '\n\n';
desiredOrder.forEach(id => {
    if (articleDict[id]) {
        // add 8 spaces indentation to each line except the first if not present
        let formatted = articleDict[id].split('\n').map((line, i) => i === 0 && line.startsWith('<!--') ? '        ' + line : line).join('\n');
        // ensure exactly one block of spacing
        if (!formatted.startsWith('        ')) {
            formatted = formatted.split('\n').map(l => '        ' + l).join('\n');
        }
        newGridContent += formatted + '\n\n';
    }
});

const newContent = content.substring(0, startIdx + startStr.length) + newGridContent + content.substring(endIdx);

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Successfully reordered projects');
