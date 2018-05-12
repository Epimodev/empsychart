import * as utils from './utils';

jest.mock('../utils/canvas', () => ({
  getTextWidth: (font: string, text: string) => text.length * 5,
  getTextHeight: () => 20,
}));

/* ==================================================
===================CREATE SELECTORS==================
================================================== */

const selectGraphFill = utils.createSelectGraphFill();
const selectGraphLineColor = utils.createSelectGraphLineColor();
const selectGridValues = utils.createSelectGridValues();
const selectGraphArea = utils.createSelectGraphArea(selectGridValues);
const selectVerticalGrid = utils.createSelectVerticalGrid(selectGraphArea);
const selectHorizontalGrid = utils.createSelectHorizontalGrid(selectGraphArea, selectGridValues);
const selectGraphPoints = utils.createSelectGraphPoints(selectGraphArea);
const selectGraph = utils.createSelectGraph(
  selectGraphArea,
  selectGraphFill,
  selectGraphLineColor,
  selectGraphPoints,
  selectVerticalGrid,
  selectHorizontalGrid,
);

/* ==================================================
======================FAKE DATA======================
================================================== */
const gridColor = '#000';
const gridLabelColor = '#000';
const data = [
  { abscissa: 0, value: 200 },
  { abscissa: 50, value: 250 },
  { abscissa: 100, value: 235 },
  { abscissa: 150, value: 80 },
  { abscissa: 200, value: 150 },
  { abscissa: 250, value: 240 },
  { abscissa: 300, value: 200 },
  { abscissa: 350, value: 190 },
  { abscissa: 400, value: 230 },
];

