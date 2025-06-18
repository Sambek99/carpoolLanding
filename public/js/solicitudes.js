'use strict';

import { fetchFakerData } from '/js/functions.js';

const loadData = async () => {

    const url = 'https://fakerapi.it/api/v2/users?_quantity=3&_gender=male,female';

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

// Muestra tarjetas reales
const renderCards = (users) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;
    container.innerHTML = "";

    users.forEach(({ firstname, lastname, ip }) => {
        const card = document.createElement("div");
        const numeroAleatorio = Math.floor(Math.random() * 5);
        card.className = "space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-4 max-w-md mx-full";

        card.innerHTML = `
            <div class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">${firstname} ${lastname}</h2>
            <p class="text-gray-500 dark:text-gray-300">${ip}</p>
            <p class="text-gray-600 dark:text-gray-400">Cupos: <strong>${numeroAleatorio}</strong></p>        `;
        container.appendChild(card);
    });
};

// Función de autoejecución
(() => {

    loadData();
})();