'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

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
      className="bg-content1 shadow-medium"
      role="form"
      aria-label="Add new RSS feed"
    >
      <CardBody>
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
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">📰</span>
              </div>
            }
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
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">🔗</span>
              </div>
            }
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
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">📁</span>
              </div>
            }
            value={newFeedCategory}
            variant="bordered"
            id="feed-category"
            name="feed-category"
            onValueChange={setNewFeedCategory}
          />
          <Button
            aria-label={addingFeed ? 'Adding new feed' : 'Add new feed'}
            className="min-w-[120px]"
            color="primary"
            isLoading={addingFeed}
            type="submit"
            id="add-feed-button"
          >
            Add Feed
          </Button>
        </form>
        {feedError && (
          <p className="text-danger mt-2 text-small" role="alert">
            {feedError}
          </p>
        )}
      </CardBody>
    </Card>
  );
};
