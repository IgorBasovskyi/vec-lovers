import { ICON_VALIDATION_ERRORS as ICON_ERRORS } from '@/constants/icon/client';

export const VALID_ICON_DATA = {
  title: 'Test Icon',
  description: 'A test icon description',
  svgIcon: '<svg><path d="M10 10"/></svg>',
  category: 'test',
};

export const INVALID_ICON_DATA = {
  title: '',
  description: 'A'.repeat(501), // Too long
  svgIcon: '',
  category: 'A'.repeat(51), // Too long
};

export const ICON_VALIDATION_ERRORS = {
  title: ICON_ERRORS.title.required,
  description: ICON_ERRORS.description.maxLength,
  svgIcon: ICON_ERRORS.svgIcon.required,
  category: ICON_ERRORS.category.maxLength,
} as const;

export const MOCK_ICON = {
  id: '1',
  title: 'Test Icon 1',
  description: 'Description 1',
  svgIcon: '<svg><path d="M10 10"/></svg>',
  category: 'test',
  liked: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  userId: 'user123',
};

export const MOCK_ICONS = [
  MOCK_ICON,
  {
    id: '2',
    title: 'Test Icon 2',
    description: 'Description 2',
    svgIcon: '<svg><path d="M20 20"/></svg>',
    category: 'test',
    liked: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    userId: 'user123',
  },
];

export const MOCK_TOTAL = 2;
