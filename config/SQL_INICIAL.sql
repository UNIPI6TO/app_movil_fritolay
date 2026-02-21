-- Declaramos la variable una sola vez al inicio del script
DECLARE @IdProducto INT;

-- ==========================================
-- 1. Lays Clásicas 160g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7501011167409', 'Lays Clásicas 160g', 'Papas fritas con el toque exacto de sal natural. Textura crujiente y sabor original.', 1.50, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/N8AU8wA.jpeg'),
(@IdProducto, 'https://i.imgur.com/uNJlp6F.jpeg'),
(@IdProducto, 'https://i.imgur.com/C0mlyxg.jpeg');

-- ==========================================
-- 2. Doritos Nacho Queso 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7501011115318', 'Doritos Nacho Queso 150g', 'Tortillas de maíz crujientes con un intenso y clásico sabor a queso.', 1.60, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/wlmeIdR.jpeg'),
(@IdProducto, 'https://i.imgur.com/qb2kh3m.jpeg'),
(@IdProducto, 'https://i.imgur.com/Brvo8Fa.jpeg');

-- ==========================================
-- 3. Cheetos Torciditos 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7501011131233', 'Cheetos Torciditos 145g', 'Snacks de maíz horneados con sabor a queso y textura crujiente.', 1.40, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/VvPPWTR.jpeg'),
(@IdProducto, 'https://i.imgur.com/h83DP4A.jpeg'),
(@IdProducto, 'https://i.imgur.com/zyoVetY.jpeg');

-- ==========================================
-- 4. Ruffles Queso 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7501011167522', 'Ruffles Queso 120g', 'Papas fritas con corte ondulado y un delicioso sabor a queso derretido.', 1.55, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/7F0fRCq.jpeg'),
(@IdProducto, 'https://i.imgur.com/Q0CImef.jpeg'),
(@IdProducto, 'https://i.imgur.com/ZetcWea.jpeg');

-- ==========================================
-- 5. Tostitos Clásicos 280g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('0284000032644', 'Tostitos Clásicos 280g', 'Tortillas de maíz blanco crujientes, ideales para acompañar con salsas y dips.', 3.50, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/z3kt0T6.jpeg'),
(@IdProducto, 'https://i.imgur.com/G0zs49J.jpeg'),
(@IdProducto, 'https://i.imgur.com/undMSDI.jpeg');

-- ==========================================
-- 6. DeTodito Mix Clásico 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7702189012345', 'DeTodito Mix Clásico 150g', 'Mezcla perfecta de Doritos, Cheetos y Ruffles en un solo empaque.', 1.75, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/NsIvWNW.jpeg'),
(@IdProducto, 'https://i.imgur.com/kfYcFIP.jpeg'),
(@IdProducto, 'https://i.imgur.com/rEmRmzJ.jpeg');

-- ==========================================
-- 7. Natuchips Plátano Verde 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7702189054321', 'Natuchips Plátano Verde 150g', 'Hojuelas de plátano verde frito con un toque de sal. Sabor tradicional.', 1.65, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/6UMAwfw.jpeg'),
(@IdProducto, 'https://i.imgur.com/WtolqG7.jpeg'),
(@IdProducto, 'https://i.imgur.com/7Z3YTwq.jpeg');

-- ==========================================
-- 8. Lays Crema y Cebolla 160g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7501011167454', 'Lays Crema y Cebolla 160g', 'Papas fritas con una suave y deliciosa combinación de crema agria y cebolla.', 1.60, 5.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/QhnemEX.jpeg'),
(@IdProducto, 'https://i.imgur.com/V02nxop.jpeg'),
(@IdProducto, 'https://i.imgur.com/Sab6dAr.jpeg');


-- ==========================================
-- 09. Lays Artesanas 96g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167409', 'Lays Artesanas 96g', 'Papas fritas con corte rústico y textura extra crujiente, elaboradas con papas 100% ecuatorianas.', 1.65, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/7JBBNLz.jpeg'),
(@IdProducto, 'https://i.imgur.com/pZyT9KO.jpeg'),
(@IdProducto, 'https://i.imgur.com/8NUu4pQ.jpeg');


-- ==========================================
-- 10. De Todito Natural 90g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011131233', 'De Todito Natural 90g', 'Mix de snacks tradicionales que incluye papas, chifles de plátano y crujiente chicharrón.', 1.50, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/he6PqvF.jpeg'),
(@IdProducto, 'https://i.imgur.com/N7GV0s4.jpeg'),
(@IdProducto, 'https://i.imgur.com/sWRy7Uq.jpeg');

