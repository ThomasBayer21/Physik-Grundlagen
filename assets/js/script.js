// Globale Variablen
let currentFilter = 'all';
let currentSearch = '';

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // Event Listener für Suche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase();
        filterMaterials();
    });

    // Enter-Taste für Suche
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMaterials();
        }
    });

    // Statistiken anzeigen
    updateStats();
});

// Suche-Funktion
function searchMaterials() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentSearch = searchTerm;
    filterMaterials();
}

// Filter nach Kategorie
function filterCategory(category) {
    currentFilter = category;

    // Update aktive Button-Klasse
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    filterMaterials();
}

// Hauptfilter-Funktion
function filterMaterials() {
    const cards = document.querySelectorAll('.material-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const keywords = card.getAttribute('data-keywords') || '';
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.description').textContent.toLowerCase();

        // Kategorie-Filter
        const categoryMatch = currentFilter === 'all' || category === currentFilter;

        // Suche-Filter
        const searchMatch = currentSearch === '' ||
                          title.includes(currentSearch) ||
                          description.includes(currentSearch) ||
                          keywords.includes(currentSearch);

        // Anzeigen oder Verstecken
        if (categoryMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleCount++;

            // Animation verzögern für Stagger-Effekt
            card.style.animationDelay = `${visibleCount * 0.05}s`;
        } else {
            card.classList.add('hidden');
        }
    });

    // "Keine Ergebnisse" Nachricht
    handleNoResults(visibleCount);
}

// "Keine Ergebnisse" Handler
function handleNoResults(count) {
    const grid = document.getElementById('materialsGrid');
    const existingMessage = document.querySelector('.no-results');

    if (count === 0 && !existingMessage) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <h3>Keine Materialien gefunden</h3>
            <p>Versuchen Sie einen anderen Suchbegriff oder Filter</p>
        `;
        grid.appendChild(message);
    } else if (count > 0 && existingMessage) {
        existingMessage.remove();
    }
}

// Statistiken aktualisieren
function updateStats() {
    const cards = document.querySelectorAll('.material-card');
    const categories = {
        organisation: 0,
        woche: 0,
        uebung: 0,
        referenz: 0
    };

    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (categories.hasOwnProperty(category)) {
            categories[category]++;
        }
    });

    console.log('Materialien-Statistik:', categories);
    console.log('Gesamt:', cards.length);
}

// Smooth Scroll zu Ankern
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hilfsfunktion: Highlighten von Suchbegriffen
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Keyboard-Navigation
document.addEventListener('keydown', function(e) {
    // Strg+F oder Cmd+F für Suche
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // Escape zum Zurücksetzen der Suche
    if (e.key === 'Escape') {
        document.getElementById('searchInput').value = '';
        currentSearch = '';
        filterMaterials();
    }
});

// Exportiere Funktionen für globale Verwendung
window.searchMaterials = searchMaterials;
window.filterCategory = filterCategory;

// Dark Mode Toggle (optional, kann später aktiviert werden)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Dark Mode aus localStorage laden
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Info-Overlay für Materialien (optional)
function showMaterialInfo(materialId) {
    // Kann später implementiert werden für detaillierte Informationen
    console.log('Material Info:', materialId);
}

// Download-Tracking (optional)
function trackDownload(fileName) {
    console.log('Download:', fileName);
    // Hier könnte Analytics-Code eingefügt werden
}

// Alle PDF-Links tracken
document.addEventListener('DOMContentLoaded', function() {
    const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
    pdfLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const fileName = this.getAttribute('href');
            trackDownload(fileName);
        });
    });
});

// Responsive Navigation
let lastScrollTop = 0;
const nav = document.querySelector('.main-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        nav.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        nav.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
}, false);

// Print-Funktion
function printMaterialList() {
    window.print();
}

// Teilen-Funktion
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Physik Kursmaterialien',
            text: 'Schaue dir die Physik Kursmaterialien an!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: URL in Zwischenablage kopieren
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Link wurde in die Zwischenablage kopiert!'))
            .catch(console.error);
    }
}
