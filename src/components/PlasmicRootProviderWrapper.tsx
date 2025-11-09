"use client";

import { PlasmicRootProvider } from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '../plasmic-init';

export default function PlasmicRootProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      {children}
    </PlasmicRootProvider>
  );
}