-- ==========================================
-- 11. Cheese Tris 130g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167522', 'Cheese Tris Palitos de Maíz 130g', 'Clásicos palitos de maíz inflado con un intenso sabor a queso.', 1.60, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/8QjaDxw.jpeg'),
(@IdProducto, 'https://i.imgur.com/RUbI28P.jpeg'),
(@IdProducto, 'https://i.imgur.com/lPJG28v.jpeg');

-- ==========================================
-- 12. Doritos Cool Ranch 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7864000032644', 'Doritos Cool Ranch 150g', 'Tortillas de maíz con el clásico y refrescante sabor a aderezo ranch, producidos localmente.', 1.75, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/U7uT4d2.jpeg'),
(@IdProducto, 'https://i.imgur.com/bFi3vOh.jpeg'),
(@IdProducto, 'https://i.imgur.com/lVx9bgq.jpeg');

-- ==========================================
-- 13. Doritos Limón Ácido Picante 165g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7862189012345', 'Doritos Limón Ácido Picante 165g', 'Bocaditos de maíz en forma de tortilla con una combinación intensa de cítrico y ají.', 1.85, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/dzK3TfQ.jpeg'),
(@IdProducto, 'https://i.imgur.com/i8TAZZf.jpeg'),
(@IdProducto, 'https://i.imgur.com/7EX8Tcs.jpeg');

-- ==========================================
-- 14. Ruffles Natural 147g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7862189054321', 'Ruffles Natural 147g', 'Papas fritas onduladas clásicas, ideales para dipear o consumir solas.', 1.60, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/Kbbtxn0.jpeg'),
(@IdProducto, 'https://i.imgur.com/TSsC2dp.jpeg'),
(@IdProducto, 'https://i.imgur.com/rCxYG1M.jpeg');

-- ==========================================
-- 15. Ruffles Picante 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167454', 'Ruffles Picante 120g', 'Papas fritas con corte ondulado y un toque extra de especias y picante.', 1.55, 5.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/lGgJnVc.jpeg'),
(@IdProducto, 'https://i.imgur.com/qNavkOa.jpeg'),
(@IdProducto, 'https://i.imgur.com/DEVJHR2.jpeg');

-- ==========================================
-- 16. Cheetos Queso 21g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011155331', 'Cheetos Queso 21g', 'Presentación personal de los clásicos snacks horneados sabor a queso.', 0.40, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/zAZkEbq.jpeg'),
(@IdProducto, 'https://i.imgur.com/5hB22RW.jpeg'),
(@IdProducto, 'https://i.imgur.com/Qr3xOaS.jpeg');

-- ==========================================
-- 17. Doritos Flamin' Hot 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167900', 'Doritos Flamin Hot 150g', 'Tortillas de maíz con el clásico crujido de Doritos y una explosión de sabor picante extremo y queso.', 1.80, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/4wQ68ev.jpeg'),
(@IdProducto, 'https://i.imgur.com/KZbClgC.jpeg'),
(@IdProducto, 'https://i.imgur.com/kH3gDsm.jpeg');

-- ==========================================
-- 18. Cheetos Flamin' Hot 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167917', 'Cheetos Flamin Hot 145g', 'Snacks de maíz horneados recubiertos con el icónico y adictivo polvo rojo picante.', 1.65, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/lAGacUt.jpeg'),
(@IdProducto, 'https://i.imgur.com/wpSyPic.jpeg'),
(@IdProducto, 'https://i.imgur.com/z4tzdao.jpeg');

-- ==========================================
-- 19. Ruffles Flamin' Hot 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167924', 'Ruffles Flamin Hot 120g', 'Papas fritas con corte ondulado que capturan al máximo el intenso sabor picante y queso.', 1.70, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/uV3oJhG.jpeg'),
(@IdProducto, 'https://i.imgur.com/1Bt4Y4k.jpeg'),
(@IdProducto, 'https://i.imgur.com/uCKNTUt.jpeg');

-- ==========================================
-- 20. Lays Flamin' Hot 110g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167931', 'Lays Flamin Hot 110g', 'Clásicas papas fritas lisas con la combinación perfecta de textura crujiente y nivel de picante Flamin Hot.', 1.60, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/gj9Yqs8.jpeg'),
(@IdProducto, 'https://i.imgur.com/fclEUqC.jpeg'),
(@IdProducto, 'https://i.imgur.com/Ug9BpnO.jpeg');

-- ==========================================
-- 21. De Todito Flamin' Hot 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo)
VALUES ('7861011167948', 'De Todito Flamin Hot 145g', 'Mix extremo que combina Cheetos, Doritos y Ruffles, todos con el intenso sabor Flamin Hot.', 1.85, 0.00, 12.00, 1);

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://i.imgur.com/keTooju.jpeg'),
(@IdProducto, 'https://i.imgur.com/gdZou0x.jpeg'),
(@IdProducto, 'https://i.imgur.com/eCgoXYi.jpeg');