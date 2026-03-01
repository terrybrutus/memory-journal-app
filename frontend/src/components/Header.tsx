import { Film, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Header() {
    const { login, clear, loginStatus, identity } = useInternetIdentity();
    const queryClient = useQueryClient();

    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    const handleAuth = async () => {
        if (isAuthenticated) {
            await clear();
            queryClient.clear();
            toast.success('Logged out successfully');
        } else {
            try {
                await login();
                toast.success('Logged in successfully');
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.message === 'User is already authenticated') {
                    await clear();
                    setTimeout(() => login(), 300);
                } else {
                    toast.error('Failed to log in');
                }
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Film className="w-8 h-8 text-primary vhs-icon" />
                        <div className="absolute inset-0 vhs-glow" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight vhs-text">
                            Memory Journal
                        </h1>
                        <p className="text-xs text-muted-foreground vhs-text-small">
                            VHS Edition
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleAuth}
                    disabled={isLoggingIn}
                    variant={isAuthenticated ? 'outline' : 'default'}
                    className={isAuthenticated ? 'vhs-button-ghost' : 'vhs-button'}
                >
                    {isLoggingIn ? (
                        'Logging in...'
                    ) : isAuthenticated ? (
                        <>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                        </>
                    )}
                </Button>
            </div>
        </header>
    );
}
