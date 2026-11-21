import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MediaCard, formatMediaCount, mediaCardLocales } from '../src';
import type { MediaItem } from '../src';

const manga: MediaItem = {
  id:'m1',kind:'manga',title:'Fictional Manga',language:{code:'es',region:'ES'},
  creators:[{id:'a1',name:'Example Studio'}],
  count:{value:123,unit:'chapters'},
  latestEntries:[{id:'c123',label:'Capítulo 123',isNew:true},{id:'c122',label:'Capítulo 122',publishedLabel:'ayer'}],
  rating:{value:8.8},status:'ongoing',progress:{current:42,total:123},
};
const book: MediaItem = {id:'b1',kind:'book',title:'A Fictional Book',count:{value:420,unit:'pages'},creators:[{id:'w1',name:'Book Author'}],description:'Libro de muestra sin publicaciones recientes.'};
const series: MediaItem = {id:'s1',kind:'series',title:'A Fictional Series',count:{value:18,unit:'episodes'},latestEntries:[{id:'e6',label:'T2 · E06',publishedLabel:'hoy',isNew:true}]};

describe('MediaCard', () => {
  it.each(['minimal','standard','detailed','compact'] as const)('renders %s with an explicit dark theme', variant => {
    const { container }=render(<MediaCard item={manga} variant={variant} theme="dark" />);
    expect(screen.getByText(manga.title)).toBeInTheDocument();
    expect(container.querySelector('.ck-card')).toHaveAttribute('data-ck-theme','dark');
  });
  it('formats counts by unit, without assuming manga chapters', () => {
    expect(formatMediaCount({value:420,unit:'pages'})).toBe('420 pages');
    expect(formatMediaCount({value:420,unit:'pages'},'es')).toBe('420 págs.');
    expect(formatMediaCount({value:18,unit:'episodes'})).toBe('18 eps.');
    expect(formatMediaCount({value:4,unit:'issues',label:'4 números'})).toBe('4 números');
  });
  it('supports user-defined count formatting for other locales', () => {
    render(<MediaCard item={book} variant="compact" countFormatter={(c) => `${c.value} pages`} />);
    expect(screen.getByText('420 pages')).toBeInTheDocument();
  });
  it('shows page counts for books and never fabricates a chapter list', () => {
    const {container}=render(<MediaCard item={book} variant="detailed" />);
    expect(container.querySelector('.ck-count')).toHaveTextContent('420 pages');
    expect(container.querySelector('.ck-chapter-list')).not.toBeInTheDocument();
    expect(screen.getByText(book.description!)).toBeInTheDocument();
  });
  it('displays series episodes by their provided labels', () => {
    render(<MediaCard item={series} variant="standard" />);
    expect(screen.getByText('T2 · E06')).toBeInTheDocument();
    expect(screen.getByText('18 eps.')).toBeInTheDocument();
  });
  it('renders a graphical flag when region exists', () => {
    const {container}=render(<MediaCard item={manga} variant="detailed" languageDisplay="flag" />);
    expect(container.querySelector('.ck-flag-svg')).toBeInTheDocument();
    expect(container.querySelector('.ck-language--inline')).toBeInTheDocument();
  });
  it('falls back to the code for languages without supported flag regions', () => {
    render(<MediaCard item={{...book,language:{code:'ca'}}} variant="compact" languageDisplay="flag" />);
    expect(screen.getByLabelText('Language CA')).toHaveTextContent('CA');
  });
  it('keeps Detailed language inline, leaving the cover count unopposed', () => {
    const {container}=render(<MediaCard item={manga} variant="detailed" />);
    expect(container.querySelector('.ck-cover .ck-language')).toBeNull();
    expect(container.querySelector('.ck-title-row .ck-language')).toBeInTheDocument();
    expect(container.querySelector('.ck-count')).toHaveTextContent('123 ch.');
  });
  it('supports missing cover and optional metadata', () => {
    const {container}=render(<MediaCard item={{id:'empty',title:'Empty'}} />);
    expect(container.querySelector('.ck-image-fallback')).toBeInTheDocument();
    expect(container.querySelector('.ck-count')).not.toBeInTheDocument();
    expect(container.querySelector('.ck-rating')).not.toBeInTheDocument();
  });
  it('dispatches distinct navigation callbacks for entries and creators', () => {
    const onOpenEntry=vi.fn(), onOpenCreator=vi.fn();
    render(<MediaCard item={manga} variant="detailed" onOpenEntry={onOpenEntry} onOpenCreator={onOpenCreator} />);
    fireEvent.click(screen.getByRole('button',{name:'Open Capítulo 123 of Fictional Manga'}));
    fireEvent.click(screen.getByRole('button',{name:'See works by Example Studio'}));
    expect(onOpenEntry).toHaveBeenCalledWith(manga.latestEntries![0],manga);
    expect(onOpenCreator).toHaveBeenCalledWith(manga.creators![0],manga);
  });
  it('supports Spanish UI without changing the language of the content', () => {
    const {container} = render(<MediaCard item={manga} variant="detailed" locale="es" />);
    expect(container.querySelector('.ck-count')).toHaveTextContent('123 caps.');
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByLabelText('Idioma ES')).toHaveTextContent('ES');
    expect(mediaCardLocales.en.labels.new).toBe('New');
  });
  it('supports custom UI labels and semantic progress', () => {
    render(<MediaCard item={manga} variant="detailed" labels={{new:'New',progress:'Reading progress'}} showProgress />);
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow','42');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax','123');
  });
});
