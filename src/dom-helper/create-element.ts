export default function createElement<T extends HTMLElement>(
  tag: string,
  attributes?: Record<string, string>,
): T {
  const element = document.createElement(tag) as T;
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
}
