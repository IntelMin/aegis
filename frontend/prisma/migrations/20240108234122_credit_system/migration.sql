/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "subscriptions";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "whitelisted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_meta" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "social_twitter" TEXT,
    "social_telegram" TEXT,
    "project_name" TEXT,
    "project_logo" TEXT,
    "project_email" TEXT,
    "project_website" TEXT,
    "project_twitter" TEXT,
    "project_telegram" TEXT,
    "project_instagram" TEXT,

    CONSTRAINT "user_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_balance" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "credit_balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_payment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "package" TEXT NOT NULL,
    "amount_eth" DOUBLE PRECISION NOT NULL,
    "credits" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_meta_user_id_key" ON "user_meta"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_balance_user_id_key" ON "credit_balance"("user_id");

-- CreateIndex
CREATE INDEX "idx_credit_balance_user" ON "credit_balance"("user_id");

-- CreateIndex
CREATE INDEX "idx_credit_payment_user" ON "credit_payment"("user_id");

-- AddForeignKey
ALTER TABLE "user_meta" ADD CONSTRAINT "user_meta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_balance" ADD CONSTRAINT "credit_balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_payment" ADD CONSTRAINT "credit_payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
