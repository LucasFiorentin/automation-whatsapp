"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileSpreadsheet, AlertCircle } from "lucide-react"

interface ContactSelectorProps {
  onContactsSelected: (contacts: { isValid: boolean; file: File | null }) => void
}

export function ContactSelector({ onContactsSelected }: ContactSelectorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("excel")
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
        setError("Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleContinue = () => {
    if (!file) {
      setError("Por favor, selecione um arquivo Excel antes de continuar.")
      return
    }

    onContactsSelected({ isValid: true, file })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Selecione os contatos</h3>
        <p className="text-sm text-gray-500">Adicione os contatos para os quais deseja enviar mensagens</p>
      </div>

      <Tabs defaultValue="excel" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="excel" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Arquivo Excel</Label>
            <div className="flex items-center gap-2">
              <Input id="excel-file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="flex-1" />
            </div>
            <p className="text-xs text-gray-500">Selecione um arquivo Excel com uma coluna contendo os contatos</p>
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              <span>{file.name}</span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <Button onClick={handleContinue} className="w-full mt-4">
          Continuar
        </Button>
      </div>
    </div>
  )
}
