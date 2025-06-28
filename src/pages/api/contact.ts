import type { APIRoute } from 'astro';
import { rateLimitMiddleware } from '../../utils/rateLimiter';

export const POST: APIRoute = async ({ request }) => {
    try {
        const rateLimitResult = rateLimitMiddleware(request);
        if (!rateLimitResult.allowed) {
            return new Response(JSON.stringify({
                success: false,
                message: rateLimitResult.message
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '900'
                }
            });
        }

        const API_KEY = import.meta.env.API_KEY || process.env.API_KEY;
        const API_URL = 'https://backend-guimarbot-bwc8.onrender.com/api/v1/contact';

        if (!API_KEY) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Configuración del servidor incompleta'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Content-Type debe ser application/json'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const body = await request.json();

        const { fullName, email, phone, course, message } = body;

        if (!fullName || !email || !phone || !course) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Todos los campos obligatorios deben ser completados'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'El formato del email no es válido'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const cursosValidos = ['robotics', 'coders', 'gamers', 'traders'];
        if (!cursosValidos.includes(course)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'El curso seleccionado no es válido'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if (message && message.length < 10) {
            return new Response(JSON.stringify({
                success: false,
                message: 'El mensaje debe tener al menos 10 caracteres'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY
            },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                course,
                message: message || ''
            })
        });

        const resultado = await response.json();

        return new Response(JSON.stringify(resultado), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error en endpoint de contacto:', error);

        return new Response(JSON.stringify({
            success: false,
            message: 'Error interno del servidor'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
