CREATE TABLE IF NOT EXISTS categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  imagen VARCHAR(255),
  category_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO categories (name) VALUES
  ('alimento'),
  ('cuidado'),
  ('juguetes');

INSERT INTO products (nombre, precio, imagen, category_id) VALUES
  ('Croquetas Premium para Perro', 600, 'https://www.ganador.com.mx/wp-content/uploads/2023/05/render-adulto-rp.png', 1),
  ('Comida Húmeda para Gato', 30, 'https://purina.com.gt/sites/default/files/styles/webp/public/2023-10/Sobre_Felix_Adulto_Pollo_1.png.webp?itok=4v8qkaeJA', 1),
  ('Alimento Natural para Cachorros', 500, 'https://eranaturals.mx/cdn/shop/files/57_d0dcf1a7-2e89-4523-b76b-ddfc0151bccb.png?v=1740596580', 1),
  ('Era Naturals Adulto Raza Mediana y Grande', 469, 'https://eranaturals.mx/cdn/shop/files/20kg_Adulto.png?v=1740596528', 1),
  ('Shampoo Antipulgas', 89, 'https://www.lacomer.com.mx/superc/img_art/7501022107010_3.jpg', 2),
  ('Cepillo Quitapelos para Mascotas', 120, 'https://m.media-amazon.com/images/I/71ECpqwKSdL.jpg', 2),
  ('Cortaúñas de Seguridad', 99, 'https://http2.mlstatic.com/D_NQ_NP_790208-CBT113616008492_072026-O.webp', 2),
  ('Cepillo Dental y Pasta', 60, 'https://i5.walmartimages.com/asr/aa9fde20-209a-4f47-80a1-bfb449856ea6.b2642d4caa69ada25724069ccc4dc81c.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 2),
  ('Pelota Resistente', 70, 'https://images.unsplash.com/photo-1669891340245-5b787bb7fa70?auto=format&fit=crop&w=600&q=80', 3),
  ('Ratón de Juguete Felpa', 99, 'https://images.unsplash.com/photo-1638826595775-e2eae86cda8e?auto=format&fit=crop&w=600&q=80', 3),
  ('Cuerda Trenzada Multicolor', 50, 'https://images.unsplash.com/photo-1723296014357-808b32c57d98?auto=format&fit=crop&w=600&q=80', 3),
  ('Comedero Rompecabezas', 250, 'https://images.unsplash.com/photo-1678783133022-89e103910f76?auto=format&fit=crop&w=600&q=80', 3);
