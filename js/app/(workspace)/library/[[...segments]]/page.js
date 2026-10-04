import { createElement, Fragment } from '../../../../runtime/dom.js';
import { notFound } from "../../../../runtime/navigation.js";
import { libraryCategories } from "../../../../config/library.js";
import { LibraryPage } from "../../../../features/library/library-page.js";
export default function Page({
  params
}) {
  const { segments = [] } = params;
  if (!segments.length) return createElement(LibraryPage, null);
  const [category, variant] = segments;
  const definition = libraryCategories.find((item) => item.slug === category);
  const example = definition?.examples.find(
    (item) => item.slug === variant && !item.href
  );
  if (segments.length !== 2 || !example) notFound();
  return createElement(LibraryPage, { category, variant });
}
