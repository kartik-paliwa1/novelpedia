/*
  Warnings:

  - A unique constraint covering the columns `[userId,novelId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,chapterId]` on the table `ReadingHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "novelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chapter_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chapter" ("content", "createdAt", "id", "novelId", "publishedAt", "status", "title", "updatedAt", "wordCount") SELECT "content", "createdAt", "id", "novelId", "publishedAt", "status", "title", "updatedAt", "wordCount" FROM "Chapter";
DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_novelId_key" ON "Rating"("userId", "novelId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_chapterId_key" ON "ReadingHistory"("userId", "chapterId");
