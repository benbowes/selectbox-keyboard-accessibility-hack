export default function getDOMChildIndex(element) {
  // Find index of `child` relative to `parent`
  return Array.prototype.indexOf.call(element.parentNode.children, element);
}
