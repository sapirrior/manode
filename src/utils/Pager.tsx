import React, { useMemo, useState, useEffect } from "react";
import { Box, Text, useApp, useInput, useStdout } from "ink";
import { parse } from "./parser.js";
import { getRenderLines } from "./layout.js";

export function Pager({ content, topic }: { content: string; topic: string }) {
  const { exit } = useApp();
  const { stdout } = useStdout();
  
  // Use process.stdout directly for more reliable initial dimensions with sane minimums
  const [dim, setDim] = useState({ 
    rows: Math.max(5, process.stdout.rows || 24), 
    cols: Math.max(10, process.stdout.columns || 80) 
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!stdout) return;
    const onResize = () => {
      setDim({ 
        rows: Math.max(5, stdout.rows), 
        cols: Math.max(10, stdout.columns) 
      });
    };
    stdout.on("resize", onResize);
    return () => {
      stdout.off("resize", onResize);
    };
  }, [stdout]);

  const blocks = useMemo(() => parse(content), [content]);
  const renderLines = useMemo(() => getRenderLines(blocks, dim.cols), [blocks, dim.cols]);

  const viewportHeight = dim.rows - 1;
  const maxScroll = Math.max(0, renderLines.length - viewportHeight);

  // Clamp scroll on resize
  useEffect(() => {
    if (scrollY > maxScroll) {
      setScrollY(maxScroll);
    }
  }, [maxScroll, scrollY]);

  useInput((input, key) => {
    if (key.ctrl && input === "c") exit();
    if (input === "q") exit();

    if (input === "j" || key.downArrow) {
      setScrollY((s) => Math.min(s + 1, maxScroll));
    }
    if (input === "k" || key.upArrow) {
      setScrollY((s) => Math.max(s - 1, 0));
    }
    if (input === " " || input === "f" || key.pageDown) {
      setScrollY((s) => Math.min(s + viewportHeight, maxScroll));
    }
    if (input === "b" || key.pageUp) {
      setScrollY((s) => Math.max(s - viewportHeight, 0));
    }
    if (input === "g") {
      setScrollY(0);
    }
    if (input === "G") {
      setScrollY(maxScroll);
    }
  });

  // Get the lines for the current viewport
  const visibleLines = renderLines.slice(scrollY, scrollY + viewportHeight);
  
  // Pad with empty lines if document is shorter than viewport to force status bar to bottom
  const linesToRender = [...visibleLines];
  while (linesToRender.length < viewportHeight) {
    linesToRender.push({ segments: [{ text: " " }] });
  }

  return (
    <Box flexDirection="column" height={dim.rows}>
      {/* Content Area */}
      <Box flexDirection="column">
        {linesToRender.map((l, i) => (
          <Text key={i} wrap="truncate">
            {l.segments.map((s, j) => (
              <Text key={j} bold={s.bold} italic={s.italic} dimColor={s.dim}>
                {s.text || (l.segments.length === 1 ? " " : "")}
              </Text>
            ))}
          </Text>
        ))}
      </Box>

      {/* Status Bar */}
      <Box height={1}>
        <Text inverse> Node Manual Pages: {topic} (q to exit) </Text>
      </Box>
    </Box>
  );
}
