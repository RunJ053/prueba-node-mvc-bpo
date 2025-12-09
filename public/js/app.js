/**
 * Estado de la aplicación
 */
const AppState = {
    currentPage: 1,
    limit: 10,
    filters: {},
    editingId: null,
    gestionModal: null,
    detailModal: null
};

/**
 * Inicializar la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
    initializeEventListeners();
    loadGestiones();
});

/**
 * Inicializar modales de Bootstrap
 */
function initializeModals() {
    AppState.gestionModal = new bootstrap.Modal(document.getElementById('gestionModal'));
    AppState.detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
}

/**
 * Inicializar event listeners
 */
function initializeEventListeners() {
    // Botón crear nueva gestión
    document.getElementById('createBtn').addEventListener('click', () => {
        openCreateModal();
    });

    // Botón guardar gestión
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveGestion();
    });

    // Formulario de filtros
    document.getElementById('filterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    // Botón limpiar filtros
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        clearFilters();
    });

    // Botón de estadísticas
    document.getElementById('statsBtn').addEventListener('click', () => {
        showStats();
    });

    // Botón de health check
    document.getElementById('healthBtn').addEventListener('click', () => {
        checkHealth();
    });

    // Búsqueda con debounce
    const searchInput = document.getElementById('searchQuery');
    searchInput.addEventListener('input', Utils.debounce(() => {
        applyFilters();
    }, 500));
}

/**
 * Cargar gestiones desde la API
 */
async function loadGestiones() {
    try {
        const filters = {
            page: AppState.currentPage,
            limit: AppState.limit,
            ...AppState.filters
        };

        const response = await API.getGestiones(filters);
        
        renderGestionesTable(response.data);
        renderPagination(response.pagination);
        
    } catch (error) {
        console.error('Error al cargar gestiones:', error);
        Utils.showAlert(error.message || 'Error al cargar gestiones', 'danger');
        renderEmptyTable();
    }
}

/**
 * Renderizar tabla de gestiones
 */
