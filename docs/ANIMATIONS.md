# AnimatedMediaCard · optional Motion wrapper

`MediaCard` is presentation-only and does **not** import Motion. For optional animated entrances use `@coverkit/animated` or install `animated-media-card` from the shadcn-compatible GitHub registry. The animated registry item includes the base files, so it is self-contained.

```tsx
import { AnimatedMediaCard } from '@coverkit/animated';

<AnimatedMediaCard
  item={item}
  variant="standard"
  locale="en"
  animation="fade-up"
  trigger="in-view"
  duration={0.35}
  once
/>
```

## Props

Every `MediaCardProps` prop is forwarded. The wrapper adds:

| Prop | Default | Meaning |
| --- | --- | --- |
| `animation` | `fade-up` | `none`, `fade-up` or `scale-in` |
| `trigger` | `in-view` | Animate on mount or on viewport entry |
| `duration` | `0.35` | Seconds, clamped to 0–2 |
| `delay` | `0` | Seconds |
| `once` | `true` | One entrance per component mount for viewport triggers |
| `viewportAmount` | `0.2` | Viewport intersection threshold, 0–1 |
| `staggerIndex` | `0` | Position in a list |
| `staggerInterval` | `0.07` | Additional delay in seconds per item |
| `pressFeedback` | `false` | Subtle press feedback on the wrapper |
| `wrapperClassName` | `''` | Additional class on the wrapper |

For a staggered grid:

```tsx
{items.map((item, index) => (
  <AnimatedMediaCard
    key={item.id}
    item={item}
    animation="fade-up"
    trigger="in-view"
    staggerIndex={index}
    staggerInterval={0.05}
  />
))}
```

**Accessibility:** `useReducedMotion` disables movement when reduced motion is preferred. The component renders a **visible card on the server** before hydration; it never ships invisible SSR content. Navigation callbacks and deep links remain the responsibility of `MediaCard` and the consumer.

The playground also has a small native click feedback effect. That effect is deliberately **not** part of the distributed `MediaCard` API.
