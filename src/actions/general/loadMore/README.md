# Generic Load More System

This system provides reusable components and actions for implementing pagination with "Load More" functionality across your application.

## Components

### 1. Generic Load More Action (`loadMore.ts`)

The generic action can work with any paginated data:

```typescript
import {
  createLoadMoreAction,
  LoadMoreParams,
} from "@/actions/general/loadMore/loadMore";

// For any data type
const loadMoreUsersAction = createLoadMoreAction<UserParams, UserResponse>(
  getAllUsersAction
);
const loadMorePostsAction = createLoadMoreAction<PostParams, PostResponse>(
  getAllPostsAction
);
```

### 2. Generic Load More Button (`LoadMoreButton`)

A reusable button component that handles URL-based pagination:

```typescript
import LoadMoreButton from "@/components/LoadMoreButton";

<LoadMoreButton
  currentOffset={0}
  limit={20}
  hasMore={true}
  buttonText="Load More Posts"
  loadingText="Loading posts..."
  offsetParamName="page" // Custom parameter name
/>;
```

### 3. Pagination Hook (`usePagination`)

A custom hook for managing pagination state:

```typescript
import { usePagination } from "@/hooks/usePagination";

const { currentOffset, limit, loadMore, isPending, resetPagination } =
  usePagination({
    offsetParamName: "page",
    limitParamName: "size",
  });
```

## Usage Examples

### Example 1: Icons (Current Implementation)

```typescript
// Action
export const loadMoreIconsAction = async (params: LoadMoreIconsParams) => {
  const { currentOffset, ...searchParams } = params;
  const nextParams = {
    ...searchParams,
    offset: currentOffset + (searchParams.limit || 20),
  };
  return await getAllIconsAction(nextParams);
};

// Component
<LoadMoreButton currentOffset={currentOffset} limit={20} hasMore={hasMore} />;
```

### Example 2: Users

```typescript
// Action
export const loadMoreUsersAction = createLoadMoreAction<
  UserParams,
  UserResponse
>(getAllUsersAction);

// Component
<LoadMoreButton
  currentOffset={currentOffset}
  limit={10}
  hasMore={hasMore}
  buttonText="Load More Users"
  offsetParamName="userOffset"
/>;
```

### Example 3: Posts with Server Actions (Load More)

```typescript
// Action - fetches only the next batch
export const loadMorePostsAction = async (params: LoadMorePostsParams) => {
  const { currentOffset, ...searchParams } = params;

  const nextParams = {
    ...searchParams,
    offset: currentOffset,
    limit: searchParams.limit || 20,
  };

  return await getAllPostsAction(nextParams);
};

// Component with server action
const [posts, setPosts] = useState(initialPosts);
const [hasMore, setHasMore] = useState(initialHasMore);
const [currentOffset, setCurrentOffset] = useState(initialPosts.length);

const handleLoadMore = async () => {
  const result = await loadMorePostsAction({
    currentOffset,
    limit: 5,
    search: searchTerm,
    // ... other parameters
  });

  // Append new data to existing data (LOAD MORE, not pagination)
  setPosts((prev) => [...prev, ...result.posts]);
  setHasMore(result.hasMore);
  setCurrentOffset((prev) => prev + result.posts.length);
};

<LoadMoreButton
  currentOffset={currentOffset}
  limit={5}
  hasMore={hasMore}
  onLoadMore={handleLoadMore}
/>;
```

### Example 4: Posts with Custom Logic

```typescript
// Component with custom load more logic
<LoadMoreButton
  currentOffset={currentOffset}
  limit={5}
  hasMore={hasMore}
  onLoadMore={() => {
    // Custom logic here
    loadMorePosts();
  }}
/>
```

## Benefits

1. **Reusable**: Works with any data type
2. **Type Safe**: Full TypeScript support
3. **Flexible**: Customizable parameter names and behavior
4. **Consistent**: Same UX across all paginated lists
5. **Server-Side**: Works with server components and actions
6. **URL-Based**: Pagination state preserved in URL

## File Structure

```
src/
├── actions/
│   ├── general/
│   │   └── loadMore/
│   │       ├── loadMore.ts          # Generic action
│   │       └── README.md            # This file
│   └── icon/
│       └── loadMore/
│           └── loadMore.ts          # Icon-specific action
├── components/
│   ├── LoadMoreButton/
│   │   └── index.tsx                # Generic button
│   └── Pagination/
│       └── LoadMoreButton/
│           └── index.tsx            # Advanced button with callbacks
└── hooks/
    └── usePagination.ts             # Pagination hook
```
