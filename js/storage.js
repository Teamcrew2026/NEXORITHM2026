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
    // Dummy data generation has been removed
  }
}

window.nexStorage = new NexorithmStorage();
