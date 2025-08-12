module.exports = {
  async before(ctx, events, done) {
    const rand = Date.now();
    const user = {
      email: `ws-${rand}@example.com`,
      password: 'password123',
      displayName: 'WS'
    };
    await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    const loginRes = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password })
    });
    const loginData = await loginRes.json();
    ctx.vars.token = loginData.accessToken;
    const roomRes = await fetch('http://localhost:5000/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.vars.token}`
      },
      body: JSON.stringify({ name: `room-${rand}` })
    });
    const room = await roomRes.json();
    ctx.vars.roomId = room.id;
    return done();
  }
};
