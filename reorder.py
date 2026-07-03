import re

file_path = r"C:\Users\Valeria\Documents\Portafolio\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the projects grid
start_str = '<div class="projects-grid">'
end_str = '      </div>\n    </div>\n  </section>\n\n  <!-- ===== EDUCATION ===== -->'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx == -1 or end_idx == -1:
    print("Could not find projects grid")
    exit(1)

grid_content = content[start_idx + len(start_str):end_idx]

# Extract articles
articles_raw = re.split(r'(?=<!--\s*[A-ZÁÉÍÓÚÑ \-]+\s*-->\s*<article)', grid_content)
articles = [a for a in articles_raw if a.strip()]

# Dictionary to hold extracted articles
article_dict = {}
for a in articles:
    match = re.search(r'id="(proj-[^"]+)"', a)
    if match:
        article_dict[match.group(1)] = a.strip()

# KeyGo HTML
keygo_html = """
        <!-- KEYGO -->
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
        </article>
"""
article_dict['proj-keygo'] = keygo_html.strip()

# Desired order
desired_order = [
    'proj-lemarj',
    'proj-keygo',
    'proj-grayola',
    'proj-mallku',
    'proj-pelicula-elite',
    'proj-soleia',
    'proj-destinos',
    'proj-levj',
    'proj-solicitudes'
]

new_grid_content = "\n\n".join(["        " + article_dict[id].replace('\n', '\n        ') if not article_dict[id].startswith('        ') else article_dict[id] for id in desired_order if id in article_dict])

new_content = content[:start_idx + len(start_str)] + "\n\n" + new_grid_content + "\n\n" + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully reordered projects")
