USE BaseDatosPedidos; -- Asegúrate de usar el nombre correcto de tu BD
GO

-- Variable para capturar el ID del producto insertado
DECLARE @IdProducto INT;

-- =============================================
-- PRODUCTO 1: Lays Clásicas (Papas Margarita)
-- =============================================
INSERT INTO Productos (Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('Lays Clásicas 160g', 'Papas fritas con el toque exacto de sal natural. Textura crujiente y sabor original.', 1.50, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); -- Captura el ID creado

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://supermercado.com/img/lays-clasica-front.jpg'),
(@IdProducto, 'https://supermercado.com/img/lays-clasica-back.jpg'),
(@IdProducto, 'https://supermercado.com/img/lays-clasica-nutrition.jpg');

-- =============================================
-- PRODUCTO 2: Doritos Nacho Atrevido
-- =============================================
INSERT INTO Productos (Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('Doritos Nacho Atrevido 200g', 'Tortillas de maíz sabor a queso intenso. Ideal para compartir en fiestas.', 2.10, 5.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://supermercado.com/img/doritos-nacho-front.jpg'),
(@IdProducto, 'https://supermercado.com/img/doritos-nacho-bowl.jpg'),
(@IdProducto, 'https://supermercado.com/img/doritos-nacho-promo.jpg');

-- =============================================
-- PRODUCTO 3: Cheetos Torciditos (Queso)
-- =============================================
INSERT INTO Productos (Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('Cheetos Torciditos 145g', 'Snack de maíz horneado con sabor a queso y mantequilla. Forma de espiral.', 1.35, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://supermercado.com/img/cheetos-torciditos-front.jpg'),
(@IdProducto, 'https://supermercado.com/img/cheetos-open-bag.jpg'),
(@IdProducto, 'https://supermercado.com/img/chester-cheetos-mascot.jpg');

-- =============================================
-- PRODUCTO 4: De Todito Mix (Surtido)
-- =============================================
INSERT INTO Productos (Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('De Todito Mix 250g', 'La mejor mezcla de tus snacks favoritos: Papas, Chicharrones, Plátanos y Palitos sabor a tocino.', 2.50, 10.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://supermercado.com/img/detodito-mix-front.jpg'),
(@IdProducto, 'https://supermercado.com/img/detodito-contents.jpg'),
(@IdProducto, 'https://supermercado.com/img/detodito-party.jpg');

-- =============================================
-- PRODUCTO 5: NatuChips Plátano (Ejemplo Impuesto 0%)
-- =============================================
-- Nota: Ponemos Impuesto 0.00 para probar la lógica de impuestos dinámicos
INSERT INTO Productos (Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('NatuChips Plátano Maduritos 100g', 'Hojuelas de plátano maduro, dulce natural sin azúcar añadida.', 1.00, 0.00, 0.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://supermercado.com/img/natuchips-platano-front.jpg'),
(@IdProducto, 'https://supermercado.com/img/natuchips-detail.jpg'),
(@IdProducto, 'https://supermercado.com/img/natuchips-vegan-icon.jpg');

-- =============================================
-- VERIFICACIÓN
-- =============================================
SELECT p.Nombre, p.PrecioBase, p.PorcentajeImpuesto, COUNT(i.IdImagen) as CantidadImagenes
FROM Productos p
JOIN ImagenesProducto i ON p.IdProducto = i.IdProducto
GROUP BY p.Nombre, p.PrecioBase, p.PorcentajeImpuesto;