// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import { auth } from "@clerk/nextjs/server";
// import { Alias } from "@/app/api/models/AliasModel";
// import { Domain } from "@/app/api/models/DomainModel";
// import { Integration } from "@/app/api/models/IntegrationModel";
// import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

// export async function GET() {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     await dbConnect();
//     const workspace = await getOrCreateWorkspaceForCurrentUser();

//     const aliases = await Alias.find({ workspaceId: workspace._id })
//       .populate("domainId")
//       .populate("integrationId")
//       .sort({ createdAt: -1 })
//       .lean()
//       .exec();

//     const data = aliases.map((a: any) => ({
//       id: a._id.toString(),
//       localPart: a.localPart,
//       email: a.email,
//       status: a.status,
//       domain: a.domainId?.domain ?? "",
//       integrationName: a.integrationId?.name ?? null,
//       integrationType: a.integrationId?.type ?? null,
//       createdAt: a.createdAt,
//     }));

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching aliases", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const body = await request.json();
//     const { domainId, localPart, integrationId } = body as {
//       domainId?: string;
//       localPart?: string;
//       integrationId?: string;
//     };

//     if (!domainId || typeof domainId !== "string") {
//       return NextResponse.json(
//         { error: "domainId is required" },
//         { status: 400 }
//       );
//     }

//     if (!localPart || typeof localPart !== "string") {
//       return NextResponse.json(
//         { error: "localPart is required" },
//         { status: 400 }
//       );
//     }

//     await dbConnect();
//     const workspace = await getOrCreateWorkspaceForCurrentUser();

//     const domain = await Domain.findOne({
//       _id: domainId,
//       workspaceId: workspace._id,
//     }).lean();

//     if (!domain) {
//       return NextResponse.json(
//         { error: "Domain not found" },
//         { status: 404 }
//       );
//     }

//     const trimmedLocalPart = localPart.trim().toLowerCase();
//     const email = `${trimmedLocalPart}@${domain.domain}`;

//     let integrationDoc: any = null;
//     if (integrationId) {
//       integrationDoc = await Integration.findOne({
//         _id: integrationId,
//         workspaceId: workspace._id,
//       }).lean();
//       if (!integrationDoc) {
//         return NextResponse.json(
//           { error: "Integration not found" },
//           { status: 404 }
//         );
//       }
//     }

//     const aliasDoc = await Alias.create({
//       workspaceId: workspace._id,
//       domainId: domainId,
//       localPart: trimmedLocalPart,
//       email,
//       status: "active",
//       integrationId: integrationDoc?._id ?? undefined,
//     });

//     console.log("🔍 Sync check:", { 
//       hasUrl: !!process.env.CF_WORKER_SYNC_URL, 
//       hasSecret: !!process.env.CF_WORKER_SYNC_SECRET,
//       url: process.env.CF_WORKER_SYNC_URL 
//     });

//     // attempt to sync this alias to the Worker KV, but don't block success if it fails
//     if (process.env.CF_WORKER_SYNC_URL && process.env.CF_WORKER_SYNC_SECRET) {
//       try {
//         const targets =
//           integrationDoc && integrationDoc.webhookUrl
//             ? [
//                 {
//                   type: integrationDoc.type,
//                   webhookUrl: integrationDoc.webhookUrl,
//                 },
//               ]
//             : [];

//         await fetch(process.env.CF_WORKER_SYNC_URL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "X-Sync-Secret": process.env.CF_WORKER_SYNC_SECRET,
//           },
//           body: JSON.stringify({
//             domain: domain.domain,
//             localPart: trimmedLocalPart,
//             workspaceId: workspace._id.toString(),
//             targets,
//           }),
//         });
//       } catch (syncError) {
//         console.error("Failed to sync alias to Worker", syncError);
//       }
//     }

//     return NextResponse.json(
//       {
//         id: aliasDoc._id.toString(),
//         localPart: aliasDoc.localPart,
//         email: aliasDoc.email,
//         status: aliasDoc.status,
//         domain: domain.domain,
//         integrationName: integrationDoc?.name ?? null,
//         integrationType: integrationDoc?.type ?? null,
//         createdAt: aliasDoc.createdAt,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating alias", error);
//     return NextResponse.json(
//       { error: "Failed to create alias" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Integration } from "@/app/api/models/IntegrationModel";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const aliases = await Alias.find({ workspaceId: workspace._id })
      .populate("domainId")
      .populate("integrationId")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const data = aliases.map((a: any) => ({
      id: a._id.toString(),
      localPart: a.localPart,
      email: a.email,
      status: a.status,
      domain: a.domainId?.domain ?? "",
      integrationId: a.integrationId?._id?.toString() ?? null,
      integrationName: a.integrationId?.name ?? null,
      integrationType: a.integrationId?.type ?? null,
      createdAt: a.createdAt,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching aliases", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { domainId, localPart, integrationId } = body as {
      domainId?: string;
      localPart?: string;
      integrationId?: string;
    };

    if (!domainId || typeof domainId !== "string") {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 }
      );
    }

    if (!localPart || typeof localPart !== "string") {
      return NextResponse.json(
        { error: "localPart is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const workspace = await getOrCreateWorkspaceForCurrentUser();

    const domain = await Domain.findOne({
      _id: domainId,
      workspaceId: workspace._id,
    }).lean();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    const trimmedLocalPart = localPart.trim().toLowerCase();
    const email = `${trimmedLocalPart}@${domain.domain}`;

    let integrationDoc: any = null;
    if (integrationId) {
      integrationDoc = await Integration.findOne({
        _id: integrationId,
        workspaceId: workspace._id,
      }).lean();
      if (!integrationDoc) {
        return NextResponse.json(
          { error: "Integration not found" },
          { status: 404 }
        );
      }
    }

    const aliasDoc = await Alias.create({
      workspaceId: workspace._id,
      domainId: domainId,
      localPart: trimmedLocalPart,
      email,
      status: "active",
      integrationId: integrationDoc?._id ?? undefined,
    });

    console.log("💾 Alias created in DB:", email);


    return NextResponse.json(
      {
        id: aliasDoc._id.toString(),
        localPart: aliasDoc.localPart,
        email: aliasDoc.email,
        status: aliasDoc.status,
        domain: domain.domain,
        integrationName: integrationDoc?.name ?? null,
        integrationType: integrationDoc?.type ?? null,
        createdAt: aliasDoc.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating alias", error);
    return NextResponse.json(
      { error: "Failed to create alias" },
      { status: 500 }
    );
  }
}