import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AnimatedMediaCard } from '../src';

describe('AnimatedMediaCard', () => {
  it('renders readable SSR content without hiding the card', () => {
    const html = renderToString(<AnimatedMediaCard item={{ id: 'book', title: 'Example book', kind: 'book' }} />);
    expect(html).toContain('Example book');
    expect(html).toContain('ck-card');
    expect(html).not.toContain('opacity:0');
  });
  it('accepts disabled animation and caller callbacks', () => {
    const html = renderToString(<AnimatedMediaCard animation="none" trigger="mount" item={{ id: 'x', title: 'A card' }} />);
    expect(html).toContain('A card');
  });
});
