document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LÓGICA DE LAS PLANTAS JURÁSICAS
    // ==========================================
    function crearPlanta(idContenedor, tipoHoja, cantidadHojas, alturaBase, apertura) {
        const contenedor = document.getElementById(idContenedor);
        if (!contenedor) return;

        for (let i = 0; i < cantidadHojas; i++) {
            const hoja = document.createElement("div");
            hoja.classList.add("hoja", tipoHoja);

            const anguloInicial = -apertura / 2; 
            const paso = apertura / (cantidadHojas - 1);
            const rotacion = anguloInicial + (paso * i);
            const variacionAltura = Math.random() * 30;
            const alturaFinal = alturaBase + variacionAltura;

            hoja.style.height = `${alturaFinal}px`;
            hoja.style.setProperty('--rotacion', `${rotacion}deg`);
            hoja.style.transform = `rotate(${rotacion}deg)`;
            hoja.style.animationDelay = `${Math.random()}s`;

            contenedor.appendChild(hoja);
        }
    }

    crearPlanta('planta-izquierda', 'hoja-helecho', 12, 70, 100);
    crearPlanta('planta-derecha', 'hoja-palma', 9, 50, 140);


    // ==========================================
    // 2. LÓGICA DEL CARRUSEL INTERACTIVO (JS)
    // ==========================================
    const slider = document.getElementById('carrusel');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    // --- A. Botones de Flecha (Para PC) ---
    btnNext.addEventListener('click', () => {
        // Desplaza 250px a la derecha suavemente
        slider.scrollBy({ left: 250, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
        // Desplaza 250px a la izquierda suavemente
        slider.scrollBy({ left: -250, behavior: 'smooth' });
    });


    // --- B. Drag & Scroll (Arrastrar con Mouse en PC) ---
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active'); // Cambia el cursor
        // Guarda dónde hiciste click
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Si no estás clickeando, no hagas nada
        e.preventDefault();  // Evita seleccionar texto
        
        // Calcula cuánto moviste el mouse
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // El *2 es la velocidad del arrastre
        
        // Mueve el carrusel
        slider.scrollLeft = scrollLeft - walk;
    });
});