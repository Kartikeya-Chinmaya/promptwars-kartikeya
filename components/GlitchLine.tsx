export function GlitchLine({
  text,
  glitching,
  className = "",
}: {
  text: string;
  glitching: boolean;
  className?: string;
}) {
  return (
    <span
      data-txt={text}
      className={`glitch-line ${glitching ? "glitching" : ""} ${className}`}
    >
      {text}
    </span>
  );
}
