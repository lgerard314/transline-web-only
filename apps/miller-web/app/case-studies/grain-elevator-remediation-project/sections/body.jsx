export function Body({ body }) {
  if (!body) return null;
  if (Array.isArray(body)) {
    return body.map((p, i) => <p key={i}>{p}</p>);
  }
  return <p>{body}</p>;
}
