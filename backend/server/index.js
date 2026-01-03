const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Firebase Admin Initialization
try {
    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
} catch (error) {
    console.warn("Firebase Admin Init Failed or Key Missing:", error.message);
    // Fallback: Try ENV if file fails (though file is preferred now)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            // Handle if it's a stringified JSON
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error("Env Init also failed");
        }
    }
}


const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

/* ======================
   HELPERS & MIDDLEWARE
====================== */

// Verify Custom Session JWT
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Forbidden" });
        req.decoded = decoded;
        next();
    });
};

// Verify Firebase ID Token
const verifyFirebaseToken = async (req, res, next) => {
    const { token } = req.body;

    // Quick allow for seeding/dev if needed, but per docs we want secure.
    // We'll require token.
    if (!token) return res.status(401).send({ message: "Unauthorized: No token provided" });

    try {
        if (admin.apps.length === 0) throw new Error("Firebase Admin not init");
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        console.warn("Firebase Token Verification Failed:", error.message);
        res.status(403).send({ message: "Forbidden: Invalid Firebase Token" });
    }
};

async function run() {
    try {
        // Connect to MongoDB
        // await client.connect(); 

        const db = client.db("AssetVerse");
        const usersCollection = db.collection("users");
        const assetsCollection = db.collection("assets");
        const requestsCollection = db.collection("requests");
        const employeeAffiliationsCollection = db.collection("employeeAffiliations");
        const packagesCollection = db.collection("packages");
        const paymentsCollection = db.collection("payments");

        console.log("Connected to MongoDB!");

        /* ======================
           SEEDING
        ====================== */
        const packageCount = await packagesCollection.countDocuments();
        if (packageCount === 0) {
            console.log("Seeding packages...");
            await packagesCollection.insertMany([
                { name: "Basic", price: 5, employeeLimit: 5, features: ["Asset Tracking", "Employee Management"] },
                { name: "Standard", price: 8, employeeLimit: 10, features: ["All Basic features", "Advanced Analytics"] },
                { name: "Premium", price: 15, employeeLimit: 20, features: ["All Standard features", "24/7 Support"] }
            ]);
            console.log("Packages seeded!");
        }

        /* ======================
           ROLE GUARD
        ====================== */
        const requireRole = (...roles) => {
            return async (req, res, next) => {
                const user = await usersCollection.findOne({ email: req.decoded.email });
                if (!user || !roles.includes(user.role)) {
                    return res.status(403).send({ message: "Access denied" });
                }
                next();
            };
        };

        /* ======================
           AUTH ROUTES
        ====================== */

        // Exchange Firebase Token for Session JWT
        app.post("/jwt", verifyFirebaseToken, async (req, res) => {
            const email = req.firebaseUser.email;
            const user = await usersCollection.findOne({ email });

            // If user is not in DB yet (Registering currently?), we might want to wait or fail.
            // But for registration flow, we usually call /users first.

            const token = jwt.sign(
                { email: email, role: user?.role || "employee" },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.send({ token });
        });

        // Create User (Register) - Idempotent
        app.post("/users", async (req, res) => {
            const { email, name, role, companyName, companyLogo, dateOfBirth, photoURL } = req.body;
            const exists = await usersCollection.findOne({ email });
            if (exists) {
                return res.status(200).send(exists);
            }

            const user = {
                name,
                email,
                role: role || 'employee',
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                profileImage: photoURL || "",
                createdAt: new Date(),
                // HR Specifics
                ...(role === 'hr' && {
                    companyName: companyName || "",
                    companyLogo: companyLogo || "",
                    packageLimit: 5, // Default Free
                    currentEmployees: 0,
                    subscription: "basic" // or 'free'
                })
            };

            const result = await usersCollection.insertOne(user);
            res.status(201).send({ ...user, _id: result.insertedId });
        });

        app.get("/api/users/profile", verifyJWT, async (req, res) => {
            const user = await usersCollection.findOne({ email: req.decoded.email });
            res.send(user);
        });

        /* ======================
           ASSET ROUTES (HR)
        ====================== */
        app.post("/api/assets", verifyJWT, requireRole("hr"), async (req, res) => {
            // Add Asset Logic
            const asset = {
                ...req.body,
                hrEmail: req.decoded.email,
                dateAdded: new Date(),
                availableQuantity: parseInt(req.body.productQuantity) // Initially equal to total
            };
            const result = await assetsCollection.insertOne(asset);
            res.send(result);
        });

        app.get("/api/assets", verifyJWT, async (req, res) => {
            // Get Assets (Filterable)
            // If HR, show OWN assets. If Employee, show assets of requestable companies?
            const { email, role } = req.decoded;
            let query = {};

            const user = await usersCollection.findOne({ email });

            if (role === 'hr') {
                query = { hrEmail: email };
            } else {
                // Employee logic: Show assets from affiliated companies? or all?
                // Docs: "Request an Asset (Show all assets from all company/HR posted)" ??
                // Actually usually you only see assets of companies you work for.
                // But Step 2 says "Auto-Affiliation via Asset Requests", implying you can see assets BEFORE affiliation.
                // So public asset list (or authenticated user list).
                // Check filtering params
            }

            // Basic implementation for now:
            if (req.query.hrEmail) {
                query.hrEmail = req.query.hrEmail;
            }
            // Text Search
            if (req.query.search) {
                query.productName = { $regex: req.query.search, $options: 'i' };
            }

            const result = await assetsCollection.find(query).toArray();
            res.send(result);
        });

        /* ======================
           REQUESTS & ASSIGNMENTS
        ====================== */

        // Request an Asset (Employee)
        app.post("/api/requests", verifyJWT, async (req, res) => {
            const { assetId, note, assetName, assetType, assetImage, companyName, hrEmail } = req.body;
            const { email, name } = req.decoded;

            const newRequest = {
                assetId: new ObjectId(assetId),
                assetName,
                assetType,
                assetImage,
                companyName,
                hrEmail,
                requesterName: name || "Employee",
                requesterEmail: email,
                requestDate: new Date(),
                requestStatus: "pending",
                note: note
            };

            const result = await requestsCollection.insertOne(newRequest);
            res.send(result);
        });

        // Get My Requests (Employee) - For counting or status?
        // Docs say "Request an Asset" page shows available assets. "My Assets" shows assigned.
        // "My Assets" page logic:
        app.get("/api/my-assets", verifyJWT, async (req, res) => {
            const { email } = req.decoded;
            const query = {
                requesterEmail: email,
                requestStatus: "approved" // Only show assigned/approved assets
            };
            // Also support text search/filter if needed
            if (req.query.search) {
                query.assetName = { $regex: req.query.search, $options: 'i' };
            }
            if (req.query.type) {
                query.assetType = req.query.type;
            }

            const result = await requestsCollection.find(query).toArray();
            res.send(result);
        });

        // Get All Requests (HR)
        app.get("/api/requests", verifyJWT, requireRole('hr'), async (req, res) => {
            const { email } = req.decoded; // hrEmail
            const { search, email: requesterEmail } = req.query;

            let query = { hrEmail: email };
            if (search) {
                query.$or = [
                    { requesterName: { $regex: search, $options: 'i' } },
                    { requesterEmail: { $regex: search, $options: 'i' } }
                ];
            }

            const result = await requestsCollection.find(query).toArray();
            res.send(result);
        });

        // Approve/Reject Request (HR)
        app.patch("/api/requests/:id", verifyJWT, requireRole('hr'), async (req, res) => {
            const id = req.params.id;
            const { status } = req.body; // approved / rejected

            const query = { _id: new ObjectId(id) };
            const request = await requestsCollection.findOne(query);

            if (status === 'approved') {
                // PACKAGE LIMIT CHECK
                const hrUser = await usersCollection.findOne({ email: req.decoded.email });
                const currentAffiliationsCount = await db.collection("employeeAffiliations").countDocuments({ hrEmail: req.decoded.email });

                // Check if this employee is ALREADY affiliated
                const isAffiliated = await db.collection("employeeAffiliations").findOne({
                    employeeEmail: request.requesterEmail,
                    hrEmail: request.hrEmail
                });

                if (!isAffiliated && currentAffiliationsCount >= hrUser.packageLimit) {
                    return res.status(400).send({ message: "Package Limit Reached. Please upgrade your package." });
                }
            }

            const updateDoc = {
                $set: {
                    requestStatus: status,
                    approvalDate: new Date()
                }
            };

            const result = await requestsCollection.updateOne(query, updateDoc);

            // Logic: specific requirements
            if (status === 'approved' && result.modifiedCount > 0) {
                // 1. Deduct Asset Quantity
                const request = await requestsCollection.findOne(query);
                await assetsCollection.updateOne(
                    { _id: request.assetId },
                    { $inc: { availableQuantity: -1 } }
                );

                // 2. Add to Employee Affiliation (if not exists)
                // Check if affiliation exists
                const affiliation = await db.collection("employeeAffiliations").findOne({
                    employeeEmail: request.requesterEmail,
                    hrEmail: request.hrEmail
                });

                if (!affiliation) {
                    // Auto-Affiliate
                    await db.collection("employeeAffiliations").insertOne({
                        employeeEmail: request.requesterEmail,
                        employeeName: request.requesterName,
                        hrEmail: request.hrEmail,
                        companyName: request.companyName, // derived from request
                        affiliationDate: new Date(),
                        status: "active"
                    });
                }
            }

            res.send(result);
        });

        // Return Asset (Employee)
        app.patch("/api/return-asset/:id", verifyJWT, async (req, res) => {
            const id = req.params.id;
            // Logic: status -> returned.
            // Asset Quantity -> +1
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: { requestStatus: "returned" }
            };
            const result = await requestsCollection.updateOne(query, updateDoc);

            if (result.modifiedCount > 0) {
                const request = await requestsCollection.findOne(query);
                await assetsCollection.updateOne(
                    { _id: request.assetId },
                    { $inc: { availableQuantity: 1 } }
                );
            }
            res.send(result);
        });


        // My Team (Employee)
        app.get("/api/my-team", verifyJWT, async (req, res) => {
            const { email } = req.decoded;
            // Find companies this employee is affiliated with
            const myAffiliations = await db.collection("employeeAffiliations").find({ employeeEmail: email }).toArray();
            if (myAffiliations.length === 0) return res.send([]);

            // Get unique HR emails (companies)
            const hrEmails = [...new Set(myAffiliations.map(a => a.hrEmail))];

            // Find all employees affiliated with these HRs
            const teamAffiliations = await db.collection("employeeAffiliations").find({ hrEmail: { $in: hrEmails } }).toArray();
            const teamEmails = teamAffiliations.map(a => a.employeeEmail);

            const teamUsers = await usersCollection.find({ email: { $in: teamEmails } }).project({ name: 1, email: 1, profileImage: 1, dateOfBirth: 1, role: 1 }).toArray();

            res.send(teamUsers);
        });

        // HR: Get My Employees
        app.get("/api/hr/employees", verifyJWT, requireRole('hr'), async (req, res) => {
            const { email } = req.decoded;
            // Find all affiliations for this HR
            const affiliations = await db.collection("employeeAffiliations").find({ hrEmail: email }).toArray();
            const employeeEmails = affiliations.map(a => a.employeeEmail);

            // Get User Details
            const employees = await usersCollection.find({ email: { $in: employeeEmails } }).project({ name: 1, email: 1, profileImage: 1, dateOfBirth: 1 }).toArray();

            // TODO: Add Asset Count per employee? 
            // Ideally we aggregate this. For now client can fetch or we do simple count.
            // Simple loop (inefficient for large data but fine for this scope):
            const result = await Promise.all(employees.map(async (emp) => {
                // Count approved requests/assigned assets
                // Assuming 'requests' with status 'approved' and hrEmail = current HR
                const assetCount = await requestsCollection.countDocuments({
                    requesterEmail: emp.email,
                    hrEmail: email,
                    requestStatus: "approved"
                });
                return { ...emp, assetCount, affiliationId: affiliations.find(a => a.employeeEmail === emp.email)._id };
            }));

            res.send(result);
        });

        // HR: Remove Employee from Team
        app.delete("/api/hr/employees/:id", verifyJWT, requireRole("hr"), async (req, res) => {
            const userId = req.params.id; // User ID
            const { email } = req.decoded; // HR Email

            // 1. Find the user to get email
            const userToRemove = await usersCollection.findOne({ _id: new ObjectId(userId) });
            if (!userToRemove) return res.status(404).send({ message: "User not found" });

            // 2. Remove Affiliation
            const deleteResult = await db.collection("employeeAffiliations").deleteOne({
                employeeEmail: userToRemove.email,
                hrEmail: email
            });

            // 3. Return All Assets? "all assets returned"
            // Find all approved requests for this user & HR
            const requests = await requestsCollection.find({
                requesterEmail: userToRemove.email,
                hrEmail: email,
                requestStatus: "approved"
            }).toArray();

            // Loop update (transaction better but...)
            for (const req of requests) {
                // Update Asset Stock
                await assetsCollection.updateOne(
                    { _id: req.assetId },
                    { $inc: { availableQuantity: 1 } }
                );
                // Update Request Status
                await requestsCollection.updateOne(
                    { _id: req._id },
                    { $set: { requestStatus: "returned" } }
                );
            }

            res.send(deleteResult);
        });

        /* ======================
           PACKAGES & PAYMENTS
        ====================== */
        app.get("/api/packages", async (req, res) => {
            const result = await packagesCollection.find().toArray();
            res.send(result);
        });

        app.post("/create-checkout-session", verifyJWT, requireRole("hr"), async (req, res) => {
            const { packageId } = req.body;
            const targetPackage = await packagesCollection.findOne({ _id: new ObjectId(packageId) });
            if (!targetPackage) return res.status(404).send({ message: "Package not found" });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                customer_email: req.decoded.email,
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: `AssetVerse ${targetPackage.name} Package`,
                            },
                            unit_amount: targetPackage.price * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                // Corrected URLs to match frontend router
                success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/hr/upgrade?success=true&pkg=${packageId}`,
                cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/hr/upgrade?canceled=true`,
            });

            res.send({ url: session.url });
        });

        // TODO: More routes (Requests, Employee Affiliation logic) for next phases.

    } finally {
        //
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`AssetVerse Server running on port ${port}`);
});
