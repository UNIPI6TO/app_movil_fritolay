-- Declaramos la variable una sola vez al inicio del script
DECLARE @IdProducto INT;

-- ==========================================
-- 1. Lays Clásicas 160g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7501011167409', 'Lays Clásicas 160g', 'Papas fritas con el toque exacto de sal natural. Textura crujiente y sabor original.', 1.50, 0.00, 12.00, 1, 'Lays', 'Natural');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699650/LaysCl%C3%A1sicas160g-03_fbt4xu.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699768/LaysCl%C3%A1sicas160g-03_ifsnwa.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699648/LaysCl%C3%A1sicas160g-02_izrsex.jpg');

-- ==========================================
-- 2. Doritos Nacho Queso 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7501011115318', 'Doritos Nacho Queso 150g', 'Tortillas de maíz crujientes con un intenso y clásico sabor a queso.', 1.60, 0.00, 12.00, 1, 'Doritos', 'Queso');

SET @IdProducto = SCOPE_IDENTITY();
EWS
INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699065/DoritosNachoQueso150g-03_m1rkk0.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699064/DoritosNachoQueso150g-02_ph7egj.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699063/DoritosNachoQueso150g-01_nsqqco.jpg');

-- ==========================================
-- 3. Cheetos Torciditos 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7501011131233', 'Cheetos Torciditos 145g', 'Snacks de maíz horneados con sabor a queso y textura crujiente.', 1.40, 0.00, 12.00, 1, 'Chetos', 'Queso');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699407/CheetosTorciditos145g-02_golpxb.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheetosTorciditos145g-01_z5tq7y.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheetosTorciditos145g-03_stbcqv.jpg');

-- ==========================================
-- 4. Ruffles Queso 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7501011167522', 'Ruffles Queso 120g', 'Papas fritas con corte ondulado y un delicioso sabor a queso derretido.', 1.55, 0.00, 12.00, 1, 'Ruffles', 'Queso');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771700160/RufflesQueso120g-01_xrwcvb.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699078/RufflesQueso120g-02_nocmtb.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699078/RufflesQueso120g-03_heyryw.jpg');

-- ==========================================
-- 5. Tostitos Clásicos 280g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('0284000032644', 'Tostitos Clásicos 280g', 'Tortillas de maíz blanco crujientes, ideales para acompañar con salsas y dips.', 3.50, 0.00, 12.00, 1, 'Nachos', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771775270/TostitosCl%C3%A1sicos280g-04_kopyvv.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699078/TostitosCl%C3%A1sicos280g-03_fsc9pl.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699078/TostitosCl%C3%A1sicos280g-01_qqywxk.jpg');

-- ==========================================
-- 6. DeTodito Mix Clásico 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7702189012345', 'DeTodito Mix Clásico 150g', 'Mezcla perfecta de Doritos, Cheetos y Ruffles en un solo empaque.', 1.75, 0.00, 12.00, 1, 'De Todito', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DeToditoMixCl%C3%A1sico150g-01_ymg8cj.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DeToditoMixCl%C3%A1sico150g-03_vzvqfi.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DeToditoMixCl%C3%A1sico150g-02_uim25s.jpg');

-- ==========================================
-- 7. Natuchips Plátano Verde 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7702189054321', 'Natuchips Plátano Verde 150g', 'Hojuelas de plátano verde frito con un toque de sal. Sabor tradicional.', 1.65, 0.00, 12.00, 1, 'Natuchips', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699071/NatuchipsPl%C3%A1tanoVerde150g-03_kzocqz.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699071/NatuchipsPl%C3%A1tanoVerde150g-02_j3chz5.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699070/NatuchipsPl%C3%A1tanoVerde150g-01_ynhh8z.jpg');

-- ==========================================
-- 8. Lays Crema y Cebolla 160g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7501011167454', 'Lays Crema y Cebolla 160g', 'Papas fritas con una suave y deliciosa combinación de crema agria y cebolla.', 1.60, 5.00, 12.00, 1, 'Lays', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771775519/LaysCremayCebolla160g-04_icmhvd.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699066/LaysCremayCebolla160g-01_ksyxyb.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699066/LaysCremayCebolla160g-02_bro4dv.jpg');


-- ==========================================
-- 09. Lays Artesanas 96g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167409', 'Lays Artesanas 96g', 'Papas fritas con corte rústico y textura extra crujiente, elaboradas con papas 100% ecuatorianas.', 1.65, 0.00, 12.00, 1, 'Lays', 'Natural');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699066/LaysArtesanas96g-03_fafmmi.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699066/LaysArtesanas96g-02_t8hls2.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699066/LaysArtesanas96g-01_cuofr8.jpg');


-- ==========================================
-- 10. De Todito Natural 90g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011131233', 'De Todito Natural 90g', 'Mix de snacks tradicionales que incluye papas, chifles de plátano y crujiente chicharrón.', 1.50, 0.00, 12.00, 1, 'De Todito', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DeToditoNatural90g-02_fldpke.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DeToditoNatural90g-03_jqb0q8.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699057/DeToditoNatural90g-01_oydv3r.jpg');

-- ==========================================
-- 11. Cheese Tris 130g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167522', 'Cheese Tris Palitos de Maíz 130g', 'Clásicos palitos de maíz inflado con un intenso sabor a queso.', 1.60, 0.00, 12.00, 1, 'Cheese Tris', 'Queso');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheeseTris130g-02_auf3f7.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699052/CheeseTris130g-03_le75uv.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699052/CheeseTris130g-01_vtqvob.jpg');

