// SafeYatra local alert server — using Fast2SMS (India-focused, no verification needed)
// Run this on your laptop during the demo — no cloud hosting needed.
//
// SETUP (one time):
//   1. Install Node.js if you don't have it: https://nodejs.org
//   2. In this folder, run:  npm install express cors node-fetch@2
//   3. Sign up free at fast2sms.com, copy your Authorization Key from the Dev API section.
//   4. Paste it below.
//   5. Run:  node server.cjs
//   6. Leave this running in a terminal window during your demo.

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// ---- Fill this in from fast2sms.com → Dev API ----
const FAST2SMS_API_KEY = 'qMnzYTec73obHLBtOir6w9N2IlkZCpvsGRmVKQAS5gxPE8hWy11XYoRpOBdn0g49MvJxe7j8kmG236Vw';
// -----------------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-alert', async (req, res) => {
  const to = req.body.to; // 10-digit Indian mobile number, no +91 prefix, e.g. "9993286348"
  const message = 'SafeYatra Alert: Heavy rain detected near Munkatiya. Route closed ahead. Nearest shelter: Gaurikund base camp.';

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_API_KEY}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${to}`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (data.return === true) {
      console.log('SMS sent, request_id:', data.request_id);
      res.json({ success: true, id: data.request_id });
    } else {
      console.error('SMS send failed:', data.message);
      res.status(500).json({ success: false, error: data.message });
    }
  } catch (err) {
    console.error('SMS send failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SafeYatra alert server running at http://localhost:${PORT}`);
  console.log('Keep this terminal window open during your demo.');
});
