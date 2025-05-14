/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Send, ImageIcon, AlertCircle, X, FileImage } from 'lucide-react'
import Image from 'next/image'
import { sendMessage } from '@/services/send-messages/send-messages'

interface MessageComposerProps {
  contacts: File | null
}

export function MessageComposer({ contacts }: MessageComposerProps) {
  const [messageType, setMessageType] = useState<
    'text' | 'image' | 'text-image'
  >('text')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [startDelay, setStartDelay] = useState<number>(40)
  const [endDelay, setEndDelay] = useState<number>(90)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setError(null)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }

      if (file.type === 'application/pdf') {
        reader.readAsDataURL(file)
      } else {
        reader.readAsDataURL(file)
      }
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSend = async () => {
    if (!contacts) {
      setError('Por favor, selecione um arquivo de contatos.')
      return
    }

    if (messageType === 'text' && !message.trim()) {
      setError('Por favor, digite uma mensagem.')
      return
    }

    if (messageType === 'image' && !image) {
      setError('Por favor, selecione um arquivo.')
      return
    }

    if (messageType === 'text-image' && (!message.trim() || !image)) {
      setError('Por favor, adicione tanto texto quanto arquivo.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await sendMessage(
        messageType,
        contacts,
        message,
        image,
        true,
        startDelay,
        endDelay
      )

      setSuccess('Mensagens enviadas com sucesso!')
      setMessage('')
      setImage(null)
      setImagePreview(null)
    } catch {
      setError('Erro ao enviar mensagens.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Componha sua mensagem</h3>
        <p className="text-sm text-gray-500">
          Escolha o tipo de mensagem que deseja enviar
        </p>
      </div>

      <Tabs
        defaultValue="text"
        value={messageType}
        onValueChange={(value) => setMessageType(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Apenas Texto</TabsTrigger>
          <TabsTrigger value="image">Apenas Arquivo</TabsTrigger>
          <TabsTrigger value="text-image">Texto e Arquivo</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="text-message">Mensagem</Label>
            <Textarea
              id="text-message"
              placeholder="Digite sua mensagem aqui... Use {name} para incluir o nome do contato"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px]"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Use {'name'} para personalizar a mensagem com o nome do contato
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage(message + '{name}')}
              >
                Inserir {'name'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Selecione um Arquivo</Label>
            <Input id="image-upload" type="file" onChange={handleFileChange} />
          </div>

          {imagePreview && (
            <div className="relative border rounded-md p-2 mt-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-800/70 hover:bg-gray-800"
                onClick={removeImage}
              >
                <X className="h-3 w-3 text-white" />
              </Button>
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={200}
                className="max-h-[200px] mx-auto rounded-md"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="text-image" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="combined-message">Mensagem</Label>
            <Textarea
              id="combined-message"
              placeholder="Digite sua mensagem aqui... Use {name} para incluir o nome do contato"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Use {'name'} para personalizar a mensagem com o nome do contato
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMessage(message + '{name}')}
              >
                Inserir {'name'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="combined-image">Selecione um arquivo</Label>
            <Input
              id="combined-image"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          {imagePreview && (
            <div className="relative border rounded-md p-2 mt-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-gray-800/70 hover:bg-gray-800"
                onClick={removeImage}
              >
                <X className="h-3 w-3 text-white" />
              </Button>

              {image?.type === 'application/pdf' ? (
                <iframe
                  src={imagePreview}
                  title="PDF Preview"
                  width="100%"
                  height="300"
                  className="rounded-md"
                />
              ) : (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={200}
                  className="max-h-[200px] mx-auto rounded-md"
                />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2">
        <div className="space-y-2">
          <Label htmlFor="start-delay">Intervalo de início</Label>
          <p className="font-light text-sm">(segundos)</p>
          <Input
            id="start-delay"
            type="number"
            value={startDelay}
            onChange={(e) => setStartDelay(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-delay">Intervalo final</Label>
          <p className="font-light text-sm">(segundos)</p>
          <Input
            id="end-delay"
            type="number"
            value={endDelay}
            onChange={(e) => setEndDelay(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default">
          <Send className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSend} disabled={loading} className="w-full">
        {loading ? (
          'Enviando...'
        ) : (
          <>
            {messageType === 'text' && (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
            {messageType === 'image' && (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Enviar Arquivo
              </>
            )}
            {messageType === 'text-image' && (
              <>
                <FileImage className="mr-2 h-4 w-4" />
                Enviar Texto e Arquivo
              </>
            )}
          </>
        )}
      </Button>
    </div>
  )
}
