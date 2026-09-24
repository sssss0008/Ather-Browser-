import { WebPageData } from '../types/browser';

export const SAMPLE_PAGES: Record<string, WebPageData> = {
  'aether://home': {
    url: 'aether://home',
    title: 'Aether OS • Command Canvas',
    domain: 'aether://',
    favicon: '🌌',
    category: 'System',
    trackersFound: [],
    summary: 'Aether Browser central hub: multi-workspace manager, neural assistant dock, instant terminal, and system telemetry.',
    markdownContent: `# Welcome to Aether Browser
Aether is an intelligent internet operating environment engineered for power researchers, developers, and creators.
- **Dual Pane Engine**: Browse docs and code side-by-side with synchronized scroll.
- **Neural Co-Pilot**: Deep contextual understanding of page text, code blocks, and data tables.
- **Zero-Trust Privacy Shield**: Real-time blocking of analytics telemetry and behavioral tracking scripts.
- **Integrated DevTools**: Chrome-grade DOM inspector, network waterfall, and JavaScript console.
`
  },
  'https://technews.today': {
    url: 'https://technews.today',
    title: 'TechNews Today • Breakthrough Quantum Computing & Edge Neural Engines',
    domain: 'technews.today',
    favicon: '⚡',
    author: 'Elena Vance, Senior Tech Editor',
    publishedDate: 'Sept 24, 2026',
    readingTimeMinutes: 5,
    category: 'Technology',
    tags: ['Quantum', 'Neural Hardware', 'Web3', 'Autonomous Systems'],
    trackersFound: ['Google Analytics 4 (Blocked)', 'Meta Pixel (Blocked)', 'Doubleclick Ad (Blocked)', 'Hotjar Session Recorder (Blocked)'],
    summary: 'Silicon photonics chips achieve 100x efficiency in edge AI inferencing, paving the way for browser-native 70B parameter local LLMs.',
    markdownContent: `# Silicon Photonics Breakthrough Accelerates Browser-Native AI

### By Elena Vance • Published September 24, 2026

Researchers at the International Nanotechnology Consortium unveiled a new class of optical coprocessors capable of executing transformer matrix operations at the speed of light with virtually zero thermal dissipation.

> "We are moving away from copper bottlenecks into direct optical bus architectures. In the near future, browsers like Aether will execute frontier models locally in microseconds without cloud roundtrips."

### Key Innovations Announced Today:
1. **Light-Speed Matrix Multipliers**: 40 Terabits/sec waveguide bandwidth directly integrated with unified system RAM.
2. **Sub-Milliwatt Idle State**: Ultra-low thermal footprint suitable for lightweight AR glasses and mobile devices.
3. **Open Optical Driver Layer**: Standards consortium announces POSIX-compatible optical kernel drivers for Linux and Android.

### What This Means for Web Developers
WebAssembly 3.0 and WebGPU will now expose low-level optical tensors directly to browser sandboxes. Client-side computer vision, real-time spatial video synthesis, and conversational agents will operate without latency or privacy compromises.
`
  },
  'https://en.wikipedia.org/wiki/Neural_network': {
    url: 'https://en.wikipedia.org/wiki/Neural_network',
    title: 'Artificial neural network - Wikipedia',
    domain: 'en.wikipedia.org',
    favicon: '📖',
    author: 'Wikipedia Contributors',
    publishedDate: 'Last edited 3 hours ago',
    readingTimeMinutes: 12,
    category: 'Reference',
    tags: ['Machine Learning', 'Computer Science', 'Mathematics', 'Cognitive Science'],
    trackersFound: ['Wikimedia Analytics (Observed - Non-invasive)'],
    summary: 'An artificial neural network is an interconnected group of nodes, inspired by a simplification of neurons in a biological brain.',
    markdownContent: `# Artificial Neural Network

From Wikipedia, the free encyclopedia.

An **artificial neural network** (**ANN**), usually simply called a **neural network** (**NN**) or **neural net**, is a computational model inspired by the structure and functional aspects of biological neural networks in human brains.

### Fundamental Components
- **Neurons (Nodes)**: Artificial units that receive signals, combine them linearly with learned synaptic weights, and apply a non-linear activation function.
- **Synaptic Weights & Biases**: Real numbers that adjust the influence of one neuron over another.
- **Layers**:
  - *Input Layer*: Receives raw empirical features (pixel values, audio spectrograms, token embeddings).
  - *Hidden Layers*: Transform inputs through hierarchical feature representations.
  - *Output Layer*: Computes predictions (class probabilities, continuous values, token distributions).

### Training via Backpropagation
During backpropagation, the gradients of the objective loss function are calculated with respect to all internal parameters via the calculus chain rule. Modern optimization algorithms such as AdamW and Muon scale this process across thousands of accelerator clusters.
`
  },
  'https://github.com/trending': {
    url: 'https://github.com/trending',
    title: 'Trending Repositories • GitHub',
    domain: 'github.com',
    favicon: '🐙',
    category: 'Development',
    tags: ['Open Source', 'TypeScript', 'Rust', 'Python', 'Go'],
    trackersFound: ['Octocats Metrics (Blocked)', 'Telemetry Beacon (Blocked)'],
    summary: 'Discover the most popular open-source projects starred by developers around the world today.',
    markdownContent: `# GitHub Trending Repositories

### 🔥 Top Starred Today

1. **aether-engine / aether-browser-core** (Rust / WebGPU)
   - *High-performance headless browser engine with sandboxed V8 isolates and optical compositing.*
   - ⭐ 34,921 stars • 2,410 forks • Apache-2.0 License

2. **deep-agents / auto-canvas** (TypeScript / React)
   - *Autonomous browser agent framework for complex web task automation and semantic scraping.*
   - ⭐ 19,842 stars • 1,120 forks • MIT License

3. **hyper-wasm / zero-latency-sqlite** (C / WASM)
   - *Client-side reactive SQLite running in Web Workers with differential CRDT syncing.*
   - ⭐ 14,208 stars • 890 forks • MIT License
`
  },
  'https://devdocs.io/css-grid': {
    url: 'https://devdocs.io/css-grid',
    title: 'CSS Grid Layout Architecture • DevDocs',
    domain: 'devdocs.io',
    favicon: '📐',
    category: 'Documentation',
    tags: ['CSS3', 'Layout', 'Web Standards', 'Frontend'],
    trackersFound: ['DocTracker (Blocked)'],
    summary: 'Comprehensive developer reference and interactive playground for two-dimensional CSS Grid layouts.',
    markdownContent: `# CSS Grid Layout Specifications

CSS Grid is the most powerful layout system available in CSS. It is a 2-dimensional system, meaning it can handle both columns and rows, unlike flexbox which is largely a 1-dimensional system.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-gap: 1.5rem;
  align-items: stretch;
}
\`\`\`

### Fundamental Concepts:
- **Grid Container**: The parent element with \`display: grid\`.
- **Grid Track**: The space between two adjacent grid lines (row or column).
- **Grid Cell**: The intersection of a grid row and a grid column (like a spreadsheet cell).
- **Fractional Units (\`fr\`)**: Represents a fraction of the free space in the grid container.
`
  }
};
