/* =========================================================
   SCRIPT.JS - Lógica, GitHub Pages Router, Terminal & Canvas
   ========================================================= */

// Inicializa os ícones vetoriais Lucide
lucide.createIcons();

// 1. Alternador de Tema Neon (Cyan, Purple, Emerald)
function setTheme(theme) {
  if (theme === "cyan") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

// 2. Efeito Spotlight 3D acompanhando o cursor nos cards
document.addEventListener("mousemove", (e) => {
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

// 3. Integração Inteligente com GitHub API & GitHub Pages (@Laicram88)
const GITHUB_USER = "Laicram88";
let allRepos = [];

// Verifica se o repositório tem GitHub Pages ativo ou Homepage configurada
function hasLivePage(repo) {
  return Boolean(
    repo.has_pages || (repo.homepage && repo.homepage.trim() !== ""),
  );
}

// Retorna o link do GitHub Pages (se existir) ou o link do repositório como fallback
function getPrimaryProjectUrl(repo) {
  if (repo.homepage && repo.homepage.trim() !== "") {
    return repo.homepage.startsWith("http")
      ? repo.homepage.trim()
      : `https://${repo.homepage.trim()}`;
  }
  if (repo.has_pages) {
    if (repo.name.toLowerCase() === `${GITHUB_USER.toLowerCase()}.github.io`) {
      return `https://${GITHUB_USER.toLowerCase()}.github.io/`;
    }
    return `https://${GITHUB_USER.toLowerCase()}.github.io/${repo.name}/`;
  }
  return repo.html_url;
}

function renderRepos(reposList) {
  const reposGrid = document.getElementById("github-repos-grid");

  if (!reposList || reposList.length === 0) {
    reposGrid.innerHTML = `
      <div class="spotlight-card rounded-2xl p-8 col-span-full text-center font-mono-tech text-sm text-slate-400">
        Nenhum projeto encontrado para este filtro.
      </div>
    `;
    return;
  }

  reposGrid.innerHTML = reposList
    .map((repo) => {
      const isLive = hasLivePage(repo);
      const primaryUrl = getPrimaryProjectUrl(repo);

      return `
      <div onclick="window.open('${primaryUrl}', '_blank', 'noopener,noreferrer')"
           role="link" tabindex="0"
           class="spotlight-card rounded-2xl p-6 flex flex-col justify-between group cursor-pointer border ${isLive ? "border-emerald-500/30" : "border-white/10"}">
        <div>
          <!-- Cabeçalho do Card com Selo LIVE PAGE ou REPO -->
          <div class="flex items-center justify-between gap-2 mb-4">
            <div class="flex items-center gap-2 text-accent font-mono-tech text-xs truncate">
              <i data-lucide="${isLive ? "globe" : "folder-git-2"}" class="w-4 h-4 shrink-0 ${isLive ? "text-emerald-400" : "text-accent"}"></i>
              <span class="truncate font-bold text-white text-sm group-hover:text-accent transition">${repo.name}</span>
            </div>

            ${
              isLive
                ? `
              <span class="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE PAGE
              </span>
            `
                : `
              <span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tech bg-white/5 text-slate-400 border border-white/10">
                REPO
              </span>
            `
            }
          </div>

          <!-- Descrição -->
          <p class="text-xs text-slate-400 leading-relaxed line-clamp-3">
            ${
              repo.description ||
              (isLive
                ? "Aplicação web interativa publicada e disponível para acesso imediato via GitHub Pages."
                : "Repositório de código-fonte e desenvolvimento hospedado no GitHub oficial @Laicram88.")
            }
          </p>
        </div>

        <!-- Rodapé do Card -->
        <div class="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-accent font-semibold">${repo.language || "Web"}</span>
            <span>• ★ ${repo.stargazers_count || 0}</span>
          </div>

          <div class="flex items-center gap-2">
            ${
              isLive
                ? `
              <!-- Botão secundário para ver o código no GitHub sem perder o clique principal do GitHub Pages -->
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
                 onclick="event.stopPropagation();"
                 title="Ver código-fonte no GitHub"
                 class="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition flex items-center gap-1">
                <i data-lucide="code-2" class="w-3 h-3"></i> Código
              </a>
              <span class="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                Abrir Site <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </span>
            `
                : `
              <span class="text-slate-300 group-hover:text-accent flex items-center gap-1 transition">
                Abrir GitHub <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
              </span>
            `
            }
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  lucide.createIcons();
}

function filterRepos(mode) {
  const btnAll = document.getElementById("filter-all");
  const btnPages = document.getElementById("filter-pages");

  if (mode === "pages") {
    btnPages.className =
      "px-3.5 py-1.5 rounded-xl text-xs font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition";
    btnAll.className =
      "px-3.5 py-1.5 rounded-xl text-xs font-mono-tech text-slate-400 hover:text-white transition";
    renderRepos(allRepos.filter((r) => hasLivePage(r)));
  } else {
    btnAll.className =
      "px-3.5 py-1.5 rounded-xl text-xs font-mono-tech bg-white/10 text-white transition";
    btnPages.className =
      "px-3.5 py-1.5 rounded-xl text-xs font-mono-tech text-slate-400 hover:text-white flex items-center gap-1.5 transition";
    renderRepos(allRepos);
  }
}

async function fetchGitHubData() {
  const reposGrid = document.getElementById("github-repos-grid");
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=18`,
      ),
    ]);

    if (userRes.ok) {
      const user = await userRes.json();
      if (user.name) document.getElementById("gh-name").textContent = user.name;
      if (user.bio) document.getElementById("hero-bio").textContent = user.bio;
      if (user.location) {
        document.getElementById("gh-location").innerHTML =
          `<i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${user.location}`;
      }
      document.getElementById("stat-repos").textContent =
        user.public_repos ?? "10+";
      document.getElementById("gh-followers").textContent =
        `Seguidores: ${user.followers ?? 0} • Seguindo: ${user.following ?? 0}`;
    }

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos) && repos.length > 0) {
        // Ordena colocando os projetos com GitHub Pages ativo no topo
        allRepos = repos.sort(
          (a, b) => Number(hasLivePage(b)) - Number(hasLivePage(a)),
        );

        const pagesCount = allRepos.filter((r) => hasLivePage(r)).length;
        document.getElementById("stat-pages").textContent = pagesCount;

        renderRepos(allRepos);
        return;
      }
    }
    throw new Error("Fallback");
  } catch (err) {
    document.getElementById("stat-repos").textContent = "PRO";
    document.getElementById("stat-pages").textContent = "LIVE";
    reposGrid.innerHTML = `
      <a href="https://github.com/Laicram88" target="_blank" rel="noopener noreferrer"
         class="spotlight-card rounded-2xl p-6 col-span-full flex items-center justify-between">
        <div>
          <h3 class="text-white font-bold text-lg">Explorar Projetos em github.com/Laicram88</h3>
          <p class="text-slate-400 text-sm mt-1">Clique para visualizar todos os repositórios e páginas publicadas diretamente no GitHub.</p>
        </div>
        <i data-lucide="external-link" class="w-6 h-6 text-accent"></i>
      </a>
    `;
    lucide.createIcons();
  }
}
fetchGitHubData();

