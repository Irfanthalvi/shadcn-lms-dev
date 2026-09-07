import "dotenv/config";
import express from "express";
import cors from "cors";
import { adminAuth, adminDb } from "./firebaseAdmin.js";

const app = express();

const PORT = process.env.PORT || 3001;

const allowedOrigins = (
    process.env.FRONTEND_ORIGIN || "http://localhost:5173"
)
    .split(",")
    .map((origin) => origin.trim());

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS not allowed."));
        },
    })
);

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Student Portal API is running.",
    });
});

app.post("/api/admin/delete-student", async (req, res) => {
    try {
        const authorization = req.headers.authorization || "";

        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authentication token is required.",
            });
        }

        const idToken = authorization.substring(7);

        const decodedToken = await adminAuth.verifyIdToken(idToken);

        const adminUid = decodedToken.uid;

        const adminDoc = await adminDb
            .collection("users")
            .doc(adminUid)
            .get();

        if (!adminDoc.exists) {
            return res.status(403).json({
                error: "Admin profile not found.",
            });
        }

        const adminData = adminDoc.data();

        if (adminData?.role !== "admin") {
            return res.status(403).json({
                error: "Admin access required.",
            });
        }

        const { uid } = req.body;

        if (!uid || typeof uid !== "string") {
            return res.status(400).json({
                error: "Student UID is required.",
            });
        }

        if (uid === adminUid) {
            return res.status(400).json({
                error: "You cannot delete your own admin account.",
            });
        }

        const studentDoc = await adminDb
            .collection("users")
            .doc(uid)
            .get();

        if (studentDoc.exists && studentDoc.data()?.role === "admin") {
            return res.status(403).json({
                error: "Admin accounts cannot be deleted.",
            });
        }

        try {
            await adminAuth.deleteUser(uid);
        } catch (error) {
            if (error.code !== "auth/user-not-found") {
                throw error;
            }
        }

        await adminDb.collection("users").doc(uid).delete();

        return res.json({
            success: true,
            message: "Student Auth account and Firestore profile deleted.",
        });
    } catch (error) {
        console.error("Delete student error:", error);

        if (
            error.code === "auth/id-token-expired" ||
            error.code === "auth/invalid-id-token" ||
            error.code === "auth/argument-error"
        ) {
            return res.status(401).json({
                error: "Your login session is invalid or expired.",
            });
        }

        return res.status(500).json({
            error: "Failed to remove student account.",
        });
    }
});

app.use((error, req, res, next) => {
    console.error("Server error:", error);

    return res.status(500).json({
        error: error.message || "Server error.",
    });
});

app.listen(PORT, () => {
    console.log(`Student Portal API running on port ${PORT}`);
});