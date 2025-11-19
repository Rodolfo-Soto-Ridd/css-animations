// ===== Variables Globales =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const menuHamburger = document.getElementById('menuHamburger');
const themeToggle = document.getElementById('themeToggle');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closePanel = document.getElementById('closePanel');

// ===== Tema Oscuro/Claro =====
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  
  // Animación de transición
  document.body.style.transition = 'background-color 0.3s ease';
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

themeToggle.addEventListener('click', toggleTheme);

// ===== Sidebar Toggle (Desktop) =====
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
  });
}

// ===== Menú Hamburguesa (Mobile) =====
if (menuHamburger) {
  menuHamburger.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
    menuHamburger.classList.toggle('active');
    toggleSidebarOverlay();
  });
}

// ===== Overlay para cerrar sidebar en mobile =====
function toggleSidebarOverlay() {
  let overlay = document.querySelector('.sidebar-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      menuHamburger.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  
  overlay.classList.toggle('active');
}

// ===== Navegación Activa =====
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remover clase active de todos los items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Agregar clase active al item clickeado
    link.parentElement.classList.add('active');
    
    // Cerrar sidebar en mobile
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('mobile-open');
      menuHamburger.classList.remove('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.classList.remove('active');
    }
  });
});

// ===== Panel de Notificaciones =====
notificationBtn.addEventListener('click', () => {
  notificationPanel.classList.add('active');
});

closePanel.addEventListener('click', () => {
  notificationPanel.classList.remove('active');
});

// Cerrar panel al hacer click fuera
document.addEventListener('click', (e) => {
  if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
    notificationPanel.classList.remove('active');
  }
});

// ===== Animación de Contadores (Stats Cards) =====
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    // Formatear números
    const formattedValue = formatNumber(Math.floor(current), element);
    element.textContent = formattedValue;
  }, 16);
}

function formatNumber(num, element) {
  const text = element.getAttribute('data-value');
  
  // Si tiene símbolo de dólar
  if (text.includes('$')) {
    return '$' + num.toLocaleString();
  }
  
  // Número normal
  return num.toLocaleString();
}

// ===== Simulación de Carga de Datos =====
function loadStatsCards() {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.remove('loading');
      card.setAttribute('data-loaded', 'true');
      
      // Animar el contador
      const valueElement = card.querySelector('.stat-value');
      const targetValue = parseInt(valueElement.getAttribute('data-value').replace(/[^0-9]/g, ''));
      
      setTimeout(() => {
        animateCounter(valueElement, targetValue, 1500);
      }, 200);
      
    }, (index + 1) * 300); // Carga escalonada
  });
}

// ===== Animación de Barras del Gráfico =====
function animateChartBars() {
  const chartBars = document.querySelectorAll('.chart-bar');
  
  chartBars.forEach((bar, index) => {
    const height = bar.style.height;
    bar.style.height = '0%';
    
    setTimeout(() => {
      bar.style.transition = 'height 0.8s ease-out';
      bar.style.height = height;
    }, index * 100);
  });
}

// ===== Filtros de Gráficos =====
const chartFilters = document.querySelectorAll('.chart-filter');

chartFilters.forEach(filter => {
  filter.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    console.log('Filtro seleccionado:', selectedValue);
    
    // Aquí puedes agregar lógica para actualizar los gráficos
    // Por ejemplo, hacer una petición a una API o filtrar datos locales
    
    // Feedback visual
    const chartCard = filter.closest('.chart-card');
    chartCard.style.opacity = '0.5';
    
    setTimeout(() => {
      chartCard.style.opacity = '1';
      animateChartBars();
    }, 300);
  });
});

// ===== Hover Effects para Cards =====
function addCardHoverEffects() {
  const cards = document.querySelectorAll('.stat-card, .chart-card, .data-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });
}

// ===== Marcar Notificaciones como Leídas =====
const notificationItems = document.querySelectorAll('.notification-item');

notificationItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.remove('unread');
    
    // Actualizar badge de notificaciones
    updateNotificationBadge();
  });
});

function updateNotificationBadge() {
  const unreadCount = document.querySelectorAll('.notification-item.unread').length;
  const badge = document.querySelector('.notification-badge');
  
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// ===== Búsqueda en Tiempo Real =====
const searchInput = document.querySelector('.search-input');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
      console.log('Buscando:', searchTerm);
      
      // Aquí puedes implementar la lógica de búsqueda
      // Por ejemplo, filtrar elementos en la página o hacer una búsqueda en la API
      
      // Feedback visual
      searchInput.parentElement.style.borderColor = 'var(--color-primary)';
    } else {
      searchInput.parentElement.style.borderColor = 'var(--border-color)';
    }
  });
}

