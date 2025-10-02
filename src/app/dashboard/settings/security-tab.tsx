"use client"

import { useState } from "react"
import { Shield, Save, Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/dashboard/ui/button"
import { Input } from "@/components/dashboard/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/ui/card"
import { Badge } from "@/components/dashboard/ui/badge"
import { Separator } from "@/components/dashboard/ui/separator"
import { Label } from "@/components/dashboard/ui/label"

interface SecurityTabProps {
  saveStatus: "idle" | "saving" | "saved" | "error"
  onSave: () => void
}

export function SecurityTab({ saveStatus, onSave }: SecurityTabProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!password.current.trim()) errors.current = "Current password is required"
    if (!password.new.trim()) errors.new = "New password is required"
    if (password.new.length < 8) errors.new = "Password must be at least 8 characters"
    if (password.new !== password.confirm) errors.confirm = "Passwords don't match"
    
    return errors
  }

  const handleSave = () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    onSave()
  }

  return (
    <Card className="novel-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password & Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={password.current}
                onChange={(e) => {
                  setPassword({...password, current: e.target.value})
                  if (formErrors.current) {
                    setFormErrors(prev => ({...prev, current: ""}))
                  }
                }}
                className={formErrors.current ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formErrors.current && (
              <p className="text-sm text-destructive">{formErrors.current}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={password.new}
              onChange={(e) => {
                setPassword({...password, new: e.target.value})
                if (formErrors.new) {
                  setFormErrors(prev => ({...prev, new: ""}))
                }
              }}
              className={formErrors.new ? "border-destructive" : ""}
            />
            {formErrors.new && (
              <p className="text-sm text-destructive">{formErrors.new}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={password.confirm}
              onChange={(e) => {
                setPassword({...password, confirm: e.target.value})
                if (formErrors.confirm) {
                  setFormErrors(prev => ({...prev, confirm: ""}))
                }
              }}
              className={formErrors.confirm ? "border-destructive" : ""}
            />
            {formErrors.confirm && (
              <p className="text-sm text-destructive">{formErrors.confirm}</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {password.new && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Password Strength</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => {
                  const strength = Math.min(4, Math.floor(password.new.length / 3))
                  return (
                    <div
                      key={level}
                      className={`h-2 w-full rounded ${
                        level <= strength
                          ? strength === 1
                            ? "bg-red-500"
                            : strength === 2
                            ? "bg-yellow-500"
                            : strength === 3
                            ? "bg-blue-500"
                            : "bg-green-500"
                          : "bg-muted"
                      }`}
                    />
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {password.new.length < 6
                  ? "Weak"
                  : password.new.length < 9
                  ? "Fair"
                  : password.new.length < 12
                  ? "Good"
                  : "Strong"}
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Two-Factor Authentication</h3>
          <div className="flex flex-col items-center justify-center py-8 space-y-4 border rounded-lg bg-muted/20">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <h4 className="font-medium">Enhanced Security</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Two-factor authentication with SMS and authenticator apps will be available soon to secure your account.
              </p>
              <Badge variant="outline" className="mt-2">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="min-w-[120px]"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Saved!
              </>
            ) : saveStatus === "error" ? (
              <>
                <X className="h-4 w-4 text-destructive mr-2" />
                Fix errors above
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
