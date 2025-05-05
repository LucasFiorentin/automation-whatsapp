import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



async function getQrCode() {
  try {
    const response = await axios.get(`http://localhost:1/whatsapp/qr-code`);

    return response.data
  } catch (error) {
    console.error('Erro ao buscar qrcode:', error);
  }
}

export default getQrCode