const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/officer', require('./routes/officerRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/challans', require('./routes/challanRoutes'));

const PORT = process.env.PORT || 5000;

const { spawn } = require('child_process');
const path = require('path');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    // Auto-start Python ML Server alongside Node
    try {
        const mlDir = path.join(__dirname, '../ml-server');
        const venvPython = path.join(__dirname, '../venv/Scripts/python');
        console.log(`Starting Python ML Server from ${mlDir}...`);
        
        const mlServer = spawn(`"${venvPython}"`, ['app.py'], { cwd: mlDir, shell: true });

        mlServer.stdout.on('data', (data) => console.log(`[ML API] ${data.toString().trim()}`));
        mlServer.stderr.on('data', (data) => console.error(`[ML API Error] ${data.toString().trim()}`));
        
        mlServer.on('close', (code) => console.log(`ML API exited with code ${code}`));

        // Cleanup on server exit/restart
        const killChildren = () => mlServer.kill();
        process.on('exit', killChildren);
        process.on('SIGINT', () => { killChildren(); process.exit(0); });
        process.on('SIGTERM', () => { killChildren(); process.exit(0); });
        process.on('SIGUSR2', () => { killChildren(); process.exit(0); });
    } catch (err) {
        console.error(`Failed to start ML Server:`, err);
    }
});
