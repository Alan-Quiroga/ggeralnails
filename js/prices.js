document.addEventListener('DOMContentLoaded', function() {
  // Configuración básica
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/27v5w4pefi04y';
  const preciosContainer = document.getElementById('precios-container');
  let lastUpdate = localStorage.getItem('lastUpdate') || '';
  let isFirstLoad = true;

  // Función para formatear precios
  function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(price);
  }

  // Verificar actualizaciones
  async function checkForUpdates() {
    try {
      const response = await fetch(SHEETDB_URL);
      if (!response.ok) return false;
      
      const data = await response.json();
      if (!data || data.length === 0) return false;
      
      const currentUpdate = data[0]['Última Actualización'] || '';
      
      if (currentUpdate !== lastUpdate) {
        lastUpdate = currentUpdate;
        localStorage.setItem('lastUpdate', currentUpdate);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar actualización:', error);
      return false;
    }
  }

  // Cargar los precios
  async function loadPrices() {
    const cachedData = localStorage.getItem('cachedPrices');
    const hasUpdates = await checkForUpdates();
    
    if (cachedData && !hasUpdates && !isFirstLoad) {
      renderPrices(JSON.parse(cachedData));
      return;
    }

    if (isFirstLoad) {
      preciosContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Cargando precios...</p>
        </div>
      `;
    }

    try {
      const response = await fetch(SHEETDB_URL);
      if (!response.ok) throw new Error('Error al cargar los precios');
      
      const data = await response.json();
      if (!data || data.length === 0) throw new Error('No hay datos disponibles');
      
      localStorage.setItem('cachedPrices', JSON.stringify(data));
      renderPrices(data);
      
      if (!isFirstLoad) {
        showUpdateNotification();
      }
    } catch (error) {
      console.error('Error:', error);
      if (!cachedData) {
        showError();
      } else {
        renderPrices(JSON.parse(cachedData));
      }
    } finally {
      isFirstLoad = false;
    }
  }

  // Mostrar los precios
  function renderPrices(data) {
    preciosContainer.innerHTML = '';
    
    const categoriasOrdenadas = ['Servicios Principales', 'Extras'];
    
    categoriasOrdenadas.forEach(categoria => {
      const itemsCategoria = data.filter(item => 
        item['Categoría'] && item['Categoría'].trim() === categoria
      );
      
      if (itemsCategoria.length === 0) return;
      
      const listaDiv = document.createElement('div');
      listaDiv.className = 'precios-lista';
      
      const titulo = document.createElement('h4');
      titulo.className = 'lista-titulo';
      titulo.textContent = categoria;
      listaDiv.appendChild(titulo);
      
      const ul = document.createElement('ul');
      ul.className = 'lista-items';
      
      itemsCategoria.forEach(item => {
        const li = document.createElement('li');
        li.className = 'lista-item';
        
        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';
        
        const nombre = document.createElement('span');
        nombre.className = 'item-nombre';
        nombre.textContent = item['Servicio'] || 'Servicio no especificado';
        itemInfo.appendChild(nombre);
        
        if (item['Detalles'] && item['Detalles'].trim() !== '') {
          const detalle = document.createElement('span');
          detalle.className = 'item-detalle';
          detalle.textContent = item['Detalles'];
          itemInfo.appendChild(detalle);
        }
        
        const precio = document.createElement('span');
        precio.className = 'item-precio';
        precio.textContent = item['Precio'] ? `$${formatPrice(parseFloat(item['Precio']))}` : 'Consultar';
        
        li.appendChild(itemInfo);
        li.appendChild(precio);
        ul.appendChild(li);
      });
      
      listaDiv.appendChild(ul);
      preciosContainer.appendChild(listaDiv);
    });

    // Añadir el botón después de cargar los precios
    addRefreshButton();
  }

  // Mostrar error
  function showError() {
    preciosContainer.innerHTML = `
      <div class="error-message">
        <p>No se pudieron cargar los precios en este momento.</p>
        <p>Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    `;
    addRefreshButton();
  }

  // Añadir botón de actualización
  function addRefreshButton() {
    // Eliminar botón anterior si existe
    const oldBtn = document.querySelector('.refresh-btn');
    if (oldBtn) oldBtn.remove();
    
    // Crear nuevo botón
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.textContent = 'Actualizar Lista';
    refreshBtn.addEventListener('click', loadPrices);
    
    // Insertar después del contenedor de precios
    preciosContainer.insertAdjacentElement('afterend', refreshBtn);
  }

  // Mostrar notificación
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.textContent = 'Lista de precios actualizada';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Añadir estilos
  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--lavender-gray);
      border-top-color: var(--plum);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .error-message {
      color: var(--rosewood);
      text-align: center;
      padding: 1.5rem;
      background-color: var(--blush);
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
    .refresh-btn {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background-color: var(--plum);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    .refresh-btn:hover {
      background-color: var(--rosewood);
    }
    .update-notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--plum);
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1000;
    }
    .update-notification.show {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // Iniciar
  loadPrices();
  setInterval(loadPrices, 300000); // Actualizar cada 5 minutos
});