export default function Footer() {
    return (
        <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Gym-Git &copy; {new Date().getFullYear()} — Dynamic Workout Planning</span>
                <span className="text-zinc-500">Built with Next.js, Tailwind CSS &amp; TypeScript</span>
            </div>
        </footer>
    );
}