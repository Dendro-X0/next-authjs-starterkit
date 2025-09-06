"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // This is where you would fetch the user from your API
      // For now, we'll check localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser) as User
      }
      return null
    },
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      // This is where you would call your API to login
      // For now, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return a mock user
      return {
        id: "1",
        name: "John Doe",
        email,
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data))
      queryClient.setQueryData(["user"], data)
    },
  })

  const signupMutation = useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      // This is where you would call your API to signup
      // For now, we'll simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return a mock user
      return {
        id: "1",
        name,
        email,
      }
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // This is where you would call your API to logout
      // For now, we'll just remove from localStorage
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.removeItem("user")
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null)
    },
  })

  useEffect(() => {
    setIsLoading(isLoadingUser)
  }, [isLoadingUser])

  const login = async (email: string) => {
    await loginMutation.mutateAsync({ email })
  }

  const signup = async (name: string, email: string) => {
    await signupMutation.mutateAsync({ name, email })
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    router.push("/auth/login")
  }

  const value = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
