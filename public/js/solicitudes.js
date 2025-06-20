'use strict';

import { fetchFakerData } from '/js/functions.js';

const loadData = async () => {
    let users = JSON.parse(localStorage.getItem("usuarios"));

    if (!users || users.length === 0) {
        const num = Math.floor(Math.random() * 10) + 3;
        const url = `https://fakerapi.it/api/v2/users?_quantity=${num}&_gender=male,female`;

        try {
            const result = await fetchFakerData(url);

            if (result.success) {
                users = result.body.data;
                localStorage.setItem("usuarios", JSON.stringify(users));
            } else {
                console.error("Error al obtener los datos:", result.error);
                return;
            }
        } catch (error) {
            console.error("Ocurrió un error inesperado:", error);
            return;
        }
    }

    renderCards(users);
};

const renderCards = (users) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;
    container.innerHTML = "";

    const reservas = JSON.parse(localStorage.getItem("reservas")) || {};

    users.forEach(({ firstname, lastname, ip }) => {
        const nombreCompleto = `${firstname} ${lastname}`;
        const telefonoLimpio = ip.replace(/\./g, '').slice(0, 10);

        // Buscar reserva
        const reserva = reservas[nombreCompleto];
        let cupos = reserva?.cupos ?? Math.floor(Math.random() * 5);

        // Crear card
        const card = document.createElement("a");
        card.href = "/html/carrera.html";
        card.className = "block space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 max-w-md mx-full transition hover:shadow-lg";
        card.dataset.nombre = nombreCompleto;
        card.dataset.telefono = telefonoLimpio;
        card.dataset.cupos = cupos;

        card.innerHTML = `
            <div class="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                <iframe src="https://www.google.com/maps/embed?..." class="w-full h-40"></iframe>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">${nombreCompleto}</h2>
            <p class="text-gray-500 dark:text-gray-300">Número de teléfono:</p>
            <p class="text-gray-500 dark:text-gray-300">${telefonoLimpio}</p>
            <p class="text-gray-600 dark:text-gray-400">Cupos: <strong>${cupos}</strong></p>
            <button class="reservar-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-2 w-full rounded">
                Reservar
            </button>
        `;

        const btn = card.querySelector(".reservar-btn");

        if (reserva?.reservado || cupos <= 0) {
            btn.disabled = true;
            btn.textContent = reserva?.reservado ? "Reservado" : "Sin cupos";
            btn.classList.add("opacity-50", "cursor-not-allowed");
        }

        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            if (cupos <= 0) {
                alert("No hay cupos disponibles para este viaje.");
                return;
            }

            const nuevosCupos = Math.max(0, cupos - 1);
            reservas[nombreCompleto] = {
                telefono: telefonoLimpio,
                reservado: true,
                cupos: nuevosCupos
            };
            localStorage.setItem("reservas", JSON.stringify(reservas));

            localStorage.setItem("nombre", nombreCompleto);
            localStorage.setItem("telefono", telefonoLimpio);
            localStorage.setItem("cupos", nuevosCupos);

            btn.disabled = true;
            btn.textContent = "Reservado";
            btn.classList.add("opacity-50", "cursor-not-allowed");

            alert(`Reservaste un cupo con ${nombreCompleto}`);
        });

        // Guardar selección actual
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("reservar-btn")) return;
            localStorage.setItem("nombre", nombreCompleto);
            localStorage.setItem("telefono", telefonoLimpio);
            localStorage.setItem("cupos", cupos);
        });

        container.appendChild(card);
    });
};

// Autoejecutar
(() => {
    loadData();
})();
