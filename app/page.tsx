"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, ShoppingCart, LogOut, Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface ShoppingItem {
  id: string
  name: string
  completed: boolean
  created_at: string
}

export default function ShoppingApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [authError, setAuthError] = useState("")
  const [itemsLoading, setItemsLoading] = useState(false)

  // Check if user is logged in on component mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadShoppingItems()
      } else {
        setShoppingItems([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load shopping items when user logs in
  useEffect(() => {
    if (user) {
      loadShoppingItems()
    }
  }, [user])

  const loadShoppingItems = async () => {
    if (!user) return

    setItemsLoading(true)
    try {
      const { data, error } = await supabase
        .from("shopping_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setShoppingItems(data || [])
    } catch (error) {
      console.error("Error loading shopping items:", error)
    } finally {
      setItemsLoading(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setAuthError("Tcheke email ou pou konfime kont ou!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      // Better error handling with specific messages in Haitian Creole
      let errorMessage = ""

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email oswa mo de pas ou pa bon. Eseye ankò oswa kreye yon kont nouvo."
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Ou pa konfime email ou ankò. Tcheke email ou pou klik sou lyen konfimation an."
      } else if (error.message.includes("User not found")) {
        errorMessage = "Kont sa a pa egziste. Klik sou 'Kreye youn' pou fè yon kont nouvo."
      } else if (error.message.includes("Password should be at least 6 characters")) {
        errorMessage = "Mo de pas ou dwe gen omwen 6 karaktè."
      } else if (error.message.includes("Unable to validate email address")) {
        errorMessage = "Email sa a pa valid. Tanpri antre yon email ki bon."
      } else {
        errorMessage = error.message
      }

      setAuthError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setEmail("")
    setPassword("")
    setShoppingItems([])
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from("shopping_items")
        .insert([
          {
            user_id: user.id,
            name: newItem.trim(),
            completed: false,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setShoppingItems([data, ...shoppingItems])
      setNewItem("")
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const removeItem = async (id: string) => {
    try {
      const { error } = await supabase.from("shopping_items").delete().eq("id", id)

      if (error) throw error

      setShoppingItems(shoppingItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const toggleItemCompleted = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase.from("shopping_items").update({ completed: !completed }).eq("id", id)

      if (error) throw error

      setShoppingItems(shoppingItems.map((item) => (item.id === id ? { ...item, completed: !completed } : item)))
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">App Kòmisyon</CardTitle>
            <CardDescription>
              {isSignUp ? "Kreye yon kont nouvo" : "Antre nan kont ou pou kòmanse achè"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Antre email ou"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mo de Pas</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Antre mo de pas ou"
                    className="w-full pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {authError && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{authError}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={authLoading}>
                {authLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSignUp ? "Kreye Kont" : "Antre"}
              </Button>
            </form>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Pou teste app la:</p>
              <Button
                onClick={() => {
                  setEmail("demo@example.com")
                  setPassword("demo123")
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Itilize Demo Account
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setAuthError("")
                }}
                className="text-sm"
              >
                {isSignUp ? "Ou gen yon kont deja? Antre" : "Ou pa gen kont? Kreye youn"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kòmisyon {user.email?.split("@")[0]}</h1>
                <p className="text-gray-600 text-sm">Mete bagay ou vle achè yo</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Dekonekte</span>
            </Button>
          </div>
        </div>

        {/* Add Item Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Mete Nouvo Bagay</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addItem} className="flex space-x-2">
              <Input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Ekri bagay ou vle achè a (diri, lèt, mayi...)"
                className="flex-1"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Mete
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Kòmisyon Ou</span>
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                {shoppingItems.length} bagay
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
                <p className="text-gray-500">Ap chaje lis ou a...</p>
              </div>
            ) : shoppingItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Ou poko gen anyen nan lis ou a</p>
                <p className="text-sm">Mete premye bagay ou vle achè a!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {shoppingItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      item.completed ? "bg-green-50 border border-green-200" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItemCompleted(item.id, item.completed)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {item.completed && <span className="text-xs">✓</span>}
                      </button>
                      <span
                        className={`font-medium capitalize ${
                          item.completed ? "text-green-700 line-through" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
