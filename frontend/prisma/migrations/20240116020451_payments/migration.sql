/*
  Warnings:

  - You are about to drop the column `link` on the `report_requests` table. All the data in the column will be lost.
  - Made the column `status` on table `report_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "report_requests" DROP COLUMN "link",
ADD COLUMN     "name" TEXT,
ALTER COLUMN "status" SET NOT NULL;

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paid_audits" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "credit_transaction_id" INTEGER,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paid_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_credit_transactions_user" ON "credit_transactions"("user_id");

-- CreateIndex
CREATE INDEX "idx_paid_audits_user" ON "paid_audits"("user_id");

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paid_audits" ADD CONSTRAINT "paid_audits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
