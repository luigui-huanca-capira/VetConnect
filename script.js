// Almacenamiento de datos
let consultas = [];
let diagnosticos = [];
let emergencias = [];

// Navegación
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    // Ocultar hero por defecto salvo cuando se pida 'inicio'
    const hero = document.getElementById('inicio');
    if (hero) {
        hero.style.display = sectionId === 'inicio' ? 'block' : 'none';
    }
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.scrollIntoView({ behavior: 'smooth' });
        // Reset tabs to default when showing sections with tabs
        if (sectionId === 'cuenta') {
            showTab('perfil');
        } else if (sectionId === 'mascota') {
            showTab('perfilMascota');
        }
    }
}

// Función para mostrar tabs dentro de secciones
function showTab(tabId) {
    // Ocultar todos los tabs content en la sección actual
    const section = document.querySelector('.section[style*="display: block"]') || document.querySelector('.section:not([style*="display: none"])');
    if (section) {
        const tabContents = section.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Remover active de todos los botones de tab
        const tabBtns = section.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Mostrar el tab seleccionado
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Activar el botón correspondiente
    const activeBtn = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Mobile menu
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.right = '0';
            navMenu.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
            navMenu.style.padding = '1rem';
            navMenu.style.borderRadius = '0 0 10px 10px';
        } else {
            navMenu.style.display = '';
        }
    });
}

// Formulario de Consulta Virtual
const consultaForm = document.getElementById('consultaForm');
if (consultaForm) {
    consultaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const consulta = {
            id: Date.now(),
            nombreDueno: document.getElementById('nombreDueno').value,
            nombreMascota: document.getElementById('nombreMascota').value,
            tipoAnimal: document.getElementById('tipoAnimal').value,
            sintomas: document.getElementById('sintomas').value,
            especialidad: document.getElementById('especialidad').value,
            fecha: new Date().toLocaleString('es-PE'),
            estado: 'Pendiente'
        };
        
        consultas.push(consulta);
        
        const resultBox = document.getElementById('consultaResult');
        resultBox.className = 'result-box success';
        resultBox.innerHTML = `
            <h3>✅ Consulta Agendada Exitosamente</h3>
            <p><strong>Número de Consulta:</strong> #${consulta.id}</p>
            <p><strong>Mascota:</strong> ${consulta.nombreMascota}</p>
            <p><strong>Especialidad:</strong> ${consulta.especialidad}</p>
            <p><strong>Fecha:</strong> ${consulta.fecha}</p>
            <p>Un veterinario se pondrá en contacto contigo en las próximas 2 horas.</p>
            <button onclick="showSection('historial')" class="btn-primary" style="margin-top: 1rem;">Ver Historial</button>
        `;
        
        consultaForm.reset();
        actualizarHistorial();
    });
}

// Formulario de Diagnóstico con IA
const diagnosticoForm = document.getElementById('diagnosticoForm');
const imagenInput = document.getElementById('imagenSintoma');

if (imagenInput) {
    imagenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Función para agregar mensaje al chat
function addMessageToChat(content, isUser = false, avatar = '🤖') {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : avatar}</div>
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

if (diagnosticoForm) {
    diagnosticoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const mascota = document.getElementById('mascotaDiag').value;
        const especie = document.getElementById('especieMascota').value;
        const area = document.getElementById('areaAfectada').value;
        const descripcion = document.getElementById('descripcionDiag').value;

        // Actualizar display de especie
        const especieDisplay = document.getElementById('especieDisplay');
        if (especieDisplay) {
            especieDisplay.textContent = especie.charAt(0).toUpperCase() + especie.slice(1);
        }

        // Agregar mensaje del usuario al chat
        let userMessage = `Mi mascota ${mascota} (${especie}) tiene un problema en ${area}`;
        if (descripcion) {
            userMessage += ` y ${descripcion}`;
        }
        addMessageToChat(userMessage, true);

        // Generar diagnóstico
        const diagnostico = {
            id: Date.now(),
            mascota: mascota,
            especie: especie,
            area: area,
            descripcion: descripcion,
            fecha: new Date().toLocaleString('es-PE'),
            resultado: generarDiagnosticoIA(area)
        };

        diagnosticos.push(diagnostico);

        // Simular respuesta de IA con pequeño delay para naturalidad
        setTimeout(() => {
            const aiResponse = `
                <strong>Diagnóstico Preliminar:</strong> ${diagnostico.resultado.diagnostico}<br><br>
                <strong>Nivel de Urgencia:</strong> <span style="color: ${diagnostico.resultado.color}">${diagnostico.resultado.urgencia}</span><br><br>
                <strong>Recomendación:</strong> ${diagnostico.resultado.recomendacion}<br><br>
                <em style="font-size: 0.9rem; color: #666;">⚠️ Este es un diagnóstico preliminar. Se recomienda consultar con un veterinario profesional.</em>
            `;
            addMessageToChat(aiResponse, false, '🤖');
        }, 500);

        diagnosticoForm.reset();
        document.getElementById('imagePreview').innerHTML = '';
        actualizarHistorial();
    });
}

