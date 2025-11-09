"use client";

import { PLASMIC } from "./plasmic-init";

export default function PlasmicClientRootProvider({
  prefetchedData,
  pageRoute,
  pageParams,
  pageQuery,
  children,
}: {
  prefetchedData?: any;
  pageRoute?: string;
  pageParams?: Record<string, any>;
  pageQuery?: Record<string, string | string[]>;
  children?: React.ReactNode;
}) {
  return (
    <PLASMIC.Provider prefetchedData={prefetchedData} pageRoute={pageRoute} pageParams={pageParams} pageQuery={pageQuery}>
      {children}
    </PLASMIC.Provider>
  );
}

