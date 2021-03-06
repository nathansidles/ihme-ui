import React from 'react';
import { render } from 'react-dom';

import d3Scale from 'd3-scale';

import { maxBy, minBy, map, uniqBy } from 'lodash';

import { dataGenerator } from '../../../test-utils';
import AxisChart from '../../axis-chart';
import { ScatterPlot } from '../';


const keyField = 'year_id';
const valueField = 'value';

const usaData = dataGenerator({
  primaryKeys: [{name: location, values: ['USA']}],
  valueKeys: [
    {name: valueField, range: [200, 500], uncertainty: true}
  ],
  length: 10
});

const canadaData = dataGenerator({
  primaryKeys: [{name: location, values: ['Canada']}],
  valueKeys: [
    {name: valueField, range: [300, 550], uncertainty: true}
  ],
  length: 10
});

const scatterData = [
  { location: 'USA', values: usaData },
  { location: 'Canada', values: canadaData }
];

const data = [...usaData, ...canadaData];
const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

const dataAccessors = {
  x: keyField,
  y: valueField
};


const clickHandler = (text) => {
  return (datum) => {
    return () => {
      alert(`${text}::${datum[keyField]},${datum[valueField]}`);
    };
  };
};

const hoverHandler = (text) => {
  return (datum) => {
    return () => {
      console.log(`${text}::${datum[keyField]},${datum[valueField]}`);
    };
  };
};

const symbolScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['circle', 'star']);
const colorScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['red', 'blue']);

class App extends React.Component {
  render() {
    return (
      <AxisChart
        xDomain={xDomain}
        xScaleType="point"
        yDomain={yDomain}
        yScaleType="linear"
        width={800}
        height={600}
      >
        <ScatterPlot
          data={scatterData}
          dataAccessors={dataAccessors}
          keyField={'location'}
          dataField={'values'}
          symbolField={'location'}
          symbolScale={symbolScale}
          colorScale={colorScale}
          clickHandler={clickHandler('click')}
          hoverHandler={hoverHandler('hover')}
        />
      </AxisChart>
    );
  }
}

render(<App />, document.getElementById('app'));
