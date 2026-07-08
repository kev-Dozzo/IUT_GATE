import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('admin')
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return {
      ...parsed,
      role:        parsed.role        || 'editeur',
      permissions: parsed.permissions || [],
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (tokenValue, adminData) => {
    const safeAdmin = {
      ...adminData,
      role:        adminData.role        || 'editeur',
      permissions: adminData.permissions || [],
    }
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('admin', JSON.stringify(safeAdmin))
    setToken(tokenValue)
    setAdmin(safeAdmin)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    setToken(null)
    setAdmin(null)
  }

  const hasPermission = (permission) => {
    if (!admin) return false
    if (admin.role === 'super_admin') return true
    if (admin.permissions?.includes('all')) return true
    return admin.permissions?.includes(permission) || false
  }

  const isSuperAdmin = () => admin?.role === 'super_admin'

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, hasPermission, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider