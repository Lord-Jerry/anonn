-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_conversationsTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_id_key" ON "conversations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_pId_key" ON "conversations"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "_conversationsTousers_AB_unique" ON "_conversationsTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_conversationsTousers_B_index" ON "_conversationsTousers"("B");

-- AddForeignKey
ALTER TABLE "_conversationsTousers" ADD CONSTRAINT "_conversationsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationsTousers" ADD CONSTRAINT "_conversationsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
