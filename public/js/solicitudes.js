'use strict';

import { fetchFakerData } from '/js/functions.js';

const loadData = async () => {

    const num = Math.floor(Math.random() * 10);
    const url = `https://fakerapi.it/api/v2/users?_quantity=${num}&_gender=male,female`;


    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }
        if (result.success) {
            renderCards(result.body.data);
            console.log('Datos obtenidos con éxito:', result.body);
        }

    } catch (error) {

        console.error('Ocurrió un error inesperado:', error);

    }

};

const renderCards = (users) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;
    container.innerHTML = "";

    users.forEach(({ firstname, lastname, ip }) => {
        let numeroAleatorio = Math.floor(Math.random() * 5);
        const telefonoLimpio = ip.replace(/\./g, '').slice(0, 10);
        const nombreCompleto = `${firstname} ${lastname}`;

        const card = document.createElement("a");
        card.href = "/html/carrera.html";
        card.className = "block space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 max-w-md mx-full transition hover:shadow-lg";

        // Recuperar reservas guardadas
        const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
        const reserva = reservas[nombreCompleto];

        // Si ya hay una reserva registrada, usar sus cupos
        if (reserva) {
            numeroAleatorio = reserva.cupos;
        }

        // Guardar datos como atributos data-*
        card.dataset.nombre = nombreCompleto;
        card.dataset.telefono = telefonoLimpio;
        card.dataset.cupos = numeroAleatorio;

        card.innerHTML = `
        <div class="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <iframe src="https://www.google.com/maps/embed?..."></iframe>
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">${nombreCompleto}</h2>
        <p class="text-gray-500 dark:text-gray-300">Número de teléfono:</p>
        <p class="text-gray-500 dark:text-gray-300">${telefonoLimpio}</p>
        <p class="text-gray-600 dark:text-gray-400">Cupos: <strong>${numeroAleatorio}</strong></p>
        <button class="reservar-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-2 w-full rounded disabled:opacity-50"
            ${numeroAleatorio > 0 ? '' : 'disabled'}>
            Reservar
        </button>
    `;

        const btn = card.querySelector('.reservar-btn');

        // Si ya reservó, desactiva el botón
        if (reserva?.reservado) {
            btn.disabled = true;
            btn.textContent = "Reservado";
            btn.classList.add("opacity-50", "cursor-not-allowed");
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            reservas[nombreCompleto] = {
                telefono: telefonoLimpio,
                reservado: true,
                cupos: numeroAleatorio - 1
            };

            localStorage.setItem("reservas", JSON.stringify(reservas));

            btn.disabled = true;
            btn.textContent = "Reservado";
            btn.classList.add("opacity-50", "cursor-not-allowed");
            alert(`Reservaste un cupo con ${nombreCompleto}`);
        });

        // Guardar datos en localStorage para usar en carrera.html
        card.addEventListener('click', () => {
            localStorage.setItem('nombre', nombreCompleto);
            localStorage.setItem('telefono', telefonoLimpio);
            localStorage.setItem('cupos', numeroAleatorio);
        });

        container.appendChild(card);
    });
};


// Función de autoejecución
(() => {

    loadData();
})();