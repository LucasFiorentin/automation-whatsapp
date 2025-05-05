import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



async function getStatus() {
  try {
    const response = await axios.get(`http://localhost:3001/whatsapp/status`);

    return response.data
  } catch (error) {
    console.error('Erro ao buscar qrcode:', error);
  }
}

export default getStatus