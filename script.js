document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 0. TAPA INICIAL (NUEVO)
    // ==========================================
    const tapa = document.getElementById('tapa-invitacion');
    // Necesitamos acceso a los elementos de música aquí
    const audioJs = document.getElementById("musica-fondo");
    const btnMusicaJs = document.getElementById("btn-musica");

    if(tapa) {
        tapa.addEventListener('click', () => {
            // 1. Añadir clase CSS para iniciar la animación de "abrir"
            tapa.classList.add('abierto');

            // 2. BONUS: Intentar reproducir música automáticamente al abrir
            // Como el usuario hizo clic, los navegadores suelen permitirlo.
            if (audioJs && btnMusicaJs && typeof reproduciendo !== 'undefined' && !reproduciendo) {
                audioJs.play().then(() => {
                    reproduciendo = true;
                    btnMusicaJs.textContent = "🔊";
                    btnMusicaJs.classList.add("music-playing");
                }).catch(error => {
                    // Si falla el autoplay (algunos móviles), no pasa nada, 
                    // el usuario aún tiene el botón flotante.
                    console.log("Autoplay bloqueado por el navegador");
                });
            }
        });
    }
    // ==========================================

    // ... aquí sigue el resto de tu código (Plantas, Carrusel, etc.) ...
    
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
    // FECHA: 21 de Febrero 2026 a las 16:30
    // (Año, Mes-1, Día, Hora, Minutos) -> Mes 1 es Febrero
    const fechaCumple = new Date(2026, 1, 21, 16, 30, 0).getTime();

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
    // 4. ENVÍO DE FORMULARIO + RECORDAR DATOS
    // ==========================================
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw7CU6QoFuLD36C-vZr0gI9KX4UfErZBTo01mzOII5BbkwtlwRsAhEcZ61N76uMrSwwZQ/exec'; 
    const form = document.forms['form-confirmacion'];
    const mensajeExito = document.getElementById('mensaje-exito');
    
    // Nombre de la llave donde guardaremos los datos
    const LLAVE_DATOS = 'datos_invitacion_amy_v2';

    // A. FUNCIÓN PARA BLOQUEAR INPUTS
    function bloquearFormulario() {
        if(!form) return;
        
        // 1. Desactivar todos los campos
        const elementos = form.querySelectorAll('input, select, button');
        elementos.forEach(elemento => {
            elemento.disabled = true; 
        });

        // 2. Cambiar estilo del botón
        const btn = form.querySelector('button');
        if(btn) {
            btn.innerText = "¡Ya confirmaste tu asistencia! ✅";
            btn.style.backgroundColor = "#888"; // Gris oscuro
            btn.style.boxShadow = "none";
            btn.style.cursor = "default";
        }
    }

    // B. VERIFICAR AL CARGAR (Recuperar datos antiguos)
    const datosGuardados = localStorage.getItem(LLAVE_DATOS);
    
    if (datosGuardados) {
        // 1. Convertimos el texto guardado a objeto real
        const datos = JSON.parse(datosGuardados);

        // 2. Rellenamos los campos con lo que el usuario escribió antes
        if(form['Adulto/s Acompañante/s']) form['Adulto/s Acompañante/s'].value = datos.adulto;
        if(form['Nombre Niño']) form['Nombre Niño'].value = datos.nino;
        if(form['Telefono']) form['Telefono'].value = datos.telefono;

        // 3. Bloqueamos todo para que no lo editen
        bloquearFormulario();
    }


    // C. LOGICA DE ENVÍO
    if(form){
        form.addEventListener('submit', e => {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const textoOriginal = btn.innerText;
            btn.innerText = "Enviando...";
            btn.disabled = true;

            // Recopilamos los datos para guardarlos en el navegador
            const datosUsuario = {
                adulto: form['Adulto/s Acompañante/s'].value,
                nino: form['Nombre Niño'].value,
                telefono: form['Telefono'].value
            };

            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                // 1. GUARDAR LOS DATOS EN EL NAVEGADOR (Como texto JSON)
                localStorage.setItem(LLAVE_DATOS, JSON.stringify(datosUsuario));

                // 2. Mostrar éxito
                form.style.display = 'none'; // Ocultamos el form momentáneamente para mostrar el msj
                mensajeExito.style.display = 'block';
                form.reset();
                
                // Opcional: Si quieres que al recargar vean el form lleno, 
                // no hacemos nada más aquí, la magia ocurre al recargar la página.
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerText = "Error, intenta de nuevo";
                btn.disabled = false;
            });
        });
    }
    // ==========================================
    // 5. CONTROL DE MÚSICA
    // ==========================================
    const audio = document.getElementById("musica-fondo");
    const btnMusica = document.getElementById("btn-musica");
    let reproduciendo = false;

    if(btnMusica && audio) {
        btnMusica.addEventListener('click', () => {
            if (!reproduciendo) {
                audio.play().then(() => {
                    reproduciendo = true;
                    btnMusica.textContent = "🔊"; // Icono sonando
                    btnMusica.classList.add("music-playing");
                }).catch(error => {
                    console.log("Error al reproducir:", error);
                });
            } else {
                audio.pause();
                reproduciendo = false;
                btnMusica.textContent = "🎵"; // Icono pausado
                btnMusica.classList.remove("music-playing");
            }
        });
    }
});
