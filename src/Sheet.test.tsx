import React from 'react';
import ReactDOM from 'react-dom';
import Sheet from './Sheet';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sheet />, div);
  ReactDOM.unmountComponentAtNode(div);
});
