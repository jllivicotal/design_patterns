-- CreateTable
CREATE TABLE "activos_fijos" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "vidaUtilMeses" INTEGER,
    "marca" TEXT,
    "modelo" TEXT,
    "serie" TEXT,
    "color" TEXT,
    "dimensiones" TEXT,
    "material" TEXT,
    "placaVehiculo" TEXT,
    "cpu" TEXT,
    "ramGB" INTEGER,
    "materialMesa" TEXT,
    "placa" TEXT,
    "ergonomica" BOOLEAN
);
