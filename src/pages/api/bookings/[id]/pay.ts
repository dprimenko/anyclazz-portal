import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ params, request }) => {
    try {
        const session = await getSession(request);
        
        if (!session?.user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { id } = params;
        const body = await request.json();
        
        // Aquí iría la lógica real de pago
        // Por ahora solo simulamos un pago exitoso
        console.log('Processing payment for booking:', id);
        console.log('Payment data:', {
            cardName: body.cardName,
            cardNumber: `****${body.cardNumber.slice(-4)}`,
            expiry: body.expiry,
            saveCard: body.saveCard,
        });

        // Simular una pequeña demora
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Retornar éxito
        return new Response(JSON.stringify({ 
            success: true,
            bookingId: id,
            message: 'Payment processed successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Payment error:', error);
        return new Response(JSON.stringify({ 
            error: 'Payment processing failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
