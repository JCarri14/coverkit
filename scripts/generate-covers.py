"""Original deterministic SVG cover placeholders; no third-party manga artwork."""
from pathlib import Path
import math,random,html
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'apps/web/public/covers';out.mkdir(parents=True,exist_ok=True)
data=[
('orbit-of-ash','#161c42','#ee846e','#ffe6b4','ORBIT','OF ASH'),
('velvet-eclipse','#190c3f','#8262f0','#ebc2fc','VELVET','ECLIPSE'),
('neon-orchard','#041e32','#00c6be','#e4fc82','NEON','ORCHARD'),
('glass-ronin','#201724','#e54d6c','#f8e7d9','GLASS','RONIN'),
('moonlit-signals','#0c2141','#5b91d8','#dde8ff','MOONLIT','SIGNALS'),
('crimson-harbor','#3c141a','#f4714a','#fbd3b7','CRIMSON','HARBOR'),
('paper-kingdom','#293b44','#87c8bb','#f4e8bb','PAPER','KINGDOM'),
('tide-of-starlight','#071e4e','#51bfe7','#d7fcf6','TIDE OF','STARLIGHT'),
('northern-echoes','#15343e','#b1e4bc','#fff3d6','NORTHERN','ECHOES'),
('bloom-circuit','#302343','#e7a1db','#f1dba6','BLOOM','CIRCUIT'),
('morrow-gate','#22243d','#f4c073','#f4edf5','MORROW','GATE'),
('last-cartographer','#26352c','#d8a36b','#e7dfbd','LAST','CARTOGRAPHER'),
]
for i,(slug,bg,accent,cream,a,b) in enumerate(data):
 r=random.Random(i*81+13)
 stars=''.join(f'<circle cx="{r.randrange(10,290)}" cy="{r.randrange(10,380)}" r="{r.choice([.6,1,1.5])}" fill="{cream}" opacity="{r.uniform(.2,.7):.2f}"/>' for _ in range(54))
 lines=''.join(f'<path d="M{r.randrange(-40,240)} {r.randrange(35,280)} Q{r.randrange(70,230)} {r.randrange(60,310)} {r.randrange(210,390)} {r.randrange(40,270)}" stroke="{cream}" stroke-width="{r.choice([1,2,3])}" opacity="{r.uniform(.08,.22):.2f}" fill="none"/>' for _ in range(8))
 motif=''
 if i%4==0:
  motif=f'<circle cx="155" cy="192" r="101" fill="none" stroke="{accent}" stroke-width="24" opacity=".65"/><circle cx="155" cy="192" r="64" fill="{accent}" opacity=".26"/><path d="M45 292 240 108" stroke="{cream}" stroke-width="4" opacity=".7"/>'
 elif i%4==1:
  motif=f'<path d="M-20 220 120 34 334 325 244 416Z" fill="{accent}" opacity=".55"/><path d="M12 290 154 96 310 310" stroke="{cream}" stroke-width="5" fill="none" opacity=".75"/><circle cx="155" cy="190" r="47" fill="{cream}" opacity=".28"/>'
 elif i%4==2:
  motif=''.join(f'<rect x="{x}" y="{214-r.randrange(0,80)}" width="{r.randrange(14,37)}" height="{r.randrange(100,190)}" fill="{accent}" opacity="{r.uniform(.18,.49):.2f}" transform="rotate({r.randrange(-15,15)} {x} 230)"/>' for x in range(0,300,32))+f'<circle cx="230" cy="105" r="60" fill="{cream}" opacity=".76"/>'
 else:
  motif=f'<path d="M0 290 114 120 182 228 244 68 300 222V410H0Z" fill="{accent}" opacity=".6"/><path d="m0 344 112-128 102 118 86-80" fill="none" stroke="{cream}" stroke-width="6" opacity=".6"/>'
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" role="img" aria-label="Portada original de {html.escape(a+' '+b)}">
 <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{bg}"/><stop offset="1" stop-color="{accent}" stop-opacity=".75"/></linearGradient><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="{bg}" stop-opacity="0"/><stop offset="1" stop-color="{bg}" stop-opacity=".95"/></linearGradient></defs>
 <rect width="300" height="400" fill="url(#bg)"/>{stars}{lines}{motif}
 <rect y="264" width="300" height="136" fill="url(#fade)"/><text x="22" y="27" font-family="Arial,sans-serif" letter-spacing="4" font-size="9" font-weight="700" fill="{cream}" opacity=".8">FICTIONAL · VOL. 0{i%6+1}</text>
 <text x="22" y="327" font-family="Arial Black,Arial,sans-serif" font-size="29" font-weight="900" letter-spacing="-1" fill="{cream}">{a}</text>
 <text x="22" y="361" font-family="Arial Black,Arial,sans-serif" font-size="26" font-weight="900" letter-spacing="-1" fill="{cream}">{b}</text>
 <path d="M22 374h53" stroke="{accent}" stroke-width="5"/>
 </svg>'''
 (out/f'{slug}.svg').write_text(svg,encoding='utf-8')
print('Generated',len(data),'original SVG covers')
