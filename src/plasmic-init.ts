import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional";
import { HelloWorld } from './components/HelloWorld';

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "hceuC4ges785JRiiocqdS4",  // ID of a project you are using
      token: "D7MZRXlzChWnjjc2WwqP31PDK5Mqmh45HKSPBg5YSUAtbm4IAFFyiAazeXcKWfIUWUPcYMHEzrKUUFznmwA"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})

// Register components
PLASMIC.registerComponent(HelloWorld, {
  name: 'HelloWorld',
  props: {
    verbose: 'boolean',
    children: 'slot'
  }
});
