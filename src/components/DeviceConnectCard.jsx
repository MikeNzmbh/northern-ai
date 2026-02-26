import { useState } from 'react';
import { requestJson } from '../lib/api';

/**
 * Three-field form card for linking a device.
 * onSuccess is called with the DeviceStatusResponse when successful.
 */
export default function DeviceConnectCard({ apiBase, onSuccess }) {
    const [connector, setConnector] = useState('northern');
    const [instanceId, setInstanceId] = useState('');
    const [storageMode, setStorageMode] = useState('cloud');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedId = instanceId.trim();
        if (!trimmedId) {
            setError('Instance ID is required.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await requestJson(apiBase, '/auth/device-link', {
                method: 'POST',
                body: JSON.stringify({
                    connector_name: connector.trim() || 'northern',
                    instance_id: trimmedId,
                    storage_mode: storageMode,
                })
            });
            onSuccess(result);
        } catch (err) {
            if (err?.status === 409) {
                setError('This device ID is already connected to another account. Try a different Instance ID (e.g. append -2), or ask the other account holder to unlink it first.');
            } else {
                setError(err.message || 'Failed to link device.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            role="form"
            onSubmit={handleSubmit}
            className="border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 w-full animate-reveal"
            style={{ background: 'rgba(255,255,255,0.01)' }}
        >
            {/* Layout follows P6: left rail, right col */}
            <div className="flex flex-col gap-6 md:w-48 shrink-0 mono-meta pt-2">
                <label htmlFor="input-connector" className="text-[var(--text-stone)]">CONNECTOR</label>
                <label htmlFor="input-instance" className="text-[var(--text-stone)]">INSTANCE ID</label>
                <span className="text-[var(--text-stone)] pt-4">HISTORY</span>
            </div>

            <div className="flex-1 max-w-xl flex flex-col gap-6 relative z-20">
                <input
                    id="input-connector"
                    type="text"
                    value={connector}
                    onChange={(e) => setConnector(e.target.value)}
                    placeholder="northern"
                    disabled={loading}
                    className="w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                />

                <div className="flex flex-col gap-2">
                    <input
                        id="input-instance"
                        type="text"
                        value={instanceId}
                        onChange={(e) => setInstanceId(e.target.value)}
                        placeholder="my-macbook"
                        disabled={loading}
                        className="w-full bg-transparent border-b border-[var(--border-hairline)] text-[var(--text-bone)] py-1 focus:outline-none focus:border-[var(--border-focus)] transition-colors mono-meta"
                    />
                    <span className="mono-meta text-[var(--text-stone)] opacity-60">
                        Use your machine hostname or a unique identifier
                    </span>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => setStorageMode('cloud')}
                        className={`mono-meta px-4 py-2 border transition-colors ${storageMode === 'cloud'
                                ? 'border-[var(--text-bone)] text-[var(--text-ink)] shadow-[0_0_10px_rgba(242,240,237,0.1)]'
                                : 'border-[var(--border-hairline)] text-[var(--text-stone)] hover:text-[var(--text-bone)]'
                            }`}
                        disabled={loading}
                    >
                        CLOUD
                    </button>
                    <button
                        type="button"
                        onClick={() => setStorageMode('device')}
                        className={`mono-meta px-4 py-2 border transition-colors ${storageMode === 'device'
                                ? 'border-[var(--text-bone)] text-[var(--text-ink)] shadow-[0_0_10px_rgba(242,240,237,0.1)]'
                                : 'border-[var(--border-hairline)] text-[var(--text-stone)] hover:text-[var(--text-bone)]'
                            }`}
                        disabled={loading}
                    >
                        DEVICE
                    </button>
                    <span className="mono-meta text-[var(--text-shadow)] ml-2">Default: CLOUD</span>
                </div>

                {error && (
                    <div className="mt-4 p-4 border border-[var(--border-hairline)] text-[var(--text-stone)] mono-meta" aria-live="polite">
                        {error}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="mono-meta border border-[var(--border-hairline)] hover:border-[var(--border-focus)] text-[var(--text-bone)] px-6 py-3 transition-colors disabled:opacity-50 w-full md:w-auto flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>Saving<span className="w-1.5 h-3 bg-[var(--text-bone)] animate-pulse inline-block align-middle" /></>
                        ) : (
                            'Save link →'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
