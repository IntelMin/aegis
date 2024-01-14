-- CreateTable
CREATE TABLE "bounties" (
    "id" SERIAL NOT NULL,
    "bounty_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,
    "max_reward" INTEGER,
    "vault_tvl" INTEGER,
    "logo" TEXT,
    "date" TIMESTAMP(3),
    "last_updated_date" TIMESTAMP(3),
    "response_time_metric_enabled" BOOLEAN NOT NULL,
    "med_response_time" INTEGER,
    "total_paid_metric_enabled" BOOLEAN NOT NULL,
    "total_paid_amount" INTEGER,
    "rating" DOUBLE PRECISION,
    "firm" JSONB NOT NULL,
    "category_list" TEXT[],
    "language_list" TEXT[],
    "source_code_list" TEXT[],
    "reference_list" TEXT[],

    CONSTRAINT "bounties_pkey" PRIMARY KEY ("id")
);
