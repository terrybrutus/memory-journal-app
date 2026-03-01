import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateMemory, useAllTags, useAllCategories, useAddTag, useAddCategory } from '@/hooks/useQueries';
import { useFileUpload } from '@/blob-storage/FileStorage';
import { ContentType, FileType, type MediaFile } from '@/backend';
import { toast } from 'sonner';

interface CreateMemoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Map file extensions to FileType enum
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

export default function CreateMemoryDialog({ open, onOpenChange }: CreateMemoryDialogProps) {
    const [caption, setCaption] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [contentType, setContentType] = useState<ContentType>(ContentType.photo);
    const [files, setFiles] = useState<File[]>([]);
    const [newTag, setNewTag] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const { data: tags = [] } = useAllTags();
    const { data: categories = [] } = useAllCategories();
    const { mutate: createMemory, isPending: isCreating } = useCreateMemory();
    const { uploadFile, isUploading } = useFileUpload();
    const { mutate: addTag } = useAddTag();
    const { mutate: addCategory } = useAddCategory();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            
            // Validate file types
            const invalidFiles = fileArray.filter(file => !getFileType(file.name));
            if (invalidFiles.length > 0) {
                toast.error(`Unsupported file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
                return;
            }
            
            setFiles(fileArray);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !tags.some((t) => t.name === newTag.trim())) {
            addTag(newTag.trim(), {
                onSuccess: () => {
                    setSelectedTags([...selectedTags, newTag.trim()]);
                    setNewTag('');
                },
            });
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.some((c) => c.name === newCategory.trim())) {
            addCategory(newCategory.trim(), {
                onSuccess: () => {
                    setCategory(newCategory.trim());
                    setNewCategory('');
                },
            });
        }
    };

    const handleSubmit = async () => {
        if (!caption.trim()) {
            toast.error('Please enter a caption');
            return;
        }

        try {
            const mediaFiles: MediaFile[] = [];

            for (const file of files) {
                const fileType = getFileType(file.name);
                
                if (!fileType) {
                    toast.error(`Unsupported file type: ${file.name}`);
                    continue;
                }
                
                const path = `memories/${Date.now()}-${file.name}`;

                const { hash } = await uploadFile(path, file);

                mediaFiles.push({
                    id: `media-${Date.now()}-${Math.random()}`,
                    fileName: file.name,
                    fileType,
                    filePath: path,
                    fileHash: hash,
                });
            }

            createMemory(
                {
                    caption: caption.trim(),
                    notes: notes.trim(),
                    tags: selectedTags,
                    category,
                    mediaFiles,
                    contentType,
                },
                {
                    onSuccess: () => {
                        toast.success('Memory created successfully');
                        resetForm();
                        onOpenChange(false);
                    },
                    onError: () => {
                        toast.error('Failed to create memory');
                    },
                }
            );
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload files');
        }
    };

    const resetForm = () => {
        setCaption('');
        setNotes('');
        setSelectedTags([]);
        setCategory('');
        setContentType(ContentType.photo);
        setFiles([]);
        setNewTag('');
        setNewCategory('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto vhs-dialog">
                <DialogHeader>
                    <DialogTitle className="vhs-text">Create New Memory</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="caption" className="vhs-text-small">
                            Caption *
                        </Label>
                        <Input
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Give your memory a title..."
                            className="vhs-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="vhs-text-small">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add some details about this memory..."
                            rows={4}
                            className="vhs-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contentType" className="vhs-text-small">
                            Content Type
                        </Label>
                        <Select
                            value={contentType}
                            onValueChange={(value) => setContentType(value as ContentType)}
                        >
                            <SelectTrigger className="vhs-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ContentType.photo}>Photo</SelectItem>
                                <SelectItem value={ContentType.video}>Video</SelectItem>
                                <SelectItem value={ContentType.audio}>Audio</SelectItem>
                                <SelectItem value={ContentType.screenshot}>Screenshot</SelectItem>
                                <SelectItem value={ContentType.text}>Text</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="vhs-text-small">Category</Label>
                        <div className="flex gap-2">
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="flex-1 vhs-select">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New category..."
                                className="vhs-input"
                            />
                            <Button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={!newCategory.trim()}
                                className="vhs-button"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="vhs-text-small">Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                                    className="cursor-pointer vhs-badge"
                                    onClick={() => {
                                        if (selectedTags.includes(tag.name)) {
                                            setSelectedTags(selectedTags.filter((t) => t !== tag.name));
                                        } else {
                                            setSelectedTags([...selectedTags, tag.name]);
                                        }
                                    }}
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="New tag..."
                                className="vhs-input"
                            />
                            <Button
                                type="button"
                                onClick={handleAddTag}
                                disabled={!newTag.trim()}
                                className="vhs-button"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="files" className="vhs-text-small">
                            Media Files
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
                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file, index) => (
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
                                            onClick={() => removeFile(index)}
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
                        disabled={isCreating || isUploading}
                        className="vhs-button"
                    >
                        {isCreating || isUploading ? 'Creating...' : 'Create Memory'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
