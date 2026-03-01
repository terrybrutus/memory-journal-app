import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground vhs-text-small">
                    <span>© 2025. Built with</span>
                    <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    <span>using</span>
                    <a
                        href="https://caffeine.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline vhs-link"
                    >
                        caffeine.ai
                    </a>
                </div>
            </div>
        </footer>
    );
}
