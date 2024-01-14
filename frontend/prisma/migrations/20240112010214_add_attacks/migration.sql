-- CreateTable
CREATE TABLE "attacks" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "target" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "attack_vector" TEXT NOT NULL,
    "reference" TEXT,
    "hash" TEXT NOT NULL,

    CONSTRAINT "attacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attacks_hash_key" ON "attacks"("hash");
