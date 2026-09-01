// ============================================================
// components/constants.jsx - Algorithm Data / Content Constants
// ============================================================
// This file stores all the static information (descriptions,
// strengths, weaknesses, complexity, images) for each of the
// 5 page replacement algorithms.
//
// This data is used by AlgorithmsPage.jsx to render the
// educational theory cards for each algorithm.
// Keeping all content here in one place makes it easy to
// update text without touching the UI component files.
// ============================================================

// algorithmsData - An array of objects, one per algorithm.
// Each object contains all the information needed to display
// that algorithm's educational card in the Algorithms page.
export const algorithmsData = [
  {
    // --- FIFO Algorithm ---
    id: 'FIFO',                            // Unique key used for tab selection
    name: 'FIFO (First-In, First-Out)',    // Full display name
    shortName: 'FIFO',                     // Abbreviated name for compact displays
    timeComplexity: 'O(1) per request',    // How fast each page request is processed
    spaceComplexity: 'O(M) where M is frame count', // Memory overhead for tracking state
    // Long description explaining how FIFO works conceptually
    description: `FIFO is the simplest page replacement algorithm. It treats memory frames like a first-in, first-out queue: the oldest loaded page (the one that entered memory first) is evicted first when a new page fault occurs.`,
    // List of advantages for display in the Strengths section
    strengths: [
      'Extremely simple to implement with minimal memory overhead (simple FIFO queue pointer).',
      'Low runtime complexity per access step O(1).',
      'Provides a baseline reference for evaluating advanced replacement policies.',
    ],
    // List of disadvantages for display in the Weaknesses section
    weaknesses: [
      'Ignores page access frequency and recency of use.',
      "Suffers from Belady's Anomaly: increasing frame capacity can paradoxically increase total page faults.",
      'Frequently evicts heavily accessed initialization pages.',
    ],
    exampleImage: '/fifo.jpg',  // Path to the step-illustration image (in the public folder)
  },
  {
    // --- Optimal Algorithm ---
    id: 'Optimal',
    name: 'Optimal (OPT / Belady\'s Algorithm)',
    shortName: 'Optimal',
    timeComplexity: 'O(N × M) simulation lookahead', // Scans future refs for each frame
    spaceComplexity: 'O(M) memory frames',
    description: `The Optimal algorithm replaces the page that will not be accessed for the longest period of time in the future. It achieves the theoretical minimum number of page faults for any given reference sequence.`,
    strengths: [
      'Guarantees the absolute minimal number of page faults possible for any memory size.',
      'Serves as the ultimate benchmark to measure performance of real-world algorithms.',
      'Never suffers from Belady\'s Anomaly.',
    ],
    weaknesses: [
      'Impossible to implement in real operating systems because future page requests are unknown in advance.',
      'Only used for offline theoretical analysis and simulator benchmarking.',
      'Requires scanning ahead in the reference string during simulation.',
    ],
    exampleImage: '/OPR.jpg',
  },
  {
    // --- LRU Algorithm ---
    id: 'LRU',
    name: 'LRU (Least Recently Used)',
    shortName: 'LRU',
    timeComplexity: 'O(1) with doubly linked list & hash map', // Efficient implementation
    spaceComplexity: 'O(M) tracking stack/counters',
    description: `LRU replaces the page that has not been accessed for the longest duration of time in the past. It relies on Temporal Locality of Reference: pages accessed recently are likely to be accessed again soon.`,
    strengths: [
      'Excellent real-world performance matching empirical application access patterns.',
      'Does not suffer from Belady\'s Anomaly.',
      'Widely used in modern OS virtual memory systems and caching layers.',
    ],
    weaknesses: [
      'Hardware support or software overhead required to maintain access timestamps or linked list pointers.',
      'Slightly higher implementation complexity compared to simple FIFO.',
      'Can suffer from cache pollution during sequential scans.',
    ],
    exampleImage: '/LRU.jpg',
  },
  {
    // --- LFU Algorithm ---
    id: 'LFU',
    name: 'LFU (Least Frequently Used)',
    shortName: 'LFU',
    timeComplexity: 'O(log M) with min-heap / frequency map',
    spaceComplexity: 'O(P) tracking total page frequencies', // P = number of distinct pages
    description: `LFU evicts the page with the smallest access frequency count. It operates on the principle that pages accessed frequently in the past will continue to be heavily used.`,
    strengths: [
      'Effective for workloads with stable access frequency distributions.',
      'Keeps frequently accessed "hot" pages in memory.',
    ],
    weaknesses: [
      'Pages accessed heavily during initialization can get stuck in memory long after they are needed (frequency accumulation).',
      'Requires additional counter storage for each page.',
      'Sudden shifts in application access patterns can degrade performance.',
    ],
    exampleImage: '/LFU.jpg',
  },
  {
    // --- MFU Algorithm ---
    id: 'MFU',
    name: 'MFU (Most Frequently Used)',
    shortName: 'MFU',
    timeComplexity: 'O(log M) with max-heap / frequency map',
    spaceComplexity: 'O(P) tracking page frequencies',
    description: `MFU replaces the page with the highest access frequency count under the assumption that a heavily accessed page has completed its processing and is no longer needed.`,
    strengths: [
      'Useful in specialized access patterns where pages have short, intensive usage spikes.',
      'Provides an educational contrast to LFU.',
    ],
    weaknesses: [
      'Rarely useful in general-purpose OS memory management.',
      'Frequently evicts active "hot" pages, causing high page fault rates.',
      'Higher computational overhead with limited practical benefit.',
    ],
    exampleImage: '/MFU.jpg',
  },
];
