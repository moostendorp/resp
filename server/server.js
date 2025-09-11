import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many submissions from this IP, please try again later.'
});

// CSV file setup
const CSV_FILE = path.join(__dirname, 'signups.csv');
const CSV_HEADERS = [
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'email', title: 'Email' },
    { id: 'name', title: 'Name' },
    { id: 'role', title: 'Role' },
    { id: 'accreditation', title: 'Accreditation Number' },
    { id: 'comments', title: 'Comments' },
    { id: 'ip', title: 'IP Address' }
];

// Create CSV file with headers if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
    const csvWriter = createObjectCsvWriter({
        path: CSV_FILE,
        header: CSV_HEADERS
    });
    csvWriter.writeRecords([]).then(() => {
        console.log('✅ CSV file created: signups.csv');
    });
}

// Validation rules
const signupValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('role').isIn(['aspiring', 'licensed', 'provider', '']).withMessage('Invalid role'),
    body('name').optional().trim().escape(),
    body('accreditation').optional().trim().escape(),
    body('comments').optional().trim().escape()
];

// POST endpoint to save signup
app.post('/api/signup', limiter, signupValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { email, name, role, accreditation, comments } = req.body;

    // Check if email already exists
    const existingEmails = [];
    if (fs.existsSync(CSV_FILE)) {
        await new Promise((resolve) => {
            fs.createReadStream(CSV_FILE)
                .pipe(csvParser())
                .on('data', (row) => {
                    if (row.Email) existingEmails.push(row.Email.toLowerCase());
                })
                .on('end', resolve);
        });
    }

    if (existingEmails.includes(email.toLowerCase())) {
        return res.status(409).json({
            success: false,
            message: 'This email is already on the waitlist!'
        });
    }

    // Prepare data
    const signupData = {
        timestamp: new Date().toISOString(),
        email: email,
        name: name || '',
        role: role || '',
        accreditation: accreditation || '',
        comments: comments || '',
        ip: req.ip || req.connection.remoteAddress
    };

    // Write to CSV
    const csvWriter = createObjectCsvWriter({
        path: CSV_FILE,
        header: CSV_HEADERS,
        append: true
    });

    try {
        await csvWriter.writeRecords([signupData]);

        console.log(`✅ New signup: ${email} (${role})`);

        res.json({
            success: true,
            message: 'Thank you for joining our waitlist! We\'ll be in touch soon.'
        });
    } catch (error) {
        console.error('Error writing to CSV:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// GET endpoint to count signups (optional - for display)
app.get('/api/signup-count', async (req, res) => {
    let count = 0;

    if (fs.existsSync(CSV_FILE)) {
        await new Promise((resolve) => {
            fs.createReadStream(CSV_FILE)
                .pipe(csvParser())
                .on('data', () => count++)
                .on('end', resolve);
        });
    }

    res.json({ count: count - 1 }); // Subtract 1 for header row
});

// GET endpoint to download CSV (protected - add authentication in production)
app.get('/api/download-signups', (req, res) => {
    // ⚠️ Add authentication here in production!
    // For now, you can add a simple secret key check:
    const secretKey = req.query.key;
    if (secretKey !== 'madameLecturer2025') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (fs.existsSync(CSV_FILE)) {
        res.download(CSV_FILE, 'signups.csv');
    } else {
        res.status(404).json({ error: 'No signups yet' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', signups_file: fs.existsSync(CSV_FILE) });
});

app.listen(PORT, () => {
    console.log(`
    🚀 Signup server running on http://localhost:${PORT}

    Endpoints:
    - POST /api/signup          - Save a new signup
    - GET  /api/signup-count    - Get total signups
    - GET  /api/download-signups?key=your-secret-key-here - Download CSV
    - GET  /api/health          - Health check

    CSV file location: ${CSV_FILE}
    `);
});
