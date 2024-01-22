/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `credit_payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credit_payment_hash_key" ON "credit_payment"("hash");
