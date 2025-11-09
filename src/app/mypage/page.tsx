// This page will show up at the route /mypage

import { PlasmicComponent } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '../../plasmic-init';
import PlasmicClientRootProvider from '../../plasmic-init-client';

// Using incremental static regeneration, will invalidate this page
// after 300s (no deploy webhooks needed)
export const revalidate = 300;

// Render the page or component from Plasmic.
export default async function MyPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const plasmicData = await PLASMIC.fetchComponentData('Homepage');
  const compMeta = plasmicData.entryCompMetas[0];
  
  return (
    <PlasmicClientRootProvider
      prefetchedData={plasmicData}
      pageRoute={compMeta.path}
      pageParams={compMeta.params}
      pageQuery={searchParams}
    >
      <PlasmicComponent component={compMeta.displayName} />
    </PlasmicClientRootProvider>
  );
}

