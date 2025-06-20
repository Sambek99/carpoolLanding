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
        const numeroAleatorio = Math.floor(Math.random() * 5);

        const card = document.createElement("a");
        card.href = "/html/carrera.html";
        card.className = "block space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 max-w-md mx-full transition hover:shadow-lg";
        const telefonoLimpio = ip.replace(/\./g, '');

        // Guardar los datos como atributos data-*
        card.dataset.nombre = `${firstname} ${lastname}`;
        card.dataset.telefono = telefonoLimpio;
        card.dataset.cupos = numeroAleatorio;

        card.innerHTML = `
            <div class="w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-lg">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1207.0068433684694!2d-79.96683541685341!3d-2.147501522823838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902d7301a324f4c9%3A0xa76d8f1608dedfed!2sLABORATORIO%20DE%20PROFESORES!5e0!3m2!1ses-419!2sec!4v1750261912672!5m2!1ses-419!2sec" 
                    class="w-full h-40" style="border:0;" allowfullscreen="" loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">${firstname} ${lastname}</h2>
            <p class="text-gray-500 dark:text-gray-300">Número de teléfono: ${telefonoLimpio}</p>
            <p class="text-gray-600 dark:text-gray-400">Cupos: <strong>${numeroAleatorio}</strong></p>
            <button class="reservar-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-2 w-full rounded disabled:opacity-50" 
            ${numeroAleatorio > 0 ? '' : 'disabled'}>Reservar
            </button>
        `;

        const btn = card.querySelector('.reservar-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // evita que el click dispare el evento del <a>
            alert(`Reservaste un cupo con ${firstname} ${lastname}`);
        });

        // Guardar datos en localStorage al hacer clic
        card.addEventListener('click', () => {
            localStorage.setItem('nombre', card.dataset.nombre);
            localStorage.setItem('telefono', card.dataset.telefono);
            localStorage.setItem('cupos', card.dataset.cupos);
        });

        container.appendChild(card);
    });
};


// Función de autoejecución
(() => {

    loadData();
})();