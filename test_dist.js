import axios from 'axios';

async function test() {
  try {
    const { data } = await axios.post('http://localhost:5000/api/address/calculate', {
      address: "Số 123, Phường Hàng Bài, Hoàn Kiếm, Hà Nội"
    });
    console.log(data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
