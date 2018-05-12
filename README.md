## Presentation

Empsychart is a new lib to create simple chart in web pages.

The main goal of this lib is to create charts with the most fluid transition possible when data, color or other graph properties change.

Charts are render with HTML5 canvas. But this lib was develop in mind to use easely other technologies for rendering.

For the moment, only LineChart is available.

Roadmap :
- create BarChart
- create PieChart and DonutChart
- create RadarChart
- test rendering with technologies based on webgl

## Installation

```sh
yarn add empsychart

# or with npm

npm install --save empsychart
```

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div id="chartContainer" style="width: 600px; height: 300px"></div>

  <script src="node_modules/empsychart/iife/index.js"></script>
  <script>
    var charContainer = document.getElementById("chartContainer");
    var chartOptions = {
      data: [
        { abscissa: 0, value: 40 },
        { abscissa: 50, value: 60 },
        { abscissa: 100, value: 52 },
        { abscissa: 150, value: 50 }
      ],
      graphColor: ['#eea849', '#eea84900']
    }
    var lineChart = new Chart.LineChart(charContainer, chartOptions)
  </script>
</body>
</html>
```

## Exemple with module bundler

```javascript
import { LineChart } from 'empsychart';
// or : import LineChart from 'empsychart/module/LineChart';

var charContainer = document.getElementById("chartContainer");
var chartOptions = {
  data: [
    { abscissa: 0, value: 40 },
    { abscissa: 50, value: 60 },
    { abscissa: 100, value: 52 },
    { abscissa: 150, value: 50 }
  ],
  graphColor: ['#eea849', '#eea84900']
}
var lineChart = new LineChart(charContainer, chartOptions)
```

## LineChart

### Create a graph
```javascript
import { LineChart } from 'empsychart';

var charContainer = document.getElementById("chartContainer");
var chartOptions = {
  data: [
    { abscissa: 0, value: 40 },
    { abscissa: 50, value: 60 },
    { abscissa: 100, value: 52 },
    { abscissa: 150, value: 50 }
  ],
  graphColor: ['#eea849', '#eea84900']
}
var lineChart = new LineChart(charContainer, chartOptions)
```

### Update a graph
```javascript
var lineChart = new LineChart(charContainer, chartOptions)
// ...

const newData = [
    { abscissa: 0, value: 20 },
    { abscissa: 50, value: 72 },
    { abscissa: 100, value: 42 },
    { abscissa: 150, value: 60 }
  ],
lineChart.update({ data: newData });
```

### options

#### data: { label?: string, abscissa: number, value: number }[]
Data to display on chart

#### pointRadius: number
default value: 0

Size of points displayed on chart

#### lineColor: string
default value: '#000'

Color of the line to display
Available formats: hexa3, hexa4, hexa6, hexa8, rgb, rgba, hsl, hsla

#### graphColor: string | string[]
default value: ''

Color between curve and the origin of the chart
You can set several colors to create a grandient

#### hasHorizontalGrid: boolean
default value: true

Display horizontal grid

#### horizontalGridColor: string
default value: 'rgba(100, 100, 100, 0.2)'

Horizontal grid color

#### horizontalGridLabelColor: string
default value: '#999'

Horizontal grid label color

#### hasVerticalGrid: boolean
default value: true

Display horizontal grid

#### verticalGridColor: string
default value: 'rgba(100, 100, 100, 0.2)'

Horizontal grid color

#### verticalGridLabelColor: string
default value: '#999'

Horizontal grid label color

#### isCurved: boolean
default value: false

Set to true to draw a curved line

#### font: string
default value: '12px sans-serif'

Font use for grid labels

#### transitionDuration: number
default value: 500
Transition duration when the chart is updated (in milliseconds)

#### ease: "linear" | "quad" | "elastic" | "bounce"
default value: 'quad'
Ease function for animation
