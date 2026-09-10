import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function getId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const PUT: APIRoute = async ({ params, request }) => {
  const id = getId(params.id);
  if (!id) return json({ error: 'Identificador inválido' }, 400);

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

    const catResult = await db.query(
      'SELECT id FROM categories WHERE name = $1',
      [categoria]
    );
    if (catResult.rows.length === 0) {
      return json({ error: `La categoría "${categoria}" no existe` }, 400);
    }
    const category_id = catResult.rows[0].id;

    const result = await db.query(
      'UPDATE products SET nombre=$1, precio=$2, imagen=$3, category_id=$4 ' +
      'WHERE id=$5 ' +
      'RETURNING id, nombre, precio, imagen, category_id, created_at',
      [nombre, precio, imagen, category_id, id]
    );
    if (result.rowCount === 0) {
      return json({ error: 'Producto no encontrado' }, 404);
    }
    return json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return json({ error: 'No fue posible actualizar el producto' }, 500);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = getId(params.id);
  if (!id) return json({ error: 'Identificador inválido' }, 400);

  try {
    const result = await db.query(
      'DELETE FROM products WHERE id=$1 RETURNING id', [id]
    );
    if (result.rowCount === 0) {
      return json({ error: 'Producto no encontrado' }, 404);
    }
    return json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    return json({ error: 'No fue posible eliminar el producto' }, 500);
  }
};
