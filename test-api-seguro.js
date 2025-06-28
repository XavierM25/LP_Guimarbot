// Script de prueba para el endpoint seguro de Astro
// Ejecutar en el navegador después de iniciar el servidor de desarrollo

async function probarEndpointSeguro() {
  const API_URL = '/api/contact'; // Ahora usa el endpoint local seguro

  // Datos de prueba
  const datosTest = {
    fullName: 'Juan Pérez Test',
    email: 'test@email.com',
    phone: '+51955567189',
    course: 'robotics',
    message: 'Este es un mensaje de prueba desde el frontend seguro',
  };

  console.log('🚀 Probando endpoint seguro...');
  console.log('URL:', API_URL);
  console.log('Datos a enviar:', datosTest);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Nota: NO enviamos API key - está protegida en el servidor
      },
      body: JSON.stringify(datosTest),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const resultado = await response.json();
    console.log('Respuesta del servidor:', resultado);

    if (response.ok && resultado.success) {
      console.log('✅ Endpoint seguro funcionando correctamente!');
    } else {
      console.log('❌ Error en la API:', resultado.message);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
}

// Función para probar rate limiting
async function probarRateLimit() {
  console.log('🛡️ Probando rate limiting...');

  const datosTest = {
    fullName: 'Rate Limit Test',
    email: 'ratetest@email.com',
    phone: '+51955567189',
    course: 'robotics',
    message: 'Prueba de rate limiting',
  };

  // Enviar 6 peticiones rápidamente para activar el rate limit
  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...datosTest,
          fullName: `Rate Test ${i}`,
        }),
      });

      const resultado = await response.json();
      console.log(`Petición ${i}:`, response.status, resultado.message);

      if (response.status === 429) {
        console.log('✅ Rate limiting funcionando - petición bloqueada');
        break;
      }
    } catch (error) {
      console.error(`Error en petición ${i}:`, error);
    }

    // Pequeña pausa entre peticiones
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Ejecutar las pruebas (descomenta las que quieras probar)
// probarEndpointSeguro();
// probarRateLimit();

console.log('📋 Funciones disponibles:');
console.log('- probarEndpointSeguro(): Prueba el endpoint de contacto');
console.log('- probarRateLimit(): Prueba el sistema de rate limiting');
console.log('');
console.log('💡 Ejecuta las funciones desde la consola del navegador');
console.log('Ejemplo: probarEndpointSeguro()');

// Para usar en el navegador, hacer disponibles las funciones globalmente
if (typeof window !== 'undefined') {
  window.probarEndpointSeguro = probarEndpointSeguro;
  window.probarRateLimit = probarRateLimit;
}
