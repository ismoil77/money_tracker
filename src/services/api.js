/**
 * ApiService — centralized HTTP client for mokky.dev REST API.
 * 
 * All methods return parsed JSON or throw on error.
 * Easy to swap backend by changing BASE_URL.
 */

const BASE_URL = 'https://75531979cff2faa5.mokky.dev'

class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    }
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    // DELETE may return empty body
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  // ═══ TRANSACTIONS ═══

  async getTransactions() {
    return this._request('/transactions')
  }

  async createTransaction(data) {
    return this._request('/transactions', {
      method: 'POST',
      body: data,
    })
  }

  async updateTransaction(id, data) {
    return this._request(`/transactions/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async deleteTransaction(id) {
    return this._request(`/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  // ═══ BUDGET PLANS ═══

  async getPlans() {
    return this._request('/plans')
  }

  async createPlan(data) {
    return this._request('/plans', {
      method: 'POST',
      body: data,
    })
  }

  async updatePlan(id, data) {
    return this._request(`/plans/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  // ═══ SETTINGS (persisted on server) ═══

  async getSettings() {
    try {
      const list = await this._request('/settings')
      return Array.isArray(list) && list.length > 0 ? list[0] : null
    } catch {
      return null
    }
  }

  async saveSettings(data) {
    try {
      const existing = await this.getSettings()
      if (existing && existing.id) {
        return this._request(`/settings/${existing.id}`, {
          method: 'PATCH',
          body: data,
        })
      }
      return this._request('/settings', {
        method: 'POST',
        body: data,
      })
    } catch {
      return this._request('/settings', {
        method: 'POST',
        body: data,
      })
    }
  }
}

export const api = new ApiService(BASE_URL)
