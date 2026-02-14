"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { signOutAction } from "@/app/(main)/auth-actions"

interface UserNavProps {
    email: string
    avatarUrl?: string
}

export function UserNav({ email, avatarUrl }: UserNavProps) {
    // Get user initials from email
    const getInitials = (email: string) => {
        const name = email.split('@')[0]
        return name.substring(0, 2).toUpperCase()
    }

    const handleSignOut = async () => {
        await signOutAction()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-white/10">
                        <AvatarImage src={avatarUrl} alt={email} />
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-purple-600 text-white font-semibold">
                            {getInitials(email)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">Mi Cuenta</p>
                        <p className="text-xs leading-none text-zinc-400 truncate">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                    className="text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
