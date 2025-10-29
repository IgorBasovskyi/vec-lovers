export const ICON_VALIDATION_ERRORS = {
  title: {
    required: 'Title is required.',
    minLength: 'Title is required.',
    maxLength: 'Title should not contain more than 100 characters.',
  },
  description: {
    maxLength: 'Description should not contain more than 500 characters.',
  },
  svgIcon: {
    required: 'SVG icon is required.',
    minLength: 'SVG icon is required.',
  },
  category: {
    maxLength: 'Category should not contain more than 50 characters.',
  },
} as const;

export const ADD_ICON = 'Add Icon';

export const ADD_ICON_DEFAULT_VALUES = {
  title: '',
  description: '',
  svgIcon: '',
  category: '',
} as const;
