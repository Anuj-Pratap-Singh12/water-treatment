// src/components/AnimatedShimmer.jsx
import React from "react";
import Reveal from "./Reveal";

/**
 * AnimatedShimmer
 * Props:
 *  - text: string or array of strings (if array and split=true, will stagger)
 *  - tag: HTML tag to render (default 'h1')
 *  - className: extra classes for typography & spacing
 *  - split: boolean - if true and text is a string, splits by space and staggers words
 *  - stagger: ms between word reveals when split (default 60)
 */
export default function AnimatedShimmer({
  text,
  tag = "h1",
  className = "",
  split = false,
  stagger = 60,
}) {
  const Tag = tag;

  // if text provided as array, use array
  const words = Array.isArray(text) ? text : split ? String(text).split(" ") : [text];

  // render words as inline <span> with shimmer class
  const content = words.map((word, i) => (
    <span
      key={i}
      className="inline-block mr-2 leading-tight shimmer-text"
      style={{ display: "inline-block" }}
    >
      {word}
    </span>
  ));

  // if multiple words and split, use Reveal stagger, else single Reveal
  if (words.length > 1 && split) {
    return (
      <Tag className={className}>
        <Reveal stagger={stagger}>
          <div style={{ display: "inline" }}>{content}</div>
        </Reveal>
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="shimmer-text">{content}</span>
    </Tag>
  );
}
