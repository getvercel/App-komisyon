"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, ShoppingCart, LogOut } from "lucide-react"

interface ShoppingItem {
  id: number
  name: string
}

export default function ShoppingApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [currentUser, setCurrentUser] = useState("")
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (username.trim() && password.trim()) {
      setIsLoggedIn(true)
      setCurrentUser(username)
      setUsername("")
      setPassword("")
    } else {
      setLoginError("Tanpri antre non itilizatè ak mo de pas ou")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser("")
    setShoppingItems([])
    setNewItem("")
  }

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      const item: ShoppingItem = {
        id: Date.now(),
        name: newItem.trim(),
      }
      setShoppingItems([...shoppingItems, item])
      setNewItem("")
    }
  }

  const removeItem = (id: number) => {
    setShoppingItems(shoppingItems.filter((item) => item.id !== id))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">App Kòmisyon</CardTitle>
            <CardDescription>Antre nan kont ou pou kòmanse achè</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Non Itilizatè</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Antre non itilizatè ou"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mo de Pas</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Antre mo de pas ou"
                  className="w-full"
                />
              </div>
              {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Antre
              </Button>
            </form>
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
                <h1 className="text-xl font-bold text-gray-900">Kòmisyon {currentUser}</h1>
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
            {shoppingItems.length === 0 ? (
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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 capitalize">{item.name}</span>
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
