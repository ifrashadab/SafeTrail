import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTouristProfileSchema, insertDigitalIdSchema } from "../shared/schema";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login route
  app.post("/api/login", async (req, res) => {
    try {
      const { touristId, fullName } = req.body;
      
      if (!touristId || !fullName) {
        return res.status(400).json({ message: "Tourist ID and Full Name are required" });
      }

      // Check if profile already exists
      let profile = await storage.getTouristProfile(touristId);
      
      if (!profile) {
        // Create new profile
        profile = await storage.createTouristProfile({
          touristId,
          fullName,
          nationality: "Indian",
          travelerType: "domestic",
          accommodation: "Not Provided",  // ✅ Added default value
          profileCompleted: false,
        });        
      }

      res.json({ 
        success: true, 
        profile: {
          id: profile.id,
          touristId: profile.touristId,
          fullName: profile.fullName,
          profileCompleted: profile.profileCompleted
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get profile
  app.get("/api/profile/:touristId", async (req, res) => {
    try {
      const { touristId } = req.params;
      const profile = await storage.getTouristProfile(touristId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Update profile
  app.post("/api/profile/:touristId", async (req, res) => {
    try {
      const { touristId } = req.params;
      const updateData = insertTouristProfileSchema.parse(req.body);
      
      // NEW: Validate mandatory accommodation field
      if (!updateData.accommodation || updateData.accommodation.trim().length === 0) {
        return res.status(400).json({ 
          message: "Place of Stay (accommodation) is mandatory for safety purposes" 
        });
      }
      
      const existingProfile = await storage.getTouristProfile(touristId);
      if (!existingProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const updatedProfile = await storage.updateTouristProfile(existingProfile.id, {
        ...updateData,
        profileCompleted: true,
      });

      if (!updatedProfile) {
        return res.status(404).json({ message: "Failed to update profile" });
      }

      // Generate digital ID if profile is completed
      if (updatedProfile.profileCompleted) {
        const existingDigitalId = await storage.getDigitalId(touristId);
        
        if (!existingDigitalId) {
          const issueDate = new Date().toISOString().split('T')[0];
          const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const blockchainHash = `0x${randomBytes(32).toString('hex')}`;
          
          await storage.createDigitalId({
            touristProfileId: updatedProfile.id,
            touristId,
            issueDate,
            validUntil,
            blockchainHash,
            triggers: [
              { type: "Profile Completion", source: "Safe Trail Platform", date: issueDate },
              { type: "Identity Verification", source: "North East Tourism Board", date: issueDate },
            ],
          });
        }
      }

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get digital ID
  app.get("/api/digital-id/:touristId", async (req, res) => {
    try {
      const { touristId } = req.params;
      const digitalId = await storage.getDigitalId(touristId);
      const profile = await storage.getTouristProfile(touristId);
      
      if (!digitalId || !profile) {
        return res.status(404).json({ message: "Digital ID not found" });
      }

      res.json({
        ...digitalId,
        profile: {
          fullName: profile.fullName,
          nationality: profile.nationality,
          travelerType: profile.travelerType,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get digital ID" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
