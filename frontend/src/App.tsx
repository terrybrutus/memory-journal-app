import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import Timeline from './pages/Timeline';
import SharedMemory from './pages/SharedMemory';
import './index.css';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
    component: () => (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <QueryClientProvider client={queryClient}>
                <div className="min-h-screen bg-background">
                    <Timeline />
                    <Toaster />
                </div>
            </QueryClientProvider>
        </ThemeProvider>
    ),
});

const timelineRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Timeline,
});

const sharedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/shared/$linkId',
    component: SharedMemory,
});

const routeTree = rootRoute.addChildren([timelineRoute, sharedRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
