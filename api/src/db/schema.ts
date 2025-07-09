import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const users = sqliteTable('Users', {
  userId: integer('user_id').primaryKey({ autoIncrement: true }), // シーケンス
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
}, (table) => ({
  emailIdx: index('Users_email_idx').on(table.email), // emailにindex
}))

export const userAuthentications = sqliteTable('UserAuthentications', {
  id: integer('id').primaryKey({ autoIncrement: true }), // シーケンス
  userId: integer('user_id').notNull().references(() => users.userId),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
}, (table) => ({
  providerUserIdIdx: index('UserAuthentications_provider_user_id_idx').on(table.providerUserId), // provider_user_idにindex
}))

export const clips = sqliteTable('Clips', {
  clipId: text('clip_id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.userId),
  clipName: text('clip_name').notNull(),
  clipComment: text('clip_comment').notNull(),
  clipUrl: text('clip_url').notNull(),
  createDate: text('create_date').notNull().default('CURRENT_TIMESTAMP'),
  updateDate: text('update_date').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  userIdIdx: index('Clips_user_id_idx').on(table.userId), // user_idにindex
  clipNameIdx: index('Clips_clip_name_idx').on(table.clipName), // clip_nameにindex
}))

export const tags = sqliteTable('Tags', {
  tagId: text('tag_id').primaryKey(),
  tagName: text('tag_name').notNull().unique(),
  createDate: text('create_date').notNull().default('CURRENT_TIMESTAMP'),
  updateDate: text('update_date').notNull().default('CURRENT_TIMESTAMP'),
}, (table) => ({
  tagNameIdx: index('Tags_tag_name_idx').on(table.tagName), // tag_nameにindex（ユニーク制約により自動作成されるが明示）
}))

export const clipTags = sqliteTable('ClipTags', {
  clipId: text('clip_id').notNull().references(() => clips.clipId),
  tagId: text('tag_id').notNull().references(() => tags.tagId),
}, (table) => ({
  pk: primaryKey({ columns: [table.clipId, table.tagId] }), // 複合主キー
}))

export const usersRelations = relations(users, ({ many }) => ({
  clips: many(clips),
  userAuthentications: many(userAuthentications),
}))

export const userAuthenticationsRelations = relations(userAuthentications, ({ one }) => ({
  user: one(users, {
    fields: [userAuthentications.userId],
    references: [users.userId],
  }),
}))

export const clipsRelations = relations(clips, ({ one, many }) => ({
  user: one(users, {
    fields: [clips.userId],
    references: [users.userId],
  }),
  clipTags: many(clipTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  clipTags: many(clipTags),
}))

export const clipTagsRelations = relations(clipTags, ({ one }) => ({
  clip: one(clips, {
    fields: [clipTags.clipId],
    references: [clips.clipId],
  }),
  tag: one(tags, {
    fields: [clipTags.tagId],
    references: [tags.tagId],
  }),
}))