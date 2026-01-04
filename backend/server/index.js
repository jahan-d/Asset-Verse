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
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://assetverse-16573.web.app",
        "https://assetverse-16573.firebaseapp.com"
    ],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Firebase Admin Initialization (Production-Ready)
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log("Attempting Firebase Admin initialization via ENV...");
        const saContent = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
        let serviceAccount;

        try {
            if (saContent.startsWith("{")) {
                serviceAccount = JSON.parse(saContent);
            } else {
                const saPath = saContent.startsWith("./") ? saContent : `./${saContent}`;
                serviceAccount = require(saPath);
            }

            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log("Firebase Admin Initialized Successfully");
            }
        } catch (parseError) {
            console.error("Critical: Failed to parse FIREBASE_SERVICE_ACCOUNT.");
        }
    } else {
        const serviceAccount = require("./serviceAccountKey.json");
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
    }
} catch (error) {
    console.warn("Firebase Admin Init Warning:", error.message);
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Collections
const db = client.db("AssetVerse");
const usersCollection = db.collection("users");
const assetsCollection = db.collection("assets");
const requestsCollection = db.collection("requests");
const employeeAffiliationsCollection = db.collection("employeeAffiliations");
const packagesCollection = db.collection("packages");
const paymentsCollection = db.collection("payments");

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
    if (!token) return res.status(401).send({ message: "Unauthorized: No token provided" });

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decodedToken;
        next();
    } catch (error) {
        res.status(403).send({ message: "Forbidden: Invalid Token" });
    }
};

// Role Guard
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
   ROUTES
====================== */

app.get("/", (req, res) => {
    res.send({ message: "AssetVerse Server is running!", status: "OK" });
});

