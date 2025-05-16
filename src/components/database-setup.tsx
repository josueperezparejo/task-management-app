"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTasks } from "@/lib/context"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

const SQL_SCRIPT = `-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Completada')),
  priority TEXT NOT NULL DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON public.tasks (priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks (due_date);`

export function DatabaseSetup() {
  const { tablesExist, checkTables } = useTasks()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (tablesExist.allExist) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configuración de la base de datos</CardTitle>
        <CardDescription>
          Para usar esta aplicación, necesitas crear las tablas necesarias en tu base de datos Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="instructions">
          <TabsList className="mb-4">
            <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
            <TabsTrigger value="sql">Script SQL</TabsTrigger>
          </TabsList>
          <TabsContent value="instructions">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Inicia sesión en tu{" "}
                <a
                  href="https://app.supabase.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  panel de control de Supabase
                </a>
                .
              </li>
              <li>Selecciona tu proyecto.</li>
              <li>Ve a la sección "SQL Editor" en el menú lateral.</li>
              <li>Crea una nueva consulta haciendo clic en "New Query".</li>
              <li>Copia y pega el script SQL proporcionado en la pestaña "Script SQL".</li>
              <li>Ejecuta el script haciendo clic en "Run".</li>
              <li>
                Vuelve a esta aplicación y haz clic en "Verificar tablas" para confirmar que las tablas se han creado
                correctamente.
              </li>
            </ol>
          </TabsContent>
          <TabsContent value="sql">
            <div className="relative">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">{SQL_SCRIPT}</pre>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={() => checkTables()}>Verificar tablas</Button>
      </CardFooter>
    </Card>
  )
}