-- ==========================================
-- 12. Doritos Cool Ranch 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7864000032644', 'Doritos Cool Ranch 150g', 'Tortillas de maíz con el clásico y refrescante sabor a aderezo ranch, producidos localmente.', 1.75, 0.00, 12.00, 1, 'Doritos', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699061/DoritosCoolRanch150g-03_e9uwco.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DoritosCoolRanch150g-01_akj1se.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699058/DoritosCoolRanch150g-02_uab29n.jpg');

-- ==========================================
-- 13. Doritos Limón Ácido Picante 165g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7862189012345', 'Doritos Limón Ácido Picante 165g', 'Bocaditos de maíz en forma de tortilla con una combinación intensa de cítrico y ají.', 1.85, 0.00, 12.00, 1, 'Doritos', 'Picante');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771775956/DoritosLim%C3%B3n%C3%81cidoPicante165g-04_dz9ajk.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699063/DoritosLim%C3%B3n%C3%81cidoPicante165g-02_s4rwfu.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699063/DoritosLim%C3%B3n%C3%81cidoPicante165g-01_x1g15l.jpg');

-- ==========================================
-- 14. Ruffles Natural 147g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7862189054321', 'Ruffles Natural 147g', 'Papas fritas onduladas clásicas, ideales para dipear o consumir solas.', 1.60, 0.00, 12.00, 1, 'Ruffles', 'Natural');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771776094/RufflesNatural147g-04_j8hkm6.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699074/RufflesNatural147g-01_kdcnis.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699074/RufflesNatural147g-01_kdcnis.jpg');

-- ==========================================
-- 15. Ruffles Picante 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167454', 'Ruffles Picante 120g', 'Papas fritas con corte ondulado y un toque extra de especias y picante.', 1.55, 5.00, 12.00, 1, 'Ruffles', 'Picante');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699075/RufflesPicante120g-01_yepyn5.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699078/RufflesPicante120g-03_otzsfq.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699077/RufflesPicante120g-02_i154ig.jpg');

-- ==========================================
-- 16. Cheetos Queso 21g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011155331', 'Cheetos Queso 21g', 'Presentación personal de los clásicos snacks horneados sabor a queso.', 0.40, 0.00, 12.00, 1, 'Chetos', 'Queso');

SET @IdProducto = SCOPE_IDENTITY();

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheetosQueso21g-01_hstxrp.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheetosQueso21g-03_fizu8g.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/CheetosQueso21g-02_slt8hu.jpg');

-- ==========================================
-- 17. Doritos Flamin' Hot 150g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167900', 'Doritos Flamin Hot 150g', 'Tortillas de maíz con el clásico crujido de Doritos y una explosión de sabor picante extremo y queso.', 1.80, 0.00, 12.00, 1, 'Doritos', 'Flamming Hot');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699062/DoritosFlamin_Hot150g-03_ijgdi3.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699061/DoritosFlamin_Hot150g-01_sepixk.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699062/DoritosFlamin_Hot150g-02_rdnast.jpg');

-- ==========================================
-- 18. Cheetos Flamin' Hot 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167917', 'Cheetos Flamin Hot 145g', 'Snacks de maíz horneados recubiertos con el icónico y adictivo polvo rojo picante.', 1.65, 0.00, 12.00, 1, 'Chetos', 'Flamming Hot');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/Cheetos-_Flamin_Hot145g-02_crswoh.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/Cheetos-_Flamin_Hot145g-03_zhsajc.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/Cheetos-_Flamin_Hot145g-01_kb9x42.jpg');

-- ==========================================
-- 19. Ruffles Flamin' Hot 120g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167924', 'Ruffles Flamin Hot 120g', 'Papas fritas con corte ondulado que capturan al máximo el intenso sabor picante y queso.', 1.70, 0.00, 12.00, 1, 'Ruffles', 'Flamming Hot');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771776351/RufflesFlamin_Hot120g-03_uuczso.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699071/RufflesFlamin_Hot120g-01_quex47.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699072/RufflesFlamin_Hot120g-02_wptwrg.jpg');

-- ==========================================
-- 20. Lays Flamin' Hot 110g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167931', 'Lays Flamin Hot 110g', 'Clásicas papas fritas lisas con la combinación perfecta de textura crujiente y nivel de picante Flamin Hot.', 1.60, 0.00, 12.00, 1, 'Lays', 'Flamming Hot');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699071/LaysFlamin_Hot110g-03_ct93pl.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699068/LaysFlamin_Hot110g-01_iyviqe.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699070/LaysFlamin_Hot110g-02_xzahcr.jpg');

-- ==========================================
-- 21. De Todito Flamin' Hot 145g
-- ==========================================
INSERT INTO Productos (SKU, Nombre, Descripcion, PrecioBase, PorcentajeDescuento, PorcentajeImpuesto, Activo, LineaProducto, Categoria)
VALUES ('7861011167948', 'De Todito Flamin Hot 145g', 'Mix extremo que combina Cheetos, Doritos y Ruffles, todos con el intenso sabor Flamin Hot.', 1.85, 0.00, 12.00, 1, 'De Todito', 'Flamming Hot');

SET @IdProducto = SCOPE_IDENTITY(); 

INSERT INTO ImagenesProducto (IdProducto, UrlImagen) VALUES 
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699053/DeToditoFlamin_Hot145g-01_gggwag.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699054/DeToditoFlamin_Hot145g-02_nz9arq.jpg'),
(@IdProducto, 'https://res.cloudinary.com/dpoixokof/image/upload/v1771699057/DeToditoFlamin_Hot145g-03_zf2lgi.jpg');