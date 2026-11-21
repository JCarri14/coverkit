import { BookOpen, Star, Image as ImageIcon, Play, FileText } from 'lucide-react';

export function Icon({ name, size = 13 }: { name: 'book' | 'star' | 'image' | 'play' | 'file'; size?: number }) {
  const icons = { book: BookOpen, star: Star, image: ImageIcon, play: Play, file: FileText };
  const Glyph = icons[name];
  return <Glyph size={size} strokeWidth={name === 'star' ? 2 : 1.9} fill={name === 'star' ? 'currentColor' : 'none'} aria-hidden="true" focusable="false" />;
}
