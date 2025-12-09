const Utils = {
    /**
     * Mostrar notificación/alerta
     */
    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="bi bi-${this.getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.innerHTML = alertHTML;
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            const alert = alertContainer.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);

        // Scroll suave hacia el alert
        alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Obtener icono de Bootstrap según tipo de alerta
     */
    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle-fill',
            'danger': 'exclamation-triangle-fill',
            'warning': 'exclamation-circle-fill',
            'info': 'info-circle-fill'
        };
        return icons[type] || 'info-circle-fill';
    },

    /**
     * Formatear fecha a formato legible
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return date.toLocaleDateString('es-ES', options);
    },

    /**
     * Formatear fecha para input datetime-local
     */
    formatDateForInput(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    /**
     * Formatear moneda
     */
    formatCurrency(amount) {
        if (!amount && amount !== 0) return '-';
        
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        }).format(amount);
    },

    /**
     * Obtener badge de Bootstrap según tipificación
     */
    getTipificacionBadge(tipificacion) {
        const badges = {
            'Contacto Efectivo': 'success',
            'No Contacto': 'secondary',
            'Promesa de Pago': 'warning',
            'Pago Realizado': 'primary',
            'Refinanciación': 'info',
            'Información': 'light',
            'Escalamiento': 'danger',
            'Otros': 'dark'
        };
        
        const badgeClass = badges[tipificacion] || 'secondary';
        return `<span class="badge bg-${badgeClass}">${tipificacion}</span>`;
    },

    /**
     * Obtener badge de estado
     */
    getEstadoBadge(estado) {
        const badges = {
            'abierta': '<span class="badge bg-success">Abierta</span>',
            'cerrada': '<span class="badge bg-secondary">Cerrada</span>'
        };
        
        return badges[estado] || estado;
    },

    /**
     * Validar formulario
     */
    validateForm(formId) {
        const form = document.getElementById(formId);
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return false;
        }
        
        return true;
    },

    /**
     * Limpiar validación de formulario
     */
    clearFormValidation(formId) {
        const form = document.getElementById(formId);
        form.classList.remove('was-validated');
    },

    /**
     * Confirmar acción con el usuario
     */
    async confirm(message, title = '¿Estás seguro?') {
        return new Promise((resolve) => {
            const result = window.confirm(`${title}\n\n${message}`);
            resolve(result);
        });
    },

    /**
     * Truncar texto largo
     */
    truncate(text, maxLength = 50) {
        if (!text) return '-';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },

    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Mostrar loading en botón
     */
    setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalHtml = button.innerHTML;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando...
            `;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalHtml || button.innerHTML;
        }
    },

    /**
     * Copiar texto al portapapeles
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showAlert('Copiado al portapapeles', 'success');
        } catch (err) {
            console.error('Error al copiar:', err);
            this.showAlert('No se pudo copiar al portapapeles', 'danger');
        }
    },

    /**
     * Generar HTML de paginación
     */
    generatePagination(currentPage, totalPages) {
        let html = '';
        
        // Botón anterior
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Números de página
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Botón siguiente
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;
        
        return html;
    },

    /**
     * Generar información de paginación
     */
    generatePaginationInfo(pagination) {
        const start = (pagination.page - 1) * pagination.limit + 1;
        const end = Math.min(pagination.page * pagination.limit, pagination.total);
        
        return `Mostrando ${start} - ${end} de ${pagination.total} registros`;
    },

    /**
     * Debounce para búsquedas
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};