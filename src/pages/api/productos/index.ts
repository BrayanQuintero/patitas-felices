import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export const GET: APIRoute = async () => {
  try {
    const result = await db.query(
      'SELECT p.id, p.nombre, p.precio, p.imagen, c.name AS categoria ' +
      'FROM products p ' +
      'JOIN categories c ON c.id = p.category_id ' +
      'ORDER BY p.id'
    );
    return json(result.rows);
  } catch (error) {
    console.error(error);
    return json({ error: 'No fue posible consultar los productos' }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const nombre = String(body.nombre ?? '').trim();
    const precio = Number(body.precio);
    const imagen = String(body.imagen ?? '').trim();
    const categoria = String(body.categoria ?? '').trim().toLowerCase();

    if (!nombre || !precio || !imagen || !categoria) {
      return json({ error: 'Todos los campos son obligatorios' }, 400);
    }
    if (Number.isNaN(precio) || precio <= 0) {
      return json({ error: 'El precio debe ser un número positivo' }, 400);
    }
    if (nombre.length > 120) {
      return json({ error: 'Nombre demasiado largo' }, 400);
    }

    const catResult = await db.query(
      'SELECT id FROM categories WHERE name = $1',
      [categoria]
    );
    if (catResult.rows.length === 0) {
      return json({ error: `La categoría "${categoria}" no existe` }, 400);
    }
    const category_id = catResult.rows[0].id;

    const result = await db.query(
      'INSERT INTO products (nombre, precio, imagen, category_id) ' +
      'VALUES ($1, $2, $3, $4) ' +
      'RETURNING id, nombre, precio, imagen, category_id, created_at',
      [nombre, precio, imagen, category_id]
    );
    return json(result.rows[0], 201);
  } catch (error) {
    console.error(error);
    return json({ error: 'No fue posible crear el producto' }, 500);
  }
};
