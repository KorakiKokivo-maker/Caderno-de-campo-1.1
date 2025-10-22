import React from 'react';

// heroicons are loaded from CDN in index.html
// FIX: Using `declare global` to augment JSX.IntrinsicElements for the custom `hero-icon` element.
// HACK: Added definitions for all standard HTML elements used in the project to resolve widespread
// "Property '...' does not exist on type 'JSX.IntrinsicElements'" errors. This is likely due to
// a misconfiguration in the project's TypeScript setup that prevents React's default JSX types from loading.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'hero-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                name: string;
            };
            'div': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            'p': React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            'button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            'form': React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            'label': React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            'input': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            'img': React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            'h1': React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            'h2': React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            'h3': React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            'h4': React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            'header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'span': React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            'select': React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            'option': React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            'details': React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
            'summary': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'textarea': React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            'nav': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'ul': React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            'li': React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            'strong': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'td': React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            'tr': React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            'table': React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            'thead': React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            'tbody': React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            'th': React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        }
    }
}

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  // FIX: Wrap in a span and apply className to it. This ensures Tailwind styles a standard
  // element, which then acts as a sized container for the custom hero-icon element,
  // finally forcing the icon to render visibly.
  return (
    <span className={`${className} inline-block`}>
      <hero-icon name={name} />
    </span>
  );
};

export default Icon;