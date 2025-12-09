// ================================
// API FRONTEND para Gestiones BPO
// ================================

const API_URL = "/api/v1/gestiones";

// ================================
// Mostrar alertas
// ================================
function showAlert(message, type = "success") {
    const alert = document.getElementById("alertMessage");
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    alert.classList.remove("d-none");

    setTimeout(() => alert.classList.add("d-none"), 3500);
}

// ================================
// Cargar Gestiones
// ================================
async function loadGestiones() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const tbody = document.getElementById("gestionesTableBody");
        tbody.innerHTML = "";

        data.data.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.clienteDocumento}</td>
                <td>${item.clienteNombre}</td>
                <td>${item.asesorId}</td>
                <td><span class="badge bg-primary">${item.tipificacion}</span></td>
                <td>${item.subtipificacion || "-"}</td>
                <td>${item.valorCompromiso || "-"}</td>
                <td>${item.fechaCompromiso ? new Date(item.fechaCompromiso).toLocaleDateString() : "-"}</td>
                <td>${item.estado}</td>
                <td>
                    <button class="btn btn-info btn-sm" onclick="editGestion(${item.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteGestion(${item.id})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        showAlert("Error al cargar gestiones", "danger");
    }
}

// ================================
// Crear Gestión
// ================================
async function createGestion(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("gestionForm"));
    const body = Object.fromEntries(formData);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            return showAlert(data.message || "Error al guardar gestión", "danger");
        }

        showAlert("Gestión creada correctamente");
        document.getElementById("gestionForm").reset();
        loadGestiones();

    } catch (error) {
        showAlert("Error al conectar con la API", "danger");
    }
}

// ================================
// Editar Gestión (cargar datos en modal)
// ================================
async function editGestion(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const { data } = await res.json();

        document.getElementById("editId").value = data.id;
        document.getElementById("editClienteDocumento").value = data.clienteDocumento;
        document.getElementById("editClienteNombre").value = data.clienteNombre;
        document.getElementById("editAsesorId").value = data.asesorId;
        document.getElementById("editTipificacion").value = data.tipificacion;
        document.getElementById("editSubtipificacion").value = data.subtipificacion || "";
        document.getElementById("editValorCompromiso").value = data.valorCompromiso || "";
        document.getElementById("editFechaCompromiso").value = data.fechaCompromiso ? data.fechaCompromiso.split("T")[0] : "";
        document.getElementById("editEstado").value = data.estado;

        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();

    } catch (error) {
        showAlert("Error al obtener datos de la gestión", "danger");
    }
}

// ================================
// Guardar edición
// ================================
async function updateGestion(event) {
    event.preventDefault();

    const id = document.getElementById("editId").value;
    const formData = new FormData(document.getElementById("editForm"));
    const body = Object.fromEntries(formData);

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) return showAlert(data.message, "danger");

        showAlert("Gestión actualizada correctamente");
        loadGestiones();

        document.querySelector("#editModal .btn-close").click();

    } catch (error) {
        showAlert("Error al actualizar gestión", "danger");
    }
}

// ================================
// Eliminar Gestión
// ================================
async function deleteGestion(id) {
    if (!confirm("¿Seguro que deseas eliminar esta gestión?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

        if (!res.ok) return showAlert("Error al eliminar gestión", "danger");

        showAlert("Gestión eliminada correctamente");
        loadGestiones();

    } catch (error) {
        showAlert("Error al conectarse con la API", "danger");
    }
}

document.addEventListener("DOMContentLoaded", loadGestiones);
