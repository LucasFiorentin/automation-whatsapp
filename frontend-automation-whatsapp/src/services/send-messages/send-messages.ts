import axios from 'axios'
import FormData from 'form-data'

export async function sendMessage(
  messageType: 'text' | 'image' | 'text-image',
  file: File,
  message: string,
  image: File | null,
  name: boolean,
  startDelay: number,
  endDelay: number
) {
  try {
    const form = new FormData()
    form.append('file', file)

    if (messageType === 'text') {
      form.append('message', message)
      form.append('name', name)
      form.append('startDelay', startDelay)
      form.append('endDelay', endDelay)
      return await axios.post(
        'http://localhost:3001/whatsapp/send-messages-text',
        form
      )
    }

    if (messageType === 'image') {
      form.append('image', image as Blob)
      form.append('startDelay', startDelay)
      form.append('endDelay', endDelay)
      return await axios.post(
        'http://localhost:3001/whatsapp/send-messages-image-only',
        form
      )
    }

    if (messageType === 'text-image') {
      form.append('image', image as Blob)
      form.append('message', message)
      form.append('name', name)
      form.append('startDelay', startDelay)
      form.append('endDelay', endDelay)
      return await axios.post(
        'http://localhost:3001/whatsapp/send-messages-media-text',
        form
      )
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    throw error
  }
}
