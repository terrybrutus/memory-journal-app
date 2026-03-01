import { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileUrl } from '@/blob-storage/FileStorage';
import type { MediaFile } from '@/backend';

interface MediaViewerProps {
    mediaFiles: MediaFile[];
}

export default function MediaViewer({ mediaFiles }: MediaViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentFile = mediaFiles[currentIndex];

    const nextMedia = () => {
        setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
    };

    const prevMedia = () => {
        setCurrentIndex((prev) => (prev - 1 + mediaFiles.length) % mediaFiles.length);
    };

    return (
        <div className="space-y-3">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden vhs-media-container">
                <MediaContent file={currentFile} />
                {mediaFiles.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={prevMedia}
                            className="absolute left-2 top-1/2 -translate-y-1/2 vhs-button-ghost bg-background/80 hover:bg-background/90"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={nextMedia}
                            className="absolute right-2 top-1/2 -translate-y-1/2 vhs-button-ghost bg-background/80 hover:bg-background/90"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </>
                )}
            </div>
            {mediaFiles.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {mediaFiles.map((file, index) => (
                        <button
                            key={file.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all vhs-dot ${
                                index === currentIndex
                                    ? 'bg-primary w-8'
                                    : 'bg-muted-foreground/30'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MediaContent({ file }: { file: MediaFile }) {
    const { data: url, isLoading } = useFileUrl(file.filePath);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground vhs-text">Loading...</div>
            </div>
        );
    }

    if (!url) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-muted-foreground vhs-text">Media not available</div>
            </div>
        );
    }

    if (file.fileType === 'jpeg' || file.fileType === 'png') {
        return (
            <img
                src={url}
                alt={file.fileName}
                className="w-full h-full object-contain vhs-image"
            />
        );
    }

    if (file.fileType === 'mp4') {
        return (
            <video
                src={url}
                controls
                className="w-full h-full vhs-video"
                preload="metadata"
            >
                Your browser does not support video playback.
            </video>
        );
    }

    if (file.fileType === 'mp3' || file.fileType === 'wav') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                <Music className="w-16 h-16 text-primary vhs-icon" />
                <audio src={url} controls className="w-full max-w-md vhs-audio">
                    Your browser does not support audio playback.
                </audio>
                <p className="text-sm text-muted-foreground vhs-text-small">{file.fileName}</p>
            </div>
        );
    }

    return null;
}
