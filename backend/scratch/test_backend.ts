
async function testBackend() {
  try {
    console.log('Testing health check...');
    const healthRes = await fetch('http://localhost:3000/');
    const healthData = await healthRes.text();
    console.log('Health check response:', healthData);

    console.log('Testing profile creation...');
    const profileRes = await fetch('http://localhost:3000/api/farmers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop: 'Tomato',
        land_acres: 2,
        has_irrigation: true,
        has_storage: false,
        mandi: 'Kolar',
        district: 'Kolar',
        language: 'Kannada'
      })
    });
    const profileData = await profileRes.json();
    console.log('Profile creation response:', profileData);
  } catch (error: any) {
    console.error('Test failed:', error.message);
  }
}

testBackend();
