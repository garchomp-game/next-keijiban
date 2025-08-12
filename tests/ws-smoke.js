module.exports = {
  async before(ctx, events) {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const rand = Date.now();
    const user = {
      email: `ws-${rand}@example.com`,
      password: 'password123',
      displayName: 'WS'
    };
    const signupRes = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!signupRes.ok) {
      throw new Error(`Signup failed: ${signupRes.status} ${await signupRes.text()}`);
    }
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password })
    });
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    }
    const loginData = await loginRes.json();
    ctx.vars.token = loginData.accessToken;
    const roomRes = await fetch(`${baseUrl}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.vars.token}`
      },
      body: JSON.stringify({ name: `room-${rand}` })
    });
    if (!roomRes.ok) {
      throw new Error(`Create room failed: ${roomRes.status} ${await roomRes.text()}`);
    }
    const room = await roomRes.json();
    ctx.vars.roomId = room.id;
  }
};
