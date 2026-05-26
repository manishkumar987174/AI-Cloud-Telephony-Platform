const request = require('supertest')
const app = require('../../../backend/src/app')

describe('Auth API', () => {
  it('POST /api/auth/login - should return 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(400)
  })
})