// 4. Terminal Interativo de Desenvolvedor
const termOutput = document.getElementById("terminal-output");
const termForm = document.getElementById("terminal-form");
const termInput = document.getElementById("terminal-input");

const commands = {
  help: () => `Comandos disponíveis:
  • <span class="text-emerald-400">pages</span>    : Lista meus projetos com GitHub Pages ativo (Links diretos)
  • <span class="text-accent">skills</span>   : Lista minha stack técnica principal
  • <span class="text-accent">projects</span> : Exibe meus projetos de destaque
  • <span class="text-accent">github</span>   : Abre meu perfil oficial @Laicram88
  • <span class="text-accent">clear</span>    : Limpa a tela do terminal`,
  pages: () => {
    const liveOnes = allRepos.filter((r) => hasLivePage(r));
    if (liveOnes.length === 0) {
      return `Buscando páginas ativas de @Laicram88... Acesse a seção "Projetos & GitHub Pages" acima!`;
    }
    return (
      `Projetos com GitHub Pages ativo (${liveOnes.length}):\n` +
      liveOnes
        .map(
          (r) =>
            `  🟢 <b>${r.name}</b> → <a href="${getPrimaryProjectUrl(r)}" target="_blank" class="text-emerald-400 underline">${getPrimaryProjectUrl(r)}</a>`,
        )
        .join("\n")
    );
  },
  skills:
    () => `[FRONT-END] HTML5, CSS3, Tailwind, JavaScript ES6+, Design Responsivo
[AUTOMAÇÃO] n8n Self-Hosted, Webhooks, Integração REST APIs, JSON
[SEGURANÇA] SQL, Prevenção de Vulnerabilidades Web, Git & GitHub Pages`,
  projects:
    () => `1. WuSmartHome (Interface de Automação Residencial + Chat IA + Modal Orçamento)
2. Hub de Automação & Integração de APIs (n8n Workflows)
3. Digite 'pages' para ver os links diretos dos projetos publicados no GitHub Pages!`,
  github: () => {
    window.open("https://github.com/Laicram88", "_blank");
    return `Abrindo https://github.com/Laicram88 em uma nova aba...`;
  },
};

function runCommand(rawCmd) {
  const cmd = rawCmd.trim().toLowerCase();
  if (!cmd) return;

  if (cmd === "clear") {
    termOutput.innerHTML = "";
    return;
  }

  const userLine = document.createElement("div");
  userLine.innerHTML = `<span class="text-accent font-bold">guest@laicram88:~$</span> ${rawCmd}`;
  termOutput.appendChild(userLine);

  const responseLine = document.createElement("div");
  responseLine.className =
    "pl-3 border-l-2 border-white/15 text-slate-300 whitespace-pre-line";
  responseLine.innerHTML = commands[cmd]
    ? commands[cmd]()
    : `Comando não reconhecido: "${cmd}". Digite <span class="text-accent">'help'</span> ou <span class="text-emerald-400">'pages'</span>.`;
  termOutput.appendChild(responseLine);

  termOutput.scrollTop = termOutput.scrollHeight;
}

termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  runCommand(termInput.value);
  termInput.value = "";
});

// 5. Background Interativo Neural Particle Canvas (60fps)
const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 55; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 2 + 1,
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const accentRGB =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-rgb")
      .trim() || "0, 242, 254";

  particles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${accentRGB}, 0.6)`;
    ctx.fill();

    for (let j = idx + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${accentRGB}, ${0.15 * (1 - dist / 130)})`;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
