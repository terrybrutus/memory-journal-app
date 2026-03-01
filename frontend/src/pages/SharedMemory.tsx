import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MediaViewer from '@/components/MediaViewer';
import VHSOverlay from '@/components/VHSOverlay';
import EditSharedMemoryDialog from '@/components/EditSharedMemoryDialog';
import { useAccessSharedMemory } from '@/hooks/useQueries';
import { Calendar, Tag } from 'lucide-react';

export default function SharedMemory() {
    const { linkId } = useParams({ from: '/shared/$linkId' });
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: memory, isLoading, error } = useAccessSharedMemory(linkId);

    const formattedDate = memory
        ? new Date(Number(memory.timestamp) / 1000000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

    return (
        <div className="relative min-h-screen flex flex-col">
            <VHSOverlay />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate({ to: '/' })}
                        className="vhs-button-ghost gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {isLoading && (
                        <div className="vhs-card h-64 animate-pulse bg-card/50" />
                    )}

                    {error && (
                        <div className="vhs-card p-8 text-center">
                            <h2 className="text-2xl font-bold vhs-text mb-4">Access Denied</h2>
                            <p className="text-muted-foreground vhs-text-small">
                                This shared link is invalid, expired, or has been revoked.
                            </p>
                        </div>
                    )}

                    {memory && (
                        <>
                            <article className="vhs-card p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="vhs-badge">
                                                <Eye className="w-3 h-3 mr-1" />
                                                Shared Memory
                                            </Badge>
                                        </div>
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
                                        <h1 className="text-3xl md:text-4xl font-bold vhs-text">
                                            {memory.caption}
                                        </h1>
                                        {memory.notes && (
                                            <p className="text-muted-foreground vhs-text-small">
                                                {memory.notes}
                                            </p>
                                        )}
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
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="vhs-badge-small"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>

                            <div className="vhs-card p-6">
                                <h3 className="text-lg font-semibold vhs-text mb-4">
                                    About Shared Memories
                                </h3>
                                <p className="text-sm text-muted-foreground vhs-text-small">
                                    This memory has been shared with you. You're viewing a snapshot of
                                    this moment in time. The owner can revoke access at any time.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />

            {memory && (
                <EditSharedMemoryDialog
                    memory={memory}
                    linkId={linkId}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </div>
    );
}
