interface Props {
  text: string;
}

export default function StepLine({ text }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <svg
        className="w-3 h-3 text-indigo-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span className="italic">{text}</span>
    </div>
  );
}
