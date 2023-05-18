-- CreateTable
CREATE TABLE "Pattern" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "points" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    CONSTRAINT "Pattern_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Pattern_areaId_idx" ON "Pattern"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_areaId_key" ON "Pattern"("areaId");
