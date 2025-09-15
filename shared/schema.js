"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDigitalIdSchema = exports.insertTouristProfileSchema = exports.insertUserSchema = exports.digitalIds = exports.touristProfiles = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
exports.touristProfiles = (0, pg_core_1.pgTable)("tourist_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    touristId: (0, pg_core_1.text)("tourist_id").notNull().unique(),
    fullName: (0, pg_core_1.text)("full_name").notNull(),
    nationality: (0, pg_core_1.text)("nationality").default("Indian"),
    travelerType: (0, pg_core_1.text)("traveler_type").default("domestic"),
    emergencyContact1: (0, pg_core_1.json)("emergency_contact_1").$type(),
    emergencyContact2: (0, pg_core_1.json)("emergency_contact_2").$type(),
    accommodation: (0, pg_core_1.text)("accommodation").notNull(), // NEW: Made accommodation mandatory
    itinerary: (0, pg_core_1.text)("itinerary"),
    medicalConditions: (0, pg_core_1.text)("medical_conditions"),
    languages: (0, pg_core_1.text)("languages"),
    travelBudget: (0, pg_core_1.text)("travel_budget"),
    profileCompleted: (0, pg_core_1.boolean)("profile_completed").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.digitalIds = (0, pg_core_1.pgTable)("digital_ids", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    touristProfileId: (0, pg_core_1.varchar)("tourist_profile_id").notNull(),
    touristId: (0, pg_core_1.text)("tourist_id").notNull().unique(),
    issueDate: (0, pg_core_1.text)("issue_date").notNull(),
    validUntil: (0, pg_core_1.text)("valid_until").notNull(),
    verificationLevel: (0, pg_core_1.text)("verification_level").default("Verified"),
    blockchainHash: (0, pg_core_1.text)("blockchain_hash").notNull(),
    status: (0, pg_core_1.text)("status").default("Active"),
    triggers: (0, pg_core_1.json)("triggers").$type().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
exports.insertTouristProfileSchema = (0, drizzle_zod_1.createInsertSchema)(exports.touristProfiles).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.insertDigitalIdSchema = (0, drizzle_zod_1.createInsertSchema)(exports.digitalIds).omit({
    id: true,
    createdAt: true,
});
