const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/address/calculate', {
      address: 'số nhà 28, Phường Hoàng Mai, Thành phố Hà Nội'
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.log('ERROR:', err.message, err.response?.data);
  }
}

test();
