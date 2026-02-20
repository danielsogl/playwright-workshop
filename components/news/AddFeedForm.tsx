'use client';

import React from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { Plus } from 'lucide-react';

interface AddFeedFormProps {
  newFeedName: string;
  setNewFeedName: (value: string) => void;
  newFeedUrl: string;
  setNewFeedUrl: (value: string) => void;
  newFeedCategory: string;
  setNewFeedCategory: (value: string) => void;
  handleAddFeed: (e: React.FormEvent) => Promise<void>;
  addingFeed: boolean;
  feedError: string | null;
}

export const AddFeedForm: React.FC<AddFeedFormProps> = ({
  newFeedName,
  setNewFeedName,
  newFeedUrl,
  setNewFeedUrl,
  newFeedCategory,
  setNewFeedCategory,
  handleAddFeed,
  addingFeed,
  feedError,
}) => {
  return (
    <Card
      className="border border-default-200"
      aria-label="Add new RSS feed"
    >
      <CardBody className="p-6">
        <form
          aria-label="Add new RSS feed form"
          className="flex flex-col md:flex-row gap-4 items-end"
          onSubmit={handleAddFeed}
          name="add-feed-form"
        >
          <Input
            aria-label="Name for the new feed"
            className="flex-grow"
            disabled={addingFeed}
            label="Feed Name"
            labelPlacement="outside"
            placeholder="e.g., TechCrunch"
            value={newFeedName}
            variant="bordered"
            id="feed-name"
            name="feed-name"
            onValueChange={setNewFeedName}
          />
          <Input
            aria-label="URL for the new feed"
            className="flex-grow"
            disabled={addingFeed}
            label="Feed URL"
            labelPlacement="outside"
            placeholder="https://example.com/feed.xml"
            type="url"
            value={newFeedUrl}
            variant="bordered"
            id="feed-url"
            name="feed-url"
            onValueChange={setNewFeedUrl}
          />
          <Input
            aria-label="Optional category for the new feed"
            className="flex-grow"
            disabled={addingFeed}
            label="Category (optional)"
            labelPlacement="outside"
            placeholder="e.g., Tech"
            value={newFeedCategory}
            variant="bordered"
            id="feed-category"
            name="feed-category"
            onValueChange={setNewFeedCategory}
          />
          <Button
            aria-label={addingFeed ? 'Adding new feed' : 'Add new feed'}
            className="min-w-[120px] font-semibold"
            color="primary"
            isLoading={addingFeed}
            type="submit"
            id="add-feed-button"
            startContent={!addingFeed ? <Plus className="w-4 h-4" aria-hidden="true" /> : undefined}
          >
            Add Feed
          </Button>
        </form>
        {feedError && (
          <div className="mt-3 p-3 bg-danger-50 text-danger border border-danger-200 rounded-lg text-sm" role="alert">
            {feedError}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
