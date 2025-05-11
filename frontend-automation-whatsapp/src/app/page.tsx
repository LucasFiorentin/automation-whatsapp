"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper } from "@/components/stepper"
import { QrCodeScanner } from "@/components/qr-code-scanner"
import { ContactSelector } from "@/components/contact-selector"
import { MessageComposer } from "@/components/message-composer"
import { Button } from "@/components/ui/button"
import whatsappLogout from "@/services/whatsapp-logout/whatsapp-logout"
import Image from "next/image"
import logo from "../assets/logo.jpeg"

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [contacts, setContacts] = useState<File | null>(null)

  const steps = [
    { id: 0, title: "Autenticação", description: "Escaneie o QR code do WhatsApp" },
    { id: 1, title: "Contatos", description: "Selecione os contatos para envio" },
    { id: 2, title: "Mensagem", description: "Componha sua mensagem" },
  ]

  const handleQrCodeScanned = () => {
    setIsAuthenticated(true)
    setCurrentStep(1)
  }

  const handleContactsSelected = ({ isValid, file }: { isValid: boolean; file: File | null }) => {
    if (isValid && file) {
      setContacts(file)
      setCurrentStep(2)
    }
  }

  const handleLogout = () => {
    whatsappLogout()
    window.location.reload()
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto relative">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="rounded"
            />
            <div>
              <CardTitle className="text-xl">Envio Automático de Mensagens WhatsApp</CardTitle>
              <CardDescription className="text-sm">
                Envie mensagens para múltiplos contatos de forma automatizada
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 0 && <QrCodeScanner onAuthenticated={handleQrCodeScanned} />}

            {currentStep === 1 && isAuthenticated && <ContactSelector onContactsSelected={handleContactsSelected} />}

            {currentStep === 2 && (
              <MessageComposer
                contacts={contacts} 
              />
            )}
          </div>
        </CardContent>

        <p className="text-[12px] p-2">By Jonatas Fiorentin</p>
      </Card>
    </main>
  )
}
