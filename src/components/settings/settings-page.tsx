"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Shield, Bell, Eye, Trash2, Key, Smartphone, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react"
import type { User as PrismaUser } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser, updateSettings, deleteAccount } from "@/actions/user";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

export function SettingsPage() {
  const [user, setUser] = useState<PrismaUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()


  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      const fetchedUser = await getUser()
      if (fetchedUser) {
        setUser(fetchedUser)
      }
      setIsLoading(false)
    }
    fetchUser()
  }, [])

  const handleSettingsUpdate = (values: {
    emailNotifications?: boolean
    pushNotifications?: boolean
    profileVisibility?: boolean
  }) => {
    startTransition(async () => {
      const result = await updateSettings(values)
      if (result.success) {
        toast.success("Settings Updated", {
          description: "Your settings have been updated.",
        });
        const updatedUser = await getUser()
        if (updatedUser) setUser(updatedUser)
      } else {
        toast.error("Update Failed", {
          description: result.error,
        });
      }
    })
  }

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      const result = await deleteAccount()
      if (result.success) {
        toast.success("Account Deleted", {
          description: "Your account is being deleted.",
        });
        signOut({ callbackUrl: "/" })
      } else {
        toast.error("Deletion Failed", {
          description: result.error,
        });
      }
    })
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center max-w-4xl py-8 mx-auto">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container max-w-4xl py-8 mx-auto">
        <p>Could not load user settings.</p>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8 mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Separator />

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Two-Factor Authentication</p>
                  {user.isTwoFactorEnabled && <Badge variant="secondary">Enabled</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center gap-2">
                {user.isTwoFactorEnabled ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/2fa-setup">Manage</Link>
                  </Button>
                ) : (
                  <Button size="sm" asChild>
                    <Link href="/auth/2fa-setup">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Enable 2FA
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your password regularly for better security</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <ChangePasswordForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={user.emailNotifications}
                onCheckedChange={(value) => handleSettingsUpdate({ emailNotifications: value })}
                disabled={isPending}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch
                checked={user.pushNotifications}
                onCheckedChange={(value) => handleSettingsUpdate({ pushNotifications: value })}
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy and data settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={user.profileVisibility}
                onCheckedChange={(value) => handleSettingsUpdate({ profileVisibility: value })}
                disabled={isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isPending}>
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
