import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MemoryEntry, Tag, Category, ContentType, MediaFile, UserProfile, Permissions } from '@/backend';

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        },
    });
}

export function useMemories(
    searchTerm: string,
    selectedTags: string[],
    selectedCategory: string,
    selectedContentType: ContentType | '',
    showFavoritesOnly: boolean
) {
    const { actor, isFetching } = useActor();

    return useQuery<MemoryEntry[]>({
        queryKey: ['memories', searchTerm, selectedTags, selectedCategory, selectedContentType, showFavoritesOnly],
        queryFn: async () => {
            if (!actor) return [];

            let memories: MemoryEntry[] = [];

            if (showFavoritesOnly) {
                memories = await actor.getFavorites();
            } else if (searchTerm) {
                memories = await actor.searchMemories(searchTerm);
            } else if (selectedTags.length > 0) {
                const results = await Promise.all(
                    selectedTags.map((tag) => actor.filterByTag(tag))
                );
                const allMemories = results.flat();
                const uniqueMemories = Array.from(
                    new Map(allMemories.map((m) => [m.id, m])).values()
                );
                memories = uniqueMemories;
            } else if (selectedCategory) {
                memories = await actor.filterByCategory(selectedCategory);
            } else if (selectedContentType) {
                memories = await actor.filterByContentType(selectedContentType);
            } else {
                memories = await actor.getAllMemories();
            }

            if (selectedContentType && !showFavoritesOnly && !searchTerm && selectedTags.length === 0 && !selectedCategory) {
                return memories;
            }

            if (selectedContentType) {
                memories = memories.filter((m) => m.contentType === selectedContentType);
            }

            if (selectedCategory && (searchTerm || selectedTags.length > 0 || showFavoritesOnly)) {
                memories = memories.filter((m) => m.category === selectedCategory);
            }

            if (selectedTags.length > 0 && (searchTerm || showFavoritesOnly || selectedCategory || selectedContentType)) {
                memories = memories.filter((m) =>
                    selectedTags.every((tag) => m.tags.includes(tag))
                );
            }

            return memories;
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAllTags() {
    const { actor, isFetching } = useActor();

    return useQuery<Tag[]>({
        queryKey: ['tags'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllTags();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAllCategories() {
    const { actor, isFetching } = useActor();

    return useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllCategories();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useCreateMemory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            caption: string;
            notes: string;
            tags: string[];
            category: string;
            mediaFiles: MediaFile[];
            contentType: ContentType;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createMemoryEntry(
                data.caption,
                data.notes,
                data.tags,
                data.category,
                data.mediaFiles,
                data.contentType
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memories'] });
        },
    });
}

export function useUpdateMemory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            id: string;
            caption: string;
            notes: string;
            tags: string[];
            category: string;
            mediaFiles: MediaFile[];
            contentType: ContentType;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateMemoryEntry(
                data.id,
                data.caption,
                data.notes,
                data.tags,
                data.category,
                data.mediaFiles,
                data.contentType
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memories'] });
        },
    });
}

export function useDeleteMemory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteMemoryEntry(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memories'] });
        },
    });
}

export function useToggleFavorite() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.toggleFavorite(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memories'] });
        },
    });
}

export function useAddTag() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addTag(name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });
}

export function useAddCategory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addCategory(name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}

export function useCreateSharedLink() {
    const { actor } = useActor();

    return useMutation({
        mutationFn: async (data: {
            memoryId: string;
            permissions: Permissions;
            expires: bigint | null;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.createSharedLink(data.memoryId, data.permissions, data.expires);
        },
    });
}

export function useAccessSharedMemory(linkId: string) {
    const { actor, isFetching } = useActor();

    return useQuery<MemoryEntry | null>({
        queryKey: ['sharedMemory', linkId],
        queryFn: async () => {
            if (!actor) return null;
            return actor.accessSharedMemory(linkId);
        },
        enabled: !!actor && !isFetching && !!linkId,
        retry: false,
    });
}

export function useEditSharedMemory() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { linkId: string; updatedMemory: MemoryEntry }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.editSharedMemory(data.linkId, data.updatedMemory);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sharedMemory', variables.linkId] });
        },
    });
}
