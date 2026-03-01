import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
    const [name, setName] = useState('');
    const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        saveProfile(
            { name: name.trim() },
            {
                onSuccess: () => {
                    toast.success('Profile created successfully');
                },
                onError: () => {
                    toast.error('Failed to create profile');
                },
            }
        );
    };

    return (
        <Dialog open={true}>
            <DialogContent className="vhs-dialog" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="vhs-text">Welcome to Memory Journal</DialogTitle>
                    <DialogDescription className="vhs-text-small">
                        Before you start preserving your memories, please tell us your name.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="vhs-text-small">
                            Your Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="vhs-input"
                            autoFocus
                        />
                    </div>
                    <Button type="submit" disabled={isPending} className="w-full vhs-button">
                        {isPending ? 'Creating Profile...' : 'Get Started'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
