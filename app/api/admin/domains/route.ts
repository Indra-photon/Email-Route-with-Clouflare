import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import dbConnect from "@/lib/dbConnect";
import { Domain } from "@/app/api/models/DomainModel";

export async function GET(_request: NextRequest) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        await dbConnect();

        const domains = await Domain.find()
            .sort({ createdAt: -1 })
            .populate("workspaceId")
            .lean();

        const formatted = domains.map((d: any) => ({
            id: d._id.toString(),
            domain: d.domain,
            status: d.status,
            verifiedForSending: d.verifiedForSending || false,
            verifiedForReceiving: d.verifiedForReceiving || false,
            receivingEnabled: d.receivingEnabled || false,
            receivingEnabledAt: d.receivingEnabledAt || null,
            resendDomainId: d.resendDomainId || null,
            workspace: (d.workspaceId as any)?.name || "Unknown Workspace",
            workspaceId: (d.workspaceId as any)?._id?.toString() || null,
            workspaceOwner: (d.workspaceId as any)?.ownerUserId || null,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
        }));

        return NextResponse.json(
            { domains: formatted, total: formatted.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching admin domains:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
