import type { Transition } from 'motion/react';

/**
 * The motion vocabulary. Three transitions, used everywhere — anything that
 * needs a fourth needs a reason.
 *
 * Curves match `--ease-out` / `--ease-in-out` in styles/layout.css, so CSS
 * and JS motion agree.
 */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Entrances and exits: strong ease-out, under 300ms. */
export const enter: Transition = { duration: 0.24, ease: EASE_OUT };

/** Critically damped spring — the default for anything that repositions. */
export const settle: Transition = { type: 'spring', bounce: 0, duration: 0.4 };

/** A little overshoot. Only after a gesture or a commit that carried momentum. */
export const springy: Transition = { type: 'spring', bounce: 0.2, duration: 0.4 };

/** Stagger step for lists: perceptible, never a queue. */
export const STAGGER = 0.04;
