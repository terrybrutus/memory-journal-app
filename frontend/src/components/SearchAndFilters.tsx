import { Search, X, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAllTags, useAllCategories } from '@/hooks/useQueries';
import { ContentType } from '@/backend';

interface SearchAndFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedContentType: ContentType | '';
    onContentTypeChange: (type: ContentType | '') => void;
    showFavoritesOnly: boolean;
    onFavoritesToggle: (value: boolean) => void;
}

export default function SearchAndFilters({
    searchTerm,
    onSearchChange,
    selectedTags,
    onTagsChange,
    selectedCategory,
    onCategoryChange,
    selectedContentType,
    onContentTypeChange,
    showFavoritesOnly,
    onFavoritesToggle,
}: SearchAndFiltersProps) {
    const { data: tags = [] } = useAllTags();
    const { data: categories = [] } = useAllCategories();

    const hasActiveFilters =
        searchTerm !== '' ||
        selectedTags.length > 0 ||
        selectedCategory !== '' ||
        selectedContentType !== '' ||
        showFavoritesOnly;

    const clearAllFilters = () => {
        onSearchChange('');
        onTagsChange([]);
        onCategoryChange('');
        onContentTypeChange('');
        onFavoritesToggle(false);
    };

    return (
        <div className="vhs-card p-6 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    placeholder="Search memories..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 vhs-input"
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[180px] vhs-select">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedContentType}
                    onValueChange={(value) => onContentTypeChange(value as ContentType | '')}
                >
                    <SelectTrigger className="w-[180px] vhs-select">
                        <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=" ">All Types</SelectItem>
                        <SelectItem value={ContentType.photo}>Photo</SelectItem>
                        <SelectItem value={ContentType.video}>Video</SelectItem>
                        <SelectItem value={ContentType.audio}>Audio</SelectItem>
                        <SelectItem value={ContentType.screenshot}>Screenshot</SelectItem>
                        <SelectItem value={ContentType.text}>Text</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant={showFavoritesOnly ? 'default' : 'outline'}
                    onClick={() => onFavoritesToggle(!showFavoritesOnly)}
                    className="vhs-button"
                >
                    <Star
                        className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`}
                    />
                    Favorites
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="vhs-button-ghost"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                            className="cursor-pointer vhs-badge"
                            onClick={() => {
                                if (selectedTags.includes(tag.name)) {
                                    onTagsChange(selectedTags.filter((t) => t !== tag.name));
                                } else {
                                    onTagsChange([...selectedTags, tag.name]);
                                }
                            }}
                        >
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
