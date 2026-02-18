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
    // ==========================================
    // 3. CUENTA REGRESIVA
    // ==========================================
    
    // FECHA DEL CUMPLEAÑOS: (Año, Mes-1, Día, Hora, Minutos)
    // Nota: Los meses en JS van de 0 (Enero) a 11 (Diciembre).
    // Para el 21 de Febrero de 2026 a las 15:00:
    const fechaCumple = new Date(2026, 1, 21, 15, 0, 0).getTime();

    const intervalo = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = fechaCumple - ahora;

        // Cálculos de tiempo
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        // Mostrar en el HTML
        const elDias = document.getElementById("dias");
        
        // Verificación simple para evitar errores si el HTML no carga
        if(elDias) {
            document.getElementById("dias").innerText = dias < 10 ? "0" + dias : dias;
            document.getElementById("horas").innerText = horas < 10 ? "0" + horas : horas;
            document.getElementById("minutos").innerText = minutos < 10 ? "0" + minutos : minutos;
            document.getElementById("segundos").innerText = segundos < 10 ? "0" + segundos : segundos;
        }

        // Si ya pasó la fecha
        if (distancia < 0) {
            clearInterval(intervalo);
            document.getElementById("cuenta-regresiva").innerHTML = "<h3 style='color:#ff6b6b'>¡Es hoy! ¡Rugidos!</h3>";
        }
    }, 1000);
    // ==========================================
    // 4. ENVÍO DE FORMULARIO A GOOGLE SHEETS
    // ==========================================
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw7CU6QoFuLD36C-vZr0gI9KX4UfErZBTo01mzOII5BbkwtlwRsAhEcZ61N76uMrSwwZQ/exec'; // <--- ¡PEGA TU URL AQUÍ!
    const form = document.forms['form-confirmacion'];
    const mensajeExito = document.getElementById('mensaje-exito');

    if(form){
        form.addEventListener('submit', e => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Cambiar texto del botón para dar feedback
            const btn = form.querySelector('button');
            const textoOriginal = btn.innerText;
            btn.innerText = "Enviando...";
            btn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                // Ocultar formulario y mostrar mensaje
                form.style.display = 'none';
                mensajeExito.style.display = 'block';
                // Resetear form por si acaso
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerText = "Error, intenta de nuevo";
                btn.disabled = false;
            });
        });
    }
});
