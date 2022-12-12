-- CreateTable
CREATE TABLE "secrets" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secrets_reactions" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "secretId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "love" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secrets_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secrets_id_key" ON "secrets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_pId_key" ON "secrets"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_reactions_id_key" ON "secrets_reactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_reactions_pId_key" ON "secrets_reactions"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "secrets_reactions_secretId_userId_key" ON "secrets_reactions"("secretId", "userId");

-- AddForeignKey
ALTER TABLE "secrets" ADD CONSTRAINT "secrets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secrets_reactions" ADD CONSTRAINT "secrets_reactions_secretId_fkey" FOREIGN KEY ("secretId") REFERENCES "secrets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "secrets_reactions" ADD CONSTRAINT "secrets_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
