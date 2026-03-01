import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MemoryCard from '@/components/MemoryCard';
import CreateMemoryDialog from '@/components/CreateMemoryDialog';
import SearchAndFilters from '@/components/SearchAndFilters';
import EmptyState from '@/components/EmptyState';
import VHSOverlay from '@/components/VHSOverlay';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { useMemories, useGetCallerUserProfile } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { ContentType } from '@/backend';

export default function Timeline() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedContentType, setSelectedContentType] = useState<ContentType | ''>('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const { identity } = useInternetIdentity();
    const isAuthenticated = !!identity;

    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
    const { data: memories = [], isLoading: memoriesLoading } = useMemories(
        searchTerm,
        selectedTags,
        selectedCategory,
        selectedContentType,
        showFavoritesOnly
    );

    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
    const showContent = isAuthenticated && userProfile !== null;

    const sortedMemories = [...memories].sort((a, b) => Number(b.timestamp - a.timestamp));

    if (!isAuthenticated) {
        return (
            <div className="relative min-h-screen flex flex-col">
                <VHSOverlay />
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 relative z-10 flex items-center justify-center">
                    <div className="max-w-md text-center space-y-6">
                        <div className="vhs-card p-8">
                            <h2 className="text-3xl font-bold vhs-text mb-4">Welcome to Memory Journal</h2>
                            <p className="text-muted-foreground vhs-text-small mb-6">
                                Please log in to access your private memories and start preserving your moments.
                            </p>
                            <p className="text-sm text-muted-foreground vhs-text-small">
                                Click the "Login" button in the header to get started.
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            <VHSOverlay />
            
            <Header />

            {showProfileSetup && <ProfileSetupDialog />}

            {showContent && (
                <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight vhs-text">
                                    Memory Timeline
                                </h1>
                                <p className="text-muted-foreground mt-2 vhs-text-small">
                                    Your moments, preserved in time
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                size="lg"
                                className="vhs-button gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                New Memory
                            </Button>
                        </div>

                        <SearchAndFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            selectedTags={selectedTags}
                            onTagsChange={setSelectedTags}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            selectedContentType={selectedContentType}
                            onContentTypeChange={setSelectedContentType}
                            showFavoritesOnly={showFavoritesOnly}
                            onFavoritesToggle={setShowFavoritesOnly}
                        />

                        {memoriesLoading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="vhs-card h-64 animate-pulse bg-card/50"
                                    />
                                ))}
                            </div>
                        ) : sortedMemories.length === 0 ? (
                            <EmptyState
                                hasFilters={
                                    searchTerm !== '' ||
                                    selectedTags.length > 0 ||
                                    selectedCategory !== '' ||
                                    selectedContentType !== '' ||
                                    showFavoritesOnly
                                }
                                onCreateClick={() => setIsCreateOpen(true)}
                            />
                        ) : (
                            <div className="space-y-6">
                                {sortedMemories.map((memory) => (
                                    <MemoryCard key={memory.id} memory={memory} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            )}

            <Footer />

            {showContent && <CreateMemoryDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
        </div>
    );
}
