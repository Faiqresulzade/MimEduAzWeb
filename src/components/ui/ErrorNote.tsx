export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl bg-danger-bg px-4 py-3 text-sm font-medium text-danger-text"
    >
      {message}
    </p>
  );
}
