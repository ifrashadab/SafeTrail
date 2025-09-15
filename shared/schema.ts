import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const touristProfiles = pgTable("tourist_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  touristId: text("tourist_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  nationality: text("nationality").default("Indian"),
  travelerType: text("traveler_type").default("domestic"),
  emergencyContact1: json("emergency_contact_1").$type<{
    name: string;
    phone: string;
    relation: string;
  }>(),
  emergencyContact2: json("emergency_contact_2").$type<{
    name: string;
    phone: string;
    relation: string;
  }>(),
  accommodation: text("accommodation").notNull(), // NEW: Made accommodation mandatory
  itinerary: text("itinerary"),
  medicalConditions: text("medical_conditions"),
  languages: text("languages"),
  travelBudget: text("travel_budget"),
  profileCompleted: boolean("profile_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const digitalIds = pgTable("digital_ids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  touristProfileId: varchar("tourist_profile_id").notNull(),
  touristId: text("tourist_id").notNull().unique(),
  issueDate: text("issue_date").notNull(),
  validUntil: text("valid_until").notNull(),
  verificationLevel: text("verification_level").default("Verified"),
  blockchainHash: text("blockchain_hash").notNull(),
  status: text("status").default("Active"),
  triggers: json("triggers").$type<Array<{
    type: string;
    source: string;
    date: string;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTouristProfileSchema = createInsertSchema(touristProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDigitalIdSchema = createInsertSchema(digitalIds).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TouristProfile = typeof touristProfiles.$inferSelect;
export type InsertTouristProfile = z.infer<typeof insertTouristProfileSchema>;
export type DigitalId = typeof digitalIds.$inferSelect;
export type InsertDigitalId = z.infer<typeof insertDigitalIdSchema>;
