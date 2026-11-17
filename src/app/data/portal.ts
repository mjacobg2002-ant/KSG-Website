/*
 * Client portal configs: one JSON file per client in /data/portal.
 * See data/portal/README.md for the fields.
 */
export type StageStatus = "complete" | "in-progress" | "upcoming";
export type PortalStage = { status: StageStatus; date?: string; daysAgo?: number; note?: string };
export type PortalClient = {
  slug: string;
  practiceName: string;
  city?: string;
  demo?: boolean;
  accessCodeSha256?: string;
  stages: { leadRescue: PortalStage; websiteBuild: PortalStage; googleAds: PortalStage };
  guarantee: {
    target?: number;
    windowDays?: number;
    adsLiveDate?: string;
    adsLiveDaysAgo?: number;
    bookedPatients: { date?: string; daysAgo?: number; source?: string }[];
  };
  links: { liveSite?: string; callLogs?: string; agreement?: string };
};

const files = import.meta.glob<PortalClient>("../../../data/portal/*.json", { eager: true, import: "default" });

export const portalClients: Record<string, PortalClient> = Object.fromEntries(
  Object.entries(files).map(([path, client]) => {
    const slug = path.split("/").pop()!.replace(/\.json$/, "");
    return [slug, { ...client, slug }];
  })
);

export const portalSlugs = Object.keys(portalClients);
