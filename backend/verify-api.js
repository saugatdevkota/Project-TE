async function test() {
    console.log('Testing Registration...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test Setup',
            email: 'setup_' + Date.now() + '@example.com',
            password: 'password123',
            role: 'student'
        })
    });
    console.log('Register Status:', regRes.status);
    console.log('Register Body:', await regRes.text());

    console.log('\nTesting Login...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'setup_' + Date.now() + '@example.com', // This won't work because email is dynamic above
            password: 'password123'
        })
    });
    // This login test is flawed because I can't reuse the dynamic email easily in this procedural script without vars.
    // Fixed logic below:
}

async function verify() {
    const email = 'verify_' + Date.now() + '@example.com';
    const password = 'password123';

    try {
        console.log('1. Registering ' + email);
        const r1 = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Verifier', email, password, role: 'student' })
        });
        const d1 = await r1.json();
        console.log(`[${r1.status}] Register:`, d1.token ? 'SUCCESS' : 'FAILED', d1);

        if (r1.status === 201) {
            console.log('2. Logging in...');
            const r2 = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const d2 = await r2.json();
            console.log(`[${r2.status}] Login:`, d2.token ? 'SUCCESS' : 'FAILED', d2);
        }
    } catch (e) {
        console.error('Verification Error:', e);
    }
}

verify();
