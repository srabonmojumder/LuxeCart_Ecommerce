/**
 * Seed demo blog posts that match the LuxeCart theme (premium home accessories,
 * design, lifestyle). Idempotent: re-running upserts by slug, so it's safe.
 *   npx tsx scripts/seed-blog.ts
 */
import { prisma } from '../src/lib/prisma.js';

interface SeedPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  publishedAt: string; // ISO
}

const posts: SeedPost[] = [
  {
    slug: '5-living-room-essentials-2026',
    title: '5 Living Room Essentials Every Modern Home Needs in 2026',
    excerpt:
      'From sculptural lighting to the perfect lounge chair — the five pieces that will quietly upgrade any living room this year.',
    content: `A great living room isn't built in a day, and it certainly isn't built from one shopping trip. The rooms we keep coming back to are the ones with a handful of pieces that earn their place — items that feel intentional, look beautiful, and quietly hold the whole space together.

If you're refreshing yours in 2026, here are the five categories we'd start with.

1. A lounge chair with a point of view. Skip the safe option. A sculptural chair in a warm fabric becomes the anchor of the room and the seat everyone fights for.

2. Layered lighting. One overhead light is a mistake. Mix a floor lamp, a table lamp, and a small accent light — suddenly your evenings feel completely different.

3. A coffee table that does work. Round edges for family rooms, sculptural shapes for statement spaces, storage drawers if you live with clutter (we all do).

4. Textiles you actually want to touch. A heavy throw, a low-pile rug, linen curtains that move with the breeze — these are the layers that turn a room into a home.

5. Greenery, real or sculptural. A trailing pothos by the bookshelf or a single bold ceramic vase — living rooms need a little life.

The thread running through all of these? Restraint. The best modern interiors aren't full — they're considered.`,
    image: '/photo-1513506003901-1e6a229e2d15.webp',
    author: 'Sara Ahmed',
    tags: ['decor', 'living-room', 'tips'],
    publishedAt: '2026-05-22T10:00:00.000Z',
  },
  {
    slug: 'art-of-minimalist-home-design',
    title: 'The Art of Minimalist Home Design',
    excerpt:
      'Minimalism isn\'t about owning less for the sake of it. It\'s about owning the right things — and letting them breathe.',
    content: `Minimalism gets a bad reputation. People imagine cold white rooms with one chair and no personality. That isn't minimalism. That's a magazine shoot.

True minimalist design is warm. It's about choosing fewer pieces but better ones — the heavy wooden bowl on the counter, the linen sofa that softens with age, the single artwork that you actually stop to look at.

Three principles we keep coming back to:

Negative space is a material. Empty wall, empty shelf, empty floor — these aren't missing furniture. They're giving your eye somewhere to rest.

Texture beats pattern. When the palette is quiet, materials do the work. Oak, brass, linen, ceramic — they all whisper instead of shouting.

One bold gesture per room. A single oversized lamp. A sculptural mirror. One thing that breaks the calm and makes the rest of the room make sense.

If you're starting out, don't try to redo a whole room overnight. Pick one corner. Strip it back. Add one good thing. Live with it for a month. Then move to the next.`,
    image: '/photo-1592078615290-033ee584e267.webp',
    author: 'Marcus Lee',
    tags: ['design', 'minimalism'],
    publishedAt: '2026-05-10T09:30:00.000Z',
  },
  {
    slug: 'style-workspace-focus-calm',
    title: 'How to Style Your Workspace for Focus and Calm',
    excerpt:
      'Your desk shapes your day more than you think. A few small upgrades — and one big one — to make yours work harder for you.',
    content: `Most workspaces are accidental. A desk gets shoved into a corner, a chair from the dining room ends up in front of it, cables snake across the floor. It works. But it also drains a little energy from every hour you spend there.

A workspace you actually want to sit at is built on three things: light, surface, and silence.

Light first. Natural light if you can, but a good warm desk lamp at minimum — never overhead fluorescents. Aim for layers: ambient light from the room, focused light on your work.

Then surface. A clean desk doesn't mean an empty one. It means everything on it has a reason — a notebook, a mug, a single plant. Hide cables. Box your peripherals. Make the surface feel like a workshop, not a junk drawer.

Last, silence — visual silence. One framed print, not five. A quiet color palette. A monitor that doesn't blink at you. The fewer things competing for attention, the more your work gets it.

The biggest upgrade isn't a gadget. It's a chair you can sit in for four hours without thinking about it.`,
    image: '/photo-1505740420928-5e560c06d30e.webp',
    author: 'Priya Nair',
    tags: ['workspace', 'productivity', 'tips'],
    publishedAt: '2026-04-28T14:00:00.000Z',
  },
  {
    slug: 'sustainable-decor-beautiful-eco',
    title: 'Sustainable Decor: Beautiful Pieces That Love the Planet',
    excerpt:
      'Eco-friendly doesn\'t mean compromising on style. Here\'s how to build a home you love — and one the planet doesn\'t mind either.',
    content: `Sustainability used to be the trade-off. You either bought the beautiful thing or the responsible one. That's no longer true — and the gap is closing fast.

The most beautiful pieces being made today are also the ones thinking carefully about where their materials come from.

What to look for:

Solid wood, not veneer. A piece of solid oak or walnut will outlive three flat-pack pieces and patina with age. The upfront cost evens out.

Natural fibers. Linen, wool, jute, cotton. They feel better, age better, and biodegrade when their lives are over.

Local makers when possible. Shorter shipping, less packaging, real people supporting real workshops. The story behind a piece is part of why you love it.

Repairable, not replaceable. Anything that can be re-upholstered, re-finished, or re-strung is a better long-term buy than something glued together.

Sustainability isn't only about saving the planet — it's also about owning things you'll keep for fifteen years instead of two.`,
    image: '/photo-1441986300917-64674bd600d8.webp',
    author: 'Sara Ahmed',
    tags: ['sustainability', 'decor'],
    publishedAt: '2026-04-12T11:00:00.000Z',
  },
  {
    slug: 'lighting-101-mood-every-room',
    title: 'Lighting 101: How to Set the Mood in Every Room',
    excerpt:
      'Lighting is the single biggest lever you have over how a room feels. Here\'s a beginner\'s guide to getting it right.',
    content: `If you only change one thing in your home this year, change the lighting.

It's the cheapest, highest-impact upgrade you can make — and most rooms are doing it badly. One bright overhead bulb. Cold white temperature. Nothing on the walls or surfaces. The room ends up feeling like a waiting area.

Good lighting follows a simple recipe. Three layers in every room:

Ambient — the soft, general fill light. Could be a ceiling fixture on a dimmer, or wall sconces. Warm white (2700K) for living spaces, never blue.

Task — a desk lamp, a reading floor lamp, under-cabinet lights in the kitchen. Wherever your eyes do work.

Accent — the small, deliberate light. A picture light over art, a candle, a small lamp that just glows. This is what makes a room feel finished.

The other rule: lower light sources than you think. Most fixtures sit too high. Floor lamps and table lamps at eye level when you're sitting create the warm pool of light that makes a room feel intimate at night.`,
    image: '/photo-1607082348824-0a96f2a4b9da.webp',
    author: 'Marcus Lee',
    tags: ['lighting', 'design', 'tips'],
    publishedAt: '2026-03-30T08:45:00.000Z',
  },
  {
    slug: 'smart-home-accessories-2026',
    title: 'Smart Home Accessories That Actually Belong in 2026',
    excerpt:
      'Most smart home gadgets are ugly, gimmicky, or both. The handful that have earned their place in a well-designed home.',
    content: `The smart home industry has produced an extraordinary amount of beige plastic. For years the choice was: have technology that works but ruins the look of the room, or have a beautiful room with a regular light switch.

That's finally changing. A handful of categories have become genuinely beautiful, and they're the only ones worth letting into a thoughtfully designed home.

Lighting controls. Dimmers and color-temperature smart bulbs let you change the mood of a room without changing the fixture. Worth every cent.

Smart speakers that look like objects. The newer generation hides behind fabric, ceramic, or wood. They're speakers first, gadgets second.

Quiet sensors. Motion sensors that turn on a hallway light at 3am, temperature sensors that nudge the thermostat — invisible technology doing useful things.

Cable-free everything. The single biggest visual upgrade you can make is removing cables. Wireless chargers built into bedside tables, hidden speaker wiring, USB-C ports built into desks.

The rule of thumb: if a guest walks into the room and asks "what's that?", it's the wrong product.`,
    image: '/photo-1445205170230-053b83016050.webp',
    author: 'Priya Nair',
    tags: ['tech', 'smart-home'],
    publishedAt: '2026-03-15T13:20:00.000Z',
  },
  {
    slug: 'color-palettes-transform-spaces',
    title: 'Color Palettes That Transform Any Space',
    excerpt:
      'Three timeless palettes our stylists keep returning to — and exactly how to apply each one without overthinking it.',
    content: `Color is the fastest way to change how a room feels, and the most paralyzing decision people face when refreshing a space. The trick is to stop trying to pick "your color" and start picking a small, considered palette.

Here are three we keep coming back to.

The Warm Neutral Palette. Cream walls, oatmeal upholstery, oak surfaces, brass hardware, dark espresso accents. This is the palette that works in almost any home, in almost any light. Add greenery and it sings.

The Quiet Earth Palette. Soft clay, sage green, putty, terracotta. Grounding, calm, surprisingly modern. Best in rooms with good natural light — they bring the outside in.

The Modern Mono Palette. Pure white, soft greys, one true black accent, and one bold color (a single rust pillow, an emerald lampshade). High-contrast, gallery-quiet, easy to live with.

A simple rule: pick three colors maximum. Use them in roughly 60-30-10 proportion — dominant, secondary, accent. Apply the same palette across the room, including textiles and small objects. Suddenly everything looks intentional.`,
    image: '/photo-1494790108377-be9c29b29330.webp',
    author: 'Sara Ahmed',
    tags: ['color', 'design', 'tips'],
    publishedAt: '2026-02-22T10:15:00.000Z',
  },
];

async function main() {
  console.log(`Seeding ${posts.length} blog posts…`);
  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        image: p.image,
        author: p.author,
        tags: p.tags,
        published: true,
        publishedAt: new Date(p.publishedAt),
      },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        image: p.image,
        author: p.author,
        tags: p.tags,
        published: true,
        publishedAt: new Date(p.publishedAt),
      },
    });
    console.log(`  ✓ ${p.slug}`);
  }
  const total = await prisma.post.count();
  console.log(`\nDone — ${total} posts in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
