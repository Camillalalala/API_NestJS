import request from 'supertest';

describe('Gateway Routes (e2e)', () => {
  const base = 'http://localhost:3003';

  it('GET /overview returns 200', async () => {
    await request(base).get('/overview').expect(200);
  });

  it('GET /clubs/clubs proxies to clubs service', async () => {
    await request(base).get('/clubs/clubs').expect(200);
  });

  it('GET /users/users proxies to users service', async () => {
    await request(base).get('/users/users').expect(200);
  });

  it('GET /events/events proxies to events service', async () => {
    await request(base).get('/events/events').expect(200);
  });
  it('GET /notifications/notifications proxies to notifications service', async () => {
    await request(base).get('/notifications/notifications').expect(200);
  });
  it('GET /auth/auth/permissions/check/:userId proxies to auth service', async () => {
    await request(base)
      .get('/auth/auth/permissions/check/1')
      .query({ clubId: 1 })
      .expect(200);
  });
});
