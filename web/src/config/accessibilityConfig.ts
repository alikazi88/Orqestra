/**
 * WCAG 2.1 AA Compliance Configuration
 *
 * This module documents the accessibility standards applied across the Orqestra application.
 * It serves as both a configuration reference and an audit checklist.
 */

export const WCAG_CHECKLIST = {
    perceivable: [
        { id: 'P1', rule: 'All images have alt text', status: 'pass', notes: 'Lucide icons use aria-hidden, functional images have alt' },
        { id: 'P2', rule: 'Color contrast ratio ≥ 4.5:1 for text', status: 'pass', notes: 'Design system uses high-contrast tokens' },
        { id: 'P3', rule: 'Color contrast ratio ≥ 3:1 for large text', status: 'pass', notes: 'Heading styles verified' },
        { id: 'P4', rule: 'No information conveyed only by color', status: 'pass', notes: 'Status badges include text labels + icons' },
        { id: 'P5', rule: 'Text resizable up to 200% without loss', status: 'pass', notes: 'Responsive design with rem/em units' },
        { id: 'P6', rule: 'Audio/video has captions', status: 'na', notes: 'No audio/video content currently' },
    ],
    operable: [
        { id: 'O1', rule: 'All functionality available via keyboard', status: 'pass', notes: 'All interactive elements are focusable' },
        { id: 'O2', rule: 'No keyboard traps', status: 'pass', notes: 'Modals have escape key support' },
        { id: 'O3', rule: 'Focus order is logical', status: 'pass', notes: 'Tab order follows DOM order' },
        { id: 'O4', rule: 'Focus indicator visible', status: 'pass', notes: 'Custom focus rings on all interactive elements' },
        { id: 'O5', rule: 'Skip navigation links available', status: 'warn', notes: 'Consider adding skip-to-content link' },
        { id: 'O6', rule: 'Page titles are descriptive', status: 'pass', notes: 'Dynamic titles via React Helmet' },
    ],
    understandable: [
        { id: 'U1', rule: 'Language declared in HTML', status: 'pass', notes: 'lang="en" on <html>' },
        { id: 'U2', rule: 'Form inputs have labels', status: 'pass', notes: 'All inputs use label or aria-label' },
        { id: 'U3', rule: 'Error messages are descriptive', status: 'pass', notes: 'Form validation with inline messages' },
        { id: 'U4', rule: 'Consistent navigation', status: 'pass', notes: 'Sidebar + tabs pattern is consistent' },
    ],
    robust: [
        { id: 'R1', rule: 'Valid HTML markup', status: 'pass', notes: 'React JSX compiled to valid HTML' },
        { id: 'R2', rule: 'ARIA attributes used correctly', status: 'pass', notes: 'Tabs, modals, dropdowns use correct ARIA' },
        { id: 'R3', rule: 'Custom components have ARIA roles', status: 'pass', notes: 'Intelly-cards use semantic HTML' },
    ],
} as const;

export const ACCESSIBILITY_SETTINGS = {
    minContrastRatio: 4.5,
    focusRingColor: 'var(--primary)',
    focusRingWidth: '2px',
    focusRingOffset: '2px',
    reducedMotionSupport: true,
    highContrastModeSupport: true,
    screenReaderOptimizations: true,
    keyboardNavigationEnhanced: true,
};
