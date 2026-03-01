import { useState } from 'react';
import { Star, Calendar, Tag, Edit, Trash2, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MediaViewer from '@/components/MediaViewer';
import EditMemoryDialog from '@/components/EditMemoryDialog';
import { useToggleFavorite, useDeleteMemory, useCreateSharedLink } from '@/hooks/useQueries';
import type { MemoryEntry } from '@/backend';
import { toast } from 'sonner';

interface MemoryCardProps {
    memory: MemoryEntry;
}

export default function MemoryCard({ memory }: MemoryCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [sharedLink, setSharedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { mutate: toggleFavorite } = useToggleFavorite();
    const { mutate: deleteMemory, isPending: isDeleting } = useDeleteMemory();
    const { mutate: createSharedLink, isPending: isCreatingLink } = useCreateSharedLink();

    const formattedDate = new Date(Number(memory.timestamp) / 1000000).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    );

    const handleToggleFavorite = () => {
        toggleFavorite(memory.id);
    };

    const handleDelete = () => {
        deleteMemory(memory.id, {
            onSuccess: () => {
                toast.success('Memory deleted successfully');
                setIsDeleteOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete memory');
            },
        });
    };

    const handleCreateShareLink = () => {
        createSharedLink(
            {
                memoryId: memory.id,
                permissions: { canView: true, canEdit },
                expires: null,
            },
            {
                onSuccess: (linkId) => {
                    const url = `${window.location.origin}/shared/${linkId}`;
                    setSharedLink(url);
                    toast.success('Share link created successfully');
                },
                onError: () => {
                    toast.error('Failed to create share link');
                },
            }
        );
    };

    const handleCopyLink = async () => {
        if (sharedLink) {
            await navigator.clipboard.writeText(sharedLink);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareDialogClose = (open: boolean) => {
        setIsShareOpen(open);
        if (!open) {
            setSharedLink(null);
            setCanEdit(false);
            setCopied(false);
        }
    };

    return (
        <>
            <article className="vhs-card p-6 space-y-4 group">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="vhs-badge">
                                {memory.contentType}
                            </Badge>
                            {memory.category && (
                                <Badge variant="secondary" className="vhs-badge">
                                    {memory.category}
                                </Badge>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold vhs-text">{memory.caption}</h3>
                        {memory.notes && (
                            <p className="text-muted-foreground vhs-text-small">{memory.notes}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleFavorite}
                            className="vhs-button-ghost"
                        >
                            <Star
                                className={`w-5 h-5 ${memory.isFavorite ? 'fill-primary text-primary' : ''}`}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsShareOpen(true)}
                            className="vhs-button-ghost"
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditOpen(true)}
                            className="vhs-button-ghost"
                        >
                            <Edit className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsDeleteOpen(true)}
                            className="vhs-button-ghost text-destructive hover:text-destructive"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {memory.mediaFiles.length > 0 && (
                    <MediaViewer mediaFiles={memory.mediaFiles} />
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground vhs-text-small">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDate}</span>
                    </div>
                    {memory.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="w-4 h-4" />
                            {memory.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="vhs-badge-small">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </article>

            <EditMemoryDialog
                memory={memory}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />

            <Dialog open={isShareOpen} onOpenChange={handleShareDialogClose}>
                <DialogContent className="vhs-dialog">
                    <DialogHeader>
                        <DialogTitle className="vhs-text">Share Memory</DialogTitle>
                        <DialogDescription className="vhs-text-small">
                            Create a secure link to share this memory with others.
                        </DialogDescription>
                    </DialogHeader>

                    {!sharedLink ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="can-edit" className="vhs-text-small">
                                    Allow recipients to edit
                                </Label>
                                <Switch
                                    id="can-edit"
                                    checked={canEdit}
                                    onCheckedChange={setCanEdit}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground vhs-text-small">
                                {canEdit
                                    ? 'Recipients will be able to view and add content to this memory.'
                                    : 'Recipients will only be able to view this memory.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-3 bg-muted rounded-lg break-all vhs-text-small">
                                {sharedLink}
                            </div>
                            <Button
                                onClick={handleCopyLink}
                                className="w-full vhs-button"
                                variant={copied ? 'outline' : 'default'}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    <DialogFooter>
                        {!sharedLink ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => handleShareDialogClose(false)}
                                    className="vhs-button-ghost"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateShareLink}
                                    disabled={isCreatingLink}
                                    className="vhs-button"
                                >
                                    {isCreatingLink ? 'Creating...' : 'Create Link'}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => handleShareDialogClose(false)}
                                className="vhs-button"
                            >
                                Done
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="vhs-dialog">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="vhs-text">Delete Memory?</AlertDialogTitle>
                        <AlertDialogDescription className="vhs-text-small">
                            This action cannot be undone. This will permanently delete this memory
                            and all associated media files.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="vhs-button-ghost">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="vhs-button bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
