"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"

interface SendStatusProps {
  isSending: boolean
  results: {
    success: string[]
    failed: string[]
  }
  totalContacts: number
  onReset: () => void
}

export function SendStatus({ isSending, results, totalContacts, onReset }: SendStatusProps) {
  const totalProcessed = results.success.length + results.failed.length
  const progressPercentage = totalContacts > 0 ? (totalProcessed / totalContacts) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Status do Envio</h3>
        <p className="text-sm text-gray-500">Acompanhe o progresso do envio das suas mensagens</p>
      </div>

      {isSending ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Enviando mensagens</h3>
              <p className="text-sm text-gray-500">Por favor, aguarde enquanto enviamos suas mensagens...</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              Processando {totalProcessed} de {totalContacts} contatos
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-md p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Enviados com Sucesso</h4>
              <p className="text-2xl font-bold text-green-600">{results.success.length}</p>
            </div>

            <div className="border rounded-md p-4 text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Falhas no Envio</h4>
              <p className="text-2xl font-bold text-red-600">{results.failed.length}</p>
            </div>
          </div>

          {results.success.length > 0 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Mensagens enviadas com sucesso</AlertTitle>
              <AlertDescription className="text-green-700">
                {results.success.length} mensagens foram enviadas com sucesso.
              </AlertDescription>
            </Alert>
          )}

          {results.failed.length > 0 && (
            <div className="space-y-2">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Falha no envio</AlertTitle>
                <AlertDescription>{results.failed.length} mensagens não puderam ser enviadas.</AlertDescription>
              </Alert>

              <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                <h4 className="font-medium mb-2 text-sm">Contatos com falha:</h4>
                <ul className="space-y-1">
                  {results.failed.map((contact, index) => (
                    <li key={index} className="text-sm py-1 border-b last:border-0 text-red-600">
                      {contact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <Button onClick={onReset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Iniciar Novo Envio
          </Button>
        </div>
      )}
    </div>
  )
}
