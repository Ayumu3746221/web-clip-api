-- CreateTable
CREATE TABLE "Users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserAuthentications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    CONSTRAINT "UserAuthentications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Clips" (
    "clip_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "clip_name" TEXT NOT NULL,
    "clip_comment" TEXT NOT NULL,
    "clip_url" TEXT NOT NULL,
    "create_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" DATETIME NOT NULL,
    CONSTRAINT "Clips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tags" (
    "tag_id" TEXT NOT NULL PRIMARY KEY,
    "tag_name" TEXT NOT NULL,
    "create_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClipTags" (
    "clip_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    PRIMARY KEY ("clip_id", "tag_id"),
    CONSTRAINT "ClipTags_clip_id_fkey" FOREIGN KEY ("clip_id") REFERENCES "Clips" ("clip_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClipTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags" ("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "UserAuthentications_provider_user_id_idx" ON "UserAuthentications"("provider_user_id");

-- CreateIndex
CREATE INDEX "Clips_user_id_idx" ON "Clips"("user_id");

-- CreateIndex
CREATE INDEX "Clips_clip_name_idx" ON "Clips"("clip_name");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_tag_name_key" ON "Tags"("tag_name");
