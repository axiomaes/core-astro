import { useState } from 'preact/hooks';
import Modal from './Modal';

export default function ContactCreateModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/contacts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setIsOpen(false);
                window.location.reload();
            } else {
                const err = await res.json();
                setError(err.message || 'Error al crear el contacto');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
            >
                Nuevo Contacto
            </button>

            <Modal open={isOpen} title="Nuevo Contacto" onClose={() => setIsOpen(false)}>
                <form onSubmit={handleSubmit} class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Nombre</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            name="emailAddress"
                            required
                            class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-medium text-slate-700">Teléfono</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            class="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                    </div>

                    {error && <p class="text-sm text-red-600 font-medium">{error}</p>}

                    <div class="flex gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            class="flex-1 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Guardando...' : 'Guardar Contacto'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            class="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