function renderGestionesTable(gestiones) {
    const tbody = document.getElementById('gestionesTableBody');
    
    if (!gestiones || gestiones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                    No se encontraron gestiones
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = gestiones.map(gestion => `
        <tr>
            <td><strong>#${gestion.id}</strong></td>
            <td>${Utils.escapeHtml(gestion.clienteNombre)}</td>
            <td>${Utils.escapeHtml(gestion.clienteDocumento)}</td>
            <td>
                <span class="badge bg-info">
                    <i class="bi bi-person-badge"></i> ${Utils.escapeHtml(gestion.asesorId)}
                </span>
            </td>
            <td>${Utils.getTipificacionBadge(gestion.tipificacion)}</td>
            <td>${Utils.getEstadoBadge(gestion.estado)}</td>
            <td>
                <small class="text-muted">
                    <i class="bi bi-calendar-event"></i>
                    ${Utils.formatDate(gestion.createdAt)}
                </small>
            </td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-info" onclick="viewGestion(${gestion.id})" 
                            title="Ver detalles">
                        <i class="bi bi-eye-fill"></i>
                    </button>
                    <button class="btn btn-warning" onclick="editGestion(${gestion.id})" 
                            title="Editar">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteGestion(${gestion.id})" 
                            title="Eliminar">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Renderizar paginación
 */
function renderPagination(pagination) {
    const paginationElement = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Información de paginación
    paginationInfo.textContent = Utils.generatePaginationInfo(pagination);
    
    // Botones de paginación
    paginationElement.innerHTML = Utils.generatePagination(
        pagination.page, 
        pagination.totalPages
    );
    
    // Event listeners para paginación
    paginationElement.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(link.dataset.page);
            if (page >= 1 && page <= pagination.totalPages) {
                AppState.currentPage = page;
                loadGestiones();
            }
        });
    });
}

/**
 * Renderizar tabla vacía
 */
function renderEmptyTable() {
    const tbody = document.getElementById('gestionesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center text-danger py-4">
                <i class="bi bi-exclamation-triangle fs-1 d-block mb-2"></i>
                Error al cargar los datos
            </td>
        </tr>
    `;
}

/**
 * Abrir modal para crear gestión
 */
function openCreateModal() {
    AppState.editingId = null;
    
    // Resetear formulario
    document.getElementById('gestionForm').reset();
    document.getElementById('gestionId').value = '';
    
    // Cambiar título del modal
    document.getElementById('modalTitle').innerHTML = `
        <i class="bi bi-file-earmark-plus me-2"></i>Nueva Gestión
    `;
    
    // Limpiar validación
    Utils.clearFormValidation('gestionForm');
    
    // Mostrar modal
    AppState.gestionModal.show();
}

/**
 * Ver detalles de una gestión
 */
async function viewGestion(id) {
    try {
        const response = await API.getGestion(id);
        const gestion = response.data;
        
        const detailHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary mb-3">
                        <i class="bi bi-person-fill me-2"></i>Información del Cliente
                    </h6>
                    <table class="table table-sm">
                        <tr>
                            <th width="40%">Documento:</th>
                            <td>${Utils.escapeHtml(gestion.clienteDocumento)}</td>
                        </tr>
                        <tr>
                            <th>Nombre:</th>
                            <td>${Utils.escapeHtml(gestion.clienteNombre)}</td>
                        </tr>
                    </table>

                    <h6 class="text-primary mb-3 mt-4">
                        <i class="bi bi-tags-fill me-2"></i>Clasificación
                    </h6>
                    <table class="table table-sm">
                        <tr>
                            <th width="40%">Tipificación:</th>
                            <td>${Utils.getTipificacionBadge(gestion.tipificacion)}</td>
                        </tr>
                        <tr>
                            <th>Subtipificación:</th>
                            <td>${gestion.subtipificacion || '-'}</td>
                        </tr>
                        <tr>
                            <th>Estado:</th>
                            <td>${Utils.getEstadoBadge(gestion.estado)}</td>
                        </tr>
                        <tr>
                            <th>Canal Oficial:</th>
                            <td>
                                ${gestion.canalOficial ? 
                                    '<span class="badge bg-success">Sí</span>' : 
                                    '<span class="badge bg-secondary">No</span>'}
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="col-md-6">
                    <h6 class="text-primary mb-3">
                        <i class="bi bi-cash-coin me-2"></i>Compromiso
                    </h6>
                    <table class="table table-sm">
                        <tr>
                            <th width="40%">Valor:</th>
                            <td>${Utils.formatCurrency(gestion.valorCompromiso)}</td>
                        </tr>
                        <tr>
                            <th>Fecha:</th>
                            <td>${Utils.formatDate(gestion.fechaCompromiso)}</td>
                        </tr>
                    </table>

                    <h6 class="text-primary mb-3 mt-4">
                        <i class="bi bi-info-circle-fill me-2"></i>Información Adicional
                    </h6>
                    <table class="table table-sm">
                        <tr>
                            <th width="40%">Asesor:</th>
                            <td>
                                <span class="badge bg-info">
                                    <i class="bi bi-person-badge"></i>
                                    ${Utils.escapeHtml(gestion.asesorId)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>Grabación:</th>
                            <td>
                                ${gestion.recordingUrl ? 
                                    `<a href="${gestion.recordingUrl}" target="_blank" class="btn btn-sm btn-primary">
                                        <i class="bi bi-play-circle"></i> Reproducir
                                    </a>` : 
                                    '-'}
                            </td>
                        </tr>
                        <tr>
                            <th>Creada:</th>
                            <td>${Utils.formatDate(gestion.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>Actualizada:</th>
                            <td>${Utils.formatDate(gestion.updatedAt)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            ${gestion.observaciones ? `
                <div class="mt-3">
                    <h6 class="text-primary mb-2">
                        <i class="bi bi-journal-text me-2"></i>Observaciones
                    </h6>
                    <div class="alert alert-secondary">
                        ${Utils.escapeHtml(gestion.observaciones)}
                    </div>
                </div>
            ` : ''}
        `;
        
        document.getElementById('detailContent').innerHTML = detailHTML;
        AppState.detailModal.show();
        
    } catch (error) {
        console.error('Error al ver gestión:', error);
        Utils.showAlert(error.message || 'Error al cargar detalles', 'danger');
    }
}

/**
 * Editar gestión
 */
async function editGestion(id) {
    try {
        const response = await API.getGestion(id);
        const gestion = response.data;
        
        AppState.editingId = id;
        
        // Llenar formulario
        document.getElementById('gestionId').value = gestion.id;
        document.getElementById('clienteDocumento').value = gestion.clienteDocumento;
        document.getElementById('clienteNombre').value = gestion.clienteNombre;
        document.getElementById('asesorId').value = gestion.asesorId;
        document.getElementById('tipificacion').value = gestion.tipificacion;
        document.getElementById('subtipificacion').value = gestion.subtipificacion || '';
        document.getElementById('canalOficial').checked = gestion.canalOficial;
        document.getElementById('valorCompromiso').value = gestion.valorCompromiso || '';
        document.getElementById('fechaCompromiso').value = Utils.formatDateForInput(gestion.fechaCompromiso);
        document.getElementById('observaciones').value = gestion.observaciones || '';
        document.getElementById('recordingUrl').value = gestion.recordingUrl || '';
        
        // Cambiar título del modal
        document.getElementById('modalTitle').innerHTML = `
            <i class="bi bi-pencil-square me-2"></i>Editar Gestión #${id}
        `;
        
        AppState.gestionModal.show();
        
    } catch (error) {
        console.error('Error al editar gestión:', error);
        Utils.showAlert(error.message || 'Error al cargar gestión', 'danger');
    }
}

/**
 * Guardar gestión (crear o actualizar)
 */
async function saveGestion() {
    if (!Utils.validateForm('gestionForm')) {
        Utils.showAlert('Por favor completa todos los campos requeridos', 'warning');
        return;
    }

    // Recopilar datos del formulario
    const gestionData = {
        clienteDocumento: document.getElementById('clienteDocumento').value.trim(),
        clienteNombre: document.getElementById('clienteNombre').value.trim(),
        asesorId: document.getElementById('asesorId').value.trim(),
        tipificacion: document.getElementById('tipificacion').value,
        subtipificacion: document.getElementById('subtipificacion').value.trim() || null,
        canalOficial: document.getElementById('canalOficial').checked,
        valorCompromiso: document.getElementById('valorCompromiso').value ? 
            parseFloat(document.getElementById('valorCompromiso').value) : null,
        fechaCompromiso: document.getElementById('fechaCompromiso').value || null,
        observaciones: document.getElementById('observaciones').value.trim() || null,
        recordingUrl: document.getElementById('recordingUrl').value.trim() || null
    };

    Utils.setButtonLoading('saveBtn', true);

    try {
        if (AppState.editingId) {
            // Actualizar
            await API.updateGestion(AppState.editingId, gestionData);
            Utils.showAlert('Gestión actualizada exitosamente', 'success');
        } else {
            // Crear
            await API.createGestion(gestionData);
            Utils.showAlert('Gestión creada exitosamente', 'success');
        }

        AppState.gestionModal.hide();
        loadGestiones();
        
    } catch (error) {
        console.error('Error al guardar gestión:', error);
        
        let errorMessage = 'Error al guardar la gestión';
        
        if (error.errors && error.errors.length > 0) {
            errorMessage += ':\n' + error.errors.map(e => `- ${e.message}`).join('\n');
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        Utils.showAlert(errorMessage, 'danger');
    } finally {
        Utils.setButtonLoading('saveBtn', false);
    }
}

/**
 * Eliminar gestión
 */
async function deleteGestion(id) {
    const confirmed = await Utils.confirm(
        'Esta acción cambiará el estado de la gestión a "cerrada".\n¿Deseas continuar?',
        'Confirmar Eliminación'
    );

    if (!confirmed) return;

    try {
        await API.deleteGestion(id);
        Utils.showAlert('Gestión eliminada exitosamente (estado: cerrada)', 'success');
        loadGestiones();
    } catch (error) {
        console.error('Error al eliminar gestión:', error);
        Utils.showAlert(error.message || 'Error al eliminar gestión', 'danger');
    }
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    AppState.filters = {
        q: document.getElementById('searchQuery').value.trim(),
        tipificacion: document.getElementById('filterTipificacion').value,
        asesorId: document.getElementById('filterAsesor').value.trim(),
        estado: document.getElementById('filterEstado').value,
        desde: document.getElementById('filterDesde').value,
        hasta: document.getElementById('filterHasta').value
    };

    // Resetear a página 1
    AppState.currentPage = 1;
    
    loadGestiones();
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    document.getElementById('filterForm').reset();
    document.getElementById('filterEstado').value = 'abierta'; // Valor por defecto
    AppState.filters = {};
    AppState.currentPage = 1;
    loadGestiones();
}

/**
 * Mostrar estadísticas
 */
async function showStats() {
    try {
        const response = await API.getGestiones({ limit: 1000 }); // Obtener todas
        const gestiones = response.data;
        
        // Calcular estadísticas
        const total = gestiones.length;
        const abiertas = gestiones.filter(g => g.estado === 'abierta').length;
        const cerradas = gestiones.filter(g => g.estado === 'cerrada').length;
        
        const porTipificacion = {};
        gestiones.forEach(g => {
            porTipificacion[g.tipificacion] = (porTipificacion[g.tipificacion] || 0) + 1;
        });
        
        const statsHTML = `
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h2>${total}</h2>
                            <p>Total Gestiones</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h2>${abiertas}</h2>
                            <p>Abiertas</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-secondary text-white">
                        <div class="card-body">
                            <h2>${cerradas}</h2>
                            <p>Cerradas</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <h5 class="mt-4">Por Tipificación:</h5>
            <table class="table table-sm">
                ${Object.entries(porTipificacion).map(([tipo, cantidad]) => `
                    <tr>
                        <td>${Utils.getTipificacionBadge(tipo)}</td>
                        <td class="text-end"><strong>${cantidad}</strong></td>
                    </tr>
                `).join('')}
            </table>
        `;
        
        document.getElementById('detailContent').innerHTML = statsHTML;
        AppState.detailModal.show();
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        Utils.showAlert('Error al cargar estadísticas', 'danger');
    }
}

/**
 * Verificar estado del sistema
 */
async function checkHealth() {
    try {
        const health = await API.healthCheck();
        
        const healthHTML = `
            <div class="text-center">
                <i class="bi bi-heart-pulse-fill text-success" style="font-size: 4rem;"></i>
                <h4 class="mt-3">Sistema Funcionando Correctamente</h4>
                <p class="text-muted">Timestamp: ${health.timestamp}</p>
                
                <div class="alert alert-success mt-3">
                    <strong>✓ API:</strong> Operativa<br>
                    <strong>✓ Base de Datos:</strong> Conectada<br>
                    <strong>✓ Frontend:</strong> Funcionando
                </div>
            </div>
        `;
        
        document.getElementById('detailContent').innerHTML = healthHTML;
        AppState.detailModal.show();
        
    } catch (error) {
        console.error('Error al verificar health:', error);
        Utils.showAlert('Error al verificar estado del sistema', 'danger');
    }
}