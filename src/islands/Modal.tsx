import { useEffect } from 'preact/hooks';

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children?: preact.ComponentChildren;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    if (!open) return null;

    return (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    class="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                    ✕
                </button>
                <h2 class="text-lg font-semibold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
}
