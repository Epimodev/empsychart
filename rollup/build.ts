import * as fse from 'fs-extra';
import * as rollup from 'rollup';
import * as babel from 'babel-core';
import * as UglifyJS from 'uglify-js';
import { BuildOptions, getAvailableCharts, getMainConfig, createChartConfig } from './utils';

const babelOptions: babel.TransformOptions = {
  ast: false,
  babelrc: true,
  extends: './.babelrc',
};

async function build(options: BuildOptions): Promise<void> {
  const bundle = await rollup.rollup(options.input);

  const { code } = await bundle.generate(options.output);
  const { code: transformedCode } = babel.transform(code, babelOptions);
  if (!transformedCode) {
    throw new Error(`babel transform failed for build : ${options.output.name}`);
  }
  const { code: minifiedCode } = UglifyJS.minify(transformedCode);
  if (!minifiedCode) {
    throw new Error(`UglifyJS failed for build : ${options.output.name}`);
  }

  await fse.outputFile(options.output.file!, minifiedCode);
  console.info(`BUILD FINISHED : ${options.output.name}`);
}

async function buildAll() {
  const mainConfig = getMainConfig();
  const mainBuildPromise = build(mainConfig);
  const availableCharts = await getAvailableCharts();
  const chartBuildPromises = availableCharts.map(chartName => {
    const buildConfig = createChartConfig(chartName);
    return build(buildConfig);
  });
  const buildPromises = [mainBuildPromise, ...chartBuildPromises];

  await Promise.all(buildPromises);
  console.log('FINISHED');
}

buildAll();