app.post("/jwt", verifyFirebaseToken, async (req, res) => {
    const email = req.firebaseUser.email;
    const user = await usersCollection.findOne({ email });
    const token = jwt.sign(
        { email: email, role: user?.role || "employee" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.send({ token });
});

app.post("/users", async (req, res) => {
    const { email, name, role, companyName, companyLogo, dateOfBirth, photoURL } = req.body;
    const exists = await usersCollection.findOne({ email });
    if (exists) return res.status(200).send(exists);

    const user = {
        name, email, role: role || 'employee',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        profileImage: photoURL || "",
        createdAt: new Date(),
        ...(role === 'hr' && {
            companyName: companyName || "",
            companyLogo: companyLogo || "",
            packageLimit: 5,
            currentEmployees: 0,
            subscription: "basic"
        })
    };
    const result = await usersCollection.insertOne(user);
    res.status(201).send({ ...user, _id: result.insertedId });
});

app.get("/api/users/profile", verifyJWT, async (req, res) => {
    const user = await usersCollection.findOne({ email: req.decoded.email });
    res.send(user);
});

// Assets
app.post("/api/assets", verifyJWT, requireRole("hr"), async (req, res) => {
    const asset = {
        ...req.body,
        hrEmail: req.decoded.email,
        dateAdded: new Date(),
        availableQuantity: parseInt(req.body.productQuantity)
    };
    const result = await assetsCollection.insertOne(asset);
    res.send(result);
});

app.get("/api/assets", verifyJWT, async (req, res) => {
    const { email, role } = req.decoded;
    let query = role === 'hr' ? { hrEmail: email } : {};
    if (req.query.hrEmail) query.hrEmail = req.query.hrEmail;
    if (req.query.search) query.productName = { $regex: req.query.search, $options: 'i' };
    const result = await assetsCollection.find(query).toArray();
    res.send(result);
});

// Requests
app.post("/api/requests", verifyJWT, async (req, res) => {
    const { assetId, note, assetName, assetType, assetImage, companyName, hrEmail } = req.body;
    const { email, name } = req.decoded;
    const newRequest = {
        assetId: new ObjectId(assetId),
        assetName, assetType, assetImage, companyName, hrEmail,
        requesterName: name || "Employee",
        requesterEmail: email,
        requestDate: new Date(),
        requestStatus: "pending",
        note
    };
    const result = await requestsCollection.insertOne(newRequest);
    res.send(result);
});

app.get("/api/my-assets", verifyJWT, async (req, res) => {
    const query = { requesterEmail: req.decoded.email, requestStatus: "approved" };
    if (req.query.search) query.assetName = { $regex: req.query.search, $options: 'i' };
    if (req.query.type) query.assetType = req.query.type;
    const result = await requestsCollection.find(query).toArray();
    res.send(result);
});

app.get("/api/requests", verifyJWT, requireRole('hr'), async (req, res) => {
    let query = { hrEmail: req.decoded.email };
    if (req.query.search) {
        query.$or = [
            { requesterName: { $regex: req.query.search, $options: 'i' } },
            { requesterEmail: { $regex: req.query.search, $options: 'i' } }
        ];
    }
    const result = await requestsCollection.find(query).toArray();
    res.send(result);
});

app.patch("/api/requests/:id", verifyJWT, requireRole('hr'), async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const query = { _id: new ObjectId(id) };
    const request = await requestsCollection.findOne(query);

    if (status === 'approved') {
        const hrUser = await usersCollection.findOne({ email: req.decoded.email });
        const affiliationsCount = await employeeAffiliationsCollection.countDocuments({ hrEmail: req.decoded.email });
        const isAffiliated = await employeeAffiliationsCollection.findOne({
            employeeEmail: request.requesterEmail,
            hrEmail: request.hrEmail
        });
        if (!isAffiliated && affiliationsCount >= hrUser.packageLimit) {
            return res.status(400).send({ message: "Package Limit Reached." });
        }
    }

    const result = await requestsCollection.updateOne(query, {
        $set: { requestStatus: status, approvalDate: new Date() }
    });

    if (status === 'approved' && result.modifiedCount > 0) {
        await assetsCollection.updateOne({ _id: request.assetId }, { $inc: { availableQuantity: -1 } });
        const affiliation = await employeeAffiliationsCollection.findOne({
            employeeEmail: request.requesterEmail,
            hrEmail: request.hrEmail
        });
        if (!affiliation) {
            await employeeAffiliationsCollection.insertOne({
                employeeEmail: request.requesterEmail,
                employeeName: request.requesterName,
                hrEmail: request.hrEmail,
                companyName: request.companyName,
                affiliationDate: new Date(),
                status: "active"
            });
            // Update HR's employee count
            await usersCollection.updateOne(
                { email: request.hrEmail },
                { $inc: { currentEmployees: 1 } }
            );
        }
    }
    res.send(result);
});

app.patch("/api/return-asset/:id", verifyJWT, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await requestsCollection.updateOne(query, { $set: { requestStatus: "returned" } });
    if (result.modifiedCount > 0) {
        const request = await requestsCollection.findOne(query);
        await assetsCollection.updateOne({ _id: request.assetId }, { $inc: { availableQuantity: 1 } });
    }
    res.send(result);
});

app.get("/api/my-team", verifyJWT, async (req, res) => {
    const myAffiliations = await employeeAffiliationsCollection.find({ employeeEmail: req.decoded.email }).toArray();
    if (myAffiliations.length === 0) return res.send([]);
    const hrEmails = [...new Set(myAffiliations.map(a => a.hrEmail))];
    const teamAffiliations = await employeeAffiliationsCollection.find({ hrEmail: { $in: hrEmails } }).toArray();
    const teamEmails = teamAffiliations.map(a => a.employeeEmail);
    const teamUsers = await usersCollection.find({ email: { $in: teamEmails } }).project({ name: 1, email: 1, profileImage: 1, dateOfBirth: 1, role: 1 }).toArray();
    res.send(teamUsers);
});

app.get("/api/hr/employees", verifyJWT, requireRole('hr'), async (req, res) => {
    const affiliations = await employeeAffiliationsCollection.find({ hrEmail: req.decoded.email }).toArray();
    const employees = await usersCollection.find({ email: { $in: affiliations.map(a => a.employeeEmail) } }).project({ name: 1, email: 1, profileImage: 1, dateOfBirth: 1 }).toArray();
    const result = await Promise.all(employees.map(async (emp) => {
        const assetCount = await requestsCollection.countDocuments({ requesterEmail: emp.email, hrEmail: req.decoded.email, requestStatus: "approved" });
        return { ...emp, assetCount, affiliationId: affiliations.find(a => a.employeeEmail === emp.email)._id };
    }));
    res.send(result);
});

