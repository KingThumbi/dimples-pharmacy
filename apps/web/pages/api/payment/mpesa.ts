// /apps/web/pages/api/payment/mpesa.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { phone, amount } = req.body;

      if (!phone || !amount) {
        return res.status(400).json({ error: 'Missing phone or amount' });
      }

      const result = await processMpesaPayment(phone, amount);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error('M-Pesa Error:', error?.response?.data || error.message);
      return res.status(500).json({ error: 'M-Pesa payment failed.' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

async function processMpesaPayment(phone: string, amount: number) {
  const token = process.env.MPESA_TOKEN;
  const shortcode = '174379';
  const partyB = '123456'; // your paybill/till
  const timestamp = getTimestamp();
  const password = generatePassword(shortcode, process.env.MPESA_PASSKEY!, timestamp);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: partyB,
    PhoneNumber: phone,
    CallBackURL: 'https://yourdomain.com/api/payment/mpesa-callback',
    AccountReference: 'DimplesPharmacy',
    TransactionDesc: 'Order Payment',
  };

  const response = await axios.post(
    'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
}

function generatePassword(shortcode: string, passkey: string, timestamp: string) {
  return Buffer.from(shortcode + passkey + timestamp).toString('base64');
}
