import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  Tree,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import addJestInputs from './add-jest-inputs';

describe('15.0.0 migration (add-jest-inputs)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add inputs configuration for jest targets', async () => {
    updateWorkspaceConfiguration(tree, {
      version: 2,
      namedInputs: {
        default: ['{projectRoot}/**/*', 'sharedGlobals'],
        sharedGlobals: [],
        production: ['default'],
      },
    });
    addProjectConfiguration(tree, 'proj', {
      root: 'proj',
      targets: {
        test: {
          executor: '@nrwl/jest:jest',
          options: {},
        },
        test2: {
          executor: '@nrwl/jest:jest',
          options: {},
        },
        notTest: {
          executor: 'nx:run-commands',
        },
      },
    });
    tree.write('jest.preset.js', '');

    await addJestInputs(tree);

    const updated = readWorkspaceConfiguration(tree);
    expect(updated).toMatchInlineSnapshot(`
      Object {
        "namedInputs": Object {
          "default": Array [
            "{projectRoot}/**/*",
            "sharedGlobals",
          ],
          "production": Array [
            "default",
            "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
            "!{projectRoot}/tsconfig.spec.json",
            "!{projectRoot}/jest.config.[jt]s",
          ],
          "sharedGlobals": Array [],
        },
        "targetDefaults": Object {
          "test": Object {
            "inputs": Array [
              "default",
              "^production",
              "{workspaceRoot}/jest.preset.js",
            ],
          },
          "test2": Object {
            "inputs": Array [
              "default",
              "^production",
              "{workspaceRoot}/jest.preset.js",
            ],
          },
        },
        "version": 2,
      }
    `);
  });
});
