import React from 'react'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, PenBox } from 'lucide-react';

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
                <Image 
                    src={"/logo.png"}
                    alt="Cashence Logo"
                    width={200}
                    height={60}
                    className="h-12 w-auto object-contain"
                />
            </Link>

            <div className="flex items-center space-x-4">
                <SignedIn>
                    {/*dashboard button*/}
                    <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                        <Button variant="outline">
                            <LayoutDashboard size={18}/>
                                <span className="hidden md:inline">Dashboard</span>
                        </Button>
                    </Link>

                    {/*Transaction create button*/}
                    <Link href="/transaction/create">
                        <Button className="flex items-center gap-2">
                            <PenBox size={18}/>
                                <span className="hidden md:inline">Add Transaction</span>
                        </Button>
                    </Link>
                </SignedIn>

                <SignedOut>
                    <SignInButton forceRedirectUrl="/dashboard">
                        <Button variant="outline">Login</Button>
                    </SignInButton>
                </SignedOut>

                <SignedIn>
                    <UserButton appearance={{
                        elements:{
                            avatarBox: "h-12 w-12",
                        }
                    }}/>
                </SignedIn>
            </div>
        </nav>
    </div>
  )
}

export default Header;