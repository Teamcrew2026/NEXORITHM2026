/**
 * Nexorithm 2026 - Data Storage Layer (MongoDB & Express REST API)
 * Communicates with the Node.js / MongoDB backend for real-time persistent data.
 */

class NexorithmStorage {
  constructor() {
    this.apiBase = '/api/';
  }

  async _request(path, options = {}) {
    let res;
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      };

      const token = localStorage.getItem('nex_admin_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      res = await fetch(this.apiBase + path, {
        ...options,
        headers,
        credentials: 'include'
      });
    } catch (networkErr) {
      console.error('API network failure:', networkErr);
      throw new Error('Could not reach the server. Please ensure the Node.js server is running.');
    }

    const responseText = await res.text();
    let payload;
    try {
      payload = JSON.parse(responseText);
    } catch (err) {
      console.error('Non-JSON Response:', responseText);
      throw new Error(`Server returned an invalid response (Status: ${res.status}).`);
    }

    if (!res.ok || payload.success === false) {
      throw new Error(payload.message || `Request failed (${res.status}).`);
    }

    return payload;
  }

  async saveRegistration(regData) {
    const payload = await this._request('registration', {
      method: 'POST',
      body: JSON.stringify(regData)
    });
    return payload.data || regData;
  }

  async getAllRegistrations() {
    const payload = await this._request('registration', { method: 'GET' });
    return payload.data || [];
  }

  async deleteRegistration(id) {
    await this._request('registration/delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
    return true;
  }

  async updateVerification(id, paymentVerified) {
    const payload = await this._request('registration/status', {
      method: 'POST',
      body: JSON.stringify({ id, paymentVerified })
    });
    return payload.paymentVerified;
  }

  async clearAll() {
    const all = await this.getAllRegistrations();
    for (const r of all) {
      await this.deleteRegistration(r.id);
    }
    return true;
  }

  async seedInitialDataIfEmpty() {
    const existing = await this.getAllRegistrations();
    if (existing && existing.length > 0) return;

    const sampleRegistrations = [
      {
        id: 'NX-2601',
        fullName: 'Aravind Swaminathan',
        college: 'Government College of Engineering, Tirunelveli',
        dept: 'Computer Science and Engineering',
        year: '3rd Year',
        email: 'aravind.cse@gce.edu.in',
        phone: '+91 98401 23456',
        events: ['debugging', 'hidden-quest'],
        teamSize: 2,
        teamMembers: ['Aravind S.', 'Siddharth M.'],
        amount: 150,
        paymentMethod: 'UPI / GPay',
        transactionId: 'UPI/402839281920/CR',
        screenshot: '',
        paymentVerified: true
      },
      {
        id: 'NX-2602',
        fullName: 'Pooja Ramachandran',
        college: 'National Engineering College, Kovilpatti',
        dept: 'Information Technology',
        year: 'Final Year',
        email: 'pooja.ram@nec.edu',
        phone: '+91 94432 98765',
        events: ['ai-prompt-athon', 'game-way'],
        teamSize: 2,
        teamMembers: ['Pooja R.', 'Kavitha S.'],
        amount: 150,
        paymentMethod: 'UPI / PhonePe',
        transactionId: 'PP/903829102934',
        screenshot: '',
        paymentVerified: true
      },
      {
        id: 'NX-2603',
        fullName: 'Sanjay Varma',
        college: 'Mepco Schlenk Engineering College, Sivakasi',
        dept: 'Computer Science and Engineering',
        year: '2nd Year',
        email: 'sanjay.varma@mepcoeng.ac.in',
        phone: '+91 97890 45678',
        events: ['idea-arena', 'farm-fresh-finder'],
        teamSize: 1,
        teamMembers: ['Sanjay Varma'],
        amount: 150,
        paymentMethod: 'UPI / Paytm',
        transactionId: 'PYTM/554433221100',
        screenshot: '',
        paymentVerified: true
      },
      {
        id: 'NX-2604',
        fullName: 'Rohit K. & Squad',
        college: 'Infant Jesus College of Engineering, Keelavallanadu',
        dept: 'Computer Science and Engineering',
        year: '3rd Year',
        email: 'rohit.ijce23@gmail.com',
        phone: '+91 96550 11223',
        events: ['debugging', 'art-30-min'],
        teamSize: 4,
        teamMembers: ['Rohit K.', 'Akash M.', 'Deepak R.', 'Naveen P.'],
        amount: 150,
        paymentMethod: 'UPI / GPay',
        transactionId: 'GPAY/889977665544',
        screenshot: '',
        paymentVerified: true
      },
      {
        id: 'NX-2605',
        fullName: 'Harini Sundar',
        college: 'St. Xavier’s Catholic College of Engineering, Nagercoil',
        dept: 'Artificial Intelligence & Data Science',
        year: 'Final Year',
        email: 'harini.s@sxcce.edu.in',
        phone: '+91 91590 77889',
        events: ['idea-arena', 'game-way'],
        teamSize: 3,
        teamMembers: ['Harini S.', 'Meera K.', 'Priya N.'],
        amount: 150,
        paymentMethod: 'UPI / GPay',
        transactionId: 'GPAY/990011223344',
        screenshot: '',
        paymentVerified: false
      }
    ];

    for (const rec of sampleRegistrations) {
      await this.saveRegistration(rec);
    }
  }
}

window.nexStorage = new NexorithmStorage();
