// config/schema.ts
import { integer, pgTable, varchar, timestamp, text, json } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
});

export const SessionChatTable = pgTable('sessionChatTable',{

  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId:varchar().notNull(),
  notes:text(),
  selectedDoctor:json(),
  conversation:json(),
  report:json(),
  createdBy:varchar().references(()=>userTable.email),
  createdOn:varchar(),

})