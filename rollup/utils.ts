import * as path from 'path';
import * as fse from 'fs-extra';
import { RollupFileOptions, OutputOptions } from 'rollup';
const resolve = require('rollup-plugin-node-resolve');
const tsconfig = require('../tsconfig.json');

const MODULE_PATH = tsconfig.compilerOptions.outDir;
const IIFE_PATH = './iife';

export interface BuildOptions {
  input: RollupFileOptions;
  output: OutputOptions;
}

const resolveOptions = {
  module: true,
  jsnext: true,
  main: false,
  browser: true,
  extensions: ['.js'],
  preferBuiltins: false,
};

export async function getAvailableCharts(): Promise<string[]> {
  const dirContent = await fse.readdir(MODULE_PATH);
  const filesOrDirs = await Promise.all(
    dirContent.map(async fileOrDirName => ({
      name: fileOrDirName,
      isDir: (await fse.stat(path.join(MODULE_PATH, fileOrDirName))).isDirectory(),
    })),
  );
  const dirs = filesOrDirs
    .filter(({ name, isDir }) => name.indexOf('Chart') > 0 && isDir)
    .map(({ name }) => name);

  return dirs;
}

export function getMainConfig(): BuildOptions {
  const input = {
    input: path.resolve(MODULE_PATH, 'index.js'),
    plugins: [resolve(resolveOptions)],
  };
  const output: OutputOptions = {
    file: path.resolve(IIFE_PATH, 'index.js'),
    format: 'iife',
    name: 'Chart',
  };

  return { input, output };
}

export function createChartConfig(chartName: string): BuildOptions {
  const input = {
    input: path.resolve(MODULE_PATH, chartName, 'index.js'),
    plugins: [resolve(resolveOptions)],
  };
  const output: OutputOptions = {
    file: path.resolve(IIFE_PATH, `${chartName}.js`),
    format: 'iife',
    name: chartName,
  };

  return { input, output };
}
