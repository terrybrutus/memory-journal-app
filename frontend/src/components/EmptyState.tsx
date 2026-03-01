import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    hasFilters: boolean;
    onCreateClick: () => void;
}

export default function EmptyState({ hasFilters, onCreateClick }: EmptyStateProps) {
    if (hasFilters) {
        return (
            <div className="vhs-card p-12 text-center">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 vhs-icon" />
                <h3 className="text-2xl font-bold mb-2 vhs-text">No memories found</h3>
                <p className="text-muted-foreground mb-6 vhs-text-small">
                    Try adjusting your search or filters
                </p>
            </div>
        );
    }

    return (
        <div className="vhs-card p-12 text-center">
            <div className="mb-6">
                <img
                    src="/assets/generated/empty-state-vintage-tv.png"
                    alt="Vintage TV"
                    className="w-32 h-32 mx-auto opacity-80 vhs-image"
                />
            </div>
            <h3 className="text-2xl font-bold mb-2 vhs-text">No memories yet</h3>
            <p className="text-muted-foreground mb-6 vhs-text-small max-w-md mx-auto">
                Start capturing your moments. Create your first memory entry with photos, videos,
                audio, or text.
            </p>
            <Button onClick={onCreateClick} size="lg" className="vhs-button gap-2">
                <Plus className="w-5 h-5" />
                Create Your First Memory
            </Button>
        </div>
    );
}
