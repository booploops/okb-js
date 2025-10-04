/*
 * Copyright (C) 2025-Present booploops and contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
export type ViewportPanOptions = {
  targetElement: HTMLElement;
  viewportElement: HTMLElement;
  /**
   * How far down must the target element be before the viewport is panned
   * Default is 50% of the viewport height
   */
  thresholdY?: number;
};

export function resetViewportPan(viewportElement: HTMLElement) {
  viewportElement.style.transform = `translateY(0px)`;
}

/**
 * Pans the viewport element with transformY to center the target element
 *
 * The viewport will only be panned if the target element is within the thresholdY (assuming that its behind the keyboard essentially)
 */
export function viewportPan(options: ViewportPanOptions) {
  const {
    targetElement,
    viewportElement,
    thresholdY = viewportElement.offsetHeight / 2,
  } = options;

  const targetElementRect = targetElement.getBoundingClientRect();
  const viewportElementRect = viewportElement.getBoundingClientRect();
  
  // Calculate the bottom of the target element relative to the viewport
  const targetBottom = targetElementRect.bottom - viewportElementRect.top;
  
  // Only pan if the target element is too close to the bottom of the viewport
  // (indicating it might be hidden behind the keyboard)
  const availableHeight = viewportElementRect.height - thresholdY;
  
  if (targetBottom > availableHeight) {
    // Calculate how much we need to pan up to bring the target into view, plus about 15% extra for comfortable room
    const extraRoom = viewportElementRect.height * 0.15;
    const panAmount = targetBottom - availableHeight + extraRoom;
    viewportElement.style.transform = `translateY(-${panAmount}px)`;
  } else {
    // No need to pan - reset to original position
    viewportElement.style.transform = `translateY(0px)`;
  }

  return () => {
    viewportElement.style.transform = `translateY(0px)`;
  };
}
