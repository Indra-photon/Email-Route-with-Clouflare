"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type DomainData = {
    id: string;
    domain: string;
    status: string;
    verifiedForSending: boolean;
    verifiedForReceiving: boolean;
    receivingEnabled: boolean;
    receivingEnabledAt: string | null;
    resendDomainId: string | null;
    workspace: string;
    workspaceId: string | null;
    workspaceOwner: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function AdminDomainsPage() {
    const [domains, setDomains] = useState<DomainData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchDomains = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/domains");
            if (res.ok) {
                const data = await res.json();
                setDomains(data.domains);
            } else {
                toast.error("Failed to load domains");
            }
        } catch (error) {
            console.error("Failed to fetch domains:", error);
            toast.error("Failed to load domains");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDomains();
    }, [fetchDomains]);

    const filtered = domains.filter(
        (d) =>
            !searchTerm ||
            d.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.workspace.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string, domain: string) => {
        if (
            !confirm(
                `Delete domain "${domain}"?\n\nThis will also delete all receiving requests for this domain. This cannot be undone.`
            )
        )
            return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/domains/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete domain");
            toast.success(`Domain "${domain}" deleted`);
            setDomains((prev) => prev.filter((d) => d.id !== id));
        } catch (err: any) {
            toast.error(err.message || "Failed to delete domain");
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
            case "verified":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        ✅ {status === "active" ? "Active" : "Verified"}
                    </span>
                );
            case "pending_verification":
                return (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        ⏳ Pending Verification
                    </span>
                );
            default:
                return <span className="text-neutral-500 text-xs">{status}</span>;
        }
    };

    // Summary counts
    const totalVerified = domains.filter((d) => d.verifiedForSending).length;
    const totalReceiving = domains.filter((d) => d.receivingEnabled).length;
    const totalPending = domains.filter((d) => d.status === "pending_verification").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">All Domains</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        All domains across all workspaces
                    </p>
                </div>
                <Button onClick={fetchDomains} variant="outline" size="sm">
                    🔄 Refresh
                </Button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{domains.length}</p>
                    <p className="text-xs text-neutral-500 mt-1">Total Domains</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalVerified}</p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">Verified Sending</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalReceiving}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Receiving Enabled</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{totalPending}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Pending Verification</p>
                </div>
            </div>

            {/* Search */}
            <Input
                type="text"
                placeholder="Search domain or workspace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            {/* Table */}
            {loading ? (
                <div className="text-center py-12 text-neutral-500">Loading domains...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                    {searchTerm ? "No domains match your search" : "No domains yet"}
                </div>
            ) : (
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Domain</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Workspace</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Status</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Sending</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Receiving</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Added</th>
                                <th className="text-left p-3 font-medium text-neutral-700 dark:text-neutral-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((domain) => (
                                <tr
                                    key={domain.id}
                                    className="border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                                >
                                    <td className="p-3">
                                        <div className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                                            {domain.domain}
                                        </div>
                                        {domain.resendDomainId && (
                                            <div className="text-xs text-neutral-400 mt-0.5">Resend ID: {domain.resendDomainId}</div>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <div className="text-neutral-700 dark:text-neutral-300">{domain.workspace}</div>
                                        {domain.workspaceOwner && (
                                            <div className="text-xs text-neutral-400 mt-0.5 truncate max-w-[160px]">
                                                {domain.workspaceOwner}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">{getStatusBadge(domain.status)}</td>
                                    <td className="p-3 text-center">
                                        {domain.verifiedForSending ? (
                                            <span className="text-green-600 dark:text-green-400 text-base">✅</span>
                                        ) : (
                                            <span className="text-neutral-300 dark:text-neutral-600 text-base">⬜</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        {domain.receivingEnabled ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-green-600 dark:text-green-400 text-base">✅</span>
                                                {domain.receivingEnabledAt && (
                                                    <span className="text-xs text-neutral-400 mt-0.5">
                                                        {new Date(domain.receivingEnabledAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-neutral-300 dark:text-neutral-600 text-base">⬜</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-neutral-600 dark:text-neutral-400 text-xs">
                                        {new Date(domain.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            disabled={deletingId === domain.id}
                                            onClick={() => handleDelete(domain.id, domain.domain)}
                                        >
                                            {deletingId === domain.id ? "Deleting..." : "🗑️ Delete"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-neutral-400 text-right">
                {filtered.length} domain{filtered.length !== 1 ? "s" : ""} shown
            </p>
        </div>
    );
}
