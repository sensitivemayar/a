"use client";

import { useUser } from "@/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";

export default function Profile() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  if (isUserLoading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings.
          </p>
        </header>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user) {
    return (
        <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </header>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account details.
        </p>
      </header>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user.photoURL && (
                <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
              )}
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.displayName || "User"}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            User ID: {user.uid}
          </p>
           <p className="text-sm text-muted-foreground mt-2">
            Email Verified: {user.emailVerified ? 'Yes' : 'No'}
          </p>
          <Button onClick={handleSignOut} variant="destructive" className="mt-6">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