// ===== Animación de Gráfico Donut al Entrar en Vista =====
function animateDonutChart() {
  const donutChart = document.querySelector('.donut-svg');
  
  if (donutChart) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const circles = donutChart.querySelectorAll('circle');
          
          circles.forEach((circle, index) => {
            const strokeDasharray = circle.getAttribute('stroke-dasharray');
            circle.setAttribute('stroke-dasharray', '0 502');
            
            setTimeout(() => {
              circle.style.transition = 'stroke-dasharray 1s ease-out';
              circle.setAttribute('stroke-dasharray', strokeDasharray);
            }, index * 200);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(donutChart);
  }
}

// ===== Animación de Elementos al Scroll =====
function animateOnScroll() {
  const elements = document.querySelectorAll('.stat-card, .chart-card, .data-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// ===== Actualizar Fecha y Hora en Tiempo Real =====
function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const dateTimeString = now.toLocaleDateString('es-ES', options);
  
  // Puedes agregar un elemento para mostrar la fecha/hora si lo deseas
  console.log('Fecha actual:', dateTimeString);
}

// ===== Tooltips Personalizados =====
function initTooltips() {
  const elementsWithTooltip = document.querySelectorAll('[title]');
  
  elementsWithTooltip.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const title = element.getAttribute('title');
      
      if (title) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = title;
        tooltip.style.cssText = `
          position: fixed;
          background: var(--text-primary);
          color: var(--bg-primary);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          pointer-events: none;
          z-index: 10000;
          white-space: nowrap;
          box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        element.setAttribute('data-original-title', title);
        element.removeAttribute('title');
        
        element.addEventListener('mouseleave', () => {
          tooltip.remove();
          element.setAttribute('title', element.getAttribute('data-original-title'));
          element.removeAttribute('data-original-title');
        }, { once: true });
      }
    });
  });
}

// ===== Simulación de Datos en Tiempo Real =====
function simulateRealTimeUpdates() {
  setInterval(() => {
    // Actualizar algún valor aleatorio (simulación)
    const randomStatCard = document.querySelectorAll('.stat-card')[Math.floor(Math.random() * 4)];
    const valueElement = randomStatCard.querySelector('.stat-value');
    
    if (valueElement) {
      const currentValue = parseInt(valueElement.textContent.replace(/[^0-9]/g, ''));
      const change = Math.floor(Math.random() * 10) - 5; // -5 a +5
      const newValue = Math.max(0, currentValue + change);
      
      valueElement.textContent = formatNumber(newValue, valueElement);
      
      // Efecto de parpadeo
      randomStatCard.style.transition = 'none';
      randomStatCard.style.opacity = '0.7';
      setTimeout(() => {
        randomStatCard.style.transition = 'all 0.3s ease';
        randomStatCard.style.opacity = '1';
      }, 100);
    }
  }, 5000); // Actualizar cada 5 segundos
}

// ===== Guardar Estado del Sidebar =====
function loadSidebarState() {
  const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  
  if (sidebarCollapsed && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
  }
}

// ===== Responsive - Ajustar al cambiar tamaño de ventana =====
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('mobile-open');
    menuHamburger.classList.remove('active');
    
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
  }
});

// ===== Click en Productos para Ver Detalles =====
const productItems = document.querySelectorAll('.product-item');

productItems.forEach(item => {
  item.addEventListener('click', () => {
    const productName = item.querySelector('.product-name').textContent;
    console.log('Producto seleccionado:', productName);
    
    // Aquí puedes agregar lógica para mostrar detalles del producto
    // Por ejemplo, abrir un modal o navegar a otra página
    
    // Feedback visual
    item.style.transform = 'scale(0.98)';
    setTimeout(() => {
      item.style.transform = '';
    }, 200);
  });
});

// ===== Click en Actividades para Ver Detalles =====
const activityItems = document.querySelectorAll('.activity-item');

activityItems.forEach(item => {
  item.addEventListener('click', () => {
    const activityTitle = item.querySelector('.activity-title').textContent;
    console.log('Actividad seleccionada:', activityTitle);
    
    // Feedback visual
    item.style.backgroundColor = 'var(--bg-tertiary)';
    setTimeout(() => {
      item.style.backgroundColor = '';
    }, 300);
  });
});

// ===== Teclado: Atajos =====
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K para buscar
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput?.focus();
  }
  
  // Ctrl/Cmd + B para toggle sidebar
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    sidebar.classList.toggle('collapsed');
  }
  
  // Ctrl/Cmd + D para toggle tema
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    toggleTheme();
  }
  
  // Escape para cerrar panel de notificaciones
  if (e.key === 'Escape') {
    notificationPanel.classList.remove('active');
  }
});

// ===== Inicialización =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Dashboard inicializado correctamente');
  
  // Inicializar tema
  initTheme();
  
  // Cargar estado del sidebar
  loadSidebarState();
  
  // Cargar stats cards con animación
  setTimeout(() => {
    loadStatsCards();
  }, 500);
  
  // Animar gráficos
  setTimeout(() => {
    animateChartBars();
    animateDonutChart();
  }, 1500);
  
  // Agregar efectos hover
  addCardHoverEffects();
  
  // Animaciones al scroll
  animateOnScroll();
  
  // Inicializar tooltips
  initTooltips();
  
  // Actualizar fecha/hora
  updateDateTime();
  setInterval(updateDateTime, 60000); // Actualizar cada minuto
  
  // Simular actualizaciones en tiempo real (opcional)
  // simulateRealTimeUpdates();
  
  // Actualizar badge de notificaciones
  updateNotificationBadge();
});

// ===== Log de Estado =====
console.log('%c Dashboard Admin Panel ', 'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('✓ Tema oscuro/claro habilitado');
console.log('✓ Sidebar responsivo configurado');
console.log('✓ Animaciones y micro-interacciones activas');
console.log('✓ Gráficos interactivos cargados');
console.log('✓ Sistema de notificaciones activo');