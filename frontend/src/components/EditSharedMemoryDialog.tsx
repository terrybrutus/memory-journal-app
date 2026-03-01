import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEditSharedMemory } from '@/hooks/useQueries';
import { useFileUpload } from '@/blob-storage/FileStorage';
import { FileType, type MediaFile, type MemoryEntry } from '@/backend';
import { toast } from 'sonner';

interface EditSharedMemoryDialogProps {
    memory: MemoryEntry;
    linkId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getFileType = (fileName: string): FileType | null => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
        case 'jpg':
            return FileType.jpg;
        case 'jpeg':
            return FileType.jpeg;
        case 'png':
            return FileType.png;
        case 'mp4':
            return FileType.mp4;
        case 'mp3':
            return FileType.mp3;
        case 'wav':
            return FileType.wav;
        case 'm4a':
            return FileType.m4a;
        default:
            return null;
    }
};

export default function EditSharedMemoryDialog({
    memory,
    linkId,
    open,
    onOpenChange,
}: EditSharedMemoryDialogProps) {
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const { mutate: editSharedMemory, isPending: isUpdating } = useEditSharedMemory();
    const { uploadFile, isUploading } = useFileUpload();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            
            const invalidFiles = fileArray.filter(file => !getFileType(file.name));
            if (invalidFiles.length > 0) {
                toast.error(`Unsupported file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
                return;
            }
            
            setNewFiles(fileArray);
        }
    };

    const removeNewFile = (index: number) => {
        setNewFiles(newFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const uploadedFiles: MediaFile[] = [];

            for (const file of newFiles) {
                const fileType = getFileType(file.name);
                
                if (!fileType) {
                    toast.error(`Unsupported file type: ${file.name}`);
                    continue;
                }
                
                const path = `memories/${Date.now()}-${file.name}`;
                const { hash } = await uploadFile(path, file);

                uploadedFiles.push({
                    id: `media-${Date.now()}-${Math.random()}`,
                    fileName: file.name,
                    fileType,
                    filePath: path,
                    fileHash: hash,
                });
            }

            const updatedMemory: MemoryEntry = {
                ...memory,
                mediaFiles: [...memory.mediaFiles, ...uploadedFiles],
            };

            editSharedMemory(
                { linkId, updatedMemory },
                {
                    onSuccess: () => {
                        toast.success('Memory updated successfully');
                        setNewFiles([]);
                        onOpenChange(false);
                    },
                    onError: () => {
                        toast.error('Failed to update memory');
                    },
                }
            );
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload files');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl vhs-dialog">
                <DialogHeader>
                    <DialogTitle className="vhs-text">Add Media to Shared Memory</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="files" className="vhs-text-small">
                            Add Media Files
                        </Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center vhs-upload-area">
                            <input
                                id="files"
                                type="file"
                                multiple
                                accept="image/jpeg,image/jpg,image/png,video/mp4,audio/mp3,audio/wav,audio/m4a,audio/x-m4a"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="files"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className="w-8 h-8 text-muted-foreground vhs-icon" />
                                <span className="text-sm text-muted-foreground vhs-text-small">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-muted-foreground vhs-text-small">
                                    JPEG, JPG, PNG, MP4, MP3, WAV, M4A
                                </span>
                            </label>
                        </div>
                        {newFiles.length > 0 && (
                            <div className="space-y-2">
                                {newFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-muted rounded vhs-file-item"
                                    >
                                        <span className="text-sm truncate vhs-text-small">
                                            {file.name}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeNewFile(index)}
                                            className="vhs-button-ghost"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="vhs-button-ghost"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isUpdating || isUploading || newFiles.length === 0}
                        className="vhs-button"
                    >
                        {isUpdating || isUploading ? 'Adding...' : 'Add Media'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
