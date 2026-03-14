import { Navigate } from "react-router-dom"
import { useEffect, useState, ReactNode } from "react"
import { supabase } from "../lib/supabaseClient"

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    checkUser()
  }, [])

  if (loading) return null

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}