import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        // Obtener la API key desde las variables de entorno
        const API_KEY = import.meta.env.API_KEY;

        if (!API_KEY) {
            return new Response(
                JSON.stringify({ error: 'API key no configurada' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Obtener los datos del formulario
        const formData = await request.json();

        // Validar datos requeridos
        const { name, email, phone, course, message } = formData;
        if (!name || !email || !phone || !course || !message) {
            return new Response(
                JSON.stringify({ error: 'Todos los campos son requeridos' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Enviar datos al backend de NestJS
        const response = await fetch('https://backend-guimarbot-bwc8.onrender.com/api/v1/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                course,
                message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return new Response(
                JSON.stringify({ error: errorData.message || 'Error al enviar el mensaje' }),
                {
                    status: response.status,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const result = await response.json();

        return new Response(
            JSON.stringify({ success: true, data: result }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Error en el endpoint de contacto:', error);
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};