// Formulario de Emergencia
const emergenciaForm = document.getElementById('emergenciaForm');
if (emergenciaForm) {
    emergenciaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emergencia = {
            id: Date.now(),
            nombreDueno: document.getElementById('nombreEmergencia').value,
            telefono: document.getElementById('telefonoEmergencia').value,
            mascota: document.getElementById('mascotaEmergencia').value,
            nivelUrgencia: document.getElementById('nivelUrgencia').value,
            descripcion: document.getElementById('descripcionEmergencia').value,
            ubicacion: document.getElementById('ubicacion').value,
            fecha: new Date().toLocaleString('es-PE'),
            estado: 'En Proceso'
        };
        
        emergencias.push(emergencia);
        
        const resultBox = document.getElementById('emergenciaResult');
        const tiempoRespuesta = emergencia.nivelUrgencia === 'critica' ? '5-10 minutos' : 
                                emergencia.nivelUrgencia === 'alta' ? '15-30 minutos' : '1-2 horas';
        
        resultBox.className = 'result-box success';
        resultBox.innerHTML = `
            <h3>🚨 Emergencia Registrada</h3>
            <p><strong>Código de Emergencia:</strong> #EMG${emergencia.id}</p>
            <p><strong>Nivel de Urgencia:</strong> ${emergencia.nivelUrgencia.toUpperCase()}</p>
            <p><strong>Tiempo Estimado de Respuesta:</strong> ${tiempoRespuesta}</p>
            <p><strong>Contacto:</strong> ${emergencia.telefono}</p>
            <p style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border-radius: 5px;">
                📞 Un veterinario de emergencia te contactará inmediatamente al número proporcionado.
                Mantén tu teléfono disponible.
            </p>
        `;
        
        emergenciaForm.reset();
        actualizarHistorial();
    });
}

// Generar diagnóstico simulado con IA
function generarDiagnosticoIA(area) {
    const diagnosticos = {
        'piel': {
            diagnostico: 'Posible dermatitis o reacción alérgica. Se observan signos de irritación cutánea.',
            urgencia: 'Media',
            color: '#FFA500',
            recomendacion: 'Consulta con veterinario en 24-48 horas. Evitar que la mascota se rasque la zona afectada.'
        },
        'ojos': {
            diagnostico: 'Posible conjuntivitis o irritación ocular. Se detecta enrojecimiento.',
            urgencia: 'Alta',
            color: '#FF4444',
            recomendacion: 'Consulta urgente con veterinario. No aplicar medicamentos sin prescripción.'
        },
        'boca': {
            diagnostico: 'Posible gingivitis o problema dental. Se observa inflamación en encías.',
            urgencia: 'Media',
            color: '#FFA500',
            recomendacion: 'Agendar consulta odontológica veterinaria. Revisar alimentación.'
        },
        'extremidades': {
            diagnostico: 'Posible lesión muscular o articular. Se detecta inflamación.',
            urgencia: 'Media',
            color: '#FFA500',
            recomendacion: 'Limitar actividad física. Consultar con veterinario si persiste el dolor.'
        }
    };
    
    return diagnosticos[area] || diagnosticos['piel'];
}

// Actualizar historial
function actualizarHistorial() {
    const historialList = document.getElementById('historialList');
    if (!historialList) return;
    
    const todosLosRegistros = [
        ...consultas.map(c => ({ ...c, tipo: 'Consulta Virtual' })),
        ...diagnosticos.map(d => ({ ...d, tipo: 'Diagnóstico IA' })),
        ...emergencias.map(e => ({ ...e, tipo: 'Emergencia' }))
    ].sort((a, b) => b.id - a.id);
    
    if (todosLosRegistros.length === 0) {
        historialList.innerHTML = '<p class="info-text">No hay consultas registradas aún</p>';
        return;
    }
    
    historialList.innerHTML = todosLosRegistros.map(registro => `
        <div class="historial-item">
            <h3>${registro.tipo} - ${registro.nombreMascota || registro.mascota}</h3>
            <p><strong>ID:</strong> #${registro.id}</p>
            <p><strong>Fecha:</strong> ${registro.fecha}</p>
            ${registro.sintomas ? `<p><strong>Síntomas:</strong> ${registro.sintomas}</p>` : ''}
            ${registro.especialidad ? `<p><strong>Especialidad:</strong> ${registro.especialidad}</p>` : ''}
            ${registro.resultado ? `<p><strong>Diagnóstico:</strong> ${registro.resultado.diagnostico}</p>` : ''}
            ${registro.nivelUrgencia ? `<p><strong>Urgencia:</strong> ${registro.nivelUrgencia}</p>` : ''}
            ${registro.estado ? `<p><strong>Estado:</strong> <span style="color: #5FB878">${registro.estado}</span></p>` : ''}
        </div>
    `).join('');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Formulario de Registro
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resultBox = document.getElementById('registroResult');
        resultBox.className = 'result-box success';
        resultBox.innerHTML = '<h3>✅ Cuenta Creada Exitosamente</h3><p>Bienvenido a VetConnect. Ahora puedes acceder al Chat IA.</p>';
        registroForm.reset();
        setTimeout(() => {
            showSection('diagnostico');
        }, 2000);
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    actualizarHistorial();
    console.log('🐾 VetConnect - Sistema Iniciado');
    // Mostrar solo la sección del hash si existe o por defecto 'contacto'
    const initial = (location.hash && location.hash.substring(1)) || 'contacto';
    showSection(initial);
});
