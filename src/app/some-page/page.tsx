import { PlasmicComponent } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '../../plasmic-init';
import PlasmicClientRootProvider from '../../plasmic-init-client';

// Be sure to also fetch data for `NavHeader`
export default async function SomePage({ 
  searchParams 
}: { 
  searchParams?: Record<string, string | string[]>;
}) {
  // Fetch Plasmic component data for SomePage and NavHeader
  const plasmicData = await PLASMIC.fetchComponentData('SomePage', 'NavHeader');

  return (
    <PlasmicClientRootProvider
      prefetchedData={plasmicData}
      pageQuery={searchParams}
    >
      <PlasmicComponent component="SomePage" />
    </PlasmicClientRootProvider>
  );
}

