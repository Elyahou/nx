import { createTree } from '@nrwl/devkit/testing';
import { readJson, Tree, writeJson } from '@nrwl/devkit';
import { newGenerator, NormalizedSchema } from './new';
import { Linter } from '../../utils/lint';
import { Preset } from '../utils/presets';

const defaultOptions: Omit<NormalizedSchema, 'name' | 'directory' | 'appName'> =
  {
    preset: Preset.Apps,
    skipInstall: false,
    linter: Linter.EsLint,
    defaultBase: 'main',
  };

describe('new', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it('should not generate a workspace.json', async () => {
    await newGenerator(tree, {
      ...defaultOptions,
      name: 'my-workspace',
      directory: 'my-workspace',
      npmScope: 'npmScope',
      appName: 'app',
    });
    expect(tree.exists('my-workspace/workspace.json')).toBeFalsy();
  });

  it('should generate an empty nx.json', async () => {
    await newGenerator(tree, {
      ...defaultOptions,
      name: 'my-workspace',
      directory: 'my-workspace',
      npmScope: 'npmScope',
      appName: 'app',
    });
    expect(readJson(tree, 'my-workspace/nx.json')).toMatchSnapshot();
  });

  describe('--preset', () => {
    describe.each([[Preset.Empty], [Preset.Angular], [Preset.React]])(
      '%s',
      (preset) => {
        it('should generate necessary npm dependencies', async () => {
          await newGenerator(tree, {
            ...defaultOptions,
            name: 'my-workspace',
            directory: 'my-workspace',
            npmScope: 'npmScope',
            appName: 'app',
            preset,
          });

          expect(readJson(tree, 'my-workspace/package.json')).toMatchSnapshot();
        });
      }
    );
  });

  it('should not modify any existing files', async () => {
    const packageJson = {
      dependencies: {
        existing: 'latest',
      },
    };
    const eslintConfig = {
      rules: {},
    };
    writeJson(tree, 'package.json', packageJson);
    writeJson(tree, '.eslintrc.json', eslintConfig);

    await newGenerator(tree, {
      ...defaultOptions,
      name: 'my-workspace',
      directory: 'my-workspace',
      npmScope: 'npmScope',
      appName: 'app',
    });

    expect(readJson(tree, 'package.json')).toEqual(packageJson);
    expect(readJson(tree, '.eslintrc.json')).toEqual(eslintConfig);
  });

  it('should throw an error when the directory is not empty', async () => {
    tree.write('my-workspace/file.txt', '');

    try {
      await newGenerator(tree, {
        ...defaultOptions,
        name: 'my-workspace',
        directory: 'my-workspace',
        npmScope: 'npmScope',
        appName: 'app',
      });
      fail('Generating into a non-empty directory should error.');
    } catch (e) {}
  });
});
