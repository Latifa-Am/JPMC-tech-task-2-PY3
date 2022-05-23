import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
//PerspectiveViewerElement behaves like an HTMLElement
interface PerspectiveViewerElement extends HTMLElement{
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      // Adding more attributes to the element (configurable part of the table/graph)
      elem.load(this.table);
      //‘view’ is the the kind of graph used to visualize the data. y_line is the closest continuous line graph that we want to be the final outcome
      elem.setAttribute('view','y_line');
      //‘column-pivots’ allow us to distinguish stock ABC with DEF. We use ‘[“stock”]’ as its corresponding value 
      elem.setAttribute('column-pivots','["stock"]');
      //‘row-pivots’ used for x-axis. It allows us to map each datapoint based on the timestamp it has
      elem.setAttribute('row-pivots','["timestamp"]');
      //‘columns’ is used to focus on a particular part of a stock’s data along the y-axis (top_ask_price, top_bid_price, stock, timestamp)
      elem.setAttribute('columns','["top_ask_price"]');
      //‘aggregates’ allow us to handle the duplicated data
      elem.setAttribute('aggregates',`
        {"stock":"distinct count",
        "top_ask_price":"avg",
        "top_bid_price":"avg",
        "timestamp":"distinct count"}`);

    }
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
