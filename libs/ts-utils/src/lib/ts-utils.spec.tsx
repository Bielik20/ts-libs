import { render } from '@testing-library/react';

import TsUtils from './ts-utils';

describe('TsUtils', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TsUtils />);
    expect(baseElement).toBeTruthy();
  });
});