const pointsMaximums = [1, 2, 5, 6];
const points = [
  { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
];
// const targetPoints = [
//   { x: 0, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 30, y: 35, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 40, y: 55, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 50, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 60, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 70, y: 10, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
//   { x: 80, y: 20, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
// ];
// const pink = {
//   red: 255,
//   green: 0,
//   blue: 136,
//   alpha: 1,
// };
// const pinkStringify = 'rgba(255, 0, 136, 1)';
// const transparentStringify = 'rgba(255, 255, 255, 0)';
// const graph = {
//   points,
//   fillColor: [transparentStringify],
//   lineColor: pinkStringify,
// };
// const targetGraph = {
//   points: targetPoints,
//   fillColor: [pink],
//   lineColor: pink,
// };
const font = '12px sans-serif';

/* ==================================================
========================TESTS========================
================================================== */

describe('computeHorizontalGridValues', () => {
  const data1 = [
    { abscissa: 0, value: 200 },
    { abscissa: 50, value: 250 },
    { abscissa: 100, value: 235 },
  ];
  const data2 = [
    { abscissa: 0, value: 0 },
    { abscissa: 50, value: 10 },
    { abscissa: 100, value: 5 },
  ];
  const data3 = [
    { abscissa: 0, value: -250 },
    { abscissa: 50, value: -120 },
    { abscissa: 100, value: -300 },
  ];
  const data4 = [
    { abscissa: 0, value: 0 },
    { abscissa: 50, value: -15 },
    { abscissa: 100, value: -5 },
  ];
  const data5 = [
    { abscissa: 0, value: 21 },
    { abscissa: 50, value: -8 },
    { abscissa: 100, value: -5 },
  ];
  test('Should compute grid when all values are positive', () => {
    const gridValues1 = utils.computeHorizontalGridValues(data1);
    const gridValues2 = utils.computeHorizontalGridValues(data2);
    expect(gridValues1).toEqual([0, 100, 200, 300]);
    expect(gridValues2).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  test('Should compute grid when all values are negative', () => {
    const gridValues1 = utils.computeHorizontalGridValues(data3);
    const gridValues2 = utils.computeHorizontalGridValues(data4);
    expect(gridValues1).toEqual([-300, -200, -100, 0]);
    expect(gridValues2).toEqual([-20, -10, 0]);
  });
  test('Should compute grid when all values are positive and negative', () => {
    const gridValues5 = utils.computeHorizontalGridValues(data5);
    expect(gridValues5).toEqual([-10, 0, 10, 20, 30]);
  });
});

describe('selectGraphArea', () => {
  const defaultGraphOptions = {
    data: [
      { abscissa: 0, value: 200 },
      { abscissa: 50, value: 250 },
      { abscissa: 100, value: -235 },
      { abscissa: 150, value: 80 },
      { abscissa: 200, value: -10 },
      { abscissa: 250, value: 240 },
      { abscissa: 300, value: 200 },
      { abscissa: 350, value: -190 },
      { abscissa: 400, value: 230 },
    ],
    pointRadius: 0,
    graphColor: ['#eea849', '#eea849'],
    lineColor: '#FF9966',
    isCurved: true,
    hasHorizontalGrid: true,
    horizontalGridColor: gridColor,
    horizontalGridLabelColor: gridLabelColor,
    hasVerticalGrid: true,
    verticalGridColor: gridColor,
    verticalGridLabelColor: gridLabelColor,
    font: '16px sans-serif',
    width: 722,
    height: 942,
  };
  test('Should have the same height than canvas when vertical grid isnt displayed', () => {
    const graphArea = selectGraphArea({
      ...defaultGraphOptions,
      hasHorizontalGrid: false,
      hasVerticalGrid: false,
    });
    expect(graphArea.graphHeight).toBe(defaultGraphOptions.height);
  });
  test('Should have the same width than canvas when horizontal grid isnt displayed', () => {
    const graphArea = selectGraphArea({
      ...defaultGraphOptions,
      hasHorizontalGrid: false,
      hasVerticalGrid: false,
    });
    expect(graphArea.graphWidth).toBe(defaultGraphOptions.width);
  });
  test('Should have the height lower than canvas when vertical grid is displayed', () => {
    const graphArea = selectGraphArea(defaultGraphOptions);
    expect(graphArea.graphHeight).toBeLessThan(defaultGraphOptions.height);
  });
  test('Should have the width lower than canvas when horizontal grid is displayed', () => {
    const graphArea = selectGraphArea(defaultGraphOptions);
    expect(graphArea.graphWidth).toBeLessThan(defaultGraphOptions.width);
  });
});

describe('selectGraphPoints', () => {
  const defaultGraphOptions = {
    data: [
      { abscissa: -50, value: 200 },
      { abscissa: 0, value: 200 },
      { abscissa: 50, value: 250 },
      { abscissa: 100, value: -235 },
      { abscissa: 150, value: 80 },
      { abscissa: 200, value: -10 },
      { abscissa: 250, value: 240 },
      { abscissa: 300, value: 200 },
      { abscissa: 350, value: -190 },
      { abscissa: 400, value: 230 },
    ],
    pointRadius: 0,
    graphColor: ['#eea849', '#eea849'],
    lineColor: '#FF9966',
    isCurved: true,
    hasHorizontalGrid: true,
    hasVerticalGrid: true,
    font: '16px sans-serif',
    width: 722,
    height: 942,
  };
  test('All points should be in graph', () => {
    const graphPoints = selectGraphPoints({
      ...defaultGraphOptions,
      hasHorizontalGrid: false,
      horizontalGridColor: gridColor,
      horizontalGridLabelColor: gridLabelColor,
      hasVerticalGrid: false,
      verticalGridColor: '#000',
      verticalGridLabelColor: '#000',
    });
    graphPoints.forEach(point => {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(defaultGraphOptions.width);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(defaultGraphOptions.height);
    });
  });
});

describe('computeHorizontalGridValues', () => {
  const dataSet = [
    { abscissa: 0, value: 200 },
    { abscissa: 50, value: 250 },
    { abscissa: 100, value: -235 },
    { abscissa: 150, value: 80 },
    { abscissa: 200, value: -10 },
    { abscissa: 250, value: 240 },
    { abscissa: 300, value: 200 },
    { abscissa: 350, value: -190 },
    { abscissa: 400, value: 230 },
  ];
  test('Should compute array of horizontal grid values', () => {
    const horizontalGridValues = utils.computeHorizontalGridValues(dataSet);
    const expectedValue = [-300, -200, -100, 0, 100, 200, 300];
    expect(horizontalGridValues).toEqual(expectedValue);
  });
});

describe('computeHorizontalGrid', () => {
  const gridValues = [-10, 0, 10, 20];
  const offsetY = -gridValues[0];
  const graphArea = {
    width: 600,
    height: 300,
    top: 0,
    left: 50,
    graphWidth: 600,
    graphHeight: 300,
    translations: {
      x: (value: number) => value,
      y: (value: number) => 300 - (value + offsetY) * 10,
    },
  };
  test('Should compute horizontal grid', () => {
    const expectedValue = [
      {
        label: '-10',
        x: 50,
        y: 300,
        labelX: 25,
        labelY: 310,
        color: gridColor,
        labelColor: gridLabelColor,
      },
      {
        label: '0',
        x: 50,
        y: 200,
        labelX: 35,
        labelY: 210,
        color: gridColor,
        labelColor: gridLabelColor,
      },
      {
        label: '10',
        x: 50,
        y: 100,
        labelX: 30,
        labelY: 110,
        color: gridColor,
        labelColor: gridLabelColor,
      },
      {
        label: '20',
        x: 50,
        y: 0,
        labelX: 30,
        labelY: 10,
        color: gridColor,
        labelColor: gridLabelColor,
      },
    ];
    const horizontalGrid = utils.computeHorizontalGrid(
      true,
      gridColor,
      gridLabelColor,
      graphArea,
      font,
      gridValues,
    );
    expect(horizontalGrid).toEqual(expectedValue);
  });
});

describe('computeVerticalGrid', () => {
  const graphArea = {
    width: 600,
    height: 300,
    top: 0,
    left: 0,
    graphWidth: 600,
    graphHeight: 300,
    translations: {
      x: (value: number) => value * 6,
      y: (value: number) => 300 - value * 10,
    },
  };
  const data1 = [
    { abscissa: 0, value: -250 },
    { abscissa: 50, value: -120 },
    { abscissa: 100, value: -300 },
  ];
  const data2 = [
    { label: 'jan.', abscissa: 0, value: -250 },
    { label: 'feb.', abscissa: 25, value: -120 },
    { label: 'mar.', abscissa: 50, value: -300 },
    { label: 'mar.', abscissa: 75, value: -300 },
    { label: 'mar.', abscissa: 100, value: -300 },
  ];
  test('Number of grid lines should be the same as number of points', () => {
    const graphVerticalGrid1 = utils.computeVerticalGrid(
      true,
      gridColor,
      gridLabelColor,
      graphArea,
      font,
      data1,
    );
    const graphVerticalGrid2 = utils.computeVerticalGrid(
      true,
      gridColor,
      gridLabelColor,
      graphArea,
      font,
      data2,
    );
    expect(graphVerticalGrid1.length).toBe(data1.length);
    expect(graphVerticalGrid2.length).toBe(data2.length);
  });
  test('Grid line label should be stringified abscissa value when point hasnt a label', () => {
    const graphVerticalGrid = utils.computeVerticalGrid(
      true,
      gridColor,
      gridLabelColor,
      graphArea,
      font,
      data1,
    );
    graphVerticalGrid.forEach((gridLine, index) => {
      expect(gridLine.label).toBe(data1[index].abscissa.toString());
    });
  });
  test('Grid line label should be point label', () => {
    const graphVerticalGrid = utils.computeVerticalGrid(
      true,
      gridColor,
      gridLabelColor,
      graphArea,
      font,
      data2,
    );
    graphVerticalGrid.forEach((gridLine, index) => {
      expect(gridLine.label).toBe(data2[index].label);
    });
  });
});

describe('selectGraph', () => {
  const baseGraphOptions = {
    width: 600,
    height: 400,
    pointRadius: 0,
    graphColor: '',
    lineColor: '#000',
    hasVerticalGrid: false,
    horizontalGridColor: gridColor,
    horizontalGridLabelColor: gridLabelColor,
    hasHorizontalGrid: false,
    verticalGridColor: gridColor,
    verticalGridLabelColor: gridLabelColor,
    isCurved: false,
    font: '16px sans-serif',
  };

  test('Should return same number of points input', () => {
    const graphOptions = {
      ...baseGraphOptions,
      data,
    };
    const graph = selectGraph(graphOptions);

    expect(graph.points.length).toBe(data.length);
  });

  test('Should return an empty array of fill colors when graph color is undefined', () => {
    const graphOptions = {
      ...baseGraphOptions,
      data: [{ abscissa: 0, value: 10 }, { abscissa: 10, value: 15 }],
    };
    const graph = selectGraph(graphOptions);

    expect(graph.fillColor.length).toBe(0);
  });

  test('Should return an array of 1 fill colors when graph color is a string', () => {
    const graphColor = '#FFF';
    const graphOptions = {
      ...baseGraphOptions,
      graphColor,
      data: [{ abscissa: 0, value: 10 }, { abscissa: 10, value: 15 }],
    };
    const graph = selectGraph(graphOptions);

    expect(graph.fillColor.length).toBe(1);
  });

  test('Should return same number of fill colors than input', () => {
    const graphColor = ['#FFF', '#000'];
    const graphOptions = {
      ...baseGraphOptions,
      graphColor,
      data: [{ abscissa: 0, value: 10 }, { abscissa: 10, value: 15 }],
    };
    const graph = selectGraph(graphOptions);

    expect(graph.fillColor.length).toBe(graphColor.length);
  });
});

describe.skip('dataToGraph', () => {
  test('Should convert data value to graph point', () => {});
});

describe('pointWithCurves', () => {
  test("All points with curves shouldn't have `x` or `y` updated", () => {
    const pointsWithCurves = points.map(utils.pointWithCurves);

    pointsWithCurves.forEach((point, index) => {
      expect(point.x).toBe(points[index].x);
      expect(point.y).toBe(points[index].y);
    });
  });

  test('All local maximums with curves should have `cp1y` and `cp2y` equals to `y`', () => {
    const pointsWithCurves = points.map(utils.pointWithCurves);

    pointsMaximums.forEach(index => {
      expect(pointsWithCurves[index].cp1y).toBe(pointsWithCurves[index].y);
      expect(pointsWithCurves[index].cp2y).toBe(pointsWithCurves[index].y);
    });
  });

  test('First and last points should have `cp1x` and `cp2x` equals to `x`', () => {
    const pointsWithCurves = points.map(utils.pointWithCurves);

    const firstPoint = pointsWithCurves[0];
    const lastPoint = pointsWithCurves[pointsWithCurves.length - 1];

    expect(firstPoint.cp1x).toBe(firstPoint.x);
    expect(firstPoint.cp2x).toBe(firstPoint.x);
    expect(lastPoint.cp1x).toBe(lastPoint.x);
    expect(lastPoint.cp2x).toBe(lastPoint.x);
  });

  test('First and last points should have `cp1y` and `cp2y` equals to `y`', () => {
    const pointsWithCurves = points.map(utils.pointWithCurves);

    const firstPoint = pointsWithCurves[0];
    const lastPoint = pointsWithCurves[pointsWithCurves.length - 1];

    expect(firstPoint.cp1y).toBe(firstPoint.y);
    expect(firstPoint.cp2y).toBe(firstPoint.y);
    expect(lastPoint.cp1y).toBe(lastPoint.y);
    expect(lastPoint.cp2y).toBe(lastPoint.y);
  });
});

// describe('createGraphStack', () => {
//   test('Each graph of stack should have the same number of points', () => {
//     const graphStack = utils.createGraphStack(graph, targetGraph, 500);

//     const firstStepNbPoint = graphStack[0].points.length;
//     graphStack.forEach(graphStep => {
//       expect(graphStep.points.length).toBe(firstStepNbPoint);
//     });
//   });

//   test('Each graph of stack should have a different color when graph color change', () => {
//     const graphStack = utils.createGraphStack(graph, targetGraph, 500);
//     // For this test, graph must have only one color
//     expect(graph.fillColor.length).toBe(1);
//     expect(targetGraph.fillColor.length).toBe(1);
//     // For this test, graph must have different fill color
//     expect(graph.fillColor).not.toEqual(targetGraph.fillColor);

//     graphStack.forEach((graphStep, index) => {
//       const previousIndex = index - 1;
//       if (previousIndex >= 0) {
//         const perviousColor = graphStack[previousIndex].fillColor;
//         const currentColor = graphStack[index].fillColor;
//         expect(perviousColor).not.toEqual(currentColor);
//       }
//     });
//   });
// });

describe('isLocalMaximum', () => {
  test('Should get local maximums points', () => {
    const maximumsIndexes = points.reduce(
      (acc, point, index, points) => {
        const isFirst = index === 0;
        const isLast = index + 1 === points.length;
        if (isFirst || isLast) {
          return acc;
        }

        const previousPoint = points[index - 1];
        const nextPoint = points[index + 1];
        if (utils.isLocalMaximum(point, previousPoint, nextPoint)) {
          return [...acc, index];
        }

        return acc;
      },
      [] as number[],
    );

    expect(maximumsIndexes).toEqual(pointsMaximums);
  });
});