app.delete("/api/hr/employees/:id", verifyJWT, requireRole("hr"), async (req, res) => {
    const userToRemove = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!userToRemove) return res.status(404).send({ message: "User not found" });
    const deleteResult = await employeeAffiliationsCollection.deleteOne({ employeeEmail: userToRemove.email, hrEmail: req.decoded.email });

    if (deleteResult.deletedCount > 0) {
        // Update HR's employee count
        await usersCollection.updateOne(
            { email: req.decoded.email },
            { $inc: { currentEmployees: -1 } }
        );
    }

    const requests = await requestsCollection.find({ requesterEmail: userToRemove.email, hrEmail: req.decoded.email, requestStatus: "approved" }).toArray();
    for (const r of requests) {
        await assetsCollection.updateOne({ _id: r.assetId }, { $inc: { availableQuantity: 1 } });
        await requestsCollection.updateOne({ _id: r._id }, { $set: { requestStatus: "returned" } });
    }
    res.send(deleteResult);
});

app.get("/api/packages", async (req, res) => {
    const result = await packagesCollection.find().toArray();
    res.send(result);
});

app.post("/create-checkout-session", verifyJWT, requireRole("hr"), async (req, res) => {
    const packageId = req.body.packageId;
    const targetPackage = await packagesCollection.findOne({ _id: new ObjectId(packageId) });
    if (!targetPackage) return res.status(404).send({ message: "Package not found" });

    const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: req.decoded.email,
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: `AssetVerse ${targetPackage.name} Package`,
                    description: `Limit: ${targetPackage.employeeLimit} Employees`
                },
                unit_amount: targetPackage.price * 100,
            },
            quantity: 1,
        }],
        mode: "payment",
        metadata: {
            packageId: packageId,
            userEmail: req.decoded.email
        },
        success_url: `${origin}/hr/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/hr/upgrade?canceled=true`,
    });
    res.send({ url: session.url });
});

app.post("/api/payments/verify", verifyJWT, async (req, res) => {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).send({ message: "No session ID provided" });

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const { packageId, userEmail } = session.metadata;
            const targetPackage = await packagesCollection.findOne({ _id: new ObjectId(packageId) });

            if (!targetPackage) return res.status(404).send({ message: "Package not found" });

            // Update User Subscription and Limit
            const updateResult = await usersCollection.updateOne(
                { email: userEmail },
                {
                    $set: {
                        packageLimit: targetPackage.employeeLimit,
                        subscription: targetPackage.name.toLowerCase()
                    }
                }
            );

            // Log Payment
            await paymentsCollection.insertOne({
                userEmail,
                packageId: new ObjectId(packageId),
                packageName: targetPackage.name,
                amount: targetPackage.price,
                stripeSessionId: session_id,
                date: new Date()
            });

            res.send({
                success: true,
                message: "Payment verified and account upgraded",
                package: targetPackage
            });
        } else {
            res.status(400).send({ message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).send({ message: "Verification failed" });
    }
});

async function run() {
    try {
        console.log("Assets Server is running.");
        const packageCount = await packagesCollection.countDocuments();
        if (packageCount === 0) {
            await packagesCollection.insertMany([
                { name: "Basic", price: 5, employeeLimit: 5, features: ["Asset Tracking", "Employee Management"] },
                { name: "Standard", price: 8, employeeLimit: 10, features: ["All Basic features", "Advanced Analytics"] },
                { name: "Premium", price: 15, employeeLimit: 20, features: ["All Standard features", "24/7 Support"] }
            ]);
        }
    } catch (e) {
        console.error(e);
    }
}
run();

app.listen(port, () => console.log(`Server running on ${port}`));
module.exports = app;
