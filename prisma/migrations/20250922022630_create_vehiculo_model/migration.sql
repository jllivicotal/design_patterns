-- CreateTable
CREATE TABLE "propietarios" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "propietarioId" INTEGER,
    "numPuertas" INTEGER,
    "traccion" TEXT,
    "capacidadTon" REAL,
    CONSTRAINT "vehiculos_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "propietarios" ("codigo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");
