"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { QrCode, AlertCircle, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import getQrCode from "@/services/qr-code/get-qr-code"
import getStatus from "@/services/qr-code/get-status"
import Image from "next/image"

type Step = "idle" | "checking" | "showingQR" | "connected"

interface QrCodeScannerProps {
  onAuthenticated: () => void
}

export function QrCodeScanner({ onAuthenticated }: QrCodeScannerProps) {
  const [step, setStep] = useState<Step>("idle")

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['qr-code'],
    queryFn: getQrCode,
    enabled: false,
  })

  const handleConnectQrCode = async () => {
    setStep("checking")

    try {
      const status = await getStatus()
      if (status === "ready") {
        setStep("connected")
        onAuthenticated()
      } else {
        await refetch()
        setStep("showingQR")
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err)
      setStep("idle")
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    if (step === "showingQR") {
      intervalId = setInterval(async () => {
        const status = await getStatus()
        if (status === "ready") {
          setStep("connected")
          onAuthenticated()
          clearInterval(intervalId)
        }
      }, 2000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [step, onAuthenticated])

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-md w-full mx-auto text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Autenticação do WhatsApp</h3>
        <p className="text-sm text-gray-500 mb-4">
          Para enviar mensagens, você precisa autenticar-se no WhatsApp Web escaneando o QR code.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao gerar QR Code <br /> Reinicie a pagina</AlertTitle>
          </Alert>
        )}

        {step === "idle" || step === "checking" ? (
          <Button onClick={handleConnectQrCode} className="w-full" disabled={step === "checking"}>
            {step === "checking" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando status...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Gerar QR Code
              </>
            )}
          </Button>
        ) : step === "showingQR" ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              {isLoading ? (
                <div className="flex flex-col items-center p-8">
                  <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                  <p className="text-sm text-gray-500">Gerando QR code...</p>
                </div>
              ) : (
                <>
                  {data && (
                    <div className="border border-gray-200 p-2 rounded-md mb-4">
                      <Image src={data.qrCode} alt="QR Code do WhatsApp" className="w-64 h-64" width={256} height={256} />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mb-2">Escaneie este QR code com seu WhatsApp</p>
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                    <span className="text-sm">Aguardando autenticação...</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-green-600 font-medium text-sm">
            ✅ WhatsApp conectado com sucesso!
          </div>
        )}
      </div>
    </div>
  )
}
