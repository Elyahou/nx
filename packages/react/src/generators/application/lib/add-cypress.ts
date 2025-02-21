import { cypressProjectGenerator } from '@nrwl/cypress';
import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {};
  }

  return await cypressProjectGenerator(host, {
    ...options,
    name: options.e2eProjectName,
    directory: options.directory,
    project: options.projectName,
  });
}
