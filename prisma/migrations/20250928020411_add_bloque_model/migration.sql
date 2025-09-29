-- CreateTable
CREATE TABLE "bloques" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "tipoMedicion" TEXT NOT NULL,
    "temperatura" REAL NOT NULL,
    "fechaRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "bloques_nombre_key" ON "bloques"("nombre");